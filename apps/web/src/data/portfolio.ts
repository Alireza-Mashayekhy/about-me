/**
 * ============================================================
 *  دادهٔ مرکزی پورتفولیو — ORBIT
 * ============================================================
 *  همهٔ محتوای سایت از همین فایل خوانده می‌شود.
 *  برای ویرایش متن‌ها، پروژه‌ها یا اطلاعات تماس فقط اینجا را تغییر بده.
 *
 *  ⚠️ اطلاعات تماس: فیلدهای خالی (`''`) در سایت نمایش داده نمی‌شوند.
 *  ایمیل، لینکدین، تلگرام و شمارهٔ تماست را اینجا وارد کن تا فعال شوند.
 *
 *  ⚠️ پروژه‌ها: برای هر پروژه فقط اطلاعاتی درج شده که از خودِ وب‌سایت
 *  عمومی آن قابل مشاهده بوده است. فیلدهای `role`، `year`، `tech` و…
 *  را با اطلاعات واقعی خودت کامل کن؛ فیلد خالی در UI مخفی می‌ماند.
 * ============================================================
 */

export const profile = {
  nameFa: 'علیرضا مشایخی',
  nameEn: 'Alireza Mashayekhy',
  roleFa: 'توسعه‌دهنده فول‌استک وب',
  roleEn: 'Full-Stack Web Developer & Creative Engineer',
  experienceFa: 'حدود ۶ سال تجربه',
  taglineFa: 'دنیای دیجیتال من را کشف کن.',
  subtitleFa: 'از ایده تا محصول؛ در تمام لایه‌های وب.',
  bioFa:
    'من علیرضا مشایخی هستم؛ توسعه‌دهنده فول‌استک وب با علاقه به ساخت محصولات دیجیتال باکیفیت، رابط‌های کاربری مدرن و تجربه‌های تعاملی منحصربه‌فرد. از طراحی رابط کاربری تا توسعه بک‌اند، تلاش می‌کنم ایده‌ها را به محصولات وب واقعی، کاربردی و قابل توسعه تبدیل کنم.',
} as const;

/** اطلاعات تماس — فیلدهای خالی نمایش داده نمی‌شوند. */
export const contact: {
  email: string;
  github: string;
  linkedin: string;
  telegram: string;
  phone: string;
} = {
  /** TODO(علیرضا): ایمیل کاری‌ات را اینجا بگذار، مثال: 'hello@example.com' */
  email: '',
  /** از مخزن عمومی همین پروژه قابل تأیید است */
  github: 'https://github.com/Alireza-Mashayekhy',
  /** TODO(علیرضا): آدرس پروفایل لینکدین */
  linkedin: '',
  /** TODO(علیرضا): آیدی تلگرام، مثال: 'https://t.me/username' */
  telegram: '',
  /** TODO(علیرضا): شماره تماس (در صورت تمایل به نمایش عمومی) */
  phone: '',
} as const;

/* ------------------------------------------------------------------ */
/*  بخش‌های اصلی — هر کدام یک مانیتور روی گوی و یک صفحهٔ مستقل است      */
/* ------------------------------------------------------------------ */

export type SectionId = 'about' | 'skills' | 'work' | 'approach' | 'expertise' | 'contact';

export interface OrbitSection {
  id: SectionId;
  index: string;
  labelFa: string;
  labelEn: string;
  href: string;
  /** جملهٔ کوتاه برای HUD و پیش‌نمایش مانیتور */
  teaserFa: string;
  /** موقعیت مانیتور روی کره (درجه) */
  lon: number;
  lat: number;
}

