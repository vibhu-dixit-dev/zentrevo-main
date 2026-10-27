import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

// Custom Vite plugin to handle all /api/* routes locally during 'npm run dev'
function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url ? req.url.split('?')[0] : '';
        if (urlPath.startsWith('/api/')) {
          const relativeRoute = urlPath.replace(/^\/api\//, '');
          const candidates = [
            path.resolve(process.cwd(), 'api', `${relativeRoute}.js`),
            path.resolve(process.cwd(), 'api', relativeRoute, 'index.js')
          ];

          let targetFile = null;
          for (const cand of candidates) {
            if (fs.existsSync(cand)) {
              targetFile = cand;
              break;
            }
          }

          if (targetFile) {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
                const fileUrl = pathToFileURL(targetFile).href + `?t=${Date.now()}`;
                const mod = await import(fileUrl);
                const handler = mod.default || mod;

                const wrappedRes = {
                  statusCode: 200,
                  status(code) {
                    this.statusCode = code;
                    res.statusCode = code;
                    return this;
                  },
                  json(data) {
                    res.statusCode = this.statusCode || 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return this;
                  }
                };

                await handler(req, wrappedRes);
              } catch (err) {
                console.error('Local API Handler Error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, message: err.message }));
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables into process.env for local development
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      localApiPlugin()
    ],
  };
});
