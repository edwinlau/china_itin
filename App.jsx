import { useState, useEffect, useRef } from "react";

// ── PALETTE ─────────────────────────────────────────────────────────────────
const T = {
  bg:       "#0e0d0b",
  bg1:      "#141210",
  bg2:      "#1a1610",
  border:   "#252018",
  border2:  "#2a2218",
  h1:       "#f0e8d8",   // headings
  h2:       "#e0d8c8",   // subheadings
  body:     "#c8bfaf",   // main readable text (was #7a7060 — much lighter now)
  sub:      "#a09080",   // secondary text
  muted:    "#7a6a5a",   // labels, timestamps
  faint:    "#5a4a3a",   // very muted
  accent:   "#c8a06a",   // gold accent
  fl:       "#6a9aba",   // flight blue
  tr:       "#c8a06a",   // train gold
  dd:       "#8a7a6a",   // didi
  pl:       "#5a9a5a",   // PL green
};

// ── CITIES ───────────────────────────────────────────────────────────────────
const CITIES = [
  { id:"summary",   label:"Summary",   emoji:"🗺️", color:"#c8a06a", dates:"Overview"    },
  { id:"xinjiang",  label:"Xinjiang",  emoji:"🏔️", color:"#c8734a", dates:"17–24 Apr"  },
  { id:"chengdu",   label:"Chengdu",   emoji:"🐼", color:"#4a8c5a", dates:"24–27 Apr"  },
  { id:"chongqing", label:"Chongqing", emoji:"🌆", color:"#3a6a9a", dates:"27–29 Apr"  },
  { id:"guilin",    label:"Guilin",    emoji:"⛰️", color:"#5a8a4a", dates:"29Apr–2May" },
  { id:"guangzhou", label:"Guangzhou", emoji:"🦆", color:"#9a6a3a", dates:"2–4 May"    },
  { id:"shenzhen",  label:"Shenzhen",  emoji:"🏙️", color:"#4a6a9a", dates:"4–6 May"   },
  { id:"hongkong",  label:"Hong Kong", emoji:"🌃", color:"#8a3a6a", dates:"6–9 May"   },
  { id:"transport", label:"Journeys",  emoji:"🚄", color:"#7a6a8a", dates:"All legs"   },
];
const CITY_IDS = ["xinjiang","chengdu","chongqing","guilin","guangzhou","shenzhen","hongkong"];

const SI = { breakfast:"🍳", coffee:"☕", activity:"🎯", snack:"🥟", massage:"💆", bar:"🍺", dinner:"🍽", ktv:"🎤", latenight:"🌙", travel:"🚄", note:"💡", pl:"⚽", csl:"🏟️" };
const SL = { breakfast:"Breakfast", coffee:"Coffee", activity:"Activity", snack:"Snack", massage:"Spa / Massage", bar:"Bar", dinner:"Dinner", ktv:"KTV", latenight:"Late Night", travel:"Travel", note:"Note", pl:"Premier League", csl:"CSL Football" };

// ── CITY OVERVIEW ─────────────────────────────────────────────────────────────

const OVERVIEW = [
  { city:"xinjiang",  emoji:"🏔️", label:"Xinjiang",  dates:"17–23 Apr", nights:7,  color:"#c8734a",
    highlights:["Urumqi — Grand Bazaar & Xinjiang Museum","Kashgar Old City — 2,000yr mud-brick lanes","Karakoram Highway + Karakul Lake (3,600m)","Panlong Ancient Road → Tashkurgan overnight","Muztagh Ata Glacier Park"] },
  { city:"chengdu",   emoji:"🐼", label:"Chengdu",   dates:"24–26 Apr", nights:3,  color:"#4a8c5a",
    highlights:["Giant Panda Base — arrive before 8am","Sichuan Opera face-changing show","Kuanzhai Alley + People's Park teahouse","Sanxingdui Bronze Age museum (1 hr drive)","⭐ Chengdu Rongcheng CSL home match — Phoenix Hill Stadium (60,000)"] },
  { city:"chongqing", emoji:"🌆", label:"Chongqing", dates:"27–28 Apr", nights:2,  color:"#3a6a9a",
    highlights:["Hongyadong neon stilted complex","Liziba monorail through apartment building","Yangtze River Night Cruise","Cyberpunk bar scene"] },
  { city:"guilin",    emoji:"⛰️", label:"Guilin",    dates:"29 Apr – 1 May", nights:3, color:"#5a8a4a",
    highlights:["Li River Cruise (4–5 hrs) through karst peaks","Yulong River bamboo rafting","Impression Liu Sanjie outdoor show","Countryside cycling + Moon Hill hike","Labour Day 1 May — everywhere busy"] },
  { city:"guangzhou", emoji:"🦆", label:"Guangzhou", dates:"2–3 May",  nights:2,  color:"#9a6a3a",
    highlights:["Nan Yuan dim sum (est. 1958) — classical garden","Canton Tower (600m) + sky walk","Shamian Island — colonial architecture","Pearl River Night Cruise","Premier League at Morgans British Pub"] },
  { city:"shenzhen",  emoji:"🏙️", label:"Shenzhen",  dates:"4–5 May",  nights:2,  color:"#4a6a9a",
    highlights:["OCT Loft Creative Culture Park — galleries","Dafen Oil Painting Village","TENZ Spa — flagship spa day","The Penthouse 38F rooftop cocktails","Premier League at Cages Sports Bar"] },
  { city:"hongkong",  emoji:"🌃", label:"Hong Kong", dates:"6–8 May",  nights:3,  color:"#8a3a6a",
    highlights:["Victoria Peak via Peak Tram + Star Ferry","Tim Ho Wan — Michelin dim sum","Temple Street Night Market","Premier League at Delaney's / The Wanch","CX105 departs HKG T1 · 00:20 · 9 May"] },
];

// ── TRANSPORT SUMMARY (for Summary tab) ───────────────────────────────────────

const TRANSPORT = [
  { kind:"flight", label:"MEL T2 → HKG T1",     no:"CX134", date:"Fri 17 Apr", dep:"07:25", arr:"14:55", note:"Cathay Pacific · Economy" },
  { kind:"flight", label:"HKG T1 → URC T4",      no:"CX998", date:"Sat 18 Apr", dep:"01:15", arr:"07:00", note:"Cathay Pacific · Economy · 5h 45m" },
  { kind:"flight", label:"URC → CTU Tianfu T2",  no:"CZ6941",date:"Fri 24 Apr", dep:"08:50", arr:"12:45", note:"China Southern · Economy" },
  { kind:"train",  label:"Chengdudong → Shapingba (CQ)", no:"G8645", date:"Mon 27 Apr", dep:"12:37", arr:"14:07", note:"Business · 1h 30m" },
  { kind:"train",  label:"Chongqingxi → Guilinxi",       no:"G905",  date:"Wed 29 Apr", dep:"08:44", arr:"12:38", note:"Business · 3h 54m" },
  { kind:"train",  label:"Yangshuo → Guangzhounan",      no:"G3741", date:"Sat 2 May",  dep:"10:20", arr:"12:39", note:"Business · 2h 19m" },
  { kind:"train",  label:"Guangzhounan → Shenzhenbei",   no:"G391",  date:"Mon 4 May",  dep:"12:28", arr:"13:01", note:"2nd Class · 33 min" },
  { kind:"train",  label:"Shenzhenbei → HK West Kowloon",no:"G919",  date:"Wed 6 May",  dep:"13:33", arr:"13:52", note:"1st Class · 19 min" },
  { kind:"flight", label:"HKG T1 → MEL T2",      no:"CX105", date:"Sat 9 May",  dep:"00:20", arr:"11:15", note:"Cathay Pacific · Economy · 8h 55m" },
];

// ── TRAVEL-IN CARDS ───────────────────────────────────────────────────────────

const TRAVEL_IN = {
  xinjiang: {
    summary:"Melbourne → Hong Kong → Urumqi",
    from:"Melbourne Airport Terminal 2",
    to:"Brilliant Hotel, Urumqi",
    steps:[
      { kind:"flight", label:"CX134 · MEL T2 → HKG T1", dep:"07:25 · Fri 17 Apr", arr:"14:55 · Fri 17 Apr · HKG T1", note:"Cathay Pacific · Economy · 9h 30m" },
      { kind:"gap",    label:"Overnight transit — Hong Kong HKG T1", note:"~10 hr layover before CX998. Stay airside or airport hotel." },
      { kind:"flight", label:"CX998 · HKG T1 → URC Tianshan T4", dep:"01:15 · Sat 18 Apr", arr:"07:00 · Sat 18 Apr · URC T4", note:"Cathay Pacific · Economy · A330-300 · 5h 45m" },
      { kind:"didi",   label:"URC T4 → Brilliant Hotel, Grand Bazaar area", note:"~25–35 min · ~¥50–70" },
    ],
  },
  chengdu: {
    summary:"Urumqi → Chengdu Tianfu",
    from:"Atour Hotel, Urumqi",
    to:"YIN INN, Taikoo Li, Chengdu",
    steps:[
      { kind:"didi",   label:"Atour Hotel → URC Tianshan Airport", note:"⏰ Leave by 06:30 · ~25–35 min · ~¥50–70" },
      { kind:"flight", label:"CZ6941 · URC → CTU Tianfu T2", dep:"08:50 · Fri 24 Apr", arr:"12:45 · Fri 24 Apr · CTU Tianfu T2", note:"China Southern · Economy · 3h 55m" },
      { kind:"didi",   label:"CTU Tianfu T2 → YIN INN (Taikoo Li)", note:"~50–65 min · ~¥90–120 · ⚠️ Tianfu Airport is 50km from city — allow extra time" },
    ],
  },
  chongqing: {
    summary:"Chengdu → Chongqing (high-speed train)",
    from:"YIN INN, Taikoo Li, Chengdu",
    to:"Atour Hotel, Jiefangbei, Chongqing",
    steps:[
      { kind:"didi",  label:"YIN INN → Chengdudong Station",    note:"⏰ Leave by 11:30 · ~40–50 min · ~¥35–50" },
      { kind:"train", label:"G8645 · Chengdudong → Shapingba",  dep:"12:37 · Mon 27 Apr", arr:"14:07 · Mon 27 Apr", note:"Business Class · 1h 30m" },
      { kind:"didi",  label:"Shapingba Station → Atour Jiefangbei", note:"~25–35 min · ~¥20–30" },
    ],
  },
  guilin: {
    summary:"Chongqing → Guilin (high-speed train)",
    from:"Atour Hotel, Jiefangbei, Chongqing",
    to:"Yitian West Street Hotel, Yangshuo",
    steps:[
      { kind:"didi",  label:"Atour Jiefangbei → Chongqingxi Station", note:"⏰ Leave by 07:45 · ~30–40 min · ~¥25–35" },
      { kind:"train", label:"G905 · Chongqingxi → Guilinxi",          dep:"08:44 · Wed 29 Apr", arr:"12:38 · Wed 29 Apr", note:"Business Class · 3h 54m" },
      { kind:"didi",  label:"Guilinxi Station → Yitian West Street Hotel, Yangshuo", note:"~45–60 min · ~¥60–80 · scenic countryside ride through karst" },
    ],
  },
  guangzhou: {
    summary:"Yangshuo → Guangzhou (high-speed train)",
    from:"Yitian West Street Hotel, Yangshuo",
    to:"Vaperse Hotel, Tianhe, Guangzhou",
    steps:[
      { kind:"didi",  label:"Yitian West Street Hotel → Yangshuo Station", note:"⏰ Leave by 09:40 · ~15–20 min · ~¥15–25" },
      { kind:"train", label:"G3741 · Yangshuo → Guangzhounan",             dep:"10:20 · Sat 2 May", arr:"12:39 · Sat 2 May", note:"Business Class · 2h 19m" },
      { kind:"didi",  label:"Guangzhounan → Vaperse Hotel, Tianhe", note:"~30–40 min · ~¥40–55 · Or: Metro Line 2 → Line 3 (35–45 min)" },
    ],
  },
  shenzhen: {
    summary:"Guangzhou → Shenzhen (high-speed train)",
    from:"Vaperse Hotel, Tianhe, Guangzhou",
    to:"Renaissance Shenzhen Bay Hotel",
    steps:[
      { kind:"didi",  label:"Vaperse Hotel → Guangzhounan Station", note:"⏰ Leave by 11:30 · ~30–40 min · ~¥40–55" },
      { kind:"train", label:"G391 · Guangzhounan → Shenzhenbei",    dep:"12:28 · Mon 4 May", arr:"13:01 · Mon 4 May", note:"2nd Class · 33 min" },
      { kind:"didi",  label:"Shenzhenbei Station → Renaissance Shenzhen Bay Hotel", note:"~30–40 min · ~¥35–50" },
    ],
  },
  hongkong: {
    summary:"Shenzhen → Hong Kong (high-speed train)",
    from:"Renaissance Shenzhen Bay Hotel",
    to:"The Hari Hong Kong, Wan Chai",
    steps:[
      { kind:"didi",  label:"Renaissance Hotel → Shenzhenbei Station", note:"⏰ Leave by 12:45 · ~25–35 min · ~¥30–45" },
      { kind:"train", label:"G919 · Shenzhenbei → HK West Kowloon",    dep:"13:33 · Wed 6 May", arr:"13:52 · Wed 6 May", note:"1st Class · 19 min" },
      { kind:"didi",  label:"HK West Kowloon → The Hari, Wan Chai", note:"~20–25 min taxi · ~HK$90–130 · ⚠️ No Didi in HK — use taxi rank at West Kowloon exit" },
    ],
  },
};

// ── PACKING ───────────────────────────────────────────────────────────────────

