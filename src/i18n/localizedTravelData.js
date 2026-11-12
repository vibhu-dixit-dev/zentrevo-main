// Localized Travel Data for Zentrevo (Destinations & Journal Articles)
// Supports English (en), Mandarin Chinese (zh), Spanish (es), Arabic (ar)
import { destinations as baseDestinations, blogArticles as baseArticles } from '../data/travelData';

export const localizedDestinations = {
  zh: {
    1: {
      title: "阿马尔菲海岸与波西塔诺断崖",
      location: "意大利",
      duration: "7天 / 6晚",
      category: "奢华度假",
      badge: "地中海风情",
      description: "悬崖私人奢华庄园隐居，卡普里蓝洞专属游艇巡航，以及米其林星级柠檬庄园私享晚宴。",
      highlights: ["卡普里岛私人游艇包船巡航", "柠檬果园私藏年份酒品鉴", "那不勒斯至庄园私人直升机接送"]
    },
    2: {
      title: "京都古刹禅意庭园与竹林清修",
      location: "日本",
      duration: "9天 / 8晚",
      category: "文化寻踪",
      badge: "东方禅意",
      description: "晨曦古刹禅宗僧侣冥想晨课，非遗茶道宗师私密茶席，以及私享传统日式数寄屋温泉旅馆。",
      highlights: ["岚山竹林非开放晨光独家探访", "米其林怀石料理宗师私房定制", "江户传统艺伎艺术私享演艺"]
    },
    3: {
      title: "瑞士阿尔卑斯冰川全景快车",
      location: "瑞士",
      duration: "6天 / 5晚",
      category: "高山自然",
      badge: "阿尔卑斯山脉",
      description: "圣莫里茨至采尔马特头等全景玻璃穹顶观光列车，马特洪峰私人直升机盘旋俯瞰，与高山私享木屋温泉。",
      highlights: ["冰川快车头等尊崇全景席位", "马特洪峰巅峰私人直升机巡游", "百年阿尔卑斯天然地热温泉水疗"]
    },
    4: {
      title: "卡帕多奇亚热气球奇迹山谷",
      location: "土耳其",
      duration: "5天 / 4晚",
      category: "全球风尚",
      badge: "趋势之选",
      description: "仙人烟囱石柱山谷破晓 VIP 私人热气球腾空，千禧地热洞穴奢华套房，以及千年地下秘城私密探索。",
      highlights: ["破晓首飞专属热气球吊篮", "奢华洞穴套房配备恒温私人跌水池", "格雷梅历史遗迹首席学者专属向导"]
    },
    5: {
      title: "雷克雅未克与极光旷野秘境",
      location: "冰岛",
      duration: "8天 / 7晚",
      category: "高山自然",
      badge: "极地荒野",
      description: "超重型极地特制越野车深入千年蓝冰洞，私享地热蓝湖尊崇泡汤，以及全透明全景玻璃穹顶木屋极光守候。",
      highlights: ["蓝湖私密专属区域不被打扰的泡汤", "瓦特纳冰川深处绝美蓝冰洞探秘", "夜宿极光全景观星玻璃木屋"]
    },
    6: {
      title: "乌鲁瓦图断崖落日与乌布静修",
      location: "巴厘岛",
      duration: "7天 / 6晚",
      category: "奢华度假",
      badge: "隐逸奢享",
      description: "海滨断崖无边泳池私人别墅，阿育吠陀丛林圣河声波疗愈，以及专属传统双体帆船夕阳出海体验。",
      highlights: ["水上圣庙非公开清晨祈福通道", "乌布丛林深处顶级颂钵声波疗愈", "私人主厨专属沙滩烛光海鲜盛宴"]
    },
    7: {
      title: "乌代布尔皮丘拉湖宫与梅瓦尔王室行宫",
      location: "拉贾斯坦, 印度",
      duration: "6天 / 5晚",
      category: "奢华度假",
      badge: "王室传世底蕴",
      description: "湖心宫殿私密入住体验，乘坐王室老爷车穿越阿拉瓦利山丘，以及大理石水上露台的私密烛光廷宴。",
      highlights: ["皮丘拉湖私人太阳能王室木船巡游", "宫廷历史学者陪同下的王室晚宴", "阿拉瓦利山谷王室老爷车探险"]
    },
    8: {
      title: "拉达克高海拔秘境与奴布拉奢华野奢营地",
      location: "拉达克, 印度",
      duration: "8天 / 7晚",
      category: "高山自然",
      badge: "高原天境",
      description: "喜马拉雅浩瀚星空下的恒温野奢测地穹顶帐篷，私人清晨藏传古刹活佛祈福，以及双峰骆驼沙丘私享漫步。",
      highlights: ["喜马拉雅山麓恒温奢华圆顶营地", "古寺晨光私人专属闭门祈福法会", "班公错高原暗夜纯净星空天文观测"]
    },
    9: {
      title: "喀拉拉宁静水乡回水与香料高原庄园",
      location: "喀拉拉, 印度",
      duration: "6天 / 5晚",
      category: "全球风尚",
      badge: "碧水静心",
      description: "专属雪松奢华巡航船漫游文巴纳德湖，名医亲授原生态阿育吠陀排毒疗程，以及有机茶山庄园采摘品茗。",
      highlights: ["独家包租私享传统雪松巡航木船", "资深阿育吠陀名医专属定制理疗", "慕那尔高山百年茶庄私人品鉴席"]
    },
    10: {
      title: "克什米尔山谷与达尔湖王室雪松船屋",
      location: "克什米尔, 印度",
      duration: "6天 / 5晚",
      category: "文化寻踪",
      badge: "东方瑞士",
      description: "手工雕花王室古香雪松船屋套房，清晨私密水上浮动花市木舟漫游，以及帕哈尔加姆松林高山草甸骑行。",
      highlights: ["私家珍藏级雕花松木水上船屋", "拂晓时分水上鲜花市集木船畅游", "帕哈尔加姆高山草甸私人骑马探幽"]
    }
  },

  es: {
    1: {
      title: "Costa Amalfitana y Acantilados de Positano",
      location: "Italia",
      duration: "7 Días / 6 Noches",
      category: "Escapadas de Lujo",
      badge: "Mediterráneo",
      description: "Villas privadas sobre acantilados, yate privado por las grutas de Capri y alta gastronomía entre limoneros.",
      highlights: ["Chárter privado en yate por Capri", "Cata de vinos en huertos de limoneros", "Traslado en helicóptero desde Nápoles"]
    },
    2: {
      title: "Jardines Zen y Bosques de Bambú de Kioto",
      location: "Japón",
      duration: "9 Días / 8 Noches",
      category: "Cultural",
      badge: "Tradición Zen",
      description: "Meditación matutina con monjes, ceremonia privada de té con maestros y estancias en ryokans históricos con aguas termales.",
      highlights: ["Acceso exclusivo al amanecer en Arashiyama", "Cena kaiseki con maestro chef", "Presentación artística privada de geishas"]
    },
    3: {
      title: "Glacier Express en los Alpes Suizos",
      location: "Suiza",
      duration: "6 Días / 5 Noches",
      category: "Naturaleza Alpina",
      badge: "Alpes Suizos",
      description: "Tren panorámico de lujo en primera clase entre St. Moritz y Zermatt, vuelo en helicóptero sobre el Matterhorn y chalets alpinos.",
      highlights: ["Asientos de primera clase en el Glacier Express", "Vuelo privado en helicóptero al Matterhorn", "Acceso a spas termales centenarios"]
    },
    4: {
      title: "Valle de Globos Aerostáticos de Capadocia",
      location: "Turquía",
      duration: "5 Días / 4 Noches",
      category: "Tendencia",
      badge: "En Tendencia",
      description: "Vuelo privado en globo al amanecer sobre chimeneas de hadas, suites cueva de gran lujo y ciudades subterráneas.",
      highlights: ["Cesta privada de vuelo al amanecer", "Suite cueva de lujo con piscina climatizada", "Guía arqueológico exclusivo en Göreme"]
    },
    5: {
      title: "Reikiavik y la Aurora Boreal Salvaje",
      location: "Islandia",
      duration: "8 Días / 7 Noches",
      category: "Naturaleza Alpina",
      badge: "Desierto Glaciar",
      description: "Expediciones en súper-jeep a cuevas de hielo, aguas termales privadas en la Laguna Azul y noches en iglús de cristal.",
      highlights: ["Retiro privado en la Laguna Azul", "Descenso a cuevas de hielo de glaciares", "Cabañas con techo de cristal bajo auroras"]
    },
    6: {
      title: "Atardecer en Uluwatu y Santuario de Ubud",
      location: "Bali",
      duration: "7 Días / 6 Noches",
      category: "Escapadas de Lujo",
      badge: "Bienestar Exclusivo",
      description: "Villas sobre acantilados, sanación sonora en ríos sagrados de la jungla y navegación en catamarán al atardecer.",
      highlights: ["Acceso privado a templos sobre el agua", "Sesiones de bienestar sonoro en la selva", "Cena privada con chef en la playa"]
    },
    7: {
      title: "Palacio de Udaipur y Tradición Real de Mewar",
      location: "Rajastán, India",
      duration: "6 Días / 5 Noches",
      category: "Escapadas de Lujo",
      badge: "Patrimonio Real",
      description: "Estancia privada en el palacio del lago Pichola, safari en coches clásicos reales por las colinas Aravalli y cenas a la luz de las velas.",
      highlights: ["Crucero real privado en el lago Pichola", "Cena palaciega con historiador real", "Tour en autos clásicos por Aravalli"]
    },
    8: {
      title: "Alta Montaña de Ladakh y Glamping en Nubra",
      location: "Ladakh, India",
      duration: "8 Días / 7 Noches",
      category: "Naturaleza Alpina",
      badge: "Himalaya",
      description: "Domo geodésico climatizado bajo las estrellas del Himalaya, bendición privada en monasterio y dunas con camellos bactrianos.",
      highlights: ["Domo geodésico climatizado de gran lujo", "Puja privada al amanecer en monasterio", "Astronomía y cielo nocturno en Pangong"]
    },
    9: {
      title: "Aguas de Kerala y Tierras Altas de Especias",
      location: "Kerala, India",
      duration: "6 Días / 5 Noches",
      category: "Tendencia",
      badge: "Aguas Serenas",
      description: "Crucero privado en casa flotante de cedro por el lago Vembanad, tratamientos ayurvédicos con médicos expertos y plantaciones de té.",
      highlights: ["Embarcación tradicional Kettuvallam privada", "Tratamiento ayurvédico dirigido por médicos", "Cata privada de té en Munnar"]
    },
    10: {
      title: "Valle de Cachemira y Casas Flotantes del Lago Dal",
      location: "Cachemira, India",
      duration: "6 Días / 5 Noches",
      category: "Cultural",
      badge: "Tradición",
      description: "Suites en casas flotantes de madera de cedro tallada a mano, shikara privado al amanecer en el mercado flotante y praderas de pino.",
      highlights: ["Casa flotante histórica de madera de pino", "Acceso al mercado flotante de flores en shikara", "Paseo a caballo por praderas de Pahalgam"]
    }
  },

  ar: {
    1: {
      title: "ساحل أمالفي ومنحدرات بوسيتانو",
      location: "إيطاليا",
      duration: "7 أيام / 6 ليالٍ",
      category: "ملاذات فاخرة",
      badge: "سحر البحر الأبيض المتوسط",
      description: "فيلات حصرية فوق المنحدرات الصخرية، رحلات يخت خاصة إلى كهوف كابري، وعشاء راقٍ حائز على نجوم ميشلان.",
      highlights: ["يخت خاص حصري إلى جزيرة كابري", "تذوق مشروبات الفاكهة في بساتين الليمون", "طيران مروحي خاص من نابولي"]
    },
    2: {
      title: "حدائق زن وغابات الخيزران في كيوتو",
      location: "اليابان",
      duration: "9 أيام / 8 ليالٍ",
      category: "رحلات ثقافية",
      badge: "سكينة شرقية",
      description: "تأمل شروق الشمس مع رهبان المعابد، مراسم شاي تقليدية خاصة مع كبار الأساتذة، وملاذات ينابيع أونسن الحصرية.",
      highlights: ["دخول خاص عند الفجر إلى غابة أراشيياما", "عشاء كايسيكي فاخر بإشراف شيف عالمي", "عرض فني خاص للغيشا اليابانية"]
    },
    3: {
      title: "قطار الأنهار الجليدية في جبال الألب السويسرية",
      location: "سويسرا",
      duration: "6 أيام / 5 ليالٍ",
      category: "طبيعة جبلية",
      badge: "جبال الألب",
      description: "قطار زجاجي بانورامي فائق الفخامة من الدرجة الأولى بين سانت موريتز وزيرمات، جولة هليكوبتر فوق ماترهورن، وشاليهات جبلية.",
      highlights: ["مقاعد درجة أولى في قطار جلاسير إكسبريس", "طيران مروحي خاص حول قمة ماترهورن", "دخول حصري إلى منتجعات المياه الحرارية"]
    },
    4: {
      title: "وادي المناطيد في كابادوكيا",
      location: "تركيا",
      duration: "5 أيام / 4 ليالٍ",
      category: "وجهات رائجة",
      badge: "الأكثر طلباً",
      description: "تحليق خاص في منطاد هوائي فجراً فوق المداخن الصخرية، أجنحة كهفية فاخرة، وجولات في المدن الأثرية تحت الأرض.",
      highlights: ["سلة خاصة للمنطاد عند شروق الشمس", "جناح كهفي فاخر مع مسبح خاص مدفأ", "مرشد تاريخي معتمد في غوريم"]
    },
    5: {
      title: "ريكيافيك وبراري الشفق القطبي",
      location: "آيسلندا",
      duration: "8 أيام / 7 ليالٍ",
      category: "طبيعة جبلية",
      badge: "براري الجليد",
      description: "رحلات سيارات الدفع الرباعي العملاقة في الكهوف الجليدية، استرخاء في بحيرة بلو لاغون، وإقامة في أكواخ زجاجية تحت الشفق.",
      highlights: ["ملاذ خاص في بحيرة بلو لاغون الحرارية", "استكشاف كهوف الجليد الزرقاء العميقة", "إقامة في كوخ زجاجي تحت أضواء الشفق"]
    },
    6: {
      title: "غروب أولواتو وملاذ أوبود الهادئ",
      location: "بالي",
      duration: "7 أيام / 6 ليالٍ",
      category: "ملاذات فاخرة",
      badge: "استجمام فاخر",
      description: "فيلات حصرية مع مسابح لا متناهية على الجرف، جلسات استشفاء صوتي في وادي النهر، وإبحار في قارب شراعي عند الغروب.",
      highlights: ["دخول خاص للمعابد العائمة عند الفجر", "جلسات استشفاء طبيعي في قلب الغابة", "شواء شاطئي خاص مع شيف شخصي"]
    },
    7: {
      title: "قصر بحيرة أودايبور وتراث ميوار الملكي",
      location: "راجستان, الهند",
      duration: "6 أيام / 5 ليالٍ",
      category: "ملاذات فاخرة",
      badge: "تراث ملكي",
      description: "إقامة حصرية في قصر بحيرة بيكولا، سفاري بالسيارات الملكية الكلاسيكية عبر تلال أرافالي، ومآدب ملكية على ضوء الشموع.",
      highlights: ["جولة خاصة في قارب ملكي شمسي بالبحيرة", "عشاء داخل القصر مع مؤرخ العائلة الملكية", "جولة سيارات كلاسيكية نادرة في تلال أرافالي"]
    },
    8: {
      title: "مرتفعات لاداخ ومخيمات نوبرا الفاخرة",
      location: "لاداخ, الهند",
      duration: "8 أيام / 7 ليالٍ",
      category: "طبيعة جبلية",
      badge: "قمم الهيمالايا",
      description: "خيام قبة جيوديسية فاخرة ومدفأة تحت نجوم الهيمالايا، بركات خاصة في الأديرة البوذية، وجولات الجمال ذات السنامين.",
      highlights: ["إقامة فاخرة في قباب جيوديسية مدفأة", "صلاة وبركة خاصة في دير تاريخي عند الشروق", "رصد فلكي متقدم للنجوم في بحيرة بانغونغ"]
    },
    9: {
      title: "قنوات كيرلا المائية ومرتفعات التوابل",
      location: "كيرلا, الهند",
      duration: "6 أيام / 5 ليالٍ",
      category: "وجهات رائجة",
      badge: "مياه هادئة",
      description: "يخت خشبي تقليدي فاخر من شجر الأرز في بحيرة فيمباناد، برامج علاج أيورفيدي أصيلة، وجولات في مزارع الشاي العضوية.",
      highlights: ["مركب تقليدي خاص وفخم في القنوات المائية", "علاجات أيورفيدية بإشراف أطباء متخصصين", "تذوق خاص لأندر أنواع الشاي في مونار"]
    },
    10: {
      title: "وادي كشمير والبيوت العائمة في بحيرة دال",
      location: "كشمير, الهند",
      duration: "6 أيام / 5 ليالٍ",
      category: "رحلات ثقافية",
      badge: "جمال كشميري",
      description: "أجنحة قوارب خشبية محفورة يدوياً من خشب الأرز، جولات فجرية في سوق الزهور العائم، ورحلات ركوب الخيل في وادي الصنوبر.",
      highlights: ["منزل عائم تراثي خاص من خشب الصنوبر", "دخول خاص لسوق الزهور العائم مع الشروق", "ركوب خيل في مروج باهالغام الساحرة"]
    }
  }
};

