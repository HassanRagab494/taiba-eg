import { Waves, Trees, Sun, Mountain, Palette, Sparkles, Music, ShoppingBag, HeartHandshake, Home } from 'lucide-react';

export const DEFAULT_NATURE_CARDS = [
    {
      title: { ar: 'شريان الخلود: نهر النيل الأبدي', en: 'The Eternal River Nile', fr: 'Le Nil Éternel', es: 'El Nilo Eterno', de: 'Der Ewige Nil' },
      desc: {
        ar: 'المصدر الحيوي الذي بنى أعظم حضارات العالم، حيث تتهادى مياهه الصافية بين ضفاف باسقة النخيل وسحر المراكب الشراعية البيضاء.',
        en: 'The lifeblood of pharaonic greatness, flowing gently past date groves, limestone cliffs, and tranquil felucca sails.',
        fr: 'Le berceau de la civilisation égyptienne, miroir azur où glissent les voiles blanches sous les palmiers.',
        es: 'La arteria vital que dio vida a los faraones, fluyendo en calma entre palmerales milenarios.',
        de: 'Die Lebensader des pharaonischen Ägyptens, ruhig fließend zwischen Palmhainen und Sandsteinklippen.'
      },
      image: '/src/assets/images/hero_luxor_thebes_nile_1794257299786.jpg',
      icon: Waves,
      tag: { ar: 'شريان الحياة', en: 'Lifeblood' },
    },
    {
      title: { ar: 'جزيرة الموز وجزر النيل العذبة', en: 'Banana Island & River Sanctuaries', fr: 'L’Île aux Bananes', es: 'Isla de los Plátanos', de: 'Banana Island' },
      desc: {
        ar: 'واحة زمردية وسط مجرى النيل تضم بساتين الموز والمانجو والفاكهة الاستوائية، وتقدم أصفى إطلالة على ماء النهر الرقراق.',
        en: 'An emerald island sanctuary blanketed in banana groves, guava, and date palms, perfect for afternoon tea.',
        fr: 'Havre de verdure au milieu du Nil planté de bananiers et manguiers pour une halte paisible.',
        es: 'Vergel esmeralda en mitad del Nilo con huertos de frutas tropicales y vistas cristalinas.',
        de: 'Smaragdgrüne Insel inmitten des Nils mit Bananenstauden und traditionellen Teestuben.'
      },
      image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
      icon: Trees,
      tag: { ar: 'طبيعة نيلية', en: 'River Isle' },
    },
    {
      title: { ar: 'سحر الغروب فوق جبال طيبة', en: 'Sunset Over The Theban Peaks', fr: 'Coucher de Soleil sur Thèbes', es: 'Puesta de Sol en Tebas', de: 'Sonnenuntergang über Theben' },
      desc: {
        ar: 'لحظة أسطورية ينسكب فيها الذهب المذاب فوق هضاب جبل القرنة وتعكس صفحة الماء ألوان الشفق الوردي والبنفسجي.',
        en: 'A daily celestial masterwork as molten gold washes over the cliffs of al-Qurn, mirrored by the still river waters.',
        fr: 'Un spectacle grandiose où l’or du couchant enflamme les crêtes thébaines et le ruban du Nil.',
        es: 'Momento mágico en que los acantilados se tiñen de oro y púrpura reflejados en el agua.',
        de: 'Ein spektakuläres Farbspiel, wenn die sinkende Sonne die Felswände in flüssiges Gold taucht.'
      },
      image: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
      icon: Sun,
      tag: { ar: 'مشهد بانورامي', en: 'Sunset Vista' },
    },
    {
      title: { ar: 'جبل القرنة والامتداد الصحراوي', en: 'Al-Qurn & The Desert Escarpment', fr: 'Le Mont Al-Qourn et le Désert', es: 'El Monte Al-Qurn y el Desierto', de: 'Al-Qurn und die Felswüste' },
      desc: {
        ar: 'القمة الهرمية الطبيعية الحارسة لوادي الملوك؛ تضاريس جيولوجية نقية تشهد على ملايين السنين من التاريخ الطبيعي.',
        en: 'The natural pyramid crest standing vigilant sentinel over royal crypts amidst raw desert majesty.',
        fr: 'Sentinelle pyramidale naturelle veillant sur les cryptes royales au milieu du désert.',
        es: 'La pirámide geológica natural que vela sobre las tumbas de los faraones en el silencio del desierto.',
        de: 'Der pyramidenförmige Naturberg, der wie ein steinerner Wächter über dem Tal der Könige thront.'
      },
      image: '/src/assets/images/valley_of_the_kings_entrance_1794257302176.jpg',
      icon: Mountain,
      tag: { ar: 'طبيعة صخرية', en: 'Desert Mountain' },
    },
  ];
