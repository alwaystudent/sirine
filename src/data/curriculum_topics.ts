import { SubjectId, TermFilter } from '../types/education';

export interface TopicBlueprint {
  topicIndex: number; // 0..14
  subjectId: SubjectId;
  term: Exclude<TermFilter, 'الكل'>;
  lessonTitle: string;
  activityTitle: string;
  examTitle: string;
  summaryTitle: string;
  summaryPoints: string[];
}

export interface SubjectMeta {
  id: SubjectId;
  title: string;
  subtitle: string;
  category: 'scientific' | 'languages' | 'humanities';
  accentHex: string;
  softBgHex: string;
  borderHex: string;
}

export const SUBJECT_METAS: SubjectMeta[] = [
  {
    id: 'math',
    title: 'الرياضيات',
    subtitle: 'الأعداد الكبيرة، الكسور، الهندسة، القيس وحلّ المسائل',
    category: 'scientific',
    accentHex: '#7C3AED',
    softBgHex: '#F5F3FF',
    borderHex: '#DDD6FE',
  },
  {
    id: 'arabic',
    title: 'اللغة العربيّة',
    subtitle: 'القواعد، التصريف، الإملاء، فهم المقروء والإنتاج الكتابي',
    category: 'languages',
    accentHex: '#DB2777',
    softBgHex: '#FDF2F8',
    borderHex: '#FBCFE8',
  },
  {
    id: 'science',
    title: 'الإيقاظ العلمي',
    subtitle: 'جسم الإنسان، النبات والبيئة، المادة والكهرباء والطاقة',
    category: 'scientific',
    accentHex: '#059669',
    softBgHex: '#ECFDF5',
    borderHex: '#A7F3D0',
  },
  {
    id: 'tanchia',
    title: 'التنشئة الاجتماعية والتربية الإسلامية',
    subtitle: 'التربية المدنية، تاريخ وجغرافيا تونس والتربية الإسلامية',
    category: 'humanities',
    accentHex: '#D97706',
    softBgHex: '#FFFBEB',
    borderHex: '#FDE68A',
  },
  {
    id: 'french',
    title: 'اللغة الفرنسيّة (Français)',
    subtitle: 'Grammaire, Conjugaison, Orthographe & Compréhension',
    category: 'languages',
    accentHex: '#0284C7',
    softBgHex: '#F0F9FF',
    borderHex: '#BAE6FD',
  },
  {
    id: 'english',
    title: 'اللغة الإنقليزيّة (English)',
    subtitle: 'Vocabulary, Grammar, Time & Everyday Dialogues',
    category: 'languages',
    accentHex: '#E11D48',
    softBgHex: '#FFF1F2',
    borderHex: '#FECDD3',
  },
  {
    id: 'arts_tech',
    title: 'التربية التكنولوجية والفنّية',
    subtitle: 'التربية التشكيلية والموسيقية، الآلات البسيطة والسلامة الرقمية',
    category: 'humanities',
    accentHex: '#EA580C',
    softBgHex: '#FFF7ED',
    borderHex: '#FED7AA',
  },
];

function termByIndex(i: number): Exclude<TermFilter, 'الكل'> {
  if (i < 5) return 'الثلاثي الأول';
  if (i < 10) return 'الثلاثي الثاني';
  return 'الثلاثي الثالث';
}

const RAW_TOPICS: Record<
  SubjectId,
  Array<{
    lesson: string;
    activity: string;
    exam: string;
    summaryTitle: string;
    summaryPoints: string[];
  }>