const PACKING = [
  { cat:"👕 Tops", note:"4 sets — laundry every 3–4 days", items:[
    { item:"Breathable t-shirts",          qty:"4", why:"Daily wear — moisture-wick for humid south cities" },
    { item:"Long-sleeve light shirt",      qty:"2", why:"Xinjiang evenings + smart casual for bars" },
    { item:"Going-out shirt",              qty:"1", why:"LKF, Ozone, Bar 62, Hope & Sesame — smart casual required" },
    { item:"Thermal baselayer top",        qty:"1", why:"Pamir Plateau 4,000m+ — pack-flat, essential" },
  ]},
  { cat:"👖 Bottoms", note:"Mix of comfort + nights out", items:[
    { item:"Lightweight trousers / chinos",qty:"2", why:"Day sightseeing + evening bars" },
    { item:"Shorts",                       qty:"1", why:"Guangzhou / Shenzhen / HK — hot by May" },
    { item:"Dark jeans or trousers",       qty:"1", why:"Smarter venues and nights out" },
  ]},
  { cat:"🩲 Underwear & Socks", note:"5 sets — buffer for sweaty days", items:[
    { item:"Underwear",                    qty:"5", why:"Laundry buffer — Chongqing and Guangzhou are sweaty" },
    { item:"Ankle socks",                  qty:"5", why:"Mix thin (south) + slightly thicker (Xinjiang)" },
    { item:"Thermal underwear bottoms",    qty:"1", why:"Pamir / Karakoram days — layers fast at altitude" },
  ]},
  { cat:"👟 Footwear", note:"3 pairs max", items:[
    { item:"Cushioned walking sneakers",   qty:"1 pair", why:"10,000+ steps every day — especially brutal on Chongqing hills" },
    { item:"Sandals or slip-ons",          qty:"1 pair", why:"Spa days — constantly in and out of shoes" },
    { item:"Smart casual shoe",            qty:"1 pair", why:"Rooftop bars, The Penthouse, Ozone — smart casual venues" },
  ]},
  { cat:"🧥 Outerwear", note:"Layer system — all pack flat", items:[
    { item:"Packable waterproof rain jacket", qty:"1", why:"Guilin / Chongqing / Guangzhou — mandatory and non-negotiable" },
    { item:"Light zip fleece or puffer",     qty:"1", why:"Xinjiang cold + Chengdu cool evenings" },
    { item:"Windproof outer shell",          qty:"1", why:"Pamir Plateau — cold wind at altitude even in April" },
  ]},
  { cat:"🎒 Accessories", note:"High impact, low weight", items:[
    { item:"Sunscreen SPF 50+",    qty:"1 large", why:"Xinjiang altitude UV is extreme. Southern cities too." },
    { item:"Polarised sunglasses", qty:"1",       why:"Karakul Lake, White Sand Lake, Li River glare" },
    { item:"Buff / neck gaiter",   qty:"1",       why:"Xinjiang dust + cold wind + UV protection" },
    { item:"Beanie",               qty:"1",       why:"Pamir + Tashkurgan nights — cold" },
    { item:"Lightweight gloves",   qty:"1 pair",  why:"High altitude days — packable" },
    { item:"Crossbody bag",        qty:"1",       why:"Day use — pickpocket-resistant for markets" },
    { item:"Packable tote",        qty:"1",       why:"Shopping, laundry overflow, rafting" },
    { item:"Reusable water bottle",qty:"1",       why:"Refill at hotels — essential at altitude" },
    { item:"SPF lip balm",         qty:"2",       why:"Altitude dryness destroys lips. Bring backups." },
  ]},
  { cat:"💻 Tech", note:"China-specific requirements", items:[
    { item:"Power bank (20,000mAh)", qty:"1",  why:"Long trains + all-day city use. Over 20,000mAh banned on flights." },
    { item:"Travel adapter",         qty:"1",  why:"Australia Type I — bring adapter for shared use" },
    { item:"VPN app (pre-installed)",qty:"1",  why:"Set up before leaving — Google, Instagram and Maps blocked in China" },
    { item:"Earphones / AirPods",    qty:"1",  why:"Trains, spas, late-night transport" },
    { item:"USB-C cables",           qty:"2",  why:"One on the power bank, one in the bag" },
    { item:"Camera or phone gimbal", qty:"1",  why:"Li River, Karakul Lake, Hongyadong — cinematic trip" },
  ]},
  { cat:"💊 Health & Toiletries", note:"Travel-size where possible", items:[
    { item:"Altitude sickness tablets (Diamox)", qty:"Course", why:"Pamir reaches 4,000m+. See a GP before departing." },
    { item:"Electrolyte sachets",   qty:"10+",    why:"Chongqing + Guangzhou heat + Chongqing hills" },
    { item:"Blister plasters",      qty:"Pack",   why:"10km+ daily walking guarantees blisters" },
    { item:"Imodium / stomach tabs",qty:"Pack",   why:"Spicy food every day — prepare for the transition" },
    { item:"Antihistamines",        qty:"Pack",   why:"Xinjiang dust + new food environments" },
    { item:"Deodorant (stick)",     qty:"1",      why:"Aerosols restricted on China domestic flights" },
    { item:"Wet wipes / sanitiser", qty:"Plenty", why:"Street food, trains, markets — use constantly" },
    { item:"Travel shampoo / conditioner", qty:"×2", why:"Bring 3-day supply and refill at local supermarkets" },
    { item:"Microfibre towel",      qty:"1",      why:"Spa days, rafting — hotels don't always provide sport towels" },
  ]},
  { cat:"📄 Documents", note:"Digital + physical copies of everything", items:[
    { item:"Passport (6+ months validity)",    qty:"Each", why:"Required for hotels, trains and all border crossings" },
    { item:"Cathay Pacific tickets",           qty:"Print + phone", why:"CX134 MEL→HKG · CX998 HKG→URC · CX105 HKG→MEL" },
    { item:"CZ6941 e-ticket",                  qty:"Print + phone", why:"URC→CTU Tianfu T2 · 08:50 · 24 Apr" },
    { item:"Xinjiang tour confirmation",       qty:"Print + phone", why:"Ctrip order — tour, flights and transfers included" },
    { item:"Train booking confirmations",      qty:"Phone screenshots", why:"QR codes for Trip.com ticket collection at station machines" },
    { item:"Travel insurance details",         qty:"Print + phone", why:"Especially important for Xinjiang high-altitude activities" },
    { item:"Emergency contacts",              qty:"Physical copy",  why:"Ctrip China emergency: 95010 · Cathay Pacific AU: 131747" },
  ]},
];

// ── CITY DEBRIEFS ─────────────────────────────────────────────────────────────

const DEBRIEFS = {
  xinjiang:  { tagline:"China's Wild West — where the Silk Road still breathes",
    body:"Xinjiang is China's largest region, spanning an area bigger than Western Europe. For over 2,000 years it was the crossroads of the ancient Silk Road — the route along which silk, spices, jade and ideas moved between China, Persia, India and Rome. The Uyghur people are Turkic in origin, with culture, language, food and architecture closer to Central Asia than to eastern China. Kashgar was one of the most important oasis cities on earth — a trading post at the junction of routes heading to Pakistan, Afghanistan and Tajikistan. The Pamir Plateau is among the world's highest inhabited landscapes, where glaciers sit above 7,000m peaks and Tajik herders live in yurts.",
    knowBefore:["Xinjiang runs on Beijing Time but local life runs ~2 hrs behind — sunset at 9–10pm is normal in spring","Border pass for the Pamir area is arranged by your tour operator","WeChat Pay and Alipay essential — card machines rare outside big hotels","Uyghur music is extraordinary — seek it out at teahouses and night markets"] },
  chengdu:   { tagline:"Slow city, fast food — the capital of Sichuan and the good life",
    body:"Chengdu is one of China's oldest continuously inhabited cities. Today it's a city of 21 million that somehow moves slower than it should — Chengdu locals famously value leisure, tea and conversation above ambition. The teahouse culture is ancient and alive: parks fill with mahjong players, ear cleaners and people sitting for hours over a single pot. The food is the reason half the world visits — Sichuan's ma la (numbing-spicy) flavour profile built on Sichuan peppercorns and chillies creates a sensation found nowhere else. The giant pandas native to the mountains north of the city have made Chengdu the unlikely wildlife capital of China.",
    knowBefore:["Sichuan peppercorn numbs your mouth — don't panic, it's the point","Chengdu is overcast most days — totally normal, not bad weather","Heming Teahouse at People's Park is where locals actually go","⚠️ Tianfu Airport (CZ6941 arrival) is 50km from city — taxi to YIN INN is ~¥100–120"] },
  chongqing: { tagline:"The cyberpunk megacity that defies gravity and logic",
    body:"Chongqing is a mountain metropolis of 32 million people built at the confluence of the Yangtze and Jialing rivers, where streets exist on six different levels and monorail trains pass through apartment buildings. During World War II it served as China's wartime capital. The city's topography forced generations to build vertically, producing the layered neon skyline that looks like science fiction. Chongqing also claims the origin of hotpot — the fiery communal boiling broth that defines its food culture.",
    knowBefore:["More hills here than anywhere on this trip — grip-sole shoes essential","Chongqing hotpot is hotter than you think — order medium and work up","The monorail through the apartment building (Liziba, Line 2) runs all day","River cruise lights switch off ~10pm — book the earlier departure"] },
  guilin:    { tagline:"A landscape so perfect it was put on the money",
    body:"The karst limestone peaks of Guilin and Yangshuo have inspired Chinese painters, poets and emperors for over 1,000 years — they appear on the Chinese 20-yuan note. The Li River winding between Guilin and Yangshuo is considered one of the most beautiful river journeys on earth. The formations were created over 300 million years as ancient seabed limestone slowly dissolved into dramatic peaks. Yangshuo has evolved from a 1980s backpacker hub into a sophisticated destination without losing its karst charm.",
    knowBefore:["Li River Cruise departs Guilin ~09:30 — conflicts with 10:30 breakfast if you want the full thing","May 1 Labour Day means serious crowds — go to popular spots before 9am","Yulong River bamboo rafting is quieter and more intimate than the main Li River cruise","Yangshuo has world-class sport climbing on the limestone — Climb Yangshuo for beginners"] },
  guangzhou: { tagline:"The city that invented dim sum and never stopped eating",
    body:"Guangzhou — historically Canton — is one of China's oldest trading cities and the birthplace of Cantonese cuisine. For centuries it was China's only officially open port. The Cantonese developed a culinary culture shaped by this openness: adventurous, ingredient-obsessed, technically precise. Dim sum originated here as yum cha teahouse culture. Roast goose, wonton noodles, claypot rice, BBQ pork — the dishes the world associates with 'Chinese food' are almost all Cantonese.",
    knowBefore:["Cantonese food is subtler than Sichuan — the skill is in freshness and technique, not heat","Serious dim sum houses close by 3pm — arrive at opening time","The Pearl River Night Cruise is one of the best in China — Canton Tower lights are spectacular","Morgans British Pub on Huajiu Lu reliably shows Premier League on match days"] },
  shenzhen:  { tagline:"40 years from fishing village to the future",
    body:"In 1979, Shenzhen was a fishing village of 30,000 people. In 1980 it became China's first Special Economic Zone — an experiment in capitalism within a communist state. Today it's a city of 17 million, home to Huawei, Tencent, DJI and BYD — China's Silicon Valley. The youngest major city in China has no ancient temples or dynastic history, only the energy of perpetual reinvention: tech campuses, design districts, art villages and a skyline that seems to add towers monthly.",
    knowBefore:["Shenzhen is flat — a welcome relief after Chongqing's hills","Huaqiangbei is the world's largest electronics market — fascinating even just to walk","OCT Loft galleries are mostly free entry","TENZ Spa near Futian Port is genuinely world-class — block 3–4 hours minimum"] },
  hongkong:  { tagline:"Where East meets West and neither ever sleeps",
    body:"Hong Kong has been shaped by 155 years of British colonial rule (ending 1997) and deep Chinese cultural roots going back centuries. The result is extraordinary contrasts — Michelin-starred restaurants beside HK$40 wonton stalls; gleaming towers beside incense-filled temples. Hong Kong's food scene is arguably the finest in Asia. The skyline viewed from Kowloon or the Peak is the most recognisable in Asia. As the final stop, Hong Kong delivers a spectacular send-off: cosmopolitan, safe, English-friendly and relentlessly energetic. Premier League football is a religion here — every pub shows every match.",
    knowBefore:["Octopus Card covers all MTR, trams, Star Ferry and most buses — get one at West Kowloon immediately","No Didi in HK — use the taxi rank at West Kowloon or hail on the street","Wan Chai is ideally placed — walkable to bars, 2 MTR stops from Central","⚠️ CX105 departs 00:20 on 9 May — leave The Hari by 21:30 for airport"] },
};

// ── DAYS ─────────────────────────────────────────────────────────────────────