export const sections: readonly OrbitSection[] = [
  {
    id: 'about',
    index: '01',
    labelFa: 'درباره من',
    labelEn: 'ABOUT',
    href: '/about',
    teaserFa: 'علیرضا مشایخی — توسعه‌دهنده فول‌استک وب با حدود ۶ سال تجربه',
    lon: 0,
    lat: 16,
  },
  {
    id: 'skills',
    index: '02',
    labelFa: 'مهارت‌ها',
    labelEn: 'SKILLS',
    href: '/skills',
    teaserFa: 'فرانت‌اند، بک‌اند، داده، سئو و ابزارهای توسعه',
    lon: 62,
    lat: -14,
  },
  {
    id: 'work',
    index: '03',
    labelFa: 'پروژه‌ها',
    labelEn: 'SELECTED WORK',
    href: '/work',
    teaserFa: 'نمونه‌کارهای واقعی و منتشرشده روی وب',
    lon: 124,
    lat: 20,
  },
  {
    id: 'approach',
    index: '04',
    labelFa: 'روش کار من',
    labelEn: 'APPROACH',
    href: '/approach',
    teaserFa: 'از درک مسئله تا توسعه، بررسی عملکرد و نگهداری محصول',
    lon: 186,
    lat: -18,
  },
  {
    id: 'expertise',
    index: '05',
    labelFa: 'توسعه محصول',
    labelEn: 'EXPERTISE',
    href: '/expertise',
    teaserFa: 'حوزه‌هایی که در آن‌ها محصول وب می‌سازم',
    lon: 248,
    lat: 12,
  },
  {
    id: 'contact',
    index: '06',
    labelFa: 'ارتباط',
    labelEn: 'CONTACT',
    href: '/contact',
    teaserFa: 'راه‌های ارتباط و شروع یک همکاری',
    lon: 308,
    lat: -10,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  مهارت‌ها                                                            */
/* ------------------------------------------------------------------ */

export interface SkillGroup {
  id: string;
  titleFa: string;
  titleEn: string;
  items: readonly string[];
}

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'frontend',
    titleFa: 'فرانت‌اند',
    titleEn: 'FRONTEND',
    items: [
      'React.js',
      'Next.js',
      'Vue.js 2 & 3',
      'Nuxt.js',
      'JavaScript',
      'TypeScript',
      'HTML & CSS',
      'Sass',
      'Tailwind CSS',
      'Bootstrap',
      'Material UI',
      'PrimeReact',
      'Nuxt UI',
    ],
  },
  {
    id: 'state-data',
    titleFa: 'مدیریت وضعیت و داده',
    titleEn: 'STATE & DATA',
    items: ['Redux', 'Pinia', 'React Query'],
  },
  {
    id: 'backend',
    titleFa: 'بک‌اند',
    titleEn: 'BACKEND',
    items: [
      'Node.js',
      'Express.js',
      'NestJS',
      'طراحی و توسعه API',
      'پیاده‌سازی منطق تجاری',
      'ارتباط فرانت‌اند و بک‌اند',
    ],
  },
  {
    id: 'seo-tools',
    titleFa: 'سئو و ابزارهای توسعه',
    titleEn: 'SEO & TOOLING',
    items: ['سئو فنی', 'بهینه‌سازی وب‌سایت', 'Git', 'Docker', 'گردش کار استقرار'],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  حوزه‌های تخصصی                                                      */
/* ------------------------------------------------------------------ */

export interface ExpertiseArea {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  related: readonly string[];
}

export const expertiseAreas: readonly ExpertiseArea[] = [
  {
    id: 'frontend',
    titleFa: 'توسعه فرانت‌اند و رابط کاربری',
    titleEn: 'FRONTEND & UI',
    descriptionFa:
      'ساخت رابط‌های کاربری مدرن، واکنش‌گرا و سریع با اکوسیستم React و Vue؛ از سیستم‌های طراحی و کتابخانه‌های کامپوننت تا تجربه‌های تعاملی و سه‌بعدی روی وب.',
    related: ['React.js', 'Next.js', 'Vue.js', 'Nuxt.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    titleFa: 'توسعه بک‌اند و API',
    titleEn: 'BACKEND & API',
    descriptionFa:
      'طراحی و توسعه API و منطق تجاری سمت سرور با Node.js؛ ساخت سرویس‌هایی که فرانت‌اند بتواند با اطمینان روی آن‌ها تکیه کند.',
    related: ['Node.js', 'NestJS', 'Express.js', 'REST API'],
  },
  {
    id: 'fullstack',
    titleFa: 'اپلیکیشن‌های فول‌استک',
    titleEn: 'FULL-STACK PRODUCTS',
    descriptionFa:
      'توسعه end-to-end محصول وب؛ اتصال منسجم لایهٔ نمایش، مدیریت وضعیت و داده، و سرویس‌های سمت سرور در یک معماری قابل نگهداری.',
    related: ['Next.js', 'React Query', 'Redux', 'Pinia'],
  },
  {
    id: 'seo',
    titleFa: 'سئو فنی و بهینه‌سازی',
    titleEn: 'SEO & OPTIMIZATION',
    descriptionFa:
      'بهینه‌سازی فنی وب‌سایت برای موتورهای جست‌وجو و تجربهٔ کاربر؛ از ساختار و متادیتا تا سرعت بارگذاری و رندر سمت سرور.',
    related: ['Technical SEO', 'SSR / SSG', 'Web Performance'],
  },
  {
    id: 'delivery',
    titleFa: 'استقرار و گردش کار توسعه',
    titleEn: 'DELIVERY & WORKFLOW',
    descriptionFa:
      'مدیریت نسخه، کانتینری‌سازی و استقرار پروژه‌های وب با گردش کاری که تحویل و نگهداری محصول را قابل پیش‌بینی می‌کند.',
    related: ['Git', 'Docker', 'Deployment Workflow'],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  روش کار                                                             */
/* ------------------------------------------------------------------ */

export interface ApproachStep {
  index: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
}

export const approachSteps: readonly ApproachStep[] = [
  {
    index: '01',
    titleFa: 'شناخت نیاز و مسئله',
    titleEn: 'DISCOVER',
    descriptionFa:
      'قبل از نوشتن هر خط کد، مسئله را دقیق می‌فهمم: هدف محصول چیست، کاربرش کیست و موفقیت دقیقاً چه شکلی است. خروجی این مرحله، برداشت مشترکی از «چه چیزی» و «چرا» است.',
  },
  {
    index: '02',
    titleFa: 'طراحی ساختار و راهکار',
    titleEn: 'ARCHITECT',
    descriptionFa:
      'معماری فنی، ساختار داده و مسیرهای اصلی کاربر طراحی می‌شود تا محصول از ابتدا قابل توسعه و نگهداری باشد؛ نه مجموعه‌ای از وصله‌های موقت.',
  },
  {
    index: '03',
    titleFa: 'پیاده‌سازی',
    titleEn: 'BUILD',
    descriptionFa:
      'توسعهٔ تدریجی و قابل مشاهده؛ از رابط کاربری تا API و منطق سمت سرور. هر بخش وقتی تمام‌شده حساب می‌شود که واقعاً کار کند، نه فقط وقتی خوب به نظر برسد.',
  },
  {
    index: '04',
    titleFa: 'تست و بررسی',
    titleEn: 'VERIFY',
    descriptionFa:
      'بررسی رفتار واقعی محصول: مسیرهای اصلی کاربر، حالت‌های مرزی، خطاها و سازگاری با دستگاه‌ها و مرورگرهای مختلف؛ قبل از اینکه کاربر نهایی به مشکل بربخورد.',
  },
  {
    index: '05',
    titleFa: 'بهینه‌سازی',
    titleEn: 'OPTIMIZE',
    descriptionFa:
      'بهینه‌سازی سرعت، سئو فنی و تجربهٔ کاربری؛ محصول خوب فقط درست کار نمی‌کند، سریع و پیدا‌شدنی هم هست.',
  },
  {
    index: '06',
    titleFa: 'نگهداری و توسعه',
    titleEn: 'EVOLVE',
    descriptionFa:
      'محصول بعد از انتشار زنده می‌ماند: پایش، رفع مشکل، و توسعهٔ قابلیت‌های تازه روی همان پایهٔ محکمی که از روز اول ساخته شده است.',
  },
] as const;

/* ------------------------------------------------------------------ */
/*  پروژه‌ها                                                            */
/* ------------------------------------------------------------------ */

export interface Project {
  slug: string;
  /** نام نمایشی پروژه */
  titleFa: string;
  titleEn: string;
  url: string;
  /** دامنهٔ نمایشی بدون https */
  domain: string;
  categoryFa: string;
  categoryEn: string;
  /**
   * توضیح کوتاه. فقط بر اساس آنچه در خودِ سایت عمومی پروژه دیده می‌شود.
   * `null` یعنی هنوز تکمیل نشده و در UI به‌صورت «در حال تکمیل» نمایش داده می‌شود.
   */
  summaryFa: string | null;
  /** مسئله و هدف پروژه — TODO: با اطلاعات واقعی تکمیل شود */
  problemFa: string | null;
  /** قابلیت‌های اصلی قابل مشاهده در سایت */
  featuresFa: readonly string[];
  /** تصمیمات فنی — TODO: با اطلاعات واقعی تکمیل شود */
  decisionsFa: readonly string[];
  /** فناوری‌های تأییدشده (قابل مشاهده یا تأییدشده توسط خودم) */
  tech: readonly string[];
  /** نقش علیرضا در پروژه — TODO: تکمیل شود */
  roleFa: string | null;
  year: string | null;
  repoUrl: string | null;
  /** رنگ لهجهٔ کاور رویه‌ای پروژه */
  accent: string;
}

export const projects: readonly Project[] = [
  {
    slug: 'ekosesin',
    titleFa: 'اکوسسین',
    titleEn: 'EkoSesin',
    url: 'https://ekosesin.com',
    domain: 'ekosesin.com',
    categoryFa: 'پلتفرم آگهی و مارکت‌پلیس',
    categoryEn: 'MARKETPLACE',
    summaryFa:
      'پلتفرم آنلاین ثبت و جست‌وجوی آگهی برای کاربران قبرس شمالی؛ از املاک و خودرو تا کالاهای دیجیتال و خدمات، با دسته‌بندی‌های متنوع و آگهی‌های به‌روز.',
    problemFa: null,
    featuresFa: [
      'ثبت و نمایش آگهی در دسته‌های متنوع',
      'جست‌وجو و مرور بر اساس شهر و دسته',
      'گالری تصویر برای هر آگهی',
    ],
    decisionsFa: [],
    tech: ['Next.js'],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#C7FF4A',
  },
  {
    slug: 'zoppini',
    titleFa: 'زوپینی',
    titleEn: 'Zoppini',
    url: 'https://zoppinico.com',
    domain: 'zoppinico.com',
    categoryFa: 'فروشگاه اینترنتی پوشاک مردانه',
    categoryEn: 'E-COMMERCE',
    summaryFa:
      'فروشگاه آنلاین پوشاک مردانهٔ برند زوپینی؛ کت‌وشلوار، پیراهن، چرم و اکسسوری با کاتالوگ محصول، پیشنهاد استایل و باشگاه مشتریان.',
    problemFa: null,
    featuresFa: [
      'کاتالوگ و صفحهٔ محصول',
      'دسته‌بندی تخصصی پوشاک مردانه',
      'پیشنهاد استایل و محصولات تخفیف‌دار',
    ],
    decisionsFa: [],
    tech: ['Next.js'],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#F1F0EB',
  },
  {
    slug: 'darmind',
    titleFa: 'دَرمایند',
    titleEn: 'Darmind',
    url: 'https://darmind.ir',
    domain: 'darmind.ir',
    categoryFa: 'پلتفرم سلامت روان',
    categoryEn: 'HEALTHTECH',
    summaryFa:
      'پلتفرم درمان آنلاین و سلامت روان؛ «درمانی از جنس آینده» با فضای امن و محرمانه، خدمات درمانی و پرسشنامه‌های روانشناسی.',
    problemFa: null,
    featuresFa: [
      'ثبت‌نام و ورود کاربران',
      'پرسشنامه‌های ارزیابی روانشناسی',
      'معرفی خدمات و مسیر درمان آنلاین',
    ],
    decisionsFa: [],
    tech: [],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#9FD8E8',
  },
  {
    slug: 'tabesh',
    titleFa: 'مشاوره کنکور تابش',
    titleEn: 'Tabesh Edu',
    url: 'https://tabeshedu.ir',
    domain: 'tabeshedu.ir',
    categoryFa: 'آموزش و مشاوره تحصیلی',
    categoryEn: 'EDUCATION',
    summaryFa:
      'وب‌سایت موسسهٔ مشاوره کنکور تابش؛ معرفی طرح‌های مشاوره، برنامه‌ریزی تحصیلی، آزمون‌های آزمایشی و فرم درخواست مشاوره.',
    problemFa: null,
    featuresFa: [
      'معرفی و فروش طرح‌های مشاوره',
      'فرم درخواست مشاوره',
      'معرفی مشاوران و خدمات آموزشی',
    ],
    decisionsFa: [],
    tech: [],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#C7FF4A',
  },
  {
    slug: 'almanf',
    titleFa: 'نماد فرایند آلما',
    titleEn: 'Alma — Namad Farayand',
    url: 'https://almanf.com',
    domain: 'almanf.com',
    categoryFa: 'وب‌سایت شرکتی هلدینگ صنایع غذایی',
    categoryEn: 'CORPORATE',
    summaryFa:
      'وب‌سایت هلدینگ صنایع غذایی و کشاورزی آلما (Namad Farayand Alma)؛ معرفی هلدینگ، ارزش‌ها، مزیت‌های رقابتی و برندهای زیرمجموعه.',
    problemFa: null,
    featuresFa: ['معرفی هلدینگ و برندها', 'صفحات محتوایی و وبلاگ', 'فرصت‌های شغلی و تماس'],
    decisionsFa: [],
    tech: [],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#F1F0EB',
  },
  {
    slug: 'amelon',
    titleFa: 'آملون',
    titleEn: 'Amelon',
    url: 'https://amelon.eron.co',
    domain: 'amelon.eron.co',
    categoryFa: 'وب‌سایت شرکتی محصولات زیست‌پایدار',
    categoryEn: 'CORPORATE',
    summaryFa:
      'وب‌سایت برند Amelon؛ ظروف یک‌بارمصرف زیست‌تخریب‌پذیر بر پایهٔ ذرت به‌عنوان جایگزین مسئولانهٔ پلاستیک، با معرفی محصولات و وبلاگ.',
    problemFa: null,
    featuresFa: ['معرفی محصولات زیست‌پایه', 'محتوای آموزشی و وبلاگ', 'معرفی شعب و راه‌های تماس'],
    decisionsFa: [],
    tech: [],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#9FD8E8',
  },
  {
    slug: 'penguin-market',
    titleFa: 'پنگوئن مارکت',
    titleEn: 'Penguin Market',
    url: 'https://penguin.market',
    domain: 'penguin.market',
    categoryFa: 'در حال تکمیل',
    categoryEn: 'PROJECT',
    summaryFa: null,
    problemFa: null,
    featuresFa: [],
    decisionsFa: [],
    tech: [],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#C7FF4A',
  },
  {
    slug: 'zarvantrip',
    titleFa: 'زروان تریپ',
    titleEn: 'ZarvanTrip',
    url: 'https://zarvantrip.com',
    domain: 'zarvantrip.com',
    categoryFa: 'در حال تکمیل',
    categoryEn: 'PROJECT',
    summaryFa: null,
    problemFa: null,
    featuresFa: [],
    decisionsFa: [],
    tech: [],
    roleFa: null,
    year: null,
    repoUrl: null,
    accent: '#9FD8E8',
  },
] as const;

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length]!;
}