export const localizedArticles = {
  zh: {
    1: {
      title: "2026年全球避世秘境与幽隐绿洲",
      category: "旷野与隐居",
      readTime: "4 分钟阅读",
      destination: "印度 · 拉达克努布拉山谷",
      excerpt: "为何挑剔的旅行家正主动远离喧嚣的首都大都市，转向高海拔的深沉静谧与风塑长风？",
      pullQuote: "在当今时代，真正的奢华不再是你拥有什么，而是你能为自己召唤而来的绝对静谧。",
      content: [
        "随着高速互联网渗透到地球的最遥远角落，真正的静谧已跃升为终极的奢华。对于2026年的旅行家而言，熙熙攘攘的传统宏伟大饭店正被从容地置换为深谷中的避世庄园、私人沙漠营地以及时间仿佛放慢的非公开古老寺院。",
        "在拉达克努布拉山谷的高山之巅，我们的贵宾醒来时听不到汽笛与警报，唯有转经筒的轻微撞击声与雪松熏香的清冽芬芳。高原的稀薄空气要求一种沉思般的从容步伐，瞬间剥离了都市生活强加的虚妄焦虑。",
        "我们的行程策划师直接与当地世代传承的家族合作，锁定通往古老商道与隐秘杏林果园的特权通道。在这里，没有外界打扰的私享晚宴在无滤镜的壮美星空下徐徐展开，耳畔仅有冰川清流的低吟浅唱。"
      ],
      highlights: [
        "与游牧天文学家一起，使用科研级光学望远镜进行私享观星课程。",
        "独家探访通常不对公众开放的14世纪古寺修道院典籍档案室。",
        "手工定制恒温奢华测地穹顶帐篷，饱览喜马拉雅巍峨全景。"
      ]
    },
    2: {
      title: "慢旅行的艺术：为何在一个山谷待满14天远胜打卡5个国家",
      category: "人文与哲学",
      readTime: "6 分钟阅读",
      destination: "意大利 · 阿马尔菲海岸与拉韦洛",
      excerpt: "请抵制集邮般收集护照印章的现代冲动。在拉韦洛度过深沉充实的两周，能将寻常假期升华为流动的艺术生命。",
      pullQuote: "直到面包师清晨知晓你习惯如何享用那杯意式浓缩，你才算真正抵达了意大利。",
      content: [
        "清单式打卡旅行是快乐的反义词。在七天内匆忙奔波于威尼斯、佛罗伦萨和罗马，只能收获数千张急促的照片，却让灵魂得不到任何安放，疲惫不堪。慢旅行正是我们热情开出的解药。",
        "当你在拉韦洛高悬海面的悬崖庄园中安顿两周，地中海的恒久节律便开始渗入你的神经系统。你开始懂得午间小憩的惬意、赋予当地柠檬传奇甘甜的独特微气候，以及世代坚守的橄榄庄园家庭的自豪。",
        "我们的定制行程在设计上特意保留了大量从容留白：一个超凡的晨间偶遇，随后是数小时不被打扰的遐思。无论是在私人露台勾勒第勒尼安海的深蓝，还是与酒庄庄主共进长达四小时的午餐，慢旅行都能重塑我们对世界的敬畏之美。"
      ],
      highlights: [
        "自由进出始于1884年的私人悬崖植物花园独家特权。",
        "私人老式红木 Riva 快艇包租，探访唯有从海面方可抵达的海蚀洞穴。",
        "定制多道式品鉴午宴，搭配未嫁接百年老藤罕见佳酿。"
      ]
    },
    3: {
      title: "探秘京都陶艺大师：柴火与泥土的十六代坚守",
      category: "匠人非遗",
      readTime: "5 分钟阅读",
      destination: "日本 · 京都与奈良",
      excerpt: "走进东山深处弥漫锯末清香的隐秘工坊，探寻十六代乐烧宗师如何为皇室传统雕琢传世茶碗。",
      pullQuote: "在日本侘寂（Wabi-Sabi）美学中，不完美绝非疏忽——它是美得以入驻的真正门槛。",
      content: [
        "掩映在东山狭窄水渠旁的雪松格栅深处，一扇不起眼的木门轻轻滑开，呈现出一个四百年未曾改变的世界。在这里，第十六代非遗匠人正揉捏着从两英里外河床掘出、并在地下暗窖中醇化了三十年的珍贵陶泥。",
        "得益于 Zentrevo 的深厚文化外交关系，我们的宾客享有特权进入这些神圣的工作室秘境。这里没有纪念品商店，没有游客队伍，也没有刻意表演——唯有六十载倾注一生所磨砺出的纯粹工匠诗意。",
        "手捧现点现打的仪式级抹茶，大师为您娓娓道来侘寂美学的真谛：对不对称、粗砺质感与岁月留痕的由衷敬畏。宾客更可受邀观摩窑温超过1200摄氏度的开窑过程，亲历矿物釉料化作温润瓷器的奇迹时刻。"
      ],
      highlights: [
        "闭门会见日本官方认定的“人间国宝”级陶艺泰斗大师。",
        "使用陈酿30年的京都特选河泥，亲身体验私教陶艺捏制体验。",
        "在私人17世纪禅宗寺院别院茶室，尊享闭门私密茶道仪式。"
      ]
    },
    4: {
      title: "高山庇护所：恩嘎丁山谷的星辰与静默",
      category: "身心疗愈",
      readTime: "5 分钟阅读",
      destination: "瑞士阿尔卑斯 · 圣莫里茨",
      excerpt: "纯净冰川高山空气、富矿地热温泉与落叶松森林浴如何深度唤醒现代人心智。",
      pullQuote: "在恩嘎丁的高处，空气如此纯澈明净，尝起来就像冰镇的水晶。",
      content: [
        "早在现代奢华水疗度假村诞生数个世纪之前，欧洲哲学家与诗人就曾远赴恩嘎丁高山深谷恢复生命元气。其秘诀正是当地人所说的“香槟气候”——一种迅速驱散大脑思维迷雾的高海拔明亮光线。",
        "我们的阿尔卑斯休养之旅将瑞士百年矿物温泉与当代生物节律修复疗法相融合。清晨，在专业向导带领下漫步于闪烁金光的落叶松森林，深呼吸富含抗压因子的天然芬多精。",
        "黄昏降临，引流自高山深处地热花岗岩温泉池倒映着月光下的雪峰。再由私人主厨以高山草本植物与纯手工奶酪精心烹调，带来身心合一的深度重生。"
      ],
      highlights: [
        "私人直升机空降至未受污染的野雪冰川越野步道起点。",
        "悬崖纯天然矿物质高山温泉夜间私密独享特权。",
        "由奥运级康复医学导师指导的一对一呼吸与高山恢复课程。"
      ]
    },
    5: {
      title: "梅瓦尔王室后厨秘事：乌代布尔廷宴寻踪",
      category: "风土美食",
      readTime: "6 分钟阅读",
      destination: "印度 · 乌代布尔皮丘拉湖",
      excerpt: "解密曾被视为国家机密的宫廷古谱、陶罐慢火熏香咖喱，以及漂浮在皮丘拉湖水面的大理石水上廷宴。",
      pullQuote: "在古梅瓦尔王室，烹饪绝非单纯的进餐，它是廷臣荣耀与草本医理交织的奇迹炼金术。",
      content: [
        "在乌代布尔王宫精致的雕花窗牖后，封存着曾被列为国家机密的烹饪传统。王室主厨世代仅凭口头诗歌传授秘方，谨守手磨香料与烟熏藏红花的独门配比。",
        "Zentrevo 贵宾受邀越过红丝绒围栏，步入私家王宫内院庭园，由第三代宫廷主厨现场展示木炭慢火慢炖的极致精髓。采自阿拉瓦利山脉微型种植园的珍稀香料在纯铜大锅中由澄清酥油精心激发香气。",
        "当夕阳将皮丘拉湖染成金玫瑰色，水上盛宴将在装饰着数百盏漂浮油灯的王室礼仪画舫上缓缓呈献。"
      ],
      highlights: [
        "王室私厨私家传世食谱定制六道式星光廷宴。",
        "皮丘拉湖私人古画舫夕阳泛舟，现场传统西塔琴大师伴奏。",
        "深入阿拉瓦利山麓原产地有机香料农庄私享品鉴之旅。"
      ]
    }
  },

  es: {
    1: {
      title: "Destinos Remotos y Refugios Secretos en 2026",
      category: "Aventura y Aislamiento",
      readTime: "4 min lectura",
      destination: "Valle de Nubra, Ladakh",
      excerpt: "¿Por qué los viajeros exigentes evitan capitales abarrotadas en busca de soledad y silencio esculpido por el viento?",
      pullQuote: "El verdadero lujo hoy no es lo que posees, sino la absoluta calma que puedes convocar a tu alrededor.",
      content: [
        "A medida que la hiperconectividad penetra en los confines del planeta, el silencio absoluto se ha coronado como el supremo lujo. Para el viajero de 2026, los concurridos hoteles tradicionales se cambian por fincas cerradas en valles remotos y monasterios de acceso privado.",
        "En el valle de Nubra, nuestros huéspedes no despiertan con alarmas, sino con el sonido de los molinillos de oración y el aroma a cedro. La altitud impone un ritmo meditativo que desvanece la urgencia de la vida moderna.",
        "Nuestros arquitectos de viaje trabajan directamente con familias locales para garantizar accesos a senderos ancestrales y huertos ocultos de albaricoques bajo un firmamento estrellado."
      ],
      highlights: [
        "Sesiones privadas de astronomía con telescopios de óptica científica.",
        "Acceso exclusivo a archivos monásticos del siglo XIV cerrados al público.",
        "Domos geodésicos climatizados con vistas panorámicas al Himalaya."
      ]
    },
    2: {
      title: "El Arte del Slow Travel: 14 Días en un Valle Superan a 5 Países",
      category: "Cultura y Filosofía",
      readTime: "6 min lectura",
      destination: "Costa Amalfitana y Ravello",
      excerpt: "Resista el impulso de coleccionar sellos en aeropuertos. Dos semanas en Ravello transforman unas vacaciones en arte puro.",
      pullQuote: "No has llegado realmente a Italia hasta que el panadero sabe cómo tomas tu café espresso por la mañana.",
      content: [
        "El itinerario de lista de deseos es la antítesis de la felicidad. Viajar con prisas produce fotos apresuradas pero agota el alma. El 'slow travel' es nuestra apasionada respuesta.",
        "Cuando te instalas dos semanas en una villa sobre los acantilados de Ravello, el ritmo del Mediterráneo calma tus sentidos. Comprendes el valor de la siesta y la dulzura única de los limones locales.",
        "Nuestros itinerarios dejan espacio para el asombro: una experiencia sublime matutina seguida de horas de serena contemplación contemplando el azul del mar Tirreno."
      ],
      highlights: [
        "Acceso ilimitado a un jardín botánico privado sobre acantilados de 1884.",
        "Chárter privado en barco Riva clásico a grutas marinas aisladas.",
        "Almuerzos gastronómicos maridados con vinos de viñas prefiloxéricas."
      ]
    },
    3: {
      title: "Con los Maestros Ceramistas de Kioto",
      category: "Artesanía y Tradición",
      readTime: "5 min lectura",
      destination: "Kioto y Nara",
      excerpt: "Dentro de los discretos talleres de madera donde maestros Raku de decimosexta generación moldean cuencos para el té imperial.",
      pullQuote: "En la estética japonesa del wabi-sabi, la imperfección es el umbral mismo por donde entra la belleza.",
      content: [
        "Detrás de celosías de cedro en los canales de Higashiyama, una discreta puerta de madera da paso a un taller intacto durante cuatro siglos. Aquí, un artesano moldea arcilla añejada durante 30 años en bóvedas subterráneas.",
        "Gracias a las relaciones culturales de Zentrevo, nuestros huéspedes acceden en exclusiva a estos santuarios de creación sin colas ni demostraciones comerciales.",
        "Degustando té matcha ceremonial, el maestro explica el wabi-sabi y permite presenciar el encendido del horno a más de 1.200 grados donde el esmalte cobra vida."
      ],
      highlights: [
        "Audiencia privada con un maestro declarado Tesoro Nacional Vivo de Japón.",
        "Taller práctico privado de moldeado con arcilla de Kioto añejada.",
        "Ceremonia exclusiva de té en el pabellón privado de un templo zen del siglo XVII."
      ]
    },
    4: {
      title: "Santuarios Alpinos: Silencio y Estrellas en el Valle de Engadina",
      category: "Bienestar",
      readTime: "5 min lectura",
      destination: "Alpes Suizos y St. Moritz",
      excerpt: "El aire puro de glaciar, los baños termales y los bosques de alerces como regeneración del cuerpo y mente.",
      pullQuote: "En Engadina, el aire es tan puro y luminoso que sabe a cristal helado.",
      content: [
        "Mucho antes de que existieran los spas contemporáneos, los pensadores europeos viajaban al valle de Engadina para recuperar su vigor gracias a su famoso 'clima de champán'.",
        "Nuestros retiros combinan baños minerales tradicionales suizos con terapias de recuperación circadiana. Caminatas conscientes por bosques de alerces reducen el estrés al instante.",
        "Al atardecer, piscinas exteriores de granito alimentadas por manantiales termales ofrecen vistas a cumbres nevadas bajo la luna."
      ],
      highlights: [
        "Vuelos en helicóptero privado hacia senderos vírgenes en glaciares.",
        "Acceso nocturno privado a baños termales de aguas minerales.",
        "Sesiones de respiración guiadas por médicos de entrenamiento olímpico."
      ]
    },
    5: {
      title: "Las Cocinas Reales de Mewar: Sabores de Udaipur",
      category: "Gastronomía",
      readTime: "6 min lectura",
      destination: "Udaipur y Lago Pichola",
      excerpt: "Recetas reales que fueron secreto de estado, curris en vasijas de barro a fuego lento y cenas flotantes en el lago Pichola.",
      pullQuote: "En la corte de Mewar, cocinar era una alquimia sagrada de honor y medicina herbaria.",
      content: [
        "Tras los miradores labrados de los palacios de Udaipur yacen secretos culinarios transmitidos únicamente mediante versos orales entre cocineros reales de generación en generación.",
        "Los invitados de Zentrevo acceden a patios privados donde maestros chefs cocinan a fuego lento con carbón de dhungar y especias puras de las colinas Aravalli.",
        "Al atardecer, la cena se sirve a bordo de una barcaza ceremonial que navega por el lago Pichola entre cientos de lámparas de aceite flotantes."
      ],
      highlights: [
        "Banquete privado de seis tiempos diseñado a partir de recetas históricas.",
        "Navegación al atardecer en barcaza real por el lago Pichola con música en vivo.",
        "Visita privada con degustación a granjas de especias de Aravalli."
      ]
    }
  },

  ar: {
    1: {
      title: "وجهات معزولة وملاذات سرية في 2026",
      category: "مغامرة وسكينة",
      readTime: "4 دقائق للقراءة",
      destination: "وادي نوبرا، لاداخ",
      excerpt: "لماذا يتجاوز المسافر المميز العواصم المزدحمة لصالح العزلة الشاهقة والصمت الساحر في أعالي الجبال؟",
      pullQuote: "الفخامة الحقيقية اليوم ليست فيما تملكه، بل في السكينة المطلقة التي تستطيع استحضارها من حولك.",
      content: [
        "مع تغلغل شبكات الاتصال في كل ركن من أركان العالم، برز الصمت الحقيقي كأسمى درجات الرفاهية. بالنسبة لمسافري 2026، تم استبدال الفنادق الكبرى الصاخبة بضيعات وادي خاصة، ومخيمات صحراوية حصرية، وأديرة يتباطأ فيها الزمن.",
        "في أعالي وادي نوبرا في لاداخ، يستيقظ ضيوفنا ليس على أصوات التنبيهات، بل على رنين عجلات الصلاة الهادئ وعبير خشب الأرز النقي. وتفرض الطبيعة الجبلية وتيرة هادئة تنزع عنك صخب الحياة الحديثة.",
        "يعمل مستشارو السفر لدينا مباشرة مع العائلات المحلية لتأمين الوصول الحصري إلى مسارات القوافل التاريخية وبساتين المشمش الخفية تحت قبة سماوية مرصعة بالنجوم."
      ],
      highlights: [
        "جلسات رصد فلكي خاصة مع علماء فلك محليين باستخدام تلسكوبات بصرية علمية.",
        "دخول حصري إلى وثائق وأرشيف دير من القرن الرابع عشر مغلق أمام العامة.",
        "قباب جيوديسية فاخرة ومدفأة مع إطلالات بانورامية على قمم الهيمالايا."
      ]
    },
    2: {
      title: "فن السفر البطيء: لماذا يعتبر قضاء 14 يوماً في وادٍ واحد أفضل من زيارة 5 دول",
      category: "ثقافة وفلسفة",
      readTime: "6 دقائق للقراءة",
      destination: "ساحل أمالفي ورافيلو",
      excerpt: "قاوم الرغبة المعاصرة في جمع أختام المطارات. أسبوعان في رافيلو يحولان الإجازة العادية إلى تحفة فنية حية.",
      pullQuote: "أنت لم تصل حقاً إلى إيطاليا حتى يعرف الخباز في الصباح كيف تحب قهوتك الإسبريسو.",
      content: [
        "السفر السريع وجداول الزيارات المزدحمة هو النقيض التام للبهجة الحقيقية. الاندفاع بين المدن في أسبوع يمنحك صوراً متسرعة ولكنه يرهق الروح. السفر الهادئ المتأني هو علاجنا المتفاني.",
        "عندما تستقر لمدة أسبوعين متتاليين في فيلا جرفية فوق رافيلو، يبدأ إيقاع البحر الأبيض المتوسط بالتغلغل في حواسك، وتفهم قيمة فترات الاسترخاء والسكينة.",
        "تتميز برامجنا بترك مساحات رحبة للتأمل: تجربة صباحية ساحرة تليها ساعات من الاسترخاء التام أمام زرقة البحر التيراني."
      ],
      highlights: [
        "دخول غير مقيد إلى حديقة نباتية خاصة على الجرف تعود لعام 1884.",
        "قارب ريفا خشبي كلاسيكي خاص للوصول إلى كهوف بحرية منعزلة.",
        "وجبات غداء استثنائية مقترنة بمحاصيل كروم عريقة متوارثة عبر الأجيال."
      ]
    },
    3: {
      title: "في كواليس مشاغل كبار خزافي كيوتو",
      category: "حرف تراثية",
      readTime: "5 دقائق للقراءة",
      destination: "كيوتو ونارا",
      excerpt: "داخل المشاغل الخشبية المعطرة بنشارة الخشب حيث يشكل أساتذة راكو من الجيل السادس عشر أواني الشاي الإمبراطورية.",
      pullQuote: "في فلسفة الوابي سابي اليابانية، عدم الكمال ليس عيباً، بل هو العتبة التي يدخل منها الجمال الحقيقي.",
      content: [
        "خلف مشربيات الأرز بمحاذاة قنوات هيغاشياما المائية، ينزلق باب خشبي خفي ليكشف عن عالم لم يتغير منذ أربعة قرون. هنا يعجن حرفي من الجيل السادس عشر طيناً مستخرجاً من قاع النهر ومخزناً منذ 30 عاماً.",
        "بفضل العلاقات الدبلوماسية والثقافية لزينتريفو، يُمنح ضيوفنا دخولاً مميزاً إلى هذه المشاغل المقدسة بعيداً عن صخب السياح.",
        "أثناء احتساء شاي الماتشا الاحتفالي، يشرح الأستاذ فلسفة الوابي سابي ويدعو الضيوف لمشاهدة لحظات إيقاد الأفران عند حرارة تتجاوز 1200 درجة مئوية."
      ],
      highlights: [
        "لقاء خاص ومغلق مع فنان مصنف كنزاً وطنياً حياً في اليابان.",
        "ورشة عمل تفاعلية خاصة للتشكيل باستخدام طين كيوتو المعتق منذ 30 عاماً.",
        "مراسم شاي حصرية تقام في جناح خاص بمعبد زن يعود للقرن السابع عشر."
      ]
    },
    4: {
      title: "ملاذات الألب: الصمت والنجوم في وادي إنغادين",
      category: "استشفاء وصحة",
      readTime: "5 دقائق للقراءة",
      destination: "جبال الألب السويسرية وسانت موريتز",
      excerpt: "كيف يساهم هواء الجليد النقي والينابيع الحرارية وغابات الصنوبر في استعادة حيوية العقل العصري.",
      pullQuote: "في أعالي إنغادين، الهواء نقي ومضيء لدرجة أن مذاقه يشبه الكريستال المثلج.",
      content: [
        "قبل قرون من وجود المنتجعات الحديثة، سافر فلاسفة وشعراء أوروبا إلى وادي إنغادين لاستعادة حيويتهم بفضل ما يصفه المحليون بمناخ الشامبانيا المنعش الذي يزيل إرهاق الذهن.",
        "تجمع برامجنا بين الاستحمام في مياه الينابيع المعدنية السويسرية وجلسات الاستشفاء الطبيعي المعاصرة، مع جولات صباحية في غابات الصنوبر الذهبية لخفض التوتر.",
        "مع حلول الغسق، توفر المسابح الحرارية الخارجية المبنية من الغرانيت إطلالات خلابة على القمم الجبلية المضاءة بالقمر."
      ],
      highlights: [
        "إنزال بطائرة مروحية خاصة عند مسارات الأنهار الجليدية البكر.",
        "دخول ليلي حصري للينابيع الحرارية الطبيعية على حافة الجرف.",
        "جلسات تنفس واستشفاء موجهة من أطباء متخصصين في تدريب الرياضيين الأولمبيين."
      ]
    },
    5: {
      title: "أسرار مطابخ ميوار الملكية: روائع الطهي في أودايبور",
      category: "فنون الطهي والتذوق",
      readTime: "6 دقائق للقراءة",
      destination: "أودايبور وبحيرة بيكولا",
      excerpt: "إحياء وصفات ملكية تاريخية، وأطباق الفخار المطهوة على نار هادئة، وعشاء فاخر على منصات رخامية عائمة في بحيرة بيكولا.",
      pullQuote: "في بلاط ميوار الملكي، لم يكن الطهي مجرد إعداد للطعام، بل كيمياء مقدسة تمزج الشرف بالطب العشبي.",
      content: [
        "خلف شرفات قصور أودايبور المزخرفة، تكمن تقاليد طهي ملكية كانت تُعد في الماضي من أسرار الدولة، وتوارثها طهاة القصر شفهياً عبر أبيات شعرية.",
        "يُدعى ضيوف زينتريفو للدخول خلف الحواجز المخملية إلى باحات القصر الخاصة حيث يستعرض كبار الطهاة فنون الطهي البطيء على فحم الدونغار المعطر والتوابل النادرة.",
        "مع غروب الشمس الذي يغمر بحيرة بيكولا بلون الذهب الوردي، يُقدم العشاء على متن قارب ملكي تاريخي يبحر وسط مئات القناديل المضيئة."
      ],
      highlights: [
        "عشاء ملكي خاص من 6 أطباق مستوحى من الوصفات الملكية النادرة.",
        "إبحار مسائي على متن بارجة ملكية في بحيرة بيكولا مع عزف حي لآلة السيتار.",
        "جولة تذوق خاصة في مزارع التوابل العضوية النادرة في سفوح تلال أرافالي."
      ]
    }
  }
};

