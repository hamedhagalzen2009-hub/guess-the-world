export interface Category {
  name: string;
  image: string;
  words: string[];
  hintText?: string;
}

export const categories: Category[] = [
  {
    name: "Naruto",
    image: "images/anime/naruto.jpg",
    words: ["Naruto", "Sasuke", "Sakura", "Kakashi", "Itachi", "jiraiya", "Hinata", "Madara"],
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
    words: ["Vinicius", "Bellingham", "Mbappe", "Modric", "Courtois", "Rodrygo", "Militao"],
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
    words: ["Pedri", "Gavi", "Lewandowski", "Yamal", "Araujo", "Christensen", "Cubarsi"],
    hintText: "The most famous current players at Barcelona"
  },
  {
    name: "AL CLAN",
    image: "images/al-clan/al-clan.jpg",
    words: ["افولي", "حامد", "صفصف", "ملهم", "ماكس", "تيكو", "احمد", "كبريتيد"],
    hintText: "صناع محتوى ترفيه في السودان و اعضاء في مجموعة الـ AL CLAN"
  },

  // ===== الفئات الجديدة =====
  {
    name: "Social Media",
    image: "images/social-media/social-media.jpg",
    words: ["Facebook", "Twitter", "Instagram", "Snapchat", "TikTok", "YouTube", "LinkedIn", "Pinterest", "WhatsApp"],
    hintText: "Popular social media platforms"
  },
  {
    name: "Car Brands",
    image: "images/cars/car-brands.jpg",
    words: ["Toyota", "Ferrari", "Nissan", "Hyundai", "Bentley", "Porsche", "kia"],
    hintText: "Global car manufacturers you see on the road every day"
  },
  {
    name: "Drinks brands",
    image: "images/drinks/drinks.jpg",
    words: ["Pepsi", "Sprite", "Fanta", "Redbull", "Nescafe", "Lipton", "CocaCola", "Dew", 'Monster'],
    hintText: "Popular drinks brands found in almost every fridge"
  },
  {
    name: "Currencies",
    image: "images/currencies/currencies.jpg",
    words: ["Dollar", "Riyal", "Dirham", "Rupee", "Dinar", "Shekel", "pound"],
    hintText: "Money used around the world, country by country"
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
    name: "Famous Phone Brands",
    image: "images/phones/phone.jpg",
    words: ["Samsung", "Huawei", "Xiaomi", "Oppo", "Nokia", "Realme", "Infinix", "Vivo", "Apple"],
    hintText: "Famous phone brands"
  },
  {
    name: "كلانات السعودية",
    image: "images/clan/saudi-clans.jpg",
    words: ["توتد", "نايت", "التيميتس", "باور", "بيكس", "فالكون"],
    hintText: "كلان سعودي مشهور"
  },
];