const DAYS = {
  xinjiang:[
    { label:"Day 1", date:"Fri 17 Apr", title:"Depart Melbourne", arrival:true, hotel:"Overnight transit — Hong Kong T1", segments:[
      { type:"travel",    time:"07:25", place:"Melbourne T2 → Hong Kong T1", what:"CX134 · Cathay Pacific · Economy · 9h 30m" },
      { type:"travel",    time:"14:55", place:"Arrive Hong Kong HKG T1",     what:"Transit overnight. Airside or airport hotel for a few hours." },
      { type:"note",      time:"",      place:"Transit note",                 what:"CX998 departs HKG T1 at 01:15 — stay airside if comfortable or get a short-stay hotel." },
    ]},
    { label:"Day 2", date:"Sat 18 Apr", title:"Arrive Urumqi — Free Day", hotel:"Brilliant Hotel, Urumqi", segments:[
      { type:"travel",    time:"01:15", place:"HKG T1 → Urumqi Tianshan T4",  what:"CX998 · Cathay Pacific · Economy · A330-300 · 5h 45m" },
      { type:"travel",    time:"07:00", place:"Arrive URC T4 → Brilliant Hotel", what:"~25–35 min taxi. Check in and rest." },
      { type:"breakfast", time:"10:30", place:"Grand Bazaar stalls",            what:"Polo rice (Uyghur lamb pilaf) or naan + lamb soup. Open-air stalls outside the bazaar." },
      { type:"coffee",    time:"~12:00", place:"Tea house near Grand Bazaar",   what:"Uyghur milk tea (奶茶 — salty, milky, served in a bowl) or rose-petal herbal tea. This is the local café culture here.", note:"Specialty coffee is limited in Urumqi — embrace the tea house experience." },
      { type:"activity",  time:"~13:00", place:"Xinjiang Regional Museum (free)", what:"Loulan Beauty 3,800yr mummy, Silk Road artefacts, ancient textiles. Allow 1.5 hrs." },
      { type:"snack",     time:"~15:00", place:"Grand Bazaar stall row",         what:"Samsa baked meat pies, fresh naan, dried apricots + walnuts — Xinjiang's finest produce." },
      { type:"massage",   time:"~16:00", place:"Hotel spa or foot massage near Grand Bazaar", what:"3–4 hrs: traditional Uyghur massage + foot reflexology. Ask hotel concierge to book. ~¥180–250." },
      { type:"bar",       time:"~20:00", place:"Rooftop tea house, Grand Bazaar", what:"Sit outside — sunset isn't until 9–10pm in Xinjiang spring. Rose-petal tea + dried fruit." },
      { type:"activity",  time:"~21:00", place:"Red Hill Park (Hongshan)",        what:"Evening walk for panoramic Urumqi skyline views. Free. Lit up at night." },
      { type:"dinner",    time:"~22:00", place:"Grand Bazaar night market",       what:"Lamb chuan'r skewers, laghman hand-pulled noodles, flatbread. Eat at the stalls." },
      { type:"latenight", time:"~00:00", place:"Night stalls, Grand Bazaar",      what:"Fried sanzi bread or spiced lamb noodles — 24hr stalls around the perimeter." },
    ]},
    { label:"Day 3", date:"Sun 19 Apr", title:"Fly to Kashgar — Tour Begins", hotel:"5-star tour hotel, Kashgar", segments:[
      { type:"note",      time:"",      place:"Departure timing",                 what:"CZ6692 departs URC 12:45 — leave hotel by 10:30 for check-in. VIP airport pickup arranged on arrival in Kashgar." },
      { type:"breakfast", time:"~09:30", place:"Hotel breakfast (Brilliant Hotel)", what:"Eat before the airport. Flight 12:45." },
      { type:"travel",    time:"12:45", place:"URC Tianshan → KHG T2",            what:"CZ6692 · China Southern · Economy · Meals included · 2h 5m · Arrive 14:50" },
      { type:"travel",    time:"14:50", place:"Arrive KHG T2 → Tour Hotel",       what:"VIP pickup arranged by tour operator. Driver meets at arrivals." },
      { type:"coffee",    time:"~16:00", place:"Oasis Coffee or old city teahouse, Kashgar", what:"Kashgar has a growing independent café scene near People's Square. Or a proper Uyghur chai teahouse with dutar music playing.", note:"Ask hotel reception for the best current café near the old city." },
      { type:"activity",  time:"~17:00", place:"Kashgar Old City",                what:"Wander 2,000yr mud-brick lanes. Id Kah Mosque at dusk. No ticket — just walk." },
      { type:"snack",     time:"~19:00", place:"Id Kah Mosque square stalls",     what:"Fresh naan, samsas, pomegranate juice. Eat where the locals eat." },
      { type:"dinner",    time:"~21:00", place:"Renmin East Road restaurants",    what:"Lamb hot pot (Xinjiang style), roast lamb ribs, grilled fish." },
      { type:"latenight", time:"~23:00", place:"Night market near the square",    what:"Spiced corn, lamb skewers, honey yoghurt." },
    ]},
    { label:"Day 4", date:"Mon 20 Apr", title:"Karakoram Highway + Lakes", hotel:"5-star tour hotel, Kashgar", fullday:true, segments:[
      { type:"note",      time:"", place:"Tour Day + Laundry Day",               what:"VIP MPV with driver. Early pickup from hotel. Pack snacks + warm layers. Drop laundry today." },
      { type:"breakfast", time:"~07:30", place:"Hotel breakfast (included)",      what:"Early start. Fuel up — limited food stops on the highway." },
      { type:"coffee",    time:"On the road", place:"Hotel flask or roadside stop", what:"Fill a flask from hotel breakfast. Embrace the journey — the scenery is the experience today." },
      { type:"activity",  time:"08:30–16:00", place:"KKH → White Sand Lake → Karakul Lake (3,600m)", what:"White Sand Lake N & S shores · Karakul Lake with Muztagh Ata (7,546m) backdrop. Drone photography throughout." },
      { type:"massage",   time:"~17:30", place:"Hotel spa, Kashgar (on return)",  what:"3–4 hrs: full body + hot soak after altitude exposure. Book ahead with hotel." },
      { type:"dinner",    time:"~22:00", place:"Kashgar restaurant",              what:"Whole roasted lamb (pre-order via hotel) or kebab house near the bazaar." },
      { type:"latenight", time:"~23:30", place:"Hotel bar or night market",       what:"Yoghurt, dried fruit or Uyghur noodle soup to wind down." },
    ]},
    { label:"Day 5", date:"Tue 21 Apr", title:"Panlong Ancient Road → Tashkurgan", hotel:"Overnight in Tashkurgan", fullday:true, segments:[
      { type:"breakfast", time:"~07:00", place:"Hotel breakfast (included)",      what:"Early start for the Panlong Road." },
      { type:"coffee",    time:"On the road", place:"Flask from hotel",           what:"Road day — no cafés on this route. Embrace it." },
      { type:"activity",  time:"08:30–18:00", place:"Panlong Road → Bandier Blue Lake → Pamir's Eye", what:"600+ hairpin bends to 4,000m+. The most dramatic road in China. Photo stops throughout." },
      { type:"snack",     time:"~13:00", place:"Packed from Kashgar",             what:"Naan + dried fruit. Pack the night before." },
      { type:"dinner",    time:"~20:00", place:"Tashkurgan local restaurant",     what:"Tajik-style: milk tea, flatbread, mutton soup, buckwheat pancakes." },
      { type:"latenight", time:"~22:00", place:"Outside under the stars",         what:"Zero light pollution at this altitude. Clearest sky of the whole trip." },
    ]},
    { label:"Day 6", date:"Wed 22 Apr", title:"Muztagh Glacier & Kashgar Old City", hotel:"5-star tour hotel, Kashgar", segments:[
      { type:"breakfast", time:"~07:00", place:"Tashkurgan guesthouse",          what:"Early start back toward Kashgar." },
      { type:"activity",  time:"~09:00", place:"Muztagh Ata Glacier Park",       what:"Walk toward No. 4 Glacier. Dramatic ice formations. Allow 2 hrs at the park." },
      { type:"coffee",    time:"~14:00", place:"Rooftop café, Kashgar old city", what:"Back in Kashgar by afternoon. Atmospheric rooftop cafés near the mosque with mud-brick skyline views.", note:"Ask hotel — new independent cafés opening constantly in Kashgar." },
      { type:"snack",     time:"~14:30", place:"Roadside stop en route",         what:"Lamb skewers from a grill or flatbread from a local family kitchen." },
      { type:"massage",   time:"~15:30", place:"Hotel spa, Kashgar",             what:"3–4 hrs: body scrub + massage + hot soak. Well earned after Pamir. Book in advance." },
      { type:"bar",       time:"~20:00", place:"Old City rooftop tea house",     what:"Mud-brick skyline views at dusk. Sit with a pot and watch the lanes quiet down." },
      { type:"activity",  time:"~21:00", place:"Kashgar Old City night walk",    what:"Oil lamps, craftsmen, copper smiths, carpet sellers in the lanes at night." },
      { type:"dinner",    time:"~22:30", place:"Night market, Kashgar",          what:"Uyghur BBQ: whole fish on skewers, lamb chops, cold noodles." },
      { type:"latenight", time:"~00:00", place:"Night market",                   what:"Fried flatbread + lamb broth — the local after-hours staple." },
    ]},
    { label:"Day 7", date:"Thu 23 Apr", title:"Depart Kashgar → Urumqi", hotel:"Atour Hotel, Urumqi (Grand Bazaar area)", segments:[
      { type:"note",      time:"",      place:"Departure timing",                 what:"CZ6804 departs KHG T2 at 11:20 — leave hotel by 09:00. CZ6941 to Chengdu tomorrow departs 08:50." },
      { type:"breakfast", time:"~08:30", place:"Hotel breakfast or Old City café", what:"Last Kashgar breakfast. Naan and chai one final time." },
      { type:"travel",    time:"11:20", place:"KHG T2 → Urumqi URC",             what:"CZ6804 · China Southern · Economy · No meals · 2 hrs · Arrive 13:20" },
      { type:"travel",    time:"13:20", place:"Arrive URC → Atour Hotel",         what:"~25–35 min taxi · ~¥50–70. Check in." },
      { type:"coffee",    time:"~14:30", place:"COSTA or local specialty café near Grand Bazaar", what:"First Western-style coffee since Melbourne. Urumqi has chain cafés near the bazaar.", note:"Enjoy it — Chengdu's coffee scene is even better." },
      { type:"activity",  time:"~15:30", place:"Grand Bazaar final shopping",     what:"Vacuum-packed lamb, walnuts, apricots, saffron — the best Xinjiang produce to take home." },
      { type:"massage",   time:"~17:00", place:"Foot massage near Grand Bazaar",  what:"3 hrs: foot reflexology + leg + back. ~¥120–180. Final Xinjiang wind-down." },
      { type:"dinner",    time:"~21:00", place:"Grand Bazaar restaurant hall",    what:"Da pan ji, laghman, polo rice, lamb ribs. Final Xinjiang feast." },
      { type:"latenight", time:"~23:00", place:"Night stalls, Grand Bazaar",      what:"Midnight lamb skewers. Set alarm — CZ6941 departs URC 08:50 tomorrow." },
    ]},
  ],

  chengdu:[
    { label:"Day 8", date:"Fri 24 Apr", title:"Arrive Chengdu", arrival:true, hotel:"YIN INN, Taikoo Li, Jinjiang District", segments:[
      { type:"breakfast", time:"~14:00", place:"Gong Zhou (5 min walk, Bib Gourmand)", what:"Chongqing-style fish in spicy bean sauce. First real Sichuan meal. Order the fish + rice.", note:"Welcome meal — treat it as lunch." },
      { type:"coffee",    time:"~15:30", place:"% Arabica (inside Taikoo Li)",     what:"Precision espresso and pour-overs from this iconic Kyoto roaster. Terrace seating inside the heritage complex.", note:"One of the best specialty coffee spots in Chengdu." },
      { type:"activity",  time:"~16:30", place:"Taikoo Li + IFS + Chunxi Road",    what:"Giant panda on the IFS building, luxury complex walk, Chunxi pedestrian street." },
      { type:"snack",     time:"~18:00", place:"Chunxi Road street stalls",         what:"Rabbit heads (Chengdu's famous snack — try one), spicy skewers, chestnut roasters." },
      { type:"massage",   time:"~19:00", place:"Golden Impression (金色印象) — 15 min taxi", what:"3–4 hrs: private room with TV + tea corner. Full body ~¥330–460 incl. unlimited drinks + buffet. Book on Meituan.", note:"Best value spa in Chengdu." },
      { type:"bar",       time:"~23:00", place:"Daci Temple bar alley (steps from hotel)", what:"Artsy bar pocket — craft cocktails, exposed brick, indie music. Lost & Found or Bar Ox." },
      { type:"dinner",    time:"~00:00", place:"Ming Ting Xiao Guan (5 min walk)", what:"Legendary fly restaurant — mapo tofu, twice-cooked pork, garlic greens. Late kitchen." },
      { type:"latenight", time:"~01:30", place:"24hr Sichuan noodle shop",          what:"Dan dan mian or zhong dumplings. Chengdu street food never sleeps." },
    ]},
    { label:"Day 9", date:"Sat 25 Apr", title:"Pandas, Culture & CSL Match Night", hotel:"YIN INN (Taikoo Li)", segments:[
      { type:"note",      time:"", place:"CSL + Panda timing",                          what:"Chengdu Rongcheng vs Zhejiang — confirmed 19:00 kickoff local time (9pm AEST). Baby panda feeding 8–9am. Wake early and go straight to the base first if you want that, then return for a late breakfast. Plenty of time for pandas + culture before the evening match." },
      { type:"breakfast", time:"10:30", place:"Chen Mapo Tofu (Qinghua Rd, Bib Gourmand) — 20 min taxi", what:"Breakfast IS mapo tofu here. Birthplace of the dish. Order tofu + rice + congee." },
      { type:"coffee",    time:"~12:00", place:"Seesaw Coffee (Taikoo Li North branch)", what:"One of China's finest specialty roasters — excellent single-origin pour-overs. Among Chengdu's best coffee destinations.", note:"Ask for the seasonal single-origin filter coffee." },
      { type:"activity",  time:"~13:00", place:"⭐ Chengdu Panda Base — 30 min taxi", what:"Giant + baby + red pandas. Bamboo forest setting. Book online — ¥55." },
      { type:"snack",     time:"~16:00", place:"Kuanzhai Alley street food — 15 min taxi", what:"Rabbit heads, sugar hawthorn sticks, red-oil dumplings, dragon whisker candy." },
      { type:"massage",   time:"~17:00", place:"Heming Teahouse People's Park → quick massage nearby", what:"Tea + ear-cleaning at People's Park (¥30, 10 min taxi), then 1–1.5 hr foot massage nearby. Keep it shorter today — match tonight.", note:"Save the long spa session for Day 10 tomorrow." },
      { type:"csl",       time:"~18:15", place:"🏟️ Phoenix Hill Football Stadium — Didi ~30 min from YIN INN", what:"Chengdu Rongcheng vs Zhejiang · CSL 2026 · Kickoff 19:00 local · Phoenix Hill Football Stadium, Jinniu District · Capacity 60,000 · League leaders at home — serious atmosphere.", note:"🎟 Book on Damai app (大麦) — search '成都蓉城'. Tickets ¥80–300. Buy before arriving in Chengdu. Leave hotel by 18:15. Expect noise, flares and an electric local crowd." },
      { type:"dinner",    time:"~22:00", place:"Hotpot near Phoenix Hill Stadium (post-match)", what:"Any local hotpot restaurant near the stadium for a post-match feast. The strip around Phoenix Hill has plenty. Or Didi back to Jiuyanqiao for Long Sen Yuan (Bib Gourmand)." },
      { type:"bar",       time:"~23:30", place:"Jiuyanqiao Bar Street — Jah Bar or Beer Nest", what:"Jah Bar (live music) or Beer Nest (Belgian craft beers, Jiuyanqiao strip). 10 min taxi from the hotpot area." },
      { type:"latenight", time:"~01:30", place:"Jiuyanqiao night stalls",            what:"Chengdu spicy cold noodles, skewers, fried tofu along the river." },
    ]},
    { label:"Day 10", date:"Sun 26 Apr", title:"Art, History & Departure Eve", hotel:"YIN INN · ⚠️ Train tomorrow 12:37 — pack tonight", segments:[
      { type:"breakfast", time:"10:30", place:"Lao Chengdu San Yang Mian (Bib Gourmand) — 20 min taxi", what:"Spicy noodles with string beans + Sichuan pepper oil. Hole-in-the-wall. Sunday breakfast Chengdu-style." },
      { type:"coffee",    time:"~12:00", place:"Grid Coffee (Jinjiang District)",   what:"Chengdu's most celebrated specialty roaster. Precise single-origins, minimal aesthetic, in-house roastery. The best independent coffee in Chengdu.", note:"Worth making time for even with a train tomorrow." },
      { type:"activity",  time:"~13:00", place:"⭐ Sanxingdui Museum — 1 hr drive", what:"3,000yr Bronze Age site. Alien-like masks, gold leaf, ivory. One of China's most extraordinary museums. Allow 2–3 hrs." },
      { type:"snack",     time:"~16:30", place:"Jinli Ancient Street — 15 min taxi", what:"Red-oil dumplings, sesame rice cakes, spicy rabbit ears. Walk + eat." },
      { type:"massage",   time:"~17:30", place:"Chi Spa (Shangri-La) or Iridium Spa (St. Regis) — 15 min taxi", what:"3–4 hrs: splurge day. Premium hotel spa — 60–90 min treatment + steam + pool." },
      { type:"bar",       time:"~21:30", place:"Yulin West Road / Third Alley — 15 min taxi", what:"Chengdu's hipster strip — folk music bars, fairy lights, outdoor tables, local crowd." },
      { type:"dinner",    time:"~23:00", place:"Zhuan Zhuan Hui (Lianhua S Rd, Bib Gourmand)", what:"Sichuan communal hotpot. Final hotpot in Chengdu." },
      { type:"latenight", time:"~01:00", place:"Beer Nest (Jiuyanqiao) — craft beers, Belgian imports", what:"Chill finish. Leave early-ish — train at 12:37 tomorrow. Leave hotel by 11:30." },
    ]},
  ],

  chongqing:[
    { label:"Day 11", date:"Mon 27 Apr", title:"Arrive Chongqing", arrival:true, hotel:"Atour Hotel, Jiefangbei / Raffles Plaza", segments:[
      { type:"breakfast", time:"~15:00", place:"Local xiaomian shop near Jiefangbei", what:"Chongqing Xiaomian — spicy noodles, ¥10–15. Point and pay. First real CQ experience.", note:"Order 中辣 (medium spice) to start." },
      { type:"coffee",    time:"~16:00", place:"Manner Coffee or M Stand (Jiefangbei)", what:"Manner is a strong Chinese specialty chain with clean espresso. M Stand has creative drinks. Look for independent cafés in the underground levels of Jiefangbei — several hidden gems.", note:"CO Coffee is Chongqing's best specialty roaster — look for a branch near the CBD." },
      { type:"activity",  time:"~17:00", place:"Jiefangbei Walking Street + Yangtze River Cableway", what:"Neon skyline walk then ride the cableway over the Yangtze (~¥10)." },
      { type:"snack",     time:"~18:30", place:"Jiaochangkou Night Market (10 min walk)", what:"Spicy grilled fish, crawfish, skewers. Standing with cold Chongqing Beer." },
      { type:"massage",   time:"~19:30", place:"ISEYA Hotel Storm Spa (58F, Yingli IFC, Jiefangbei)", what:"3–4 hrs: dramatic waterfall effect every 30 min, hot pools + full massage ~¥250. Book ahead." },
      { type:"bar",       time:"~23:30", place:"Soloist Bar (near Shibati)",         what:"Cocktail terrace. Or Hongyadong Jiuba Street for the full atmosphere." },
      { type:"activity",  time:"~00:00", place:"⭐ Hongyadong (Hongya Cave)",         what:"11-storey neon stilted complex. After dark only. Walk the riverside below for the best shot." },
      { type:"dinner",    time:"~01:00", place:"Hotpot near Jiefangbei",              what:"Chongqing má là hotpot. Tripe, beef, lotus root, tofu skin." },
      { type:"ktv",       time:"~02:30", place:"Deyi World KTV (5 min walk)",         what:"Peak neon cyberpunk. Private rooms, full bar. The one to do in Chongqing." },
      { type:"latenight", time:"~04:00", place:"Jiaochangkou stalls",                 what:"Shaokao BBQ skewers + cheap cold beer." },
    ]},
    { label:"Day 12", date:"Tue 28 Apr", title:"Cyberpunk Deep Dive", hotel:"Atour Hotel · ⚠️ G905 departs 08:44 — leave hotel 07:45, pack tonight", segments:[
      { type:"breakfast", time:"10:30", place:"Ciqikou Ancient Town — 30 min taxi",  what:"Stir-fried sticky rice (炒糍粑), sesame dumplings, warm soy milk. Quiet before afternoon crowds.", note:"Worth the taxi ride." },
      { type:"coffee",    time:"~12:00", place:"CO Coffee (Chongqing) or Ciqikou courtyard café", what:"CO Coffee is Chongqing's strongest specialty roaster. Or find an atmospheric café in an old timber courtyard building in Ciqikou.", note:"CO Coffee: the best beans in Chongqing." },
      { type:"activity",  time:"~13:00", place:"⭐ Liziba Monorail Station (Line 2)", what:"Train passes through an apartment building. Multiple trains per hour. The photo." },
      { type:"activity",  time:"~14:00", place:"Shibati (18 Steps) + Luohan Temple", what:"Crumbling stone stairway district + 500 arhat statues. ¥5 temple entry." },
      { type:"snack",     time:"~15:30", place:"Shibati street stalls",               what:"Pineapple with chilli salt, spicy tofu, Chongqing cold noodles." },
      { type:"massage",   time:"~16:30", place:"Golden Impression (CQ branch) — book Meituan", what:"3–4 hrs: private cinema room, 2.5hr massage + free-flow food + movies. Under ¥500." },
      { type:"bar",       time:"~21:00", place:"Bar 62 (62F rooftop)",               what:"Pre-cruise cocktails with bird's-eye Yangtze confluence views." },
      { type:"activity",  time:"~22:00", place:"⭐ Yangtze River Night Cruise",      what:"Full cyberpunk skyline from the water. Book early departure (lights off ~10pm). ~¥150–300.", note:"The best thing to do in Chongqing. Buy at the wharf or via Trip.com." },
      { type:"dinner",    time:"~23:30", place:"Nanbin Road riverside restaurant",   what:"After the cruise — any hotpot or fish restaurant with skyline views." },
      { type:"latenight", time:"~01:00", place:"Head back — early start tomorrow",   what:"G905 departs 08:44. Leave hotel by 07:45. Set two alarms." },
    ]},
  ],

  guilin:[
    { label:"Day 13", date:"Wed 29 Apr", title:"Arrive Yangshuo", arrival:true, hotel:"Yitian West Street Hotel, Yangshuo", segments:[
      { type:"breakfast", time:"~14:00", place:"Lucy's Cafe, West Street",           what:"Legendary backpacker institution — 25+ years. Pancakes, eggs, fresh juice. Or Guilin rice noodles at any local shop." },
      { type:"coffee",    time:"~15:30", place:"West Street rooftop café or Yangshuo Coffee", what:"Several independent cafés on West Street with rooftop karst views. Look for signs up narrow stairways — the best ones are always slightly hidden.", note:"Yangshuo's specialty coffee scene is driven by expat café owners." },
      { type:"activity",  time:"~16:30", place:"Yangshuo riverside bike ride",       what:"Hire bikes (~¥30/day) from West Street. Flat river path south — scenic, almost no traffic." },
      { type:"snack",     time:"~18:00", place:"West Street market stalls",          what:"Mifen rice noodle rolls, fried pumpkin cakes, fresh sugarcane juice pressed to order." },
      { type:"massage",   time:"~19:00", place:"West Street foot massage + hot spring soak", what:"3–4 hrs: foot massage with full-body extension + hot spring room. ~¥150–200." },
      { type:"bar",       time:"~23:00", place:"Mojo Rooftop (6F Alshan Hotel, top of West St)", what:"360° karst silhouettes + Li River. Lychee gin fizz. Best bar in Yangshuo." },
      { type:"dinner",    time:"~00:00", place:"Beer Fish restaurant, West Street",  what:"Yangshuo signature — Li River fish in local beer sauce." },
      { type:"latenight", time:"~01:30", place:"Bad Panda / Monkey Jane's (alleys off West St)", what:"Backpacker-friendly bars. Cheap drinks, pool table." },
    ]},
    { label:"Day 14", date:"Thu 30 Apr", title:"Li River & The Show", hotel:"Yitian West Street Hotel", segments:[
      { type:"note",      time:"", place:"Li River option",                          what:"⚠️ Li River Cruise departs Guilin ~09:30. Wake early and taxi to pier by 09:00 to do the full thing. Or: Yulong rafting this afternoon fits your schedule perfectly." },
      { type:"breakfast", time:"10:30", place:"Local mifen shop, West Street",       what:"Guilin rice noodles — clear pork broth with braised toppings. ¥15–20." },
      { type:"coffee",    time:"~12:00", place:"DEMO bar (Binjiang Lu) — coffee by day", what:"Craft beer bar that does decent coffee in the day. Good riverside position.", note:"Try their homemade lemonade on a hot day." },
      { type:"activity",  time:"~13:00", place:"⭐ Yulong River bamboo rafting",     what:"Book via hotel or West Street agent (~¥150). 1.5–2 hrs floating through karst. Bring waterproof bags." },
      { type:"snack",     time:"~16:00", place:"Riverside stalls at raft exit",      what:"Sugarcane juice, cold beer, fried dough. Wet and happy." },
      { type:"massage",   time:"~17:00", place:"West Street spa — full body + hot spring", what:"3–4 hrs: full-body Chinese massage + hot spring soak. ~¥200." },
      { type:"bar",       time:"~21:00", place:"The Groove (Chengbei Lu)",           what:"Newest and coolest bar in Yangshuo. Bobcat IPA, peanuts, burgers. Local + expat mix." },
      { type:"activity",  time:"~22:00", place:"⭐ Impression Liu Sanjie night show", what:"Zhang Yimou's outdoor masterpiece. 600+ performers on the Li River. 15 min from hotel. ¥198–680. Book ahead.", note:"Nothing else like this in the world." },
      { type:"dinner",    time:"~23:30", place:"West Street restaurant (post-show)", what:"Cold beer fish, stir-fried river snails, steamed rice. Open past midnight." },
      { type:"latenight", time:"~01:00", place:"TK Pub Taproom or Lichun Music Hutong", what:"TK for beers, or Lichun for live classical Chinese instruments — erhu, pipa, flute." },
    ]},
    { label:"Day 15", date:"Fri 1 May", title:"Rafting, Heights & Labour Day 🚨", hotel:"Yitian West Street Hotel · ⚠️ Train tomorrow 10:20 — leave by 09:40", segments:[
      { type:"note",      time:"", place:"Labour Day + Laundry Day",                 what:"🚨 May 1 = Labour Day. Everywhere popular will be packed — go early. Drop laundry at hotel today." },
      { type:"breakfast", time:"10:30", place:"Yangshuo Brewing Company (West Street area)", what:"Western brunch — eggs, toast, fresh juice. Good change of pace." },
      { type:"coffee",    time:"~12:00", place:"Small indie café off a West Street side alley", what:"Look for cafés up side stairs off the main strip — there are always 2–3 doing excellent pour-overs. Ask at hotel.", note:"The less obvious the entrance, the better the coffee in Yangshuo." },
      { type:"activity",  time:"~13:00", place:"Moon Hill hike (20 min ride from West St)", what:"30 min climb to natural limestone arch. Panoramic views. ~¥25 entry. Quieter in the afternoon." },
      { type:"snack",     time:"~15:00", place:"Village stall at Moon Hill base",    what:"Fresh fruit, cold drinks, sticky rice parcels from the vendor at the trailhead." },
      { type:"massage",   time:"~16:00", place:"West Street spa — full body",        what:"3 hrs: final Guilin massage. Full body. ~¥150." },
      { type:"bar",       time:"~19:00", place:"Mojo Rooftop (golden hour)",         what:"Karst peaks at sunset. Li River turns gold. Best photo of the whole trip." },
      { type:"activity",  time:"~20:30", place:"Xianggong Mountain (30 min drive)",  what:"Best photography viewpoint over Li River + karst peaks. Hire a car via hotel (~¥100 return)." },
      { type:"dinner",    time:"~22:30", place:"West Street Beer Fish restaurant",   what:"Final Yangshuo dinner. Whole fish, cold tofu, jug of local beer." },
      { type:"latenight", time:"~00:00", place:"DEMO (Binjiang Lu)",                 what:"Live music Fridays on the riverside terrace. Pack bags — taxi to Yangshuo station at 09:40 tomorrow." },
    ]},
  ],

  guangzhou:[
    { label:"Day 16", date:"Sat 2 May", title:"Arrive Guangzhou + PL Match Day", arrival:true, hotel:"Vaperse Hotel, Tianhe District", segments:[
      { type:"breakfast", time:"~14:00", place:"Cheungloi Cook (10 min taxi, Bib Gourmand)", what:"Cantonese wok classics — slow-roasted goose, clams in black bean, white-cut chicken.", note:"Order the goose — it's the signature." },
      { type:"coffee",    time:"~15:30", place:"% Arabica Guangzhou (Tianhe) or Seesaw Coffee", what:"Both have strong Tianhe locations — precision espresso in clean minimal spaces. Within easy taxi range from the hotel.", note:"Guangzhou's specialty coffee scene is excellent — don't settle for chains here." },
      { type:"activity",  time:"~16:30", place:"⭐ Canton Tower (15 min taxi)",      what:"600m tower — observation deck + outdoor sky walk + optional freefall ride. ~¥150." },
      { type:"snack",     time:"~18:30", place:"Canton Tower area snack shops",      what:"Shrimp wonton, turnip cake, cold soy milk. Classic Cantonese street snack lineup." },
      { type:"pl",        time:"~19:30", place:"⭐ Morgans British Pub (Huajiu Lu, Zhujiang New Town) — 10 min taxi", what:"The definitive PL pub in Guangzhou. Multiple screens, British pub atmosphere, full expat crowd on match days.", note:"Huajiu Lu has other sports bars nearby if Morgans is busy." },
      { type:"massage",   time:"~23:00", place:"Cinema foot massage (影院足浴) — search Meituan near Tianhe", what:"3–4 hrs: private cinema room + foot + body massage + fruit platter + tea. ~¥250–350. A Guangzhou specialty.", note:"Private cinema-room massage parlours are unique to GZ — don't miss it." },
      { type:"dinner",    time:"~02:00", place:"Dong Xing (Tianhe, Bib Gourmand)",   what:"Claypot eel rice. 30+ year institution. Late kitchen — dinner at 2am is normal in Guangzhou." },
      { type:"latenight", time:"~03:30", place:"Congee shop (粥店) near hotel",      what:"Silky congee — 皮蛋瘦肉粥 (preserved egg + pork). Open all night. ~¥20." },
    ]},
    { label:"Day 17", date:"Sun 3 May", title:"Dim Sum, Colonial & Nightlife", hotel:"Vaperse Hotel · ⚠️ Train tomorrow 12:28 — leave hotel 11:30", segments:[
      { type:"breakfast", time:"10:30", place:"⭐ Nan Yuan (Bib Gourmand, est. 1958) — 25 min taxi", what:"Cantonese dim sum in a classical garden. Har gow, char siu bao, cheung fun, banded grouper.", note:"Arrive right at 10:30 — popular on Sundays." },
      { type:"coffee",    time:"~12:30", place:"Seesaw or % Arabica (Zhujiang New Town)", what:"Post-dim-sum walk through Zhujiang New Town. Stop at one of the specialty cafés on the wide boulevards.", note:"Zhujiang has an excellent café-to-bar ratio — good strip to explore." },
      { type:"activity",  time:"~13:30", place:"⭐ Shamian Island — 30 min taxi",    what:"European colonial architecture, banyan boulevards, riverside cafes. Walk the full island (~45 min)." },
      { type:"snack",     time:"~15:30", place:"Beijing Road pedestrian street food", what:"Hawthorn sticks, fried wonton skins, Cantonese sausage. Archaeological glass floor visible underfoot." },
      { type:"massage",   time:"~16:30", place:"⭐ Yoma Space (Pazhou) — 20 min taxi", what:"3–4 hrs: viral 24hr all-inclusive. Hot springs + massage + seafood buffet + PS5 + karaoke + cinema. ~¥600–800.", note:"This is an event, not just a massage. Luggage storage available." },
      { type:"bar",       time:"~21:30", place:"Hope & Sesame (Asia's Top 50) — book ahead", what:"Hidden entrance, creative cocktail menu, intimate atmosphere. ~20 min taxi.", note:"One of Asia's best bars. Book via Instagram or WeChat. Do not skip." },
      { type:"activity",  time:"~23:30", place:"⭐ Pearl River Night Cruise",         what:"Lit Canton Tower, Haiyin Bridge, colonial buildings. ~¥50–100. Many operators run until late." },
      { type:"dinner",    time:"~01:30", place:"Hai Men Yu Zi Dian (Chaozhou seafood) — 15 min taxi", what:"Walk the tanks, point at what you want, they cook it. Raw marinated crab + live oysters." },
      { type:"latenight", time:"~03:00", place:"Congee shop near hotel",             what:"Second congee. Guangzhou does it best. Silky, slow-cooked, restorative." },
    ]},
  ],

  shenzhen:[
    { label:"Day 18", date:"Mon 4 May", title:"Arrive Shenzhen + PL Night", arrival:true, hotel:"Renaissance Shenzhen Bay Hotel", segments:[
      { type:"breakfast", time:"~14:30", place:"Shekou Taizi Road food strip — 30 min taxi", what:"International options: Japanese ramen, brunch cafes, Thai. The most diverse food strip in SZ." },
      { type:"coffee",    time:"~16:00", place:"Seesaw Coffee (Nanshan) or % Arabica Shenzhen (Futian)", what:"Seesaw Nanshan is beautifully designed — airy converted space drawing SZ's creative crowd. % Arabica Futian is more central.", note:"Shenzhen's specialty coffee scene punches well above its weight." },
      { type:"activity",  time:"~17:00", place:"⭐ OCT Loft Creative Culture Park — 25 min taxi", what:"Gallery crawl through converted industrial warehouses. Contemporary Chinese art + street murals. Free entry most galleries. 1.5–2 hrs." },
      { type:"snack",     time:"~19:00", place:"OCT Loft food options",               what:"Japanese onigiri, Korean corn dogs, fresh juice within the complex." },
      { type:"pl",        time:"~20:00", place:"Cages Sports Bar (Sea World, Shekou) or Blarney Stone Irish Pub — 30 min taxi", what:"Cages is SZ's best sports bar — multiple screens, loud atmosphere. Blarney Stone is an Irish pub nearby. Both on Shekou Taizi Road.", note:"Check May 4 fixture — Bank Holiday may mean a rearranged PL match." },
      { type:"massage",   time:"~22:30", place:"Ai Mu Spring Spa (Futian) — free shuttle from Futian Port", what:"3–4 hrs: 24hr luxury spa. Aesthetic hot tubs, movie screenings, gaming, free-flow fruit. ~¥200–250 entry." },
      { type:"dinner",    time:"~02:00", place:"Dongmen Pedestrian Street shaokao stalls", what:"Grilled skewers, oysters, corn, stinky tofu. Buzzes until well past midnight." },
      { type:"latenight", time:"~03:30", place:"24hr noodle shop near hotel",          what:"Wonton noodle soup. Always open near the hotel area." },
    ]},
    { label:"Day 19", date:"Tue 5 May", title:"Art, Tech & The Big Spa Day", hotel:"Renaissance Shenzhen Bay · ⚠️ G919 departs 13:33 — leave hotel 12:45", segments:[
      { type:"breakfast", time:"10:30", place:"Hotel breakfast or nearby dim sum",    what:"Renaissance has a solid breakfast. Or find a local dim sum shop — SZ has absorbed HK dim sum culture well." },
      { type:"coffee",    time:"~12:00", place:"% Arabica Shenzhen (Futian)",         what:"One of % Arabica's most elegant mainland China locations — worth visiting for the space as much as the coffee.", note:"Last specialty coffee before Hong Kong's equally strong scene." },
      { type:"activity",  time:"~13:00", place:"Dafen Oil Painting Village — 40 min taxi", what:"Streets of artists producing and selling oil paintings. Commission a custom portrait (~¥200–400). Allow 1.5 hrs." },
      { type:"snack",     time:"~15:00", place:"Huaqiangbei Electronics Market — 30 min taxi", what:"World's largest electronics market. Street food vendors in the alleys between malls. Pick up cables + gadgets cheap.", note:"A fascinating browse even without buying." },
      { type:"massage",   time:"~16:00", place:"⭐ TENZ Spa (Tangquan Life) — 7 min walk from Futian Port", what:"3–4 hrs minimum: 5-storey Japanese 24hr spa. Hot springs, 300 massage rooms, salt rooms, VR, arcade, unlimited Häagen-Dazs. ~¥500–600. Book on Klook.", note:"Spa highlight of the entire trip. Block the full afternoon." },
      { type:"bar",       time:"~21:00", place:"⭐ The Penthouse (38F Grand Hyatt, Luohu) — 20 min taxi", what:"Rooftop cocktails with Hong Kong visible across the bay. Smart casual. Last night on the mainland.", note:"Watch HK's lights flicker across the water." },
      { type:"activity",  time:"~22:30", place:"Shenzhen Bay Park waterfront (near hotel)", what:"Night walk along the bay promenade. Hong Kong glittering across the water. Free." },
      { type:"dinner",    time:"~23:30", place:"Shekou Taizi Road — 30 min taxi",    what:"Final mainland meal. Korean BBQ, Japanese yakitori, craft burger — whatever you've been craving." },
      { type:"latenight", time:"~01:30", place:"Sea World bars (Shekou)",            what:"Wind-down drinks. Set alarm — G919 at 13:33. Leave hotel by 12:45." },
    ]},
  ],

  hongkong:[
    { label:"Day 20", date:"Wed 6 May", title:"Arrive Hong Kong", arrival:true, hotel:"The Hari Hong Kong, Wan Chai", segments:[
      { type:"breakfast", time:"~15:30", place:"Joy Hing Roasted Meat (5 min walk from The Hari)", what:"Char siu, roast duck, crispy belly pork over rice. The welcome-to-HK meal.", note:"Queue 10–15 min. Always worth it." },
      { type:"coffee",    time:"~17:00", place:"Cupping Room (Central, 15 min MTR) or % Arabica HK", what:"Cupping Room is one of HK's finest specialty roasters — serious single-origins, knowledgeable staff. % Arabica has multiple HK locations.", note:"HK's coffee scene is world-class — you're entering serious territory now." },
      { type:"activity",  time:"~18:00", place:"⭐ Victoria Peak via Peak Tram (~HK$80 return)", what:"Panoramic 360° skyline. Best in golden hour. Walk down Old Peak Road or take the tram back." },
      { type:"activity",  time:"~19:30", place:"⭐ Star Ferry (Wan Chai pier → TST)", what:"HK$3.4 harbour crossing at dusk — both skylines lit. Best value in Asia." },
      { type:"snack",     time:"~20:30", place:"TST waterfront or Temple Street (opens ~6pm)", what:"Egg waffles (鷄蛋仔) — crispy outside, pillowy inside. Buy from a street cart and eat walking." },
      { type:"massage",   time:"~21:30", place:"Wan Chai foot massage (Lockhart Rd area)", what:"3 hrs: many walk-in shops on Lockhart + Jaffe Road. 60–90 min ~HK$250–380." },
      { type:"bar",       time:"~00:00", place:"Lan Kwai Fong — 15 min MTR",        what:"HK's most famous bar district. Walk down the hill — bars on every corner." },
      { type:"dinner",    time:"~01:00", place:"Ho Lee Fook (SoHo) — 15 min MTR",  what:"Modern Chinese. Hip, dim, excellent food. Book ahead.", note:"Crispy taro dumplings, wagyu with XO sauce." },
      { type:"latenight", time:"~03:00", place:"Wonton noodle shop, Wan Chai",      what:"Thin egg noodles, plump shrimp wontons, clear broth. The HK late-night staple. ~HK$50." },
    ]},
    { label:"Day 21", date:"Thu 7 May", title:"Markets, Dim Sum & PL Final Night", hotel:"The Hari, Wan Chai · ⚠️ CX105 departs 00:20 on 9 May — leave hotel by 21:30", segments:[
      { type:"note",      time:"", place:"PL + Dinner + Flight timing",              what:"PL typically kicks off 19:30 HK time but you have a 20:00 dinner reservation at MOSU — watch the first half at Delaney's, then walk to dinner, then airport from ~22:00. Pack bags before going out." },
      { type:"breakfast", time:"10:30", place:"Tim Ho Wan (Sham Shui Po) — 30 min MTR", what:"World's cheapest Michelin dim sum. BBQ pork buns (baked), har gow, egg tarts, cheung fun. ~HK$150 per person.", note:"Go at opening — queue builds fast." },
      { type:"coffee",    time:"~12:30", place:"Bellwood Coffee (Sheung Wan) or Omotesando Koffee (IFC, Central)", what:"Bellwood is HK's most celebrated independent roaster — the must-visit café here. Omotesando is a Japanese minimalist icon with excellent pour-overs.", note:"If you visit one specialty café in HK, make it Bellwood." },
      { type:"activity",  time:"~13:30", place:"⭐ Temple Street Night Market (Jordan) — opens midday", what:"Jade, antiques, street food, fortune tellers. One of the most authentic HK experiences. 25 min MTR. 1.5 hrs." },
      { type:"activity",  time:"~15:30", place:"Mong Kok Markets",                  what:"Ladies' Market, Sneaker Street, Goldfish Market. Walk between all three. 20 min MTR." },
      { type:"snack",     time:"~17:00", place:"Street food, Mong Kok",              what:"Curry fish balls on a skewer, siu mai from a steamer cart, cold grass jelly. Classic HK street eating." },
      { type:"massage",   time:"~17:30", place:"Wan Chai massage (Lockhart Rd area)", what:"~1.5 hrs: final massage of the trip. Keep it shorter today — dinner reservation at 20:00." },
      { type:"pl",        time:"~19:30", place:"Delaney's Irish Pub (Wan Chai, 10 min walk)", what:"Catch kickoff and the first half before dinner. Delaney's is walking distance from The Hari and a short walk to MOSU.", note:"Watch the first half, then head to MOSU for 20:00. Check the score after dinner." },
      { type:"dinner",    time:"20:00", place:"⭐ MOSU Hong Kong — reservation confirmed · 5 guests", what:"MOSU is a refined modern Korean restaurant in Hong Kong, known for clean, elegant flavours and an exceptional tasting experience. Reservation confirmed — Thu 7 May · 20:00 · 5 guests.", note:"Address: MOSU Hong Kong. Reservation confirmed via SevenRooms. Allow ~2 hrs for the full experience. Smart casual at minimum." },
      { type:"ktv",       time:"~22:30", place:"Tai Lung Fung (Wan Chai, 5 min walk) — farewell drinks", what:"Retro Wan Chai bar. Cheap cold beers, very local feel. Quick farewell round.", note:"⏰ Leave for airport by 21:30 if catching Airport Express. Or taxi straight from dinner ~HK$350." },
      { type:"travel",    time:"⏰ Leave The Hari by 21:30", place:"The Hari → HKG Airport T1", what:"Airport Express from Hong Kong Station (15 min MTR + 24 min express). Or taxi ~HK$350. Allow 2.5 hrs for 00:20 departure." },
      { type:"travel",    time:"00:20 (Sat 9 May)", place:"HKG T1 → Melbourne T2",  what:"CX105 · Cathay Pacific · Economy · 8h 55m · Arrive MEL T2 11:15 on 9 May" },
    ]},
    { label:"Day 22", date:"Fri 8 May", title:"Final Day in Hong Kong", hotel:"The Hari Hong Kong, Wan Chai", segments:[
      { type:"note",      time:"", place:"Late checkout + flight tonight",             what:"CX105 departs 00:20 on 9 May. Full day free in Hong Kong. Check out by 12:00 — ask The Hari to hold luggage. Light day, save energy for the overnight flight home." },
      { type:"breakfast", time:"10:30", place:"Kam's Roast Goose (5 min walk from The Hari)", what:"Crispy roast goose over rice. Michelin-recommended, always queues, always worth it. Last proper HK meal of the morning.", note:"If Kam's has a wait, Joy Hing Roasted Meat is equally excellent next door." },
      { type:"coffee",    time:"~12:00", place:"% Arabica HK (various) or Cupping Room (Central)", what:"One final specialty coffee. % Arabica has multiple HK locations — the IFC branch in Central is worth the MTR ride." },
      { type:"activity",  time:"~13:00", place:"Wan Chai neighbourhood explore — on foot", what:"PMQ creative hub (Sheung Wan, 15 min MTR) · Cat Street antique shops · Man Mo Temple incense coils. Or just walk Wan Chai's side streets — dim sum shops, herbalists, old signage." },
      { type:"snack",     time:"~15:30", place:"Street food, Wan Chai / Sheung Wan area", what:"Egg waffles from a cart, pineapple bun from a local bakery, cold grass jelly (凉粉). Eat and wander." },
      { type:"massage",   time:"~16:30", place:"Wan Chai foot massage (Lockhart Rd area)", what:"Final massage of the trip. 90 min full body while luggage stays at The Hari. One last relaxed afternoon.", note:"Walk-in shops on Lockhart + Jaffe Rd. ~HK$280–380." },
      { type:"dinner",    time:"~19:30", place:"Hung's Delicacies (10 min walk from The Hari)", what:"Chiu Chow braised meats — 50+ year chef. Low-key, exceptional, unpretentious. Perfect final dinner before a long flight.", note:"Or: Mak's Noodle (Central) for classic shrimp wonton noodles if you want something lighter before flying." },
      { type:"bar",       time:"~21:00", place:"Ozone Bar (118F ICC, West Kowloon) — on the way to airport", what:"Highest bar in Hong Kong. One farewell round with the city spread below. 30 min MTR from Wan Chai — conveniently on the way to West Kowloon for the Airport Express.", note:"Or stay local in Wan Chai — The Wanch or Tai Lung Fung. Either way, collect luggage from The Hari and head airport-side by 21:30." },
      { type:"travel",    time:"⏰ Collect luggage + leave by 21:30", place:"The Hari → HKG Airport T1", what:"Airport Express from Hong Kong Station (15 min MTR + 24 min express, or take it from West Kowloon after Ozone). Taxi ~HK$350. Allow 2.5 hrs before midnight departure." },
      { type:"travel",    time:"00:20 (Sat 9 May)", place:"HKG T1 → Melbourne T2",  what:"CX105 · Cathay Pacific · Economy · 8h 55m · Arrive MEL T2 11:15 on 9 May. That's it — 22 days done. 🦘" },
    ]},
  ],
};

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function TravelCard({ cityId, color }) {
  const d = TRAVEL_IN[cityId]; if (!d) return null;
  const [open, setOpen] = useState(false);
  const KC = { flight:T.fl, train:T.tr, didi:T.dd, gap:T.faint };
  const KI = { flight:"✈️", train:"🚄", didi:"🚕", gap:"💤" };
  return (
    <div style={{ marginBottom:12, border:`1px solid ${color}38`, borderRadius:6, background:"#0f0e0b", overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"11px 13px", display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left" }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.14em", color, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:2 }}>Getting Here</div>
          <div style={{ fontSize:12, color:T.h2, fontFamily:"sans-serif" }}>{d.summary}</div>
        </div>
        <span style={{ color:T.faint, fontSize:9, marginLeft:8 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ padding:"0 13px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", gap:8, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>From</div>
              <div style={{ fontSize:11, color:T.sub, fontFamily:"sans-serif" }}>{d.from}</div>
            </div>
            <span style={{ color, fontSize:14, paddingTop:12 }}>→</span>
            <div style={{ flex:1, textAlign:"right" }}>
              <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:2 }}>To</div>
              <div style={{ fontSize:11, color:T.h2, fontFamily:"sans-serif" }}>{d.to}</div>
            </div>
          </div>
          {d.steps.map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:10, marginBottom:9, alignItems:"flex-start" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, minWidth:34 }}>
                <span style={{ fontSize:15 }}>{KI[s.kind]}</span>
                {i < d.steps.length-1 && <div style={{ width:1, height:18, background:T.border }}/>}
              </div>
              <div style={{ flex:1, background:T.bg1, border:`1px solid ${KC[s.kind]}28`, borderLeft:`2px solid ${KC[s.kind]}`, borderRadius:"0 4px 4px 0", padding:"8px 10px" }}>
                <div style={{ fontSize:11, color:KC[s.kind], fontFamily:"sans-serif", fontWeight:"bold", marginBottom: s.dep?4:2 }}>{s.label}</div>
                {s.dep && <div style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif", marginBottom:2 }}>🛫 {s.dep}</div>}
                {s.arr && <div style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif", marginBottom:4 }}>🛬 {s.arr}</div>}
                <div style={{ fontSize:11, color:T.muted, fontFamily:"sans-serif", lineHeight:1.5 }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SegmentRow({ seg, color }) {
  const icon  = SI[seg.type]  || "•";
  const label = SL[seg.type] || seg.type;
  const muted = seg.type === "note" || seg.type === "travel";
  const isPL  = seg.type === "pl";
  const isCSL = seg.type === "csl";
  return (
    <div style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:`1px solid ${T.bg}`, alignItems:"flex-start" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, minWidth:44 }}>
        <span style={{ fontSize:15 }}>{icon}</span>
        <span style={{ fontSize:7, color: isPL ? T.pl : isCSL ? "#e0a020" : muted ? T.faint : color, fontFamily:"sans-serif", letterSpacing:"0.04em", textTransform:"uppercase", textAlign:"center", lineHeight:1.2 }}>{label}</span>
      </div>
      <div style={{ flex:1 }}>
        {seg.time && <div style={{ fontSize:9, color:T.faint, fontFamily:"sans-serif", marginBottom:1 }}>{seg.time}</div>}
        <div style={{ fontSize:12, color: muted ? "#a08060" : isPL ? "#8aca8a" : isCSL ? "#f0c040" : T.h2, fontFamily:"sans-serif", fontWeight:"bold", marginBottom:2 }}>{seg.place}</div>
        <div style={{ fontSize:12, color:T.body, lineHeight:1.65 }}>{seg.what}</div>
        {seg.note && <div style={{ marginTop:3, fontSize:11, color:"#7ab07a", fontFamily:"sans-serif", fontStyle:"italic" }}>💡 {seg.note}</div>}
      </div>
    </div>
  );
}

function DayCard({ day, color, collapseKey, collapseAll }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(!collapseAll); }, [collapseKey]);
  return (
    <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:6, overflow:"hidden", marginBottom:8 }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"11px 13px", display:"flex", alignItems:"center", gap:9, textAlign:"left" }}>
        <span style={{ background:color+"22", color, padding:"2px 8px", borderRadius:2, fontSize:9, fontFamily:"sans-serif", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{day.label}</span>
        <span style={{ flex:1 }}>
          <span style={{ fontSize:12, color:T.h2, display:"block", fontFamily:"sans-serif" }}>{day.title}</span>
          <span style={{ fontSize:9, color:T.faint, fontFamily:"sans-serif" }}>{day.date}{day.hotel ? ` · 🏨 ${day.hotel}` : ""}</span>
        </span>
        {day.arrival && <span style={{ fontSize:8, background:"#2a1e10", color:T.accent, padding:"2px 6px", borderRadius:2, fontFamily:"sans-serif" }}>ARRIVAL</span>}
        <span style={{ color:T.faint, fontSize:9 }}>{open?"▲":"▼"}</span>
      </button>
      {open && <div style={{ padding:"0 13px 8px" }}>{day.segments.map((s,i)=><SegmentRow key={i} seg={s} color={color}/>)}</div>}
    </div>
  );
}

