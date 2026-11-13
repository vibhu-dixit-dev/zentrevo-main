import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  Cloud, 
  CloudFog, 
  CloudRain, 
  Snowflake, 
  CloudLightning, 
  Wind, 
  Thermometer, 
  Shirt,
  Sparkles
} from 'lucide-react';
import { resolveIndiaCoordinates } from '../data/indiaCityGeoResolver';
import { resolveWorldCoordinates } from '../data/worldCityGeoResolver';

// Map WMO Weather Codes to Luxury Atmosphere & Icons
function getWeatherDetails(code, isDay = 1) {
  if (code === 0) {
    return {
      condition: isDay ? 'Radiant Sun • Clear Sky' : 'Starlit Horizon • Clear Sky',
      icon: isDay ? Sun : Moon,
      iconColor: isDay ? 'text-amber-400' : 'text-indigo-300'
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      condition: 'Gentle Breeze • High Clouds',
      icon: CloudSun,
      iconColor: 'text-amber-300'
    };
  }
  if (code === 45 || code === 48) {
    return {
      condition: 'Misty Alpine Horizon • Morning Fog',
      icon: CloudFog,
      iconColor: 'text-slate-300'
    };
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      condition: 'Passing Coastal Showers • Maritime Mist',
      icon: CloudRain,
      iconColor: 'text-sky-300'
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      condition: 'Fresh Mountain Powder • Winter Snow',
      icon: Snowflake,
      iconColor: 'text-cyan-200'
    };
  }
  if (code >= 95) {
    return {
      condition: 'Atmospheric Skies • Summer Thunderstorm',
      icon: CloudLightning,
      iconColor: 'text-amber-300'
    };
  }
  return {
    condition: 'Temperate Expedition Weather',
    icon: Cloud,
    iconColor: 'text-stone-300'
  };
}

// Generate bespoke curator attire advice based on temperature
function getAttireRecommendation(tempC) {
  if (tempC < 5) {
    return 'Heavy cashmere knitwear, thermal underlayers & insulated mountain parka.';
  }
  if (tempC < 14) {
    return 'Merino wool layers, light trench coat & evening cashmere scarf.';
  }
  if (tempC < 22) {
    return 'Tailored breathable cottons, light blazer & evening cardigan.';
  }
  if (tempC < 29) {
    return 'Breezy coastal linen, UV sun hat & polarized eye protection.';
  }
  return 'Ultra-lightweight silks, resort swimwear & continuous hydration.';
}