> = {
  math: [
    {
      lesson: 'الأعداد ذات 6 أرقام فأكثر (منزلة الملايين)',
      activity: 'ورشة قراءة وتفكيك الملايين',
      exam: 'اختبار تقييمي: الأعداد الكبيرة',
      summaryTitle: 'تذكّر القاعدة: منزلة الملايين',
      summaryPoints: [
        'يُقسم العدد الكبير إلى منازل من اليمين: الوحدات البسيطة، الآلاف، والملايين.',
        'كل منزلة تضمّ آحاداً وعشرات ومئات.',
      ],
    },
    {
      lesson: 'مقارنة وترتيب الأعداد الصحيحة الطبيعية',
      activity: 'سباق ترتيب الأعداد الكبيرة',
      exam: 'فرض مراقبة: المقارنة والترتيب',
      summaryTitle: 'تذكّر القاعدة: مقارنة الأعداد',
      summaryPoints: [
        'العدد الذي له أكبر عدد من الأرقام هو الأكبر.',
        'عند تساوي عدد الأرقام نقارن بدءاً من أقصى اليسار.',
      ],
    },
    {
      lesson: 'الجمع والطرح بالاحتفاظ والتفكيك',
      activity: 'تحدّي حساب الفواتير بالدينار التونسي',
      exam: 'اختبار الجمع والطرح',
      summaryTitle: 'تذكّر القاعدة: الجمع والطرح',
      summaryPoints: [
        'نضع الآحاد تحت الآحاد والعشرات تحت العشرات قبل الحساب.',
        '1 دينار تونسي = 1000 مليم.',
      ],
    },
    {
      lesson: 'الضرب في عدد ذي رقمين وثلاثة أرقام',
      activity: 'مصفوفة الضرب السريع',
      exam: 'اختبار جدول الضرب والعمليات',
      summaryTitle: 'تذكّر القاعدة: الضرب العمودي',
      summaryPoints: [
        'نضرب في رقم الآحاد أولاً ثم في رقم العشرات مع وضع نقطة أو صفر تحت رقم الآحاد في السطر الثاني.',
      ],
    },
    {
      lesson: 'القسمة الإقليدية وإيجاد الباقي',
      activity: 'نشاط توزيع المجموعات والباقي',
      exam: 'فرض تأليفي: الثلاثي الأول في الرياضيات',
      summaryTitle: 'تذكّر القاعدة: القسمة الإقليدية',
      summaryPoints: [
        'المقسوم = (القاسم × خارج القسمة) + الباقي.',
        'الباقي أصغر دائماً من القاسم.',
      ],
    },
    {
      lesson: 'المضاعفات والقواسم وقابلية القسمة',
      activity: 'لعبة فرز مضاعفات 2 و 3 و 5',
      exam: 'اختبار قابلية القسمة',
      summaryTitle: 'تذكّر القاعدة: قابلية القسمة',
      summaryPoints: [
        'يقبل العدد القسمة على 2 إذا كان رقم آحاده زوجياً، وعلى 5 إذا كان آحاده 0 أو 5.',
        'يقبل العدد القسمة على 3 إذا كان مجموع أرقامه من مضاعفات 3.',
      ],
    },
    {
      lesson: 'الأعداد الكسرية: القراءة والتمثيل والمقارنة',
      activity: 'ورشة تلوين ومطابقة الكسور',
      exam: 'اختبار الأعداد الكسرية',
      summaryTitle: 'تذكّر القاعدة: البسط والمقام',
      summaryPoints: [
        'يتكوّن الكسر من بسط في الأعلى ومقام في الأسفل لا يساوي صفراً.',
        '1/2 = 0.5 و 1/4 = 0.25 و 3/4 = 0.75.',
      ],
    },
    {
      lesson: 'الأعداد العشرية: الجزء الصحيح والجزء العشري',
      activity: 'تصنيف الأعداد العشرية والصحيحة',
      exam: 'فرض مراقبة: الأعداد العشرية',
      summaryTitle: 'تذكّر القاعدة: العدد العشري',
      summaryPoints: [
        'الفاصلة تفصل الجزء الصحيح عن الجزء العشري (أعشار، أجزاء من مئة).',
      ],
    },
    {
      lesson: 'جمع وطرح الأعداد العشرية',
      activity: 'مختبر حساب الأعداد العشرية',
      exam: 'اختبار العمليات العشرية',
      summaryTitle: 'تذكّر القاعدة: ترتيب الفواصل',
      summaryPoints: [
        'لجمع أو طرح عددين عشريين نضع الفاصلة تحت الفاصلة تماماً.',
      ],
    },
    {
      lesson: 'الضرب في 10 و 100 و 1000 للأعداد العشرية',
      activity: 'نشاط تحريك الفاصلة نحو اليمين',
      exam: 'فرض تأليفي: الثلاثي الثاني في الرياضيات',
      summaryTitle: 'تذكّر القاعدة: الضرب في 10 و100 و1000',
      summaryPoints: [
        'عند الضرب في 10 نزيح الفاصلة برتبة نحو اليمين، وفي 100 برتبتين.',
      ],
    },
    {
      lesson: 'المستقيمات المتعامدة والمتوازية والتناظر المحوري',
      activity: 'ورشة تصنيف الزوايا ورسم النظير',
      exam: 'اختبار الهندسة والتناظر المحوري',
      summaryTitle: 'تذكّر القاعدة: التعامد والتوازي والتناظر',
      summaryPoints: [
        'المستقيمان المتعامدان يشكّلان زاوية قائمة قيسها 90°، والمتوازيان لا يتقاطعان أبداً.',
        'التناظر المحوري يحفظ الأبعاد والأشكال حول محور التناظر.',
      ],
    },
    {
      lesson: 'المربّع والمستطيل: المحيط والمساحة',
      activity: 'تحدّي تصميم حديقة المدرسة وحساب قيس مساحتها',
      exam: 'اختبار المحيطات والمساحات',
      summaryTitle: 'تذكّر القاعدة: قوانين المحيط والمساحة',
      summaryPoints: [
        'قيس محيط المربّع = قيس الضلع × 4 ، قيس مساحته = قيس الضلع × قيس الضلع.',
        'قيس محيط المستطيل = (قيس الطول + قيس العرض) × 2 ، قيس مساحته = قيس الطول × قيس العرض.',
      ],
    },
    {
      lesson: 'وحدات قيس الأطوال والكتل والسعات',
      activity: 'نشاط تحويل المتر والغرام واللتر',
      exam: 'اختبار وحدات القيس',
      summaryTitle: 'تذكّر القاعدة: جدول التحويلات',
      summaryPoints: [
        '1 كلم = 1000 م، 1 م = 100 صم، 1 كغ = 1000 غ، 1 ل = 1000 مل.',
      ],
    },
    {
      lesson: 'قيس الزمن وحساب المدد بالساعات والدقائق',
      activity: 'تحدّي مواقيت الرحلات المدرسية',
      exam: 'اختبار قيس الزمن',
      summaryTitle: 'تذكّر القاعدة: الزمن',
      summaryPoints: [
        '1 ساعة = 60 دقيقة، 1 دقيقة = 60 ثانية.',
      ],
    },
    {
      lesson: 'التناسب الطردي والنسبة المائوية وحلّ المسائل المركّبة',
      activity: 'مسائل متجر الياسمين التونسي',
      exam: 'الامتحان الشامل لنهاية السنة في الرياضيات',
      summaryTitle: 'تذكّر القاعدة: التناسب والنسبة المائوية',
      summaryPoints: [
        'لحساب ثمن عدّة قطع متماثلة نحسب ثمن القطعة الواحدة (معامل التناسب) أو نستعمل التناسب الطردي.',
      ],
    },
  ],
  arabic: [
    {
      lesson: 'الجملة الاسمية: المبتدأ والخبر',
      activity: 'ورشة تركيب الجمل الاسمية',
      exam: 'اختبار الجملة الاسمية',
      summaryTitle: 'تذكّر القاعدة: ركنا الجملة الاسمية',
      summaryPoints: [
        'تتكون الجملة الاسمية من مبتدأ مرفوع وخبر مرفوع يتمّم المعنى.',
      ],
    },
    {
      lesson: 'النواسخ الفعلية: كان وأخواتها',
      activity: 'تصنيف النواسخ الفعلية والحرفية',
      exam: 'فرض مراقبة: كان وأخواتها',
      summaryTitle: 'تذكّر القاعدة: عمل كان وأخواتها',
      summaryPoints: [
        'كان وأخواتها (أصبح، صار، ظلّ، ليس) ترفع المبتدأ وتنصب الخبر.',
      ],
    },
    {
      lesson: 'النواسخ الحرفية: إنّ وأخواتها',
      activity: 'نشاط ضبط اسم إنّ وخبرها',
      exam: 'اختبار النواسخ الحرفية',
      summaryTitle: 'تذكّر القاعدة: عمل إنّ وأخواتها',
      summaryPoints: [
        'إنّ وأخواتها (إنّ، أنّ، لعلّ، ليت، كأنّ، لكنّ) تنصب المبتدأ وترفع الخبر.',
      ],
    },
    {
      lesson: 'الجملة الفعلية: الفعل والفاعل والمفعول به',
      activity: 'تحليل أركان الجملة الفعلية',
      exam: 'اختبار الجملة الفعلية',
      summaryTitle: 'تذكّر القاعدة: الفاعل والمفعول به',
      summaryPoints: [
        'الفاعل اسم مرفوع يدلّ على من قام بالفعل، والمفعول به اسم منصوب وقع عليه الفعل.',
      ],
    },
    {
      lesson: 'المفعول لأجله والمفعول المطلق',
      activity: 'تحدّي التمييز بين المفاعيل',
      exam: 'فرض تأليفي: الثلاثي الأول في العربيّة',
      summaryTitle: 'تذكّر القاعدة: المفعول لأجله والمطلق',
      summaryPoints: [
        'المفعول لأجله يبيّن سبب الفعل (اجتهدتُ رغبةً في النجاح).',
      ],
    },
    {
      lesson: 'المركّب النعتي (المنعوت والنعت) في الإفراد والتثنية والجمع',
      activity: 'مطابقة النعت للمنعوت',
      exam: 'اختبار المركّب النعتي (النعت والمنعوت)',
      summaryTitle: 'تذكّر القاعدة: التطابق في المركّب النعتي',
      summaryPoints: [
        'يتبع النعتُ المنعوتَ في الجنس (التذكير والتأنيث) والعدد (الإفراد والتثنية والجمع) والتعريف والتنكير وحركة الإعراب.',
      ],
    },
    {
      lesson: 'الفعل الصحيح: السالم والمهموز والمضعّف',
      activity: 'فرز الأفعال الصحيحة حسب نوعها',
      exam: 'اختبار الفعل الصحيح',
      summaryTitle: 'تذكّر القاعدة: الفعل الصحيح',
      summaryPoints: [
        'الفعل الصحيح خلت حروفه الأصلية من حروف العلّة (و، ا، ي).',
      ],
    },
    {
      lesson: 'الفعل المعتل: المثال والأجوف والناقص',
      activity: 'ورشة مطابقة الأفعال المعتلّة',
      exam: 'فرض مراقبة: الفعل المعتل',
      summaryTitle: 'تذكّر القاعدة: الفعل المعتل',
      summaryPoints: [
        'المثال أوله علّة (وصل)، الأجوف وسطه علّة (قال)، الناقص آخره علّة (سعى).',
      ],
    },
    {
      lesson: 'تصريف الأفعال في الماضي والمضارع',
      activity: 'نشاط إسناد الأفعال إلى الضمائر',
      exam: 'اختبار التصريف في الزمنين',
      summaryTitle: 'تذكّر القاعدة: التصريف',
      summaryPoints: [
        'ننتبه لحروف الزيادة والضمائر المتّصلة مثل: هنّ رمينَ، أنتم تكتبون.',
      ],
    },
    {
      lesson: 'فعل الأمر وصياغته مع الضمائر',
      activity: 'تحويل الأفعال إلى صيغة الأمر',
      exam: 'فرض تأليفي: الثلاثي الثاني في العربيّة',
      summaryTitle: 'تذكّر القاعدة: فعل الأمر',
      summaryPoints: [
        'يُصاغ الأمر للمخاطَب والمخاطَبة: اكتبْ، اكتبي، اكتبوا.',
      ],
    },
    {
      lesson: 'الهمزة المتوسطة وأقوى الحركات',
      activity: 'لعبة وضع الهمزة في مكانها الصحيح',
      exam: 'اختبار رسم الهمزة المتوسطة',
      summaryTitle: 'تذكّر القاعدة: سلّم الحركات',
      summaryPoints: [
        'أقوى الحركات: الكسرة ← الضمة ← الفتحة ← السكون.',
      ],
    },
    {
      lesson: 'الهمزة المتطرفة في آخر الكلمة',
      activity: 'ورشة الإملاء للهمزة المتطرفة',
      exam: 'اختبار الهمزة المتطرفة',
      summaryTitle: 'تذكّر القاعدة: الهمزة المتطرفة',
      summaryPoints: [
        'تُكتب الهمزة المتطرفة حسب حركة الحرف الذي قبلها (شاطئ، لؤلؤ، قرأ، سماء).',
      ],
    },
    {
      lesson: 'التاء المربوطة والتاء المبسوطة',
      activity: 'تصنيف الكلمات المنتهية بالتاء',
      exam: 'اختبار الإملاء: التاء',
      summaryTitle: 'تذكّر القاعدة: التاء في آخر الكلمة',
      summaryPoints: [
        'تُكتب مربوطة في الاسم المفرد المؤنث (زهرة)، ومبسوطة في الأفعال وجمع المؤنث السالم.',
      ],
    },
    {
      lesson: 'الألف اللينة في الأفعال والأسماء',
      activity: 'تحدّي الألف الممدودة والمقصورة',
      exam: 'اختبار الألف اللينة',
      summaryTitle: 'تذكّر القاعدة: الألف اللينة',
      summaryPoints: [
        'إذا كان أصل الألف واواً كُتبت ممدودة (دعا)، وإذا كان ياءً كُتبت مقصورة (رمى).',
      ],
    },
    {
      lesson: 'فهم المقروء والإنتاج الكتابي التونسي',
      activity: 'ترتيب فقرات نصّ عن القيروان والياسمين',
      exam: 'الامتحان الشامل لنهاية السنة في العربيّة',
      summaryTitle: 'تذكّر القاعدة: فهم المقروء والإنتاج الكتابي',
      summaryPoints: [
        'نستخرج الفكرة الرئيسية للنصّ ونربط الجمل بالروابط النصّية المناسبة.',
      ],
    },
  ],
  science: [
    {
      lesson: 'التغذية المتوازنة والهرم الغذائي',
      activity: 'تصنيف أغذية النموّ وأغذية الطاقة وأغذية الوقاية',
      exam: 'اختبار التغذية والصحة',
      summaryTitle: 'تذكّر القاعدة: الوجبة المتوازنة',
      summaryPoints: [
        'تنقسم الأغذية إلى: أغذية النموّ (البانية/البروتينات)، وأغذية الطاقة (السكريات والدهون)، وأغذية الوقاية (الفيتامينات والأملاح المعدنية).',
      ],
    },
    {
      lesson: 'الجهاز الهضمي ومسار الطعام',
      activity: 'ترتيب أعضاء الجهاز الهضمي',
      exam: 'اختبار الهضم',
      summaryTitle: 'تذكّر القاعدة: الهضم',
      summaryPoints: [
        'يمرّ الغذاء من الفم ← المريء ← المعدة ← الأمعاء الدقيقة.',
      ],
    },
    {
      lesson: 'الجهاز التنفسي: الشهيق والزفير',
      activity: 'تتبّع مسار الهواء في التنفس',
      exam: 'فرض مراقبة: التنفس',
      summaryTitle: 'تذكّر القاعدة: التنفس',
      summaryPoints: [
        'يمتصّ الجسم الأكسجين في الشهيق ويطرح ثاني أكسيد الكربون في الزفير.',
      ],
    },
    {
      lesson: 'الدم والقلب والدورة الدموية',
      activity: 'مطابقة مكونات جهاز الدوران بوظائفها',
      exam: 'اختبار القلب والدم',
      summaryTitle: 'تذكّر القاعدة: القلب والشرايين',
      summaryPoints: [
        'القلب يضخّ الدم عبر الشرايين لتوزيع الأكسجين والغذاء على كامل الجسم.',
      ],
    },
    {
      lesson: 'الهيكل العظمي والعضلات والحواس الخمس',
      activity: 'ربط الحاسة بالعضو المسؤول عنها',
      exam: 'فرض تأليفي: الثلاثي الأول في الإيقاظ العلمي',
      summaryTitle: 'تذكّر القاعدة: الجهاز الحركي ووقاية الحواس',
      summaryPoints: [
        'يدعم الهيكل العظمي الجسم وتساعد المفاصل والعضلات (بالتقلّص والارتخاء) على الحركة.',
        'نحافظ على البصر بالإضاءة الكافية وعلى العظام والعضلات بالغذاء المتوازن والرياضة.',
      ],
    },
    {
      lesson: 'التكاثر عند النباتات الزهرية',
      activity: 'ترتيب مراحل تحوّل الزهرة إلى ثمرة',
      exam: 'اختبار تكاثر النباتات',
      summaryTitle: 'تذكّر القاعدة: الإزهار والإثمار',
      summaryPoints: [
        'تتحوّل الزهرة بعد التلقيح إلى ثمرة تحتوي على البذور.',
      ],
    },
    {
      lesson: 'إنبات البذور وشروط نموّ النبات الأخضر',
      activity: 'تجربة شروط الإنبات (الماء والضوء والحرارة)',
      exam: 'اختبار إنبات البذور',
      summaryTitle: 'تذكّر القاعدة: الإنبات',
      summaryPoints: [
        'تحتاج البذرة للإنبات إلى ماء ورطوبة وحرارة مناسبة وتهوية.',
      ],
    },
    {
      lesson: 'التكاثر عند الحيوانات (البيوضة والولودة)',
      activity: 'تصنيف الحيوانات إلى بيوضة وولودة',
      exam: 'فرض مراقبة: تكاثر الحيوانات',
      summaryTitle: 'تذكّر القاعدة: التكاثر الحيواني',
      summaryPoints: [
        'الثدييات كالقط والأرنب ولودة، بينما الطيور والأسماك والزواحف بيوضة.',
      ],
    },
    {
      lesson: 'السلاسل الغذائية والتوازن البيئي',
      activity: 'بناء سلاسل غذائية متوازنة',
      exam: 'اختبار السلاسل الغذائية',
      summaryTitle: 'تذكّر القاعدة: المنتج والمستهلك',
      summaryPoints: [
        'تبدأ كل سلسلة غذائية بنبات أخضر مُنتج يتغذّى بالتركيب الضوئي.',
      ],
    },
    {
      lesson: 'حماية الغابات والمياه في تونس',
      activity: 'فرز السلوكات الصديقة والضارة بالبيئة',
      exam: 'فرض تأليفي: الثلاثي الثاني في الإيقاظ العلمي',
      summaryTitle: 'تذكّر القاعدة: حماية المحيط',
      summaryPoints: [
        'الترشيد في الماء والتشجير يحميان التربة التونسية من التصحّر.',
      ],
    },
    {
      lesson: 'حالات المادة الثلاث وتحولاتها',
      activity: 'تصنيف حالات المادة (صلبة، سائلة، غازية)',
      exam: 'اختبار حالات المادة',
      summaryTitle: 'تذكّر القاعدة: تحولات الماء',
      summaryPoints: [
        'الماء يتحول من جليد إلى سائل بالانصهار، ومن سائل إلى بخار بالتبخر.',
      ],
    },
    {
      lesson: 'الخلائط المتجانسة وغير المتجانسة والفصل بينها',
      activity: 'طرق فصل الخلائط (الترشيح والتبخير)',
      exam: 'اختبار الخلائط',
      summaryTitle: 'تذكّر القاعدة: فصل الخلائط',
      summaryPoints: [
        'نستعمل الترشيح لفصل الأجسام الصلبة غير الذائبة، والتبخير لاستخراج الملح.',
      ],
    },
    {
      lesson: 'الميزان وقيس الكتل بالغرام والكيلوغرام',
      activity: 'تحدّي موازنة الكفتين وحساب الكتلة',
      exam: 'اختبار الميزان والكتل',
      summaryTitle: 'تذكّر القاعدة: قيس الكتلة',
      summaryPoints: [
        'نقيس الكتلة بالميزان، والوحدة الأساسية هي الغرام (غ) والكيلوغرام (كغ).',
      ],
    },
    {
      lesson: 'الضوء والرؤية والأوساط الشفافة والشافّة والمعتمة',
      activity: 'تصنيف الأوساط إلى شفافة وشافّة ومعتمة',
      exam: 'اختبار الضوء والأوساط الضوئية',
      summaryTitle: 'تذكّر القاعدة: انتشار الضوء',
      summaryPoints: [
        'ينتشر الضوء في خطوط مستقيمة عبر الأوساط الشفافة (كالزجاج الصافي)، وينفذ جزئياً عبر الأوساط الشافّة، ويُحجب في الأوساط المعتمة.',
      ],
    },
    {
      lesson: 'الدارة الكهربائية البسيطة والطاقة المتجددة',
      activity: 'اختبار الأجسام الناقلة والأجسام العازلة للكهرباء في الدارة',
      exam: 'الامتحان الشامل لنهاية السنة في الإيقاظ العلمي',
      summaryTitle: 'تذكّر القاعدة: الكهرباء والطاقة',
      summaryPoints: [
        'النحاس والحديد جسمان ناقلان للكهرباء، والطاقة الشمسية وطاقة الرياح طاقتان متجددتان.',
      ],
    },
  ],
  tanchia: [
    {
      lesson: 'التربية المدنية: حقوق الطفل الأساسية',
      activity: 'مطابقة حقوق الطفل بأمثلتها',
      exam: 'اختبار حقوق الطفل',
      summaryTitle: 'تذكّر القاعدة: حقوق الطفل',
      summaryPoints: [
        'من حقوق الطفل: الحق في الاسم والجنسية، التعليم، العلاج، واللعب.',
      ],
    },
    {
      lesson: 'واجبات التلميذة والمواطنة الصالحة',
      activity: 'تصنيف الحقوق والواجبات المدرسية',
      exam: 'اختبار الواجبات والمواطنة',
      summaryTitle: 'تذكّر القاعدة: الواجب والالتزام',
      summaryPoints: [
        'من واجباتنا احترام المربّين والمعلّمين والزميلات، والمحافظة على نظافة المدرسة.',
      ],
    },
    {
      lesson: 'المحافظة على الممتلكات العامة والبيئة المدرسية',
      activity: 'اختيار السلوك المدني السليم',
      exam: 'فرض مراقبة: التربية المدنية',
      summaryTitle: 'تذكّر القاعدة: الملك العمومي',
      summaryPoints: [
        'المدرسة والحديقة والمكتبة ملك للجميع، والحفاظ عليها واجب وطني.',
      ],
    },
    {
      lesson: 'السلامة المرورية وقواعد عبور الطريق',
      activity: 'ترتيب خطوات عبور الطريق بأمان',
      exam: 'اختبار السلامة المرورية',
      summaryTitle: 'تذكّر القاعدة: قانون الطرقات',
      summaryPoints: [
        'نعبر من ممرّ المترجّلين عندما يكون ضوء المترجّلين أخضر.',
      ],
    },
    {
      lesson: 'مؤسسات الدولة التونسية والبلدية',
      activity: 'ربط كل مؤسسة بخدمتها للمواطنين',
      exam: 'فرض تأليفي: الثلاثي الأول في التنشئة',
      summaryTitle: 'تذكّر القاعدة: خدمات المؤسسات',
      summaryPoints: [
        'البلدية تعتني بالنظافة والحدائق والحالة المدنية، والمستشفى بالعلاج.',
      ],
    },
    {
      lesson: 'من الحضارة القبصية إلى تأسيس قرطاج (عليسة 814 ق.م)',
      activity: 'بطاقات تاريخ تونس القديم وتأسيس قرطاج',
      exam: 'اختبار تونس القديمة وقرطاج الفينيقية',
      summaryTitle: 'تذكّر القاعدة: جذورنا التاريخية',
      summaryPoints: [
        'تميّزت الحضارة القبصية في قفصة بأدواتها الصوّانية، وأسّست عليسة قرطاج سنة 814 ق.م.',
      ],
    },
    {
      lesson: 'القائد القرطاجي حنبعل وعبقرية الدفاع',
      activity: 'تتبّع مسيرة القائد حنبعل',
      exam: 'اختبار تاريخ قرطاج',
      summaryTitle: 'تذكّر القاعدة: حنبعل',
      summaryPoints: [
        'حنبعل قائد قرطاجي شهير اشتهر بعبقريته العسكرية في الدفاع عن وطنه.',
      ],
    },
    {
      lesson: 'عقبة بن نافع وتأسيس مدينة القيروان',
      activity: 'معالم مدينة القيروان التاريخية',
      exam: 'فرض مراقبة: القيروان والأغالبة',
      summaryTitle: 'تذكّر القاعدة: القيروان',
      summaryPoints: [
        'تأسّست القيروان سنة 50 هـ وبُني فيها جامع عقبة بن نافع العريق.',
      ],
    },
    {
      lesson: 'المعالم الأثرية التونسية: الجمّ ودقّة وسبيطلة',
      activity: 'مطابقة كل معلم أثري بالولاية التونسية',
      exam: 'اختبار المعالم الأثرية التونسية',
      summaryTitle: 'تذكّر القاعدة: تراث تونس',
      summaryPoints: [
        'مسرح الجمّ بالمهدية، ودقّة بباجة، وسبيطلة بالقصرين.',
      ],
    },
    {
      lesson: 'خريطة تونس: الموقع والحدود والولايات',
      activity: 'استكشاف أقاليم تونس على الخريطة',
      exam: 'فرض تأليفي: الثلاثي الثاني في التنشئة',
      summaryTitle: 'تذكّر القاعدة: جغرافيا تونس',
      summaryPoints: [
        'تونس تقع في شمال إفريقيا وتضمّ 24 ولاية وتطلّ على البحر المتوسط.',
      ],
    },
    {
      lesson: 'التضاريس والأنهار التونسية (واد مجردة)',
      activity: 'تصنيف الجبال والسهول والواحات التونسية',
      exam: 'اختبار التضاريس والمناخ',
      summaryTitle: 'تذكّر القاعدة: تضاريس تونس',
      summaryPoints: [
        'أعلى قمّة في تونس جبل الشعانبي (1544 م)، وأطول نهر واد مجردة.',
      ],
    },
    {
      lesson: 'الفلاحة والصناعات التقليدية في تونس',
      activity: 'ربط المنتجات التونسية بولاياتها',
      exam: 'اختبار الاقتصاد التونسي',
      summaryTitle: 'تذكّر القاعدة: خيرات تونس',
      summaryPoints: [
        'تشتهر صفاقس والساحل بالزيتون، وتوزر بالتمور، ونابل بالخزف، والقيروان بالزربية.',
      ],
    },
    {
      lesson: 'التربية الإسلامية: أركان الإيمان الستة',
      activity: 'ترتيب وتثبيت أركان الإيمان',
      exam: 'اختبار العقيدة وأركان الإيمان',
      summaryTitle: 'تذكّر القاعدة: أركان الإيمان',
      summaryPoints: [
        'الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشرّه.',
      ],
    },
    {
      lesson: 'السور القرآنية المقررة ومعانيها (الانفطار والبروج برواية قالون)',
      activity: 'مطابقة الآيات الكريمة بمعانيها المبسّطة',
      exam: 'اختبار القرآن الكريم والسيرة',
      summaryTitle: 'تذكّر القاعدة: التدبّر والتلاوة',
      summaryPoints: [
        'تُقرأ السور المقرّرة (الانفطار، المطفّفين، الانشقاق، البروج) في تونس برواية قالون عن نافع.',
      ],
    },
    {
      lesson: 'الأخلاق الإسلامية: الصدق والأمانة وبرّ الوالدين',
      activity: 'اختيار القيم الأخلاقية الحميدة',
      exam: 'الامتحان الشامل لنهاية السنة في التنشئة',
      summaryTitle: 'تذكّر القاعدة: الصادق الأمين',
      summaryPoints: [
        'لُقّب النبي ﷺ بالصادق الأمين، والصدق والأمانة أساس الثقة والمحبّة.',
      ],
    },
  ],
  french: [
    {
      lesson: 'Les types de phrases (déclarative, interrogative, exclamative)',
      activity: 'Associer chaque phrase à sa ponctuation',
      exam: 'Évaluation : Les types de phrases',
      summaryTitle: 'Règle : La ponctuation et le sens',
      summaryPoints: [
        'Déclarative (.) · Interrogative (?) · Exclamative (!)',
      ],
    },
    {
      lesson: 'La phrase affirmative et la phrase négative',
      activity: 'Transformer à la forme négative (ne... pas)',
      exam: 'Contrôle : Forme négative',
      summaryTitle: 'Règle : La négation',
      summaryPoints: [
        'On encadre le verbe par "ne ... pas" ou "n’ ... pas".',
      ],
    },
    {
      lesson: 'Le nom et les déterminants (articles et possessifs)',
      activity: 'Compléter avec le bon déterminant',
      exam: 'Test : Les déterminants',
      summaryTitle: 'Règle : Accorder le déterminant',
      summaryPoints: [
        'Singulier (mon, ma, un, une) · Pluriel (mes, ses, les, des).',
      ],
    },
    {
      lesson: 'L’adjectif qualificatif et l’accord dans le GN',
      activity: 'Classer les adjectifs masculins et féminins',
      exam: 'Test : L’adjectif qualificatif',
      summaryTitle: 'Règle : L’accord de l’adjectif',
      summaryPoints: [
        'L’adjectif s’accorde en genre et en nombre avec le nom.',
      ],
    },
    {
      lesson: 'Le Groupe Nominal Sujet (GNS) et le Groupe Verbal (GV)',
      activity: 'Construire des phrases correctes par glisser-déposer',
      exam: 'Devoir de synthèse 1 : Français',
      summaryTitle: 'Règle : Structure de la phrase',
      summaryPoints: [
        'Une phrase simple contient un GNS (qui fait l’action) et un GV.',
      ],
    },
    {
      lesson: 'Le présent des verbes être et avoir',
      activity: 'Conjuguer être et avoir au présent',
      exam: 'Test : Être et avoir au présent',
      summaryTitle: 'Règle : Verbes auxiliaires',
      summaryPoints: [
        'Être : je suis, tu es, il est, nous sommes, vous êtes, ils sont.',
        'Avoir : j’ai, tu as, il a, nous avons, vous avez, ils ont.',
      ],
    },
    {
      lesson: 'Le présent des verbes du 1er groupe (-er)',
      activity: 'Classer les verbes du 1er et 2e groupe',
      exam: 'Contrôle : Verbes en -er',
      summaryTitle: 'Règle : Terminaisons du 1er groupe',
      summaryPoints: [
        'Terminaisons au présent : -e, -es, -e, -ons, -ez, -ent.',
      ],
    },
    {
      lesson: 'Le présent des verbes du 2e groupe (-ir)',
      activity: 'Atelier de conjugaison : finir et choisir',
      exam: 'Test : Verbes du 2e groupe',
      summaryTitle: 'Règle : Terminaisons en -issons',
      summaryPoints: [
        'Finir : je finis, tu finis, il finit, nous finissons, vous finissez, ils finissent.',
      ],
    },
    {
      lesson: 'Le passé composé avec avoir et être',
      activity: 'Associer l’infinitif au participe passé',
      exam: 'Test : Le passé composé',
      summaryTitle: 'Règle : Temps du passé',
      summaryPoints: [
        'Passé composé = auxiliaire être/avoir au présent + participe passé.',
      ],
    },
    {
      lesson: 'Le futur simple des verbes réguliers',
      activity: 'Compléter des phrases au futur',
      exam: 'Devoir de synthèse 2 : Français',
      summaryTitle: 'Règle : Le futur simple',
      summaryPoints: [
        'Infinitif + -ai, -as, -a, -ons, -ez, -ont (ex : tu chanteras).',
      ],
    },
    {
      lesson: 'Les homophones grammaticaux : a / à et et / est',
      activity: 'Remplir les blancs avec a/à et et/est',
      exam: 'Test d’orthographe : Homophones',
      summaryTitle: 'Règle : Ne plus confondre',
      summaryPoints: [
        '"a" = avait (verbe avoir) · "est" = était (verbe être).',
      ],
    },
    {
      lesson: 'Les homophones : son / sont et on / ont',
      activity: 'Trier les homophones par glisser-déposer',
      exam: 'Contrôle d’orthographe',
      summaryTitle: 'Règle : Astuce de remplacement',
      summaryPoints: [
        '"sont" = étaient · "ont" = avaient.',
      ],
    },
    {
      lesson: 'Le pluriel des noms en -s, -x et -aux',
      activity: 'Associer chaque nom à son pluriel',
      exam: 'Test : Le pluriel des noms',
      summaryTitle: 'Règle : Pluriel irrégulier',
      summaryPoints: [
        'Un journal → des journaux ; un bijou → des bijoux ; un cheval → des chevaux.',
      ],
    },
    {
      lesson: 'Les synonymes et les antonymes (contraires)',
      activity: 'Relier les mots contraires et synonymes',
      exam: 'Test de vocabulaire',
      summaryTitle: 'Règle : Enrichir son vocabulaire',
      summaryPoints: [
        'Synonyme = même sens (joli / beau) · Antonyme = sens contraire (grand / petit).',
      ],
    },
    {
      lesson: 'Compréhension de texte : Le printemps en Tunisie',
      activity: 'Remettre en ordre le récit de Cyrine',
      exam: 'Examen final de 5e année : Français',
      summaryTitle: 'Règle : Lire et comprendre',
      summaryPoints: [
        'Repère les personnages, le lieu et le moment du texte.',
      ],
    },
  ],
  english: [
    {
      lesson: 'Greetings & Introducing Myself',
      activity: 'Order polite English greetings',
      exam: 'Quiz: Greetings & Introductions',
      summaryTitle: 'Remember: Meeting Friends',
      summaryPoints: [
        'Hello! My name is Cyrine. I am eleven years old. I live in Tunisia.',
      ],
    },
    {
      lesson: 'My Family & Professions',
      activity: 'Match family words with their meanings',
      exam: 'Test: Family & Jobs',
      summaryTitle: 'Remember: Family Vocabulary',
      summaryPoints: [
        'Mother, father, sister, brother, teacher, doctor.',
      ],
    },
    {
      lesson: 'School Supplies & Classroom Objects',
      activity: 'Match English school items',
      exam: 'Quiz: My School Bag',
      summaryTitle: 'Remember: Inside My Backpack',
      summaryPoints: [
        'Notebook, pencil case, ruler, eraser, scissors.',
      ],
    },
    {
      lesson: 'Days of the Week & Months of the Year',
      activity: 'Order the days of the week',
      exam: 'Test: Days & Months',
      summaryTitle: 'Remember: Calendar',
      summaryPoints: [
        'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.',
      ],
    },
    {
      lesson: 'Colors, Numbers & Classroom Commands',
      activity: 'Fill in color & number sentences',
      exam: 'Term 1 Assessment: English',
      summaryTitle: 'Remember: Colors & Numbers',
      summaryPoints: [
        'Pink, purple, yellow, blue; Open your book, listen carefully.',
      ],
    },
    {
      lesson: 'Verb "To Be" & "Have got / Has got"',
      activity: 'Choose have got or has got',
      exam: 'Grammar Test: To Be & Have got',
      summaryTitle: 'Remember: Has got vs Have got',
      summaryPoints: [
        'I/You/We/They have got · He/She/It has got.',
      ],
    },
    {
      lesson: 'Present Simple: Daily Routines',
      activity: 'Complete Cyrine’s morning routine',
      exam: 'Grammar Quiz: Present Simple',
      summaryTitle: 'Remember: Every Day Actions',
      summaryPoints: [
        'Add -s or -es with he/she/it: Cyrine goes to school at 8 o’clock.',
      ],
    },
    {
      lesson: 'Present Continuous: Actions Happening Now',
      activity: 'Build sentences with am/is/are + -ing',
      exam: 'Grammar Test: Present Continuous',
      summaryTitle: 'Remember: Right Now',
      summaryPoints: [
        'Look! She is drawing a flower right now.',
      ],
    },
    {
      lesson: 'Prepositions of Place (in, on, under, next to)',
      activity: 'Match prepositions to positions',
      exam: 'Quiz: Where Is It?',
      summaryTitle: 'Remember: Describing Places',
      summaryPoints: [
        'The book is ON the desk. The pen is IN the pencil case.',
      ],
    },
    {
      lesson: 'Telling the Time in English',
      activity: 'Match clock times with English phrases',
      exam: 'Term 2 Assessment: English',
      summaryTitle: 'Remember: What Time Is It?',
      summaryPoints: [
        'It is eight o’clock (08:00) · It is half past eight (08:30).',
      ],
    },
    {
      lesson: 'Seasons & Weather in Tunisia',
      activity: 'Classify Seasons and Weather words',
      exam: 'Test: Seasons & Weather',
      summaryTitle: 'Remember: Four Seasons',
      summaryPoints: [
        'Spring, Summer, Autumn, Winter · Sunny, rainy, windy, cloudy.',
      ],
    },
    {
      lesson: 'Clothes & Shopping',
      activity: 'Classify Summer and Winter clothes',
      exam: 'Quiz: Clothes Vocabulary',
      summaryTitle: 'Remember: What We Wear',
      summaryPoints: [
        'Dress, coat, sweater, hat, shoes.',
      ],
    },
    {
      lesson: 'Food, Fruits & Healthy Eating',
      activity: 'Classify Healthy Fruits and Drinks',
      exam: 'Test: Food & Drinks',
      summaryTitle: 'Remember: Healthy Plate',
      summaryPoints: [
        'Apples, oranges, olives, dates, milk, water.',
      ],
    },
    {
      lesson: 'Hobbies, Sports & Free Time',
      activity: 'Complete sentences about hobbies',
      exam: 'Quiz: My Hobbies',
      summaryTitle: 'Remember: Expressing Likes',
      summaryPoints: [
        'I like reading books and painting flowers.',
      ],
    },
    {
      lesson: 'Reading Short Dialogues about Tunisia',
      activity: 'Order a friendly dialogue',
      exam: 'Final 5th-Grade Exam: English',
      summaryTitle: 'Remember: Reading Dialogues',
      summaryPoints: [
        'Read questions carefully and find key words in the dialogue.',
      ],
    },
  ],
  arts_tech: [
    {
      lesson: 'الألوان الأساسية والألوان الثانوية',
      activity: 'تصنيف الألوان الأساسية والثانوية',
      exam: 'اختبار دائرة الألوان',
      summaryTitle: 'تذكّر القاعدة: الألوان',
      summaryPoints: [
        'الأساسية: الأحمر، الأصفر، الأزرق · الثانوية: الأخضر، البرتقالي، البنفسجي.',
      ],
    },
    {
      lesson: 'التدرّج اللوني والألوان الدافئة والباردة',
      activity: 'فرز الألوان الدافئة والباردة',
      exam: 'اختبار التدرّج اللوني',
      summaryTitle: 'تذكّر القاعدة: حرارة الألوان',
      summaryPoints: [
        'الأحمر والبرتقالي والأصفر ألوان دافئة، والأزرق والأخضر ألوان باردة.',
      ],
    },
    {
      lesson: 'الزخرفة الهندسية والزليج التونسي',
      activity: 'إتمام قواعد التناظر والزخرفة',
      exam: 'اختبار الزليج التونسي',
      summaryTitle: 'تذكّر القاعدة: الزليج',
      summaryPoints: [
        'يعتمد الزليج التونسي على التناظر وتكرار الأشكال الهندسية.',
      ],
    },
    {
      lesson: 'فن الفسيفساء التونسية في متحف باردو',
      activity: 'تعرّف على مواد الفسيفساء',
      exam: 'اختبار الفنون التشكيلية',
      summaryTitle: 'تذكّر القاعدة: الفسيفساء',
      summaryPoints: [
        'تُصنع الفسيفساء من مكعّبات صغيرة ملوّنة من الحجر والزجاج.',
      ],
    },
    {
      lesson: 'الرسم المنظوري والتظليل البسيط',
      activity: 'تحديد مصدر الضوء والظل في الرسم',
      exam: 'فرض تأليفي: الثلاثي الأول في الفنون',
      summaryTitle: 'تذكّر القاعدة: الظل والنور',
      summaryPoints: [
        'يتكوّن الظل في الجهة المقابلة لمصدر الضوء لإبراز حجم الشكل.',
      ],
    },
    {
      lesson: 'الآلات البسيطة: الرافعة والبكرة',
      activity: 'مطابقة الآلة البسيطة باستعمالها',
      exam: 'اختبار الآلات البسيطة',
      summaryTitle: 'تذكّر القاعدة: تسهيل العمل',
      summaryPoints: [
        'البكرة والرافعة تقلّلان الجهد المبذول لرفع الأجسام الثقيلة.',
      ],
    },
    {
      lesson: 'العجلة والمسنّنات ونقل الحركة',
      activity: 'ترتيب مراحل نقل الحركة في الدراجة',
      exam: 'اختبار نقل الحركة',
      summaryTitle: 'تذكّر القاعدة: المسنّنات',
      summaryPoints: [
        'تنقل المسنّنات والسلاسل الحركة الدورانية بدقّة.',
      ],
    },
    {
      lesson: 'التركيب الكهربائي المنزلي الآمن',
      activity: 'فرز تصرفات الأمان الكهربائي',
      exam: 'اختبار السلامة الكهربائية',
      summaryTitle: 'تذكّر القاعدة: الوقاية من الصدمة',
      summaryPoints: [
        'لا نلمس المقابس الكهربائية بأيدٍ مبلّلة أبداً.',
      ],
    },
    {
      lesson: 'المجسمات الهندسية والطيّ الورقي (الأوريغامي)',
      activity: 'ربط كل مجسم بقاعدته الهندسية',
      exam: 'اختبار المجسمات الورقية',
      summaryTitle: 'تذكّر القاعدة: نشر المجسمات',
      summaryPoints: [
        'يتكوّن المكعب من 6 أوجه مربعة متقايسة.',
      ],
    },
    {
      lesson: 'مكونات الحاسوب: الإدخال والإخراج',
      activity: 'تصنيف وحدات الإدخال والإخراج',
      exam: 'فرض تأليفي: الثلاثي الثاني في التكنولوجيا',
      summaryTitle: 'تذكّر القاعدة: الحاسوب',
      summaryPoints: [
        'لوحة المفاتيح والفأرة للإدخال، والشاشة والطابعة للإخراج.',
      ],
    },
    {
      lesson: 'السلامة الرقمية وحماية كلمة المرور',
      activity: 'تحدّي التصرّف الرقمي الآمن',
      exam: 'اختبار السلامة الرقمية',
      summaryTitle: 'تذكّر القاعدة: الأمان الرقمي',
      summaryPoints: [
        'كلمة المرور سرّية ولا نشاركها مع الغرباء أبداً.',
      ],
    },
    {
      lesson: 'كتابة النصوص الرقمية وتنظيم الملفات',
      activity: 'ترتيب خطوات حفظ ملف مدرسي',
      exam: 'اختبار المهارات الرقمية',
      summaryTitle: 'تذكّر القاعدة: تنظيم الحاسوب',
      summaryPoints: [
        'نرتّب دروسنا في مجلّدات واضحة حسب كل مادة.',
      ],
    },
    {
      lesson: 'الإيقاع الموسيقي والرموز البسيطة',
      activity: 'مطابقة الآلات الموسيقية بنوعها',
      exam: 'اختبار التربية الموسيقية',
      summaryTitle: 'تذكّر القاعدة: الإيقاع',
      summaryPoints: [
        'تُقسم الآلات إلى وترية كالعود، وإيقاعية كالدربوكة، وهوائية كالناي.',
      ],
    },
    {
      lesson: 'المألوف التونسي والتراث الموسيقي الوطني',
      activity: 'استكشاف آلات المالوف التونسي',
      exam: 'اختبار التراث الموسيقي',
      summaryTitle: 'تذكّر القاعدة: المالوف',
      summaryPoints: [
        'المالوف تراث موسيقي تونسي أصيل يُعزف بالعود والقانون والرباب.',
      ],
    },
    {
      lesson: 'مشروع نهاية السنة: تصميم بطاقة تهنئة تونسية',
      activity: 'ترتيب مراحل إنجاز المشروع الفني',
      exam: 'الامتحان الشامل لنهاية السنة في التربية التكنولوجية والفنّية',
      summaryTitle: 'تذكّر القاعدة: الإبداع والتنفيذ',
      summaryPoints: [
        'يبدأ كل مشروع بالتخطيط ثم اختيار المواد ثم التنفيذ والتقييم.',
      ],
    },
  ],
};

export const TOPIC_BLUEPRINTS: TopicBlueprint[] = SUBJECT_METAS.flatMap((meta) =>
  RAW_TOPICS[meta.id].map((item, idx) => ({
    topicIndex: idx,
    subjectId: meta.id,
    term: termByIndex(idx),
    lessonTitle: item.lesson,
    activityTitle: item.activity,
    examTitle: item.exam,
    summaryTitle: item.summaryTitle,
    summaryPoints: item.summaryPoints,
  }))
);