function CityDebrief({ cityId, color }) {
  const d = DEBRIEFS[cityId]; if (!d) return null;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom:12, border:`1px solid ${color}25`, borderLeft:`3px solid ${color}`, borderRadius:"0 6px 6px 0", background:"#111009", overflow:"hidden" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"11px 13px", display:"flex", justifyContent:"space-between", alignItems:"center", textAlign:"left" }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.12em", color, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:2 }}>City Debrief</div>
          <div style={{ fontSize:12, color:T.h2, fontFamily:"sans-serif", fontStyle:"italic" }}>{d.tagline}</div>
        </div>
        <span style={{ color:T.faint, fontSize:9, marginLeft:8 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ padding:"0 13px 13px" }}>
          <p style={{ fontSize:12, color:T.sub, lineHeight:1.8, margin:"0 0 12px" }}>{d.body}</p>
          <div style={{ fontSize:9, letterSpacing:"0.12em", color, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:7 }}>Know Before You Go</div>
          {d.knowBefore.map((k,i)=>(
            <div key={i} style={{ display:"flex", gap:7, marginBottom:5 }}>
              <span style={{ color, fontSize:10 }}>→</span>
              <span style={{ fontSize:11, color:T.body, fontFamily:"sans-serif", lineHeight:1.5 }}>{k}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#00000096", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:12 }} onClick={onClose}>
      <div style={{ background:"#1a1510", border:`1px solid ${T.border}`, borderRadius:8, padding:18, maxWidth:700, width:"100%", maxHeight:"90vh", overflow:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ color:T.accent, fontFamily:"sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase" }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── SUMMARY VIEW ──────────────────────────────────────────────────────────────

function SummaryView({ onNavigate }) {
  const [packOpen, setPackOpen] = useState(false);
  return (
    <div>
      {/* Plan box — cities + days only */}
      <div style={{ background:"linear-gradient(160deg,#1c1408 0%,#0e0d0b 100%)", border:`1px solid ${T.border2}`, borderRadius:8, padding:"18px 16px", marginBottom:16 }}>
        <div style={{ fontSize:9, letterSpacing:"0.2em", color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:6 }}>22 Days · 7 Cities · 17 April — 9 May 2026</div>
        <div style={{ fontSize:10, color:T.muted, fontFamily:"sans-serif", letterSpacing:"0.04em", marginBottom:16 }}>Melbourne → Hong Kong → Xinjiang → Chengdu → Chongqing → Guilin → Guangzhou → Shenzhen → Hong Kong → Melbourne</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {OVERVIEW.map((o,i)=>(
            <button key={i} onClick={()=>onNavigate(o.city)}
              style={{ background:"#0e0d0b", border:`1px solid ${o.color}30`, borderRadius:5, padding:"10px 12px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=o.color+"70"}
              onMouseLeave={e=>e.currentTarget.style.borderColor=o.color+"30"}>
              <span style={{ fontSize:18 }}>{o.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:T.h2, fontFamily:"sans-serif" }}>{o.label}</div>
                <div style={{ fontSize:9, color:o.color, fontFamily:"sans-serif", marginTop:1 }}>{o.dates}</div>
                <div style={{ fontSize:9, color:T.faint, fontFamily:"sans-serif" }}>{o.nights} nights</div>
              </div>
              <span style={{ color:o.color, fontSize:12 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* City highlights */}
      <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:10 }}>What's On</div>
      {OVERVIEW.map((o,i)=>(
        <button key={i} onClick={()=>onNavigate(o.city)}
          style={{ width:"100%", background:T.bg1, border:`1px solid ${T.border}`, borderRadius:6, padding:"12px 13px", marginBottom:8, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"flex-start", gap:11 }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=o.color+"50"}
          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:48 }}>
            <span style={{ fontSize:20 }}>{o.emoji}</span>
            <span style={{ fontSize:8, background:o.color+"20", color:o.color, padding:"1px 5px", borderRadius:2, fontFamily:"sans-serif" }}>{o.dates}</span>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, color:T.h1, fontFamily:"sans-serif", marginBottom:5 }}>{o.label}</div>
            {o.highlights.map((b,j)=>(
              <div key={j} style={{ display:"flex", gap:5 }}>
                <span style={{ color:o.color, fontSize:9 }}>·</span>
                <span style={{ fontSize:11, color:T.body, fontFamily:"sans-serif", lineHeight:1.65 }}>{b}</span>
              </div>
            ))}
          </div>
          <span style={{ color:o.color, fontSize:13, marginTop:2 }}>→</span>
        </button>
      ))}

      {/* Transport */}
      <div style={{ fontSize:9, letterSpacing:"0.18em", color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:10, marginTop:8 }}>Flights & Trains</div>
      <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:6, overflow:"hidden", marginBottom:14 }}>
        {TRANSPORT.map((t,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 13px", borderBottom: i<TRANSPORT.length-1 ? `1px solid ${T.bg}`:"none" }}>
            <span style={{ fontSize:12 }}>{t.kind==="flight"?"✈️":"🚄"}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:T.h2, fontFamily:"sans-serif" }}>{t.label}</div>
              <div style={{ fontSize:9, color:T.muted, fontFamily:"sans-serif" }}>{t.note}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color: t.kind==="flight" ? T.fl : T.tr, fontFamily:"sans-serif" }}>{t.no}</div>
              <div style={{ fontSize:9, color:T.faint, fontFamily:"sans-serif" }}>{t.date}</div>
              <div style={{ fontSize:9, color:T.sub, fontFamily:"sans-serif" }}>{t.dep} → {t.arr}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Laundry */}
      <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:6, padding:"12px 13px", marginBottom:14 }}>
        <div style={{ fontSize:9, letterSpacing:"0.15em", color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:7 }}>🧺 Laundry Schedule (every 3–4 days)</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
          {["Day 4 — Kashgar hotel","Day 8 — YIN INN, Chengdu","Day 12 — Atour, Chongqing","Day 15 — Yitian, Yangshuo","Day 19 — Renaissance, Shenzhen"].map((d,i)=>(
            <div key={i} style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:3, padding:"4px 9px", fontSize:10, color:T.sub, fontFamily:"sans-serif" }}>{d}</div>
          ))}
        </div>
        <div style={{ fontSize:10, color:T.muted, fontFamily:"sans-serif" }}>All hotels offer laundry service. YIN INN + Atour have self-service machines. Budget ¥30–80 per load. Pack 4–5 sets of each core item.</div>
      </div>

      {/* Packing */}
      <button onClick={()=>setPackOpen(o=>!o)}
        style={{ width:"100%", background:T.bg1, border:`1px solid ${T.border}`, borderRadius: packOpen?"6px 6px 0 0":"6px", padding:"12px 13px", cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:9, letterSpacing:"0.15em", color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:2 }}>🎒 Full Packing List</div>
          <div style={{ fontSize:11, color:T.body, fontFamily:"sans-serif" }}>All activities covered · laundry every 3–4 days · spa days included</div>
        </div>
        <span style={{ color:T.faint, fontSize:12 }}>{packOpen?"▲":"▼"}</span>
      </button>
      {packOpen && (
        <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderTop:"none", borderRadius:"0 0 6px 6px", padding:"0 13px 14px" }}>
          {PACKING.map((cat,ci)=>(
            <div key={ci} style={{ marginTop:16 }}>
              <div style={{ fontSize:10, letterSpacing:"0.1em", color:T.accent, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:7 }}>
                {cat.cat} <span style={{ color:T.faint, letterSpacing:0, textTransform:"none", fontSize:9 }}>— {cat.note}</span>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"sans-serif" }}>
                  <thead>
                    <tr style={{ background:T.bg2 }}>
                      {["Item","Qty","Why it matters"].map(h=>(
                        <th key={h} style={{ padding:"6px 9px", textAlign:"left", fontSize:9, color:T.faint, letterSpacing:"0.08em", textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item,ii)=>(
                      <tr key={ii} style={{ borderBottom:`1px solid ${T.bg}`, background: ii%2===0 ? T.bg1 : "#131008" }}>
                        <td style={{ padding:"7px 9px", fontSize:12, color:T.h2 }}>{item.item}</td>
                        <td style={{ padding:"7px 9px", fontSize:12, color:T.accent, whiteSpace:"nowrap" }}>{item.qty}</td>
                        <td style={{ padding:"7px 9px", fontSize:11, color:T.body, lineHeight:1.5 }}>{item.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── JOURNEYS DATA ─────────────────────────────────────────────────────────────

const JOURNEYS = [
  {
    id:"mel-urc", label:"Melbourne → Urumqi", days:"Day 1–2 · 17–18 Apr",
    from:"Home", to:"Brilliant Hotel, Urumqi (Grand Bazaar area)",
    leaveBy:"⏰ Leave for airport by 05:30 on Fri 17 Apr",
    arriveAt:"Arrive hotel ~08:00 Sat 18 Apr (after Didi from airport)",
    snacks:{ needed:true, advice:"Pack snacks + entertainment for ~19 hrs of total travel. Eat a solid meal before boarding CX134." },
    legs:[
      { kind:"didi",   from:"Home",          to:"Melbourne Airport T2",
        time:"~30–45 min",  cost:"~A$40–60",
        note:"Allow 2.5 hrs before 07:25 departure for check-in and security." },
      { kind:"flight", label:"CX134",        carrier:"Cathay Pacific",
        dep:"07:25 · Fri 17 Apr · Melbourne T2", arr:"14:55 · Fri 17 Apr · Hong Kong T1",
        duration:"9h 30m",  class:"Economy",  ref:"FHGVJ2",
        baggage:"1PC checked bag included" },
      { kind:"wait",   label:"Overnight transit — Hong Kong",
        note:"~10 hr layover. Stay airside Terminal 1 or book a short-stay airport hotel. CX998 departs T1 at 01:15 — allow 1.5 hrs to get back through security." },
      { kind:"flight", label:"CX998",        carrier:"Cathay Pacific · A330-300",
        dep:"01:15 · Sat 18 Apr · Hong Kong T1", arr:"07:00 · Sat 18 Apr · Urumqi Tianshan T4",
        duration:"5h 45m",  class:"Economy Essential",  ref:"FHGVJ2",
        baggage:"2PC × 23kg + 7kg cabin bag" },
      { kind:"didi",   from:"URC Tianshan T4", to:"Brilliant Hotel, Grand Bazaar area",
        time:"~25–35 min",  cost:"~¥50–70",
        note:"Taxi rank at T4 exit. Or book Didi before landing." },
    ],
  },
  {
    id:"urc-khg", label:"Urumqi → Kashgar", days:"Day 3 · 19 Apr",
    from:"Brilliant Hotel, Urumqi", to:"5-star tour hotel, Kashgar",
    leaveBy:"⏰ Leave hotel by 10:30 on Sun 19 Apr",
    arriveAt:"Arrive tour hotel ~15:30 (VIP pickup included)",
    snacks:{ needed:false, advice:"Meals included on CZ6692. No snacks needed — eat hotel breakfast before leaving." },
    legs:[
      { kind:"didi",   from:"Brilliant Hotel, Urumqi", to:"URC Tianshan Airport",
        time:"~25–35 min",  cost:"~¥50–70",
        note:"Depart hotel 10:30. Check-in closes 11:45." },
      { kind:"flight", label:"CZ6692",       carrier:"China Southern",
        dep:"12:45 · Sun 19 Apr · URC Tianshan", arr:"14:50 · Sun 19 Apr · KHG T2",
        duration:"2h 5m",   class:"Economy", ref:"Ctrip #1128143923804640",
        baggage:"8kg carry-on + 20kg checked · Meals included" },
      { kind:"transfer", label:"VIP airport pickup",
        note:"Driver meets at KHG T2 arrivals — part of the Ctrip tour package. Zero waiting." },
    ],
  },
  {
    id:"khg-urc", label:"Kashgar → Urumqi", days:"Day 7 · 23 Apr",
    from:"5-star tour hotel, Kashgar", to:"Atour Hotel, Urumqi (Grand Bazaar area)",
    leaveBy:"⏰ Leave hotel by 09:00 on Thu 23 Apr",
    arriveAt:"Arrive Atour Hotel ~14:00",
    snacks:{ needed:true, advice:"No meals on CZ6804. Pick up something at the Kashgar hotel breakfast or grab naan from the old city before leaving." },
    legs:[
      { kind:"didi",   from:"Tour hotel, Kashgar", to:"KHG Laining International T2",
        time:"~20–30 min",  cost:"~¥30–50",
        note:"Leave by 09:00. Check-in closes 10:20." },
      { kind:"flight", label:"CZ6804",       carrier:"China Southern",
        dep:"11:20 · Thu 23 Apr · KHG T2", arr:"13:20 · Thu 23 Apr · URC Tianshan",
        duration:"2h",      class:"Economy", ref:"Ctrip #1128143923804640",
        baggage:"8kg carry-on + 20kg checked · No meals" },
      { kind:"didi",   from:"URC Tianshan", to:"Atour Hotel, Grand Bazaar area",
        time:"~25–35 min",  cost:"~¥50–70",  note:"Didi from terminal exit." },
    ],
  },
  {
    id:"urc-ctu", label:"Urumqi → Chengdu", days:"Day 8 · 24 Apr",
    from:"Atour Hotel, Urumqi", to:"YIN INN, Taikoo Li, Chengdu",
    leaveBy:"⏰ Leave hotel by 06:30 on Fri 24 Apr",
    arriveAt:"Arrive YIN INN ~14:00",
    snacks:{ needed:true, advice:"Grab breakfast at the hotel before leaving — very early start. Pack a snack for the long Didi after landing. Tianfu Airport is 50km from the city." },
    legs:[
      { kind:"didi",   from:"Atour Hotel, Urumqi", to:"URC Tianshan Airport",
        time:"~25–35 min",  cost:"~¥50–70",
        note:"Leave 06:30 sharp. Check-in closes 07:50." },
      { kind:"flight", label:"CZ6941",       carrier:"China Southern",
        dep:"08:50 · Fri 24 Apr · URC Tianshan", arr:"12:45 · Fri 24 Apr · CTU Tianfu T2",
        duration:"3h 55m",  class:"Economy", ref:"NXB1WY",
        baggage:"8kg carry-on + 20kg checked" },
      { kind:"didi",   from:"CTU Tianfu T2", to:"YIN INN, Taikoo Li, Jinjiang District",
        time:"~50–65 min",  cost:"~¥90–120",
        note:"⚠️ Tianfu Airport is 50km from city — this is a long taxi. Have the hotel address in Chinese ready." },
    ],
  },
  {
    id:"ctu-cq", label:"Chengdu → Chongqing", days:"Day 11 · 27 Apr",
    from:"YIN INN, Taikoo Li, Chengdu", to:"Atour Hotel, Jiefangbei, Chongqing",
    leaveBy:"⏰ Leave hotel by 11:30 on Mon 27 Apr",
    arriveAt:"Arrive Atour Hotel ~14:45",
    snacks:{ needed:false, advice:"Only 1.5 hrs in Business class — on-board service available. No need to pack snacks." },
    legs:[
      { kind:"didi",   from:"YIN INN, Taikoo Li", to:"Chengdudong Station",
        time:"~40–50 min",  cost:"~¥35–50",
        note:"Leave 11:30. Collect tickets at station machine using booking QR code — allow 20 min." },
      { kind:"train",  label:"G8645",        carrier:"China Railway",
        dep:"12:37 · Mon 27 Apr · Chengdudong", arr:"14:07 · Mon 27 Apr · Shapingba",
        duration:"1h 30m",  class:"Business Class", ref:"Trip.com #1167729273601708",
        note:"Tickets collected via QR code at station machines. Sale opens Mon 13 Apr 08:45." },
      { kind:"didi",   from:"Shapingba Station", to:"Atour Hotel, Jiefangbei / Raffles Plaza",
        time:"~25–35 min",  cost:"~¥20–30",  note:"Didi from station exit. 10 min walk to Raffles Sky Bridge." },
    ],
  },
  {
    id:"cq-gl", label:"Chongqing → Guilin", days:"Day 13 · 29 Apr",
    from:"Atour Hotel, Jiefangbei, Chongqing", to:"Yitian West Street Hotel, Yangshuo",
    leaveBy:"⏰ Leave hotel by 07:45 on Wed 29 Apr",
    arriveAt:"Arrive Yitian West Street Hotel ~13:30",
    snacks:{ needed:true, advice:"Nearly 4 hrs on the train. Pick up food at Chongqingxi station convenience store before boarding, or bring snacks from the hotel." },
    legs:[
      { kind:"didi",   from:"Atour Jiefangbei, Chongqing", to:"Chongqingxi Station",
        time:"~30–40 min",  cost:"~¥25–35",
        note:"Leave 07:45. Collect tickets at Chongqingxi station machines on arrival." },
      { kind:"train",  label:"G905",         carrier:"China Railway",
        dep:"08:44 · Wed 29 Apr · Chongqingxi", arr:"12:38 · Wed 29 Apr · Guilinxi",
        duration:"3h 54m",  class:"Business Class", ref:"Trip.com #1167729331512196",
        note:"Sale opens Wed 15 Apr 11:00. Long scenic stretch through Guizhou hills." },
      { kind:"didi",   from:"Guilinxi Station", to:"Yitian West Street Hotel, Yangshuo",
        time:"~45–60 min",  cost:"~¥60–80",
        note:"Long scenic Didi through karst countryside — your first views of the limestone peaks. Worth staying awake for." },
    ],
  },
  {
    id:"gl-gz", label:"Yangshuo → Guangzhou", days:"Day 16 · 2 May",
    from:"Yitian West Street Hotel, Yangshuo", to:"Vaperse Hotel, Tianhe, Guangzhou",
    leaveBy:"⏰ Leave hotel by 09:40 on Sat 2 May",
    arriveAt:"Arrive Vaperse Hotel ~13:30",
    snacks:{ needed:false, advice:"2.5 hrs in Business class — light service on board. Quick trip, no need to pack extra." },
    legs:[
      { kind:"didi",   from:"Yitian West Street Hotel, Yangshuo", to:"Yangshuo Station",
        time:"~15–20 min",  cost:"~¥15–25",
        note:"Leave 09:40. Station is close — but collect tickets first (allow 15 min)." },
      { kind:"train",  label:"G3741",        carrier:"China Railway",
        dep:"10:20 · Sat 2 May · Yangshuo", arr:"12:39 · Sat 2 May · Guangzhounan",
        duration:"2h 19m",  class:"Business Class", ref:"Trip.com #1167729331515905",
        note:"Sale opens Sat 18 Apr 17:30." },
      { kind:"didi",   from:"Guangzhounan Station", to:"Vaperse Hotel, Tianhe District",
        time:"~30–40 min",  cost:"~¥40–55",
        note:"Or: Metro Line 2 → Line 3 (~35 min, cheaper). Exit at Tianhe Sports Centre." },
    ],
  },
  {
    id:"gz-sz", label:"Guangzhou → Shenzhen", days:"Day 18 · 4 May",
    from:"Vaperse Hotel, Tianhe, Guangzhou", to:"Renaissance Shenzhen Bay Hotel",
    leaveBy:"⏰ Leave hotel by 11:30 on Mon 4 May",
    arriveAt:"Arrive Renaissance ~13:45",
    snacks:{ needed:false, advice:"Only 33 minutes on the train. No snacks needed." },
    legs:[
      { kind:"didi",   from:"Vaperse Hotel, Tianhe", to:"Guangzhounan Station",
        time:"~30–40 min",  cost:"~¥40–55",
        note:"Leave 11:30. Collect tickets at Guangzhounan station machines." },
      { kind:"train",  label:"G391",         carrier:"China Railway",
        dep:"12:28 · Mon 4 May · Guangzhounan", arr:"13:01 · Mon 4 May · Shenzhenbei",
        duration:"33 min",  class:"2nd Class", ref:"Trip.com #1167729331581566",
        note:"Sale opens Mon 20 Apr 10:15. Short hop — get a window seat and watch the PRD landscape." },
      { kind:"didi",   from:"Shenzhenbei Station", to:"Renaissance Shenzhen Bay Hotel",
        time:"~30–40 min",  cost:"~¥35–50",  note:"Didi from station exit." },
    ],
  },
  {
    id:"sz-hk", label:"Shenzhen → Hong Kong", days:"Day 20 · 6 May",
    from:"Renaissance Shenzhen Bay Hotel", to:"The Hari Hong Kong, Wan Chai",
    leaveBy:"⏰ Leave hotel by 12:45 on Wed 6 May",
    arriveAt:"Arrive The Hari ~14:20",
    snacks:{ needed:false, advice:"19 minutes on the train. No snacks needed. Grab a coffee at the Shenzhen hotel before leaving." },
    legs:[
      { kind:"didi",   from:"Renaissance Shenzhen Bay Hotel", to:"Shenzhenbei Station",
        time:"~25–35 min",  cost:"~¥30–45",
        note:"Leave 12:45. Immigration clearance at Shenzhenbei — allow 20 min for China exit + HK entry." },
      { kind:"train",  label:"G919",         carrier:"China Railway",
        dep:"13:33 · Wed 6 May · Shenzhenbei", arr:"13:52 · Wed 6 May · HK West Kowloon",
        duration:"19 min",  class:"1st Class", ref:"Trip.com #1167729331582143",
        note:"Sale opens Wed 22 Apr 09:15. Cross-border immigration happens at both ends." },
      { kind:"taxi",   from:"HK West Kowloon", to:"The Hari Hong Kong, Wan Chai",
        time:"~20–25 min",  cost:"~HK$90–130",
        note:"⚠️ No Didi in Hong Kong. Use the red taxi rank at the West Kowloon exit — do not use unlicensed touts. Or: MTR to Wan Chai (~15 min, HK$10)." },
    ],
  },
  {
    id:"hk-mel", label:"Hong Kong → Melbourne", days:"Day 22 · 7–9 May",
    from:"The Hari Hong Kong, Wan Chai", to:"Melbourne Airport T2",
    leaveBy:"⏰ Leave hotel by 21:30 on Thu 7 May",
    arriveAt:"Land Melbourne T2 · 11:15 Sat 9 May",
    snacks:{ needed:true, advice:"9 hr overnight flight. Pack headphones, a neck pillow and your own snacks if you're a light sleeper. Cathay has solid meals on board but extras help." },
    legs:[
      { kind:"transfer", label:"The Hari → HKG Airport T1",
        note:"Option A: MTR to Hong Kong Station (15 min) + Airport Express (24 min) — buy ticket at MTR station. Option B: Taxi ~HK$350. Leave hotel 21:30. Check-in closes ~22:20." },
      { kind:"flight", label:"CX105",        carrier:"Cathay Pacific",
        dep:"00:20 · Sat 9 May · HKG T1", arr:"11:15 · Sat 9 May · MEL T2",
        duration:"8h 55m",  class:"Economy", ref:"FHGVJ2",
        baggage:"1PC checked bag included" },
    ],
  },
];

// ── JOURNEY GUIDE COMPONENT ───────────────────────────────────────────────────

function JourneyGuide() {
  const kindIcon  = { flight:"✈️", train:"🚄", didi:"🚕", taxi:"🚖", transfer:"🤝", wait:"💤" };
  const kindColor = { flight:T.fl, train:T.tr, didi:T.dd, taxi:T.dd, transfer:"#7a8a6a", wait:T.faint };
  const [open, setOpen] = useState(JOURNEYS.map(() => false));
  const toggle = (i) => setOpen(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div>
      <div style={{ fontSize:9, letterSpacing:"0.15em", color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", marginBottom:12 }}>
        Tap any journey to expand full details
      </div>
      {JOURNEYS.map((j, ji) => (
        <div key={ji} style={{ marginBottom:10, border:`1px solid ${open[ji] ? T.accent+"40" : T.border}`, borderRadius:7, overflow:"hidden", transition:"border-color 0.2s" }}>

          {/* Collapsed header — always visible */}
          <button onClick={() => toggle(ji)} style={{ width:"100%", background: open[ji] ? T.bg2 : T.bg1, border:"none", cursor:"pointer", padding:"12px 14px", textAlign:"left", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:T.h1, fontFamily:"sans-serif", fontWeight:"bold" }}>{j.label}</div>
              <div style={{ display:"flex", gap:10, marginTop:3, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, color:T.accent, fontFamily:"sans-serif" }}>{j.days}</span>
                <span style={{ fontSize:10, color:"#f0c060", fontFamily:"sans-serif" }}>{j.leaveBy.replace("⏰ ","⏰ ")}</span>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:9, color:T.muted, fontFamily:"sans-serif" }}>{j.from.split(",")[0]}</div>
              <div style={{ fontSize:9, color:T.accent, fontFamily:"sans-serif" }}>→ {j.to.split(",")[0]}</div>
            </div>
            <span style={{ color:T.faint, fontSize:11, marginLeft:6 }}>{open[ji]?"▲":"▼"}</span>
          </button>

          {/* Expanded detail */}
          {open[ji] && (
            <div style={{ borderTop:`1px solid ${T.border}` }}>
              {/* Arrive + from/to + snacks */}
              <div style={{ padding:"10px 14px", background:T.bg2, borderBottom:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>From</div>
                    <div style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif" }}>{j.from}</div>
                  </div>
                  <span style={{ color:T.accent, fontSize:14 }}>→</span>
                  <div style={{ flex:1, textAlign:"right" }}>
                    <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase", letterSpacing:"0.05em" }}>To</div>
                    <div style={{ fontSize:10, color:T.h2, fontFamily:"sans-serif" }}>{j.to}</div>
                  </div>
                </div>
                <div style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif", marginBottom:8 }}>🏁 {j.arriveAt}</div>
                <div style={{ padding:"7px 10px", background: j.snacks.needed ? "#1a1a0a" : "#0a140a", border:`1px solid ${j.snacks.needed ? "#4a4010" : "#1a3a1a"}`, borderRadius:4 }}>
                  <span style={{ fontSize:10, color: j.snacks.needed ? "#d0b040" : "#60a060", fontFamily:"sans-serif" }}>
                    {j.snacks.needed ? "🥪 Pack snacks — " : "✅ No snacks needed — "}
                  </span>
                  <span style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif" }}>{j.snacks.advice}</span>
                </div>
              </div>

              {/* Legs */}
              <div style={{ padding:"12px 14px" }}>
                {j.legs.map((leg, li) => (
                  <div key={li} style={{ display:"flex", gap:10, marginBottom: li < j.legs.length-1 ? 10 : 0, alignItems:"flex-start" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:30 }}>
                      <div style={{ width:26, height:26, borderRadius:"50%", background:kindColor[leg.kind]+"22", border:`1px solid ${kindColor[leg.kind]}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>
                        {kindIcon[leg.kind] || "•"}
                      </div>
                      {li < j.legs.length-1 && <div style={{ width:1, flex:1, minHeight:12, background:T.border, margin:"3px 0" }}/>}
                    </div>

                    <div style={{ flex:1, background:T.bg, border:`1px solid ${kindColor[leg.kind]}25`, borderLeft:`2px solid ${kindColor[leg.kind]}`, borderRadius:"0 5px 5px 0", padding:"9px 11px" }}>

                      {(leg.kind==="didi"||leg.kind==="taxi") && (
                        <>
                          <div style={{ fontSize:11, color:kindColor[leg.kind], fontFamily:"sans-serif", fontWeight:"bold", marginBottom:3 }}>
                            {leg.kind==="didi" ? "🚕" : "🚖"} {leg.from} → {leg.to}
                          </div>
                          <div style={{ display:"flex", gap:10, marginBottom:3, flexWrap:"wrap" }}>
                            {leg.time && <span style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif" }}>⏱ {leg.time}</span>}
                            {leg.cost && <span style={{ fontSize:10, color:T.accent, fontFamily:"sans-serif" }}>💴 {leg.cost}</span>}
                          </div>
                          {leg.note && <div style={{ fontSize:11, color:T.body, fontFamily:"sans-serif", lineHeight:1.55 }}>{leg.note}</div>}
                        </>
                      )}

                      {(leg.kind==="transfer"||leg.kind==="wait") && (
                        <>
                          <div style={{ fontSize:11, color:kindColor[leg.kind], fontFamily:"sans-serif", fontWeight:"bold", marginBottom:3 }}>{leg.label}</div>
                          {leg.note && <div style={{ fontSize:11, color:T.body, fontFamily:"sans-serif", lineHeight:1.55 }}>{leg.note}</div>}
                        </>
                      )}

                      {leg.kind==="flight" && (
                        <>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:4, marginBottom:6 }}>
                            <div style={{ fontSize:13, color:T.fl, fontFamily:"sans-serif", fontWeight:"bold" }}>{leg.label}</div>
                            <div style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif" }}>{leg.carrier}</div>
                          </div>
                          <div style={{ display:"flex", gap:4, alignItems:"center", marginBottom:6 }}>
                            <div>
                              <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase" }}>Dep</div>
                              <div style={{ fontSize:10, color:T.h2, fontFamily:"sans-serif" }}>{leg.dep}</div>
                            </div>
                            <div style={{ flex:1, borderTop:`1px dashed ${T.border}`, margin:"0 4px" }}/>
                            <div style={{ fontSize:9, color:T.muted, fontFamily:"sans-serif", whiteSpace:"nowrap" }}>{leg.duration}</div>
                            <div style={{ flex:1, borderTop:`1px dashed ${T.border}`, margin:"0 4px" }}/>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase" }}>Arr</div>
                              <div style={{ fontSize:10, color:T.h2, fontFamily:"sans-serif" }}>{leg.arr}</div>
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            <span style={{ fontSize:9, color:T.muted, fontFamily:"sans-serif", background:T.bg2, padding:"2px 7px", borderRadius:3 }}>{leg.class}</span>
                            {leg.ref && <span style={{ fontSize:9, color:T.accent, fontFamily:"sans-serif", background:T.bg2, padding:"2px 7px", borderRadius:3 }}>Ref: {leg.ref}</span>}
                            {leg.baggage && <span style={{ fontSize:9, color:T.sub, fontFamily:"sans-serif", background:T.bg2, padding:"2px 7px", borderRadius:3 }}>{leg.baggage}</span>}
                          </div>
                        </>
                      )}

                      {leg.kind==="train" && (
                        <>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:4, marginBottom:6 }}>
                            <div style={{ fontSize:13, color:T.tr, fontFamily:"sans-serif", fontWeight:"bold" }}>{leg.label}</div>
                            <div style={{ fontSize:10, color:T.sub, fontFamily:"sans-serif" }}>{leg.carrier}</div>
                          </div>
                          <div style={{ display:"flex", gap:4, alignItems:"center", marginBottom:6 }}>
                            <div>
                              <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase" }}>Dep</div>
                              <div style={{ fontSize:10, color:T.h2, fontFamily:"sans-serif" }}>{leg.dep}</div>
                            </div>
                            <div style={{ flex:1, borderTop:`1px dashed ${T.border}`, margin:"0 4px" }}/>
                            <div style={{ fontSize:9, color:T.muted, fontFamily:"sans-serif", whiteSpace:"nowrap" }}>{leg.duration}</div>
                            <div style={{ flex:1, borderTop:`1px dashed ${T.border}`, margin:"0 4px" }}/>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontSize:8, color:T.faint, fontFamily:"sans-serif", textTransform:"uppercase" }}>Arr</div>
                              <div style={{ fontSize:10, color:T.h2, fontFamily:"sans-serif" }}>{leg.arr}</div>
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom: leg.note ? 6 : 0 }}>
                            <span style={{ fontSize:9, color:T.muted, fontFamily:"sans-serif", background:T.bg2, padding:"2px 7px", borderRadius:3 }}>{leg.class}</span>
                            {leg.ref && <span style={{ fontSize:9, color:T.accent, fontFamily:"sans-serif", background:T.bg2, padding:"2px 7px", borderRadius:3 }}>{leg.ref}</span>}
                          </div>
                          {leg.note && <div style={{ fontSize:11, color:T.body, fontFamily:"sans-serif", lineHeight:1.55 }}>{leg.note}</div>}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


const APPS_LIST = [
  { name:"Alipay",            note:"Payments — set up in Australia before departure" },
  { name:"Alipay Transport",  note:"Transit QR codes for metro & bus" },
  { name:"WeChat Pay",        note:"Backup payments + many services require it" },
  { name:"Didi",              note:"Ride-hailing — use this constantly on mainland" },
  { name:"Amap (Gaode)",      note:"Chinese Google Maps — works perfectly in China" },
  { name:"Google Translate",  note:"Download offline Chinese language pack before leaving" },
  { name:"Trip.com",          note:"Trains, flights, hotel bookings" },
  { name:"Meituan",           note:"Food delivery, spa bookings, restaurant reviews" },
  { name:"Dianping",          note:"Chinese Yelp — local restaurant ratings" },
  { name:"Little Red Book",   note:"Best social recommendations for hidden gems" },
  { name:"Damai (大麦)",      note:"Football, concerts and show tickets" },
  { name:"Klook",             note:"English-friendly activities and spa discounts" },
  { name:"Cathay Pacific App",note:"Boarding passes, flight status and gate info" },
  { name:"Pleco",             note:"Best Chinese dictionary" },
];

export default function App() {
  const [activeCity, setActiveCity] = useState("summary");
  const [modal, setModal] = useState(null);
  const [collapseAll, setCollapseAll] = useState(true);
  const [collapseKey, setCollapseKey] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef(null);

  const city = CITIES.find(c => c.id === activeCity);
  const days = DAYS[activeCity] || [];
  const C    = city.color;

  const toggleCollapse = () => {
    setCollapseAll(prev => {
      const next = !prev;
      setCollapseKey(k => k + 1);
      return next;
    });
  };

  const handleScroll = (e) => {
    setShowBackToTop(e.target.scrollTop > 300);
  };

  const scrollToTop = () => {
    if (contentRef.current) contentRef.current.scrollTo({ top:0, behavior:"smooth" });
  };

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:T.bg, fontFamily:"'Georgia','Times New Roman',serif", color:T.h1 }}>

      {modal==="apps" && (
        <Modal title="Install Before You Leave" onClose={()=>setModal(null)}>
          {APPS_LIST.map((a,i)=>(
            <div key={i} style={{ padding:"7px 0", borderBottom: i<APPS_LIST.length-1 ? `1px solid ${T.bg}`:"none" }}>
              <div style={{ fontSize:12, color:T.h2, fontFamily:"sans-serif" }}>{a.name}</div>
              <div style={{ fontSize:10, color:T.muted, fontFamily:"sans-serif" }}>{a.note}</div>
            </div>
          ))}
        </Modal>
      )}

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${T.border}`, padding:"13px 14px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <div style={{ fontSize:8, letterSpacing:"0.2em", color:T.faint, textTransform:"uppercase", fontFamily:"sans-serif", marginBottom:2 }}>Travel Guide</div>
          <h1 style={{ margin:0, fontSize:19, fontWeight:"normal", color:T.h1 }}>China <span style={{ color:T.accent }}>2026</span></h1>
        </div>
        <button onClick={()=>setModal("apps")} style={{ background:T.bg2, border:`1px solid ${T.border}`, color:T.accent, padding:"5px 9px", borderRadius:3, cursor:"pointer", fontFamily:"sans-serif", fontSize:10 }}>📱 Apps</button>
      </div>

      {/* City Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, overflowX:"auto", scrollbarWidth:"none", flexShrink:0 }}>
        {CITIES.map(c=>(
          <button key={c.id} onClick={()=>{ setActiveCity(c.id); setCollapseAll(true); setCollapseKey(k=>k+1); }} style={{
            background:"none", border:"none", cursor:"pointer",
            padding:"9px 11px 7px", display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            borderBottom: activeCity===c.id ? `2px solid ${c.color}` : "2px solid transparent",
            opacity: activeCity===c.id ? 1 : 0.38, whiteSpace:"nowrap", minWidth:60, transition:"opacity 0.15s", flexShrink:0,
          }}>
            <span style={{ fontSize:14 }}>{c.emoji}</span>
            <span style={{ fontSize:9, fontFamily:"sans-serif", color: activeCity===c.id ? c.color : T.sub }}>{c.label}</span>
            <span style={{ fontSize:7, color:T.faint, fontFamily:"sans-serif" }}>{c.dates}</span>
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div ref={contentRef} onScroll={handleScroll} style={{ flex:1, overflowY:"auto", position:"relative" }}>
        <div style={{ maxWidth:800, margin:"0 auto", padding:"14px 12px 80px" }}>

          {activeCity === "summary" && <SummaryView onNavigate={setActiveCity} />}

          {activeCity === "transport" && (
            <>
              <div style={{ marginBottom:14, paddingBottom:10, borderBottom:`1px solid #7a6a8a25` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:19 }}>🚄</span>
                  <h2 style={{ margin:0, fontWeight:"normal", fontSize:16, color:T.h1 }}>Journey Guide</h2>
                  <span style={{ background:"#7a6a8a22", color:"#9a8aaa", padding:"2px 8px", borderRadius:2, fontSize:9, fontFamily:"sans-serif" }}>All legs</span>
                </div>
                <div style={{ fontSize:11, color:T.muted, fontFamily:"sans-serif", marginTop:5 }}>Hotel to hotel — tap any journey to expand full details</div>
              </div>
              <JourneyGuide />
            </>
          )}

          {CITY_IDS.includes(activeCity) && (
            <>
              <div style={{ marginBottom:13, paddingBottom:10, borderBottom:`1px solid ${C}18`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:19 }}>{city.emoji}</span>
                  <h2 style={{ margin:0, fontWeight:"normal", fontSize:16, color:T.h1 }}>{city.label}</h2>
                  <span style={{ background:C+"22", color:C, padding:"2px 8px", borderRadius:2, fontSize:9, fontFamily:"sans-serif", letterSpacing:"0.05em" }}>{city.dates}</span>
                </div>
                <button onClick={toggleCollapse} style={{ background:T.bg2, border:`1px solid ${T.border}`, color:T.sub, padding:"5px 10px", borderRadius:3, cursor:"pointer", fontFamily:"sans-serif", fontSize:10 }}>
                  {collapseAll ? "Expand All ▼" : "Collapse All ▲"}
                </button>
              </div>
              <TravelCard cityId={activeCity} color={C} />
              <CityDebrief cityId={activeCity} color={C} />
              {days.map((day,i) => <DayCard key={i} day={day} color={C} collapseAll={collapseAll} collapseKey={collapseKey} />)}
              <button onClick={()=>setActiveCity("summary")} style={{ marginTop:14, width:"100%", background:"none", border:`1px solid ${T.border}`, borderRadius:5, padding:"9px", cursor:"pointer", color:T.muted, fontFamily:"sans-serif", fontSize:11 }}>
                ← Back to Summary
              </button>
            </>
          )}
        </div>

        {/* Back to top */}
        {showBackToTop && (
          <button onClick={scrollToTop} style={{
            position:"fixed", bottom:24, right:16, background:T.accent, border:"none", color:"#0e0d0b",
            borderRadius:"50%", width:40, height:40, cursor:"pointer", fontSize:16, display:"flex",
            alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px #00000060", zIndex:100,
          }}>↑</button>
        )}
      </div>
    </div>
  );
}