export default function LiveWeatherWidget({ destination, currentTheme }) {
  const isEmerald = currentTheme === 'emerald';
  const isSapphire = currentTheme === 'sapphire';

  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      if (!destination) return;
      setIsLoading(true);

      // 1. Resolve Coordinates
      let lat = destination.lat;
      let lng = destination.lng;

      if (!lat || !lng) {
        if ((destination.region || '').toLowerCase() === 'national') {
          const res = resolveIndiaCoordinates(destination.location, destination.title);
          const [rLat, rLng] = (res.coordinates || '').split('/');
          lat = rLat;
          lng = rLng;
        } else {
          const res = resolveWorldCoordinates(destination.location, destination.title);
          const [rLat, rLng] = (res.coordinates || '').split('/');
          lat = rLat;
          lng = rLng;
        }
      }

      const numLat = parseFloat(lat);
      const numLng = parseFloat(lng);

      if (isNaN(numLat) || isNaN(numLng)) {
        setIsLoading(false);
        return;
      }

      // 2. Check SessionStorage Cache (30 min TTL)
      const cacheKey = `zen_wtr_${numLat.toFixed(2)}_${numLng.toFixed(2)}`;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
            if (isMounted) {
              setWeather(parsed.data);
              setIsLoading(false);
            }
            return;
          }
        }
      } catch {}

      // 3. Fetch from Open-Meteo
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${numLat}&longitude=${numLng}&current=temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather API unreachable');
        const json = await res.json();

        if (json && json.current && isMounted) {
          const wData = {
            tempC: Math.round(json.current.temperature_2m),
            feelsC: Math.round(json.current.apparent_temperature),
            isDay: json.current.is_day,
            code: json.current.weather_code,
            windKm: Math.round(json.current.wind_speed_10m)
          };
          setWeather(wData);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: wData }));
          } catch {}
        }
      } catch (err) {
        console.warn('Live weather advisory note:', err?.message || err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  if (isLoading) {
    return (
      <div className={`p-4 rounded-2xl border animate-pulse flex items-center justify-between text-xs ${
        isSapphire
          ? 'bg-[#081226]/60 border-slate-700/60 text-stone-300'
          : isEmerald
            ? 'bg-emerald-950/30 border-emerald-800/40 text-stone-300'
            : 'bg-stone-50 border-stone-200 text-stone-600'
      }`}>
        <div className="flex items-center gap-2.5">
          <Thermometer className="w-4 h-4 text-amber-500/60 animate-bounce" />
          <span>Synchronizing live consular climate & weather sensors...</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const { condition, icon: WeatherIcon, iconColor } = getWeatherDetails(weather.code, weather.isDay);
  const displayTemp = unit === 'C' ? `${weather.tempC}°C` : `${Math.round(weather.tempC * 1.8 + 32)}°F`;
  const displayFeels = unit === 'C' ? `${weather.feelsC}°C` : `${Math.round(weather.feelsC * 1.8 + 32)}°F`;
  const attireTip = getAttireRecommendation(weather.tempC);

  return (
    <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all ${
      isSapphire
        ? 'bg-[#081226]/90 border-amber-500/30 text-stone-100 shadow-lg shadow-blue-950/40'
        : isEmerald
          ? 'bg-emerald-950/40 border-emerald-800/50 text-stone-100 shadow-lg shadow-emerald-950/30'
          : 'bg-gradient-to-br from-stone-50 to-amber-50/30 border-stone-200/90 text-stone-900 shadow-sm'
    }`}>
      {/* Top Banner: Condition, Temp, Unit Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200/20">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
            isSapphire
              ? 'bg-[#060e20] border-amber-500/30'
              : isEmerald
                ? 'bg-emerald-900/40 border-emerald-700/50'
                : 'bg-white border-stone-200 shadow-xs'
          }`}>
            <WeatherIcon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight">
                {displayTemp}
              </span>
              <span className={`text-[11px] font-medium ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-500'}`}>
                (Feels {displayFeels})
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300/90 leading-tight">
              {condition}
            </p>
          </div>
        </div>

        {/* Right Tag & Unit Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3" />
            <span>Live Atmosphere</span>
          </div>

          <button
            type="button"
            onClick={() => setUnit(u => u === 'C' ? 'F' : 'C')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
              isSapphire || isEmerald
                ? 'bg-white/10 hover:bg-white/20 text-stone-200 border-white/15'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
            title="Toggle Celsius / Fahrenheit"
            aria-label="Toggle Celsius / Fahrenheit"
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>
      </div>

      {/* Bottom Insights: Wind Speed & Luggage Attire Guidance */}
      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Wind className={`w-3.5 h-3.5 shrink-0 ${isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-500'}`} />
          <span className={`text-[11px] ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
            Breeze Velocity: <strong className={isSapphire || isEmerald ? 'text-white' : 'text-stone-900'}>{weather.windKm} km/h</strong>
          </span>
        </div>

        <div className="flex items-start gap-2">
          <Shirt className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSapphire ? 'text-amber-400' : isEmerald ? 'text-emerald-400' : 'text-stone-500'}`} />
          <span className={`text-[11px] leading-tight ${isSapphire || isEmerald ? 'text-stone-300' : 'text-stone-600'}`}>
            Curator Luggage: <span className={isSapphire || isEmerald ? 'text-stone-200' : 'text-stone-800'}>{attireTip}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