export const DEFAULT_CULTURE_CARDS = [
    {
      title: { ar: 'صناعة ونحت الألباستر بالقرنة', en: 'Traditional Alabaster Carving in Qurna', fr: 'L’Art de l’Albâtre à Gournah', es: 'Talla Tradicional de Alabastro en Qurna', de: 'Traditionelle Alabaster-Bildhauerei in Qurna' },
      desc: {
        ar: 'مهنة وراثية متوارثة منذ آلاف السنين؛ يشكل حرفيو القرنة حجر الألباستر المصري الشفاف يدوياً بالأزاميل والمبارد ليخرجوا مزهريات وتماثيل تحاكي مقتنيات المقابر الملكية.',
        en: 'A hereditary craft preserved for millennia: master artisans chisel translucent Egyptian calcite into illuminated vases and scarabs using ancient hand tools.',
        fr: 'Art millénaire hérité des bâtisseurs de tombes : les artisans sculptent manuellement l’albâtre translucide en vases et statuettes délicates.',
        es: 'Oficio transmitido de padres a hijos: artesanos tallan a mano la calcita traslúcida creando vasos y amuletos idénticos a los del ajuar real.',
        de: 'Jahrtausendealte Handwerkskunst: Meister schnitzen den durchscheinenden Alabaster von Hand zu Skarabäen und Vasen.'
      },
      image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
      icon: Palette,
    },
    {
      title: { ar: 'صناعة البردي والنسيج اليدوي النيلي', en: 'Papyrus Making & Heritage Handloom Weaving', fr: 'Papyrus Antique & Tissage Manuel', es: 'Papiros y Telares Artesanales', de: 'Papyrus-Herstellung & Handweberei' },
      desc: {
        ar: 'تحويل سيقان نبات البردي المثلثة لشرائح مضغوطة كما في عهد الفراعنة، ورسم النقوش بالألوان الطبيعية، بالإضافة إلى أنوال النسيج الصعيدي بالقطن والكتان.',
        en: 'Pressing triangular papyrus reeds into supple writing sheets and hand-weaving pure Egyptian long-staple cotton and linen on wooden foot looms.',
        fr: 'Fabrication authentique des feuilles de papyrus pressées et tissage traditionnel du lin et coton sur métiers en bois.',
        es: 'Elaboración tradicional del papiro mediante tiras cruzadas y prensadas, y tejido en telares de madera.',
        de: 'Pressen von echtem Nilpapyrus und Weben von feinstem ägyptischem Leinen auf traditionellen Webstühlen.'
      },
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      icon: Sparkles,
    },
    {
      title: { ar: 'رقصة التحطيب بالعصا والفنون الشعبية', en: 'Tahtib Stick Dancing & Folk Music', fr: 'L’Art du Tahtib & Musiques Populaires', es: 'Danza de Bastón Tahtib y Folclore', de: 'Tahtib-Stocktanz & Volksmusik' },
      desc: {
        ar: 'أقدم فن دفاعي وراقص مسجل على جدران المعابد ومدرج بقائمة اليونسكو للتراث الإنساني؛ مبارزة نبيلة بالعصا الطويلة على أنغام المزمار البلدي والطبول الصعيدية.',
        en: 'UNESCO-inscribed ancient martial stick dance depicted on pharaonic reliefs; an elegant duel of honor set to hypnotic mizmar pipes and drums.',
        fr: 'Danse martiale au bâton inscrite à l’UNESCO, figurant sur les temples antiques, rythmée par le hautbois traditionnel et les tambours.',
        es: 'Danza marcial de bastones reconocida por la UNESCO, acompañada de caramillos tradicionales y tambores.',
        de: 'UNESCO-Kulturerbe: Der altägyptische Stockfechttanz Tahtib zur Musik von Schalmeien und Rahmentrommeln.'
      },
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      icon: Music,
    },
    {
      title: { ar: 'سوق الأقصر التراثي وخان العطارة', en: 'Historic Luxor Souk & Spice Bazaars', fr: 'Le Vieux Souk et Bazar aux Épices', es: 'El Zoco Histórico y Bazar de Especias', de: 'Historischer Gewürzbasar von Luxor' },
      desc: {
        ar: 'عالم يفيض بعطور اللبان الأسواني، والكركديه، والزعفران، والكمون البلدي، والأواني الفخارية المشغولة، وحلي الفضة البدوية في ممرات مظللة بطول كيلومتر.',
        en: 'A fragrant sensory wonderland filled with frankincense, ruby karkadeh, golden cumin, hand-hammered brass lamps, and Bedouin silver jewelry.',
        fr: 'Labyrinthe parfumé d’encens, de karkadé, de cumin doré et d’échoppes d’artisanat en laiton ciselé.',
        es: 'Bazar aromático repleto de mirra, incienso, hibisco, azafrán y platería tradicional.',
        de: 'Ein duftendes Labyrinth aus Weihrauch, Karkadeh, Kreuzkümmel, Messinglampen und Silberschmuck.'
      },
      image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80',
      icon: ShoppingBag,
    },
    {
      title: { ar: 'كرم الضيافة الصعيدي والعادات الأصيلة', en: 'Upper Egyptian Hospitality & Customs', fr: 'L’Hospitalité Saidie et Traditions', es: 'Hospitalidad Saidí y Costumbres', de: 'Gastfreundschaft & Traditionen Oberägyptens' },
      desc: {
        ar: 'الشهامة الصعيدية المتوارثة: جلسات "المندرة" وتبادل كؤوس الشاي الثقيل بالحبق، وتقديم واجب الضيافة لكل عابر سبيل بابتسامة ترحيب أصيلة.',
        en: 'Timeless codes of Southern Egyptian warmth: gatherings in the family reception hall (mandara) and welcoming travelers as honored guests.',
        fr: 'Règles séculaires de la générosité du sud : réunions dans la mandara et thé bouillant partagé en signe de bienvenue.',
        es: 'La legendaria calidez del sur: tertulias en la mandara y bienvenida afectuosa a todo viajero.',
        de: 'Jahrhundertealte Traditionen des Südens: Beisammensein in der Mandara und herzliche Gastfreundschaft für jeden Reisenden.'
      },
      image: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
      icon: HeartHandshake,
    },
    {
      title: { ar: 'الحياة في القرى الريفية والبيوت الطينية', en: 'Rural Village Life & Vernacular Earthen Homes', fr: 'Architecture en Terre & Vie Rurale', es: 'Vida Rural y Casas de Adobe', de: 'Dörfliches Leben & Lehmarchitektur' },
      desc: {
        ar: 'بيوت بنيت من طمي النيل والآجر اللبن بقباب تحافظ على البرودة الطبيعية صيفاً، وحقول القمح وقصب السكر التي تحاكي لوحات مقابر الفراعنة.',
        en: 'Dome-roofed earthen homes naturally cooled against desert heat, set against emerald cane fields mirroring 3,500-year-old tomb frescoes.',
        fr: 'Maisons de pisé aux toits en coupole bioclimatiques, bordant les champs de canne à sucre comme sur les bas-reliefs antiques.',
        es: 'Viviendas de adobe bioclimáticas con cúpulas frescas rodeadas de cañaverales idénticos a los frescos faraónicos.',
        de: 'Klimagerechte Lehmhäuser mit Kuppeldächern inmitten von Zuckerrohrfeldern wie auf altägyptischen Wandmalereien.'
      },
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      icon: Home,
    },
  ];