const pendingTranslationKeys = new Set();

// Helper function to return localized destination
export const getLocalizedDestination = (dest, language = 'en') => {
  if (!dest) return dest;
  const targetLang = language || 'en';

  // 1. Check dynamic cloud/admin auto-translations stored on the destination card
  const dynamicLocalized = dest.translations?.[targetLang];
  if (dynamicLocalized && dynamicLocalized.title) {
    return {
      ...dest,
      ...dynamicLocalized,
      baseCategory: dest.category,
      categoryLabel: dynamicLocalized.category || dest.category
    };
  }

  if (targetLang === 'en') return dest;

  // 2. Fallback to built-in curated dictionary
  const translationMap = localizedDestinations[targetLang];
  if (!translationMap || !translationMap[dest.id]) return dest;
  const localized = translationMap[dest.id];
  return {
    ...dest,
    ...localized,
    baseCategory: dest.category,
    categoryLabel: localized.category || dest.category
  };
};

// Background helper to translate any custom/admin card lacking translations for active language
export const ensureMissingTranslations = async (destinationsList = [], language = 'en') => {
  if (typeof window === 'undefined' || !Array.isArray(destinationsList) || !language) return;

  const candidates = destinationsList.filter((dest) => {
    if (!dest || !dest.id || !dest.title) return false;
    if (dest.translations?.[language]?.title) return false;
    if (language === 'en' && !dest.translations) return false;
    if (language !== 'en' && localizedDestinations[language]?.[dest.id]) return false;
    const key = `${dest.id}:${language}`;
    if (pendingTranslationKeys.has(key)) return false;
    return true;
  });

  if (candidates.length === 0) return;

  for (const dest of candidates) {
    const key = `${dest.id}:${language}`;
    pendingTranslationKeys.add(key);
    try {
      const res = await fetch('/api/translate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip: {
            title: dest.title,
            location: dest.location,
            badge: dest.badge,
            category: dest.category,
            duration: dest.duration,
            description: dest.description,
            highlights: Array.isArray(dest.highlights) ? dest.highlights : []
          }
        })
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data?.success || !data?.translations) continue;

      const storedRaw = localStorage.getItem('zentrevo_active_destinations');
      const currentList = storedRaw ? JSON.parse(storedRaw) : destinationsList;
      if (Array.isArray(currentList)) {
        const updatedList = currentList.map((item) =>
          item.id === dest.id
            ? { ...item, translations: { ...(item.translations || {}), ...data.translations } }
            : item
        );
        localStorage.setItem('zentrevo_active_destinations', JSON.stringify(updatedList));
        window.dispatchEvent(new Event('zentrevo_destinations_updated'));
      }
    } catch {}
  }
};

// Helper function to return array of localized destinations
export const getLocalizedDestinationsList = (destinationsList = baseDestinations, language = 'en') => {
  if (!destinationsList) return [];
  if (!language || language === 'en') return destinationsList;
  return destinationsList.map(d => getLocalizedDestination(d, language));
};

// Helper function to return localized article
export const getLocalizedArticle = (article, language = 'en') => {
  if (!article) return article;
  if (!language || language === 'en') return article;
  const translationMap = localizedArticles[language];
  if (!translationMap || !translationMap[article.id]) return article;
  return {
    ...article,
    ...translationMap[article.id]
  };
};

// Helper function to return array of localized articles
export const getLocalizedArticlesList = (articlesList = baseArticles, language = 'en') => {
  if (!articlesList) return [];
  if (!language || language === 'en') return articlesList;
  return articlesList.map(a => getLocalizedArticle(a, language));
};
