export interface Category {
  name: string;
  image: string;
  words: string[];
  hintText?: string;
}

export const categories: Category[] = [
  // ===== ENGLISH =====
  {
    name: "Naruto",
    image: "images/anime/naruto.jpg",
    words: ["Naruto", "Sasuke", "Sakura", "Kakashi", "Itachi", "Jiraiya", "Hinata", "Madara"],
    hintText: "Main Characters Of Naruto Anime"
  },
  {
    name: "Attack on Titan",
    image: "images/anime/attack-on-titan.jpg",
    words: ["Eren", "Mikasa", "Armin", "Levi", "Historia", "Reiner", "Annie", "Erwin"],
    hintText: "Popular Character In Attack On Titan Anime"
  },
  {
    name: "Death Note",
    image: "images/anime/death-note.jpeg",
    words: ["Light", "Ryuk", "Misa", "Near", "Matsuda", "Watari", "Rem"],
    hintText: "Popular Character In Death Note Anime"
  },
  {
    name: "One Piece",
    image: "images/anime/one-piece.jpg",
    words: ["Luffy", "Zoro", "Nami", "Sanji", "Chopper", "Robin", "Franky", "Brook"],
    hintText: "Luffy's Crew Members From One Piece Anime"
  },
  {
    name: "Dragon Ball",
    image: "images/anime/dragon-ball.avif",
    words: ["Goku", "Vegeta", "Gohan", "Piccolo", "Krillin", "virus", "Trunks", "Frieza"],
    hintText: "Famous Dragon Ball characters"
  },
  {
    name: "Real Madrid",
    image: "images/clubs/real-madrid.webp",
    words: ["Vinicius", "Bellingham", "Mbappe", "Arnold", "Camavinga", "Rodrygo", "Militao"],
    hintText: "The Most Famous Current Players At Real Madrid"
  },
  {
    name: "Al Nassr",
    image: "images/clubs/al-nasser.webp",
    words: ["Ronaldo"],
    hintText: "The most famous Player in Al-Nassr Saudi Club"
  },
  {
    name: "Barcelona",
    image: "images/clubs/barcelona.png",
    words: ["Pedri", "Gavi", "Yamal", "Cubarsi", "Balde", "Olmo", "Terstegen"],
    hintText: "The most famous current players at Barcelona"
  },
  {
    name: "AL CLAN",
    image: "images/al-clan/al-clan.jpg",
    words: ["Afoly", "Hamed", "Safsaf", "Mulhim", "Max", "Teeko", "Ahmed", "Kabreteed"],
    hintText: "Sudanese entertainment content creators and members of the AL CLAN group"
  },

  // ===== New categories =====
  {
    name: "Social Media",
    image: "images/social-media/social-media.jpg",
    words: ["Facebook", "Twitter", "Instagram", "Snapchat", "TikTok", "YouTube", "LinkedIn", "Pinterest", "WhatsApp"],
    hintText: "Popular social media platforms"
  },
  {
    name: "Car Brands",
    image: "images/cars/car-brands.jpg",
    words: ["Toyota", "Ferrari", "Nissan", "Hyundai", "Bentley", "Porsche", "Kia"],
    hintText: "Global car manufacturers you see on the road every day"
  },
  {
    name: "Drinks brands",
    image: "images/drinks/drinks.jpg",
    words: ["Pepsi", "Sprite", "Fanta", "Redbull", "Nescafe", "Lipton", "CocaCola", "Dew", "Monster"],
    hintText: "Popular drinks brands found in almost every fridge"
  },
  {
    name: "Currencies",
    image: "images/currencies/currencies.jpg",
    words: ["Dollar", "Riyal", "Dirham", "Rupee", "Dinar", "Shekel", "Pound"],
    hintText: "Money used around the world, country by country"
  },
  {
    name: "Natural Phenomena and Disasters",
    image: "images/nature/disasters.jpg",
    words: ["Earthquake", "Volcano", "Flood", "Hurricane", "Tsunami", "Drought", "Landslide"],
    hintText: "A powerful natural phenomenon that can reshape the Earth"
  },
  {
    name: "Arab Countries In Asia",
    image: "images/regions/arab-regions-asia.jpg",
    words: ["Iraq", "Saudi Arabia", "Yemen", "Oman", "Palestine", "Kuwait", "Syria", "Lebanon"],
    hintText: "An Arab country located in Asia"
  },
  {
    name: "Prophets And Messengers",
    image: "images/prophets/prophets.jpg",
    words: ["Noah", "Abraham", "Moses", "Jesus", "Joseph", "Jacob", "David", "Solomon", "Jonah"],
    hintText: "A prophet or messenger mentioned in the Quran"
  },
  {
    name: "Olympic Sports",
    image: "images/sports/olympic-sports.jpg",
    words: ["Swimming", "Gymnastics", "Wrestling", "Rowing", "Archery", "Fencing", "Diving"],
    hintText: "A sport played at the Olympic Games"
  },
  {
    name: "Famous Musical Instruments",
    image: "images/instruments/musical-instruments.jpg",
    words: ["Oud", "Violin", "Darbuka", "Ney", "Piano", "Guitar", "Accordion"],
    hintText: "A famous musical instrument used for playing and singing"
  },
  {
    name: "Famous Sudanese Rappers",
    image: "images/rappers/sudanese-rappers.jpg",
    words: ["Mandela", "Todoub", "Tageel", "Filbter", "Haleem", "Solja", "Azzu", "Davinci", "Kolo", "Awab", "Montiago", "Blackjack", "Weljees"],
    hintText: "A well-known Sudanese rapper in the music scene"
  },
  {
    name: "Famous Phone Brands",
    image: "images/phones/phone.jpg",
    words: ["Samsung", "Huawei", "Xiaomi", "Oppo", "Nokia", "Realme", "Infinix", "Vivo", "Apple"],
    hintText: "Famous phone brands"
  },
  {
    name: "Saudi Clans",
    image: "images/clan/saudi-clans.jpg",
    words: ["Linex", "Power", "Pix", "Falcon"],
    hintText: "A famous Saudi gaming clan from the Kingdom of Saudi Arabia"
  },
  {
    name: "ناروتو",
    image: "images/anime/naruto.jpg",
    words: ["ناروتو", "ساسكي", "ساكورا", "كاكاشي", "ايتاشي", "جيرايا", "هيناتا", "مادارا"],
    hintText: "شخصية من الشخصيات الرئيسية في أنمي ناروتو"
  },
  {
    name: "هجوم العمالقة",
    image: "images/anime/attack-on-titan.jpg",
    words: ["ايرين", "ميكاسا", "ارمين", "ليفاي", "هيستوريا", "راينر", "اني", "ايروين"],
    hintText: "شخصية مشهورة في أنمي هجوم العمالقة"
  },
  {
    name: "دفتر الموت",
    image: "images/anime/death-note.jpeg",
    words: ["لايت", "ريوك", "ميسا", "نير", "ماتسودا", "واتاري", "ريم"],
    hintText: "شخصية مشهورة في أنمي دفتر الموت"
  },
  {
    name: "ون بيس",
    image: "images/anime/one-piece.jpg",
    words: ["لوفي", "زورو", "نامي", "سانجي", "تشوبر", "روبين", "فرانكي", "بروك"],
    hintText: "أحد أعضاء طاقم القبطان لوفي في أنمي ون بيس"
  },
  {
    name: "دراغون بول",
    image: "images/anime/dragon-ball.avif",
    words: ["غوكو", "فيجيتا", "غوهان", "بيكولو", "كريلين", "فيروس", "ترانكس", "فريزا"],
    hintText: "شخصية مشهورة في أنمي دراغون بول"
  },
  {
    name: "ريال مدريد",
    image: "images/clubs/real-madrid.webp",
    words: ["فينيسيوس", "بيلينجهام", "مبابي", "ارنولد", "كامافينجا", "رودريجو", "ميليتاو"],
    hintText: "لاعب مشهور حاليًا في نادي ريال مدريد"
  },
  {
    name: "النصر",
    image: "images/clubs/al-nasser.webp",
    words: ["رونالدو"],
    hintText: "أشهر لاعب في نادي النصر السعودي"
  },
  {
    name: "برشلونة",
    image: "images/clubs/barcelona.png",
    words: ["بيدري", "غافي", "يامال", "كوبارسي", "بالدي", "اولمو", "تير شتيجن"],
    hintText: "لاعب مشهور حاليًا في نادي برشلونة"
  },
  {
    name: "AL CLAN (عربي)",
    image: "images/al-clan/al-clan.jpg",
    words: ["افولي", "حامد", "صفصف", "ملهم", "ماكس", "تيكو", "احمد", "كبريتيد"],
    hintText: "صناع محتوى ترفيه في السودان و اعضاء في مجموعة الـ AL CLAN"
  },

  // ===== الفئات الجديدة =====
  {
    name: "وسائل التواصل الاجتماعي",
    image: "images/social-media/social-media.jpg",
    words: ["فيسبوك", "تويتر", "انستقرام", "سناب شات", "تيك توك", "يوتيوب", "لينكدإن", "بينتيريست", "واتساب"],
    hintText: "منصة تواصل اجتماعي مشهورة"
  },
  {
    name: "ماركات السيارات",
    image: "images/cars/car-brands.jpg",
    words: ["تويوتا", "فيراري", "نيسان", "هيونداي", "بنتلي", "بورش", "كيا"],
    hintText: "ماركة سيارات عالمية تشوفها في الشارع كل يوم"
  },
  {
    name: "ماركات المشروبات",
    image: "images/drinks/drinks.jpg",
    words: ["بيبسي", "سبرايت", "فانتا", "ريدبول", "نسكافيه", "ليبتون", "كوكاكولا", "مونتن ديو", "مونستر"],
    hintText: "ماركة مشروبات مشهورة موجودة في كل ثلاجة تقريبًا"
  },
  {
    name: "العملات",
    image: "images/currencies/currencies.jpg",
    words: ["دولار", "ريال", "درهم", "روبية", "دينار", "شيكل", "جنيه"],
    hintText: "عملة تُستخدم حول العالم، دولة بدولة"
  },
  {
    name: "ظواهر وكوارث طبيعية",
    image: "images/nature/disasters.jpg",
    words: ["زلزال", "بركان", "فيضان", "اعصار", "تسونامي", "جفاف", "انهيار"],
    hintText: "ظواهرة طبيعية قوية ممكن تغيّر شكل الأرض"
  },
  {
    name: "دول عربية في قارة آسيا",
    image: "images/regions/arab-regions-asia.jpg",
    words: ["العراق", "السعودية", "اليمن", "عمان", "فلسطين", "الكويت", "سوريا", "لبنان"],
    hintText: "دولة عربية تقع ضمن قارة آسيا"
  },
  {
    name: "رسل وأنبياء",
    image: "images/prophets/prophets.jpg",
    words: ["نوح", "ابراهيم", "موسى", "عيسى", "يوسف", "يعقوب", "داود", "سليمان", "يونس"],
    hintText: "نبي أو رسول ذُكر في القران"
  },
  {
    name: "رياضات وألعاب أولمبية",
    image: "images/sports/olympic-sports.jpg",
    words: ["سباحة", "جمباز", "مصارعة", "تجديف", "رماية", "مبارزة", "غطس"],
    hintText: "رياضة تُلعب في دورة الألعاب الأولمبية"
  },
  {
    name: "آلات موسيقية مشهورة",
    image: "images/instruments/musical-instruments.jpg",
    words: ["عود", "كمان", "طبلة", "ناي", "بيانو", "جيتار", "اكورديون"],
    hintText: "آلة موسيقية مشهورة تُستخدم في العزف والغناء"
  },
  {
    name: "رابرز سودانيين مشاهير",
    image: "images/rappers/sudanese-rappers.jpg",
    words: ["مانديلا", "تودوب", "تقيل", "فلبتر", "حليم", "سولجا", "عزو", "دافنشي", "كولو", "اواب", "مونتياغو", "بلاكجاك", "ولجيز"],
    hintText: "رابر سوداني معروف في الساحة الغنائية"
  },
  {
    name: "ماركات الجوالات المشهورة",
    image: "images/phones/phone.jpg",
    words: ["سامسونج", "هواوي", "شاومي", "اوبو", "نوكيا", "ريلمي", "انفينكس", "فيفو", "ابل"],
    hintText: "ماركة جوالات مشهورة"
  },
  {
    name: "كلانات السعودية",
    image: "images/clan/saudi-clans.jpg",
    words: ["لينكس", "باور", "بيكس", "فالكون"],
    hintText: "كلان سعودي مشهور في المملكة العربية السعودية"
  },
];