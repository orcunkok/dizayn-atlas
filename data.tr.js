/* Design Language Atlas: Turkish content. Entries are keyed by their English name in data.js.
   An entry missing here falls back to English. Eras are translated by rule (see era below), so new
   entries only need: [Turkish name, feel, traits, look up]. */
window.ATLAS_TR = (() => {
  const REGIONS = {
    TR: "Türkiye ve Anadolu", JP: "Japonya", EA: "Çin ve Kore", SA: "Güney ve Güneydoğu Asya",
    ME: "İslam dünyası ve Orta Doğu", EU: "Avrupa", AM: "Amerika", AF: "Afrika", GL: "Küresel ve dijital",
  };
  const KINDS = {
    Idea: "Estetik fikir", Movement: "Akım", Craft: "Zanaat ve malzeme",
    Architecture: "Mimari", Graphic: "Grafik ve yazı", Era: "Dönem ve üslup",
  };

  // "16th c." → "16. yy.", "1920s" → "1920’ler", "c. 600 BCE" → "yak. MÖ 600"
  const WORDS = { today: "bugün", medieval: "Orta Çağ", ancient: "Antik Çağ", "pre-Columbian": "Kolomb öncesi", Edo: "Edo dönemi" };
  const DECADE = { 0: "ler", 1: "lar", 2: "ler", 3: "lar", 4: "lar", 5: "ler", 6: "lar", 7: "ler", 8: "ler", 9: "lar" };
  const era = (s) => {
    if (s === "centuries–today") return "yüzyıllardır";
    if (s === "everyday") return "gündelik";
    const bce = / BCE$/.test(s);
    let t = s.replace(/ BCE$/, "");
    const circa = /^c\. /.test(t);
    t = t.replace(/^c\. /, "")
      .replace(/(\d+)(st|nd|rd|th)/g, "$1.")
      .replace(/ c\./g, " yy.")
      .replace(/\b(\d{4})s\b/g, (m, y) => y + "’" + DECADE[y[2]])
      .replace(/pre-Columbian|medieval|ancient|today|Edo/g, (w) => WORDS[w]);
    return (circa ? "yak. " : "") + (bce ? "MÖ " : "") + t;
  };

  // [Turkish name, feel, traits, look up]
  const E = {
    "Göbekli Tepe & Neolithic Anatolia": ["Göbekli Tepe ve Neolitik Anadolu", "Dünyanın en eski anıtsal sanatı: tilki, yaban domuzu ve akbaba kabartmalı T biçimli taş dikilitaşlar.", "Kireçtaşı, alçak kabartma, dikilitaş halkaları, Çatalhöyük’te aşı boyalı duvar resimleri.", "Göbekli Tepe dikilitaşları, Çatalhöyük duvar resimleri, Karahan Tepe"],
    "Hittite relief": ["Hitit kabartması", "Canlı kayaya oyulmuş tanrı alayları; ağır ve kendinden emin.", "Bazalt ve kaya yüzeyi kabartması, güneş kursları, aslanlar, bronz sancaklar.", "Yazılıkaya, Alaca Höyük güneş kursları, Hattuşa Aslanlı Kapı"],
    "Byzantine mosaic": ["Bizans mozaiği", "Mum ışığında parıldayan altın tesseralar; düz, cepheden, kutsal figürler.", "Altın zemin, cam tesseralar, derin maviler ve morlar, yürüdükçe hareket eden ışık.", "Ayasofya mozaikleri, Kariye mozaikleri, Ravenna"],
    "Cappadocian rock-cut": ["Kapadokya kaya oyma mimarisi", "Yumuşak volkanik kayaya oyulmuş, karanlıkta boyanmış odalar.", "Tüf taşı, mağara içleri, küçük açıklıklar, aşı ve mavi freskler.", "Göreme Açık Hava Müzesi, Karanlık Kilise, Derinkuyu"],
    "Seljuk stone geometry": ["Selçuklu taş geometrisi", "Sade taş yapılar ve coşkulu oymalı taç kapılar.", "Kesme taş, derin kabartma, yıldız çokgenler, mukarnas, içte firuze ve siyah çini.", "Divriği Ulu Camii, Sivas Gök Medrese, Karatay Medresesi, Sultanhanı"],
    "İznik çini": ["İznik çinisi", "Sırlı çinide Osmanlı çiçek bahçesi: laleler, karanfiller, saz yaprakları.", "Parlak beyaz üzerinde kobalt, firuze, kabarık domates kırmızısı ve adaçayı yeşili.", "Rüstem Paşa Camii, Topkapı Sünnet Odası"],
    "Saz style": ["Saz üslubu", "Ejder ve kuşların çevresinde kıvrılan uzun, tırtıklı yaprakların mürekkep çizimleri.", "İnce çizgi, hareket, melez yaratıklar, çoğunlukla yalnızca siyah mürekkep.", "Şahkulu, saz yolu çizimleri, Topkapı albümleri"],
    "Hat: Ottoman calligraphy": ["Hat: Osmanlı hat sanatı", "Mimari gibi ele alınan yazı: harfler bir bina gibi istiflenip dengelenir.", "Sülüs ve celî yazılar, istif kompozisyonları, aharlı kâğıt, siyah ve altın.", "Şeyh Hamdullah, Hafız Osman, Mustafa Rakım, celî levha"],
    "Tuğra": ["Tuğra", "Padişahın imzası; belki de ilk logo sistemi.", "Uzun dikeyler, geniş kavisler, lacivert üzerine altın, her belgede tek bir işaret.", "Kanuni Sultan Süleyman’ın tuğrası, Osmanlı fermanları"],
    "Tezhip: illumination": ["Tezhip", "Sayfayı çerçeveleyen altın ve lacivert bezeme; yoğun ama kusursuz düzenli.", "Rumi ve hatayi motifleri, varak altın, lacivert, simetrik kenarlar.", "Kara Memi, Topkapı yazmaları"],
    "Ottoman miniature": ["Osmanlı minyatürü", "Düz, kuşbakışı anlatım: bütün şehirler ve şenlikler yukarıdan görülür.", "Perspektif yok, haritalanmış mekân, çok sayıda küçük figür, parlak mineral renkler.", "Matrakçı Nasuh şehir haritaları, Levnî’nin Surname-i Vehbi’si, Nakkaş Osman"],
    "Ottoman court textiles": ["Osmanlı saray kumaşları", "İri, cesur motifli kaftanlar ve kadifeler. Çintemani bugünün grafiği gibi okunur.", "Çintemani (üç benek ve kaplan çizgisi), ogival ağlar, kırmızı ipek ve altın.", "Topkapı kaftanları, çatma kadife, kemha"],
    "Ebru: paper marbling": ["Ebru", "Suyun üzerinde yüzen ve kâğıda alınan renk; her yaprak tek bir an.", "Akışkan damarlar, taraklı desenler, sıvıyla çizilen çiçekler.", "Necmeddin Okyay, Mustafa Düzgünman"],
    "Karagöz shadow theatre": ["Karagöz gölge oyunu", "Işıklı perdeye bastırılmış renkli, yarı saydam figürler: gölge ve ışıkla komedi.", "Arkadan aydınlatılmış deve derisi, doygun saydam renkler, cesur siluetler, beyaz perde.", "Hacivat ve Karagöz figürleri, gölge oyunu"],
    "Kilim & Anatolian weaving": ["Kilim ve Anadolu dokumacılığı", "Her biri bir anlam taşıyan geometrik motifler: bereket, koruma, kurt ağzı.", "Elibelinde, koçboynuzu, göz, kurt ağzı; kökboya kırmızısı, çivit, ceviz kahvesi, cehri sarısı.", "Konya kilimleri, Vakıflar Halı Müzesi"],
    "Oya & yazma": ["Oya ve yazma", "Yazmanın kenarını süsleyen minik iğne oyası çiçekleri; elle kalıp basılmış kumaş.", "Minyatür üç boyutlu çiçekler, kalıpla basılmış pamuk, yumuşak kırmızılar ve yeşiller.", "İğne oyası, Tokat yazması"],
    "Mimar Sinan": ["Mimar Sinan", "Yarım kubbelere dökülen kubbeler; sakin, eşit ışıkla dolu iç mekânlar.", "Kurşun gri kubbeler, kalem minareler, taş, yüzlerce pencere.", "Süleymaniye, Selimiye, Şehzade Camii"],
    "Hammam": ["Hamam", "Küçük cam yıldızlarla delinmiş bir kubbenin altında mermer ve buhar.", "Fil gözü ışıklıklar, sıcak göbek taşı, ılık mermer, buğuda ışık huzmeleri.", "Çemberlitaş Hamamı, Kılıç Ali Paşa Hamamı"],
    "Ottoman wooden house": ["Osmanlı ahşap evi", "Üst katları sokağa taşan, ortasında sofa olan ahşap evler.", "Cumbalar, kafesler, sofalı plan, boyalı tavanlar; Sedad Hakkı Eldem’in modern yorumu.", "Safranbolu evleri, Boğaziçi yalıları, Sedad Hakkı Eldem"],
    "Tulip Era": ["Lale Devri", "Osmanlı zevki yumuşar ve şenlenir: çeşmeler, bahçeler, vazoda çiçekler.", "Pastel boyalar, çiçekli panolar, Osmanlı süslemesiyle buluşan Barok kıvrımlar.", "III. Ahmed Çeşmesi, Levnî"],
    "Mevlevi sema": ["Mevlevi seması", "Sema töreni: beyaz tennureler, dönen tek bir daire, neyin uzun nefesi.", "Beyaz, keçe sikkeler, dairesel hareket, hareketin içindeki dinginlik.", "Mevlana Müzesi Konya, ney"],
    "Hüzün": ["Hüzün", "Orhan Pamuk’un anlattığı İstanbul’un ortak melankolisi: ağırlığı olan güzellik.", "Siyah beyaz şehir, Boğaz’da sis, solgun ahşap köşkler, akşamüstü vapurlar.", "Pamuk’un İstanbul: Hatıralar ve Şehir kitabı, Ara Güler fotoğrafları"],
    "Keyif": ["Keyif", "Acelesiz zevk: çay, bir manzara, yetişilecek bir yer olmaması.", "Çay bardağı, güneş ışığı, çınar gölgesi, yavaş zaman.", "Çay bahçesi, Türk çay kültürü"],
    "Early Republic modernism": ["Erken Cumhuriyet modernizmi", "Yeni bir ulus kendini sade geometri ve Ankara taşıyla inşa eder.", "Yalın klasisizm, düz damlar, yeni kurumlar, harf devrimi.", "Clemens Holzmeister’in Ankara yapıları, Bruno Taut, Seyfi Arkan"],
    "Republican commercial art": ["Cumhuriyet dönemi ticari sanatı", "Modernleşen bir ülke için elle çizilmiş ilanlar ve afişler.", "Düz illüstrasyon, kendinden emin harfler, sıcak ve sınırlı mürekkepler.", "İhap Hulusi Görey, Münif Fehim"],
    "Turkish modern graphic design": ["Türk modern grafik tasarımı", "Yeni bir kuşaktan cesur tipografik afişler ve kitap kapakları.", "Güçlü tipografi, geometrik soyutlama, sınırlı renk, yerel motiflerle İsviçre etkisi.", "Mengü Ertel, Yurdaer Altıntaş, Sait Maden, Bülent Erkmen"],
    "Folk modernism": ["Halk modernizmi", "Ressamlar Anadolu motiflerini modern sanata katar.", "Halk desenleri, mozaikler, düzleştirilmiş biçimler, zengin renk.", "Bedri Rahmi Eyüboğlu, D Grubu, Abidin Dino, Fahrelnissa Zeid"],
    "Yeşilçam posters": ["Yeşilçam afişleri", "Elle boyanmış sinema afişleri: büyük yüzler, büyük duygular.", "Doygun boya, el yazısı harfler, melodram, dramatik ışık.", "Yeşilçam afiş ressamları"],
    "Bosphorus everyday": ["Boğaz’ın gündelik hâli", "Sıradan İstanbul’un tasarımı: vapurlar, çay bardakları, simit tezgâhları, Arnavut kaldırımı.", "Siyah bacalı beyaz vapurlar, lale biçimli çay bardağı, deniz ışığı.", "Şehir Hatları vapurları, ince belli çay bardağı, Ara Güler"],
    "Anatolian folk objects": ["Anadolu halk eşyaları", "Kullanılmak ve sevilmek için yapılmış şeyler: bakır, mavi cam, boyalı seramik.", "Dövme bakır, nazar mavisi, Beykoz çeşm-i bülbül camı, Kütahya seramiği.", "Nazar boncuğu, Beykoz camı, Kütahya çinisi"],

    "Wabi-sabi": ["Wabi-sabi", "Kusurlu, geçici ve tamamlanmamış olandaki güzellik.", "Kaba kil, patina, asimetri, sessiz renk, yaşın izleri.", "Leonard Koren, Raku çay kâseleri, Sen no Rikyū"],
    "Ma": ["Ma", "Anlamlı boşluk: çevresindekine biçim veren duraklama.", "Aralık, sessizlik, malzeme olarak boşluk, zamanlama.", "Arata Isozaki’nin Ma sergisi, Noh sahnesi"],
    "Shibui": ["Shibui", "İnce ve göze batmayan, baktıkça zenginleşen güzellik.", "Tek bir sessiz derinliği olan kırık renk, yalın biçim, ince doku.", "Yanagi Sōetsu"],
    "Yūgen": ["Yūgen", "Görülmekten çok hissedilen derin, gizemli bir zarafet.", "Sis, alacakaranlık, yarı görülen biçimler, söylemek yerine sezdirmek.", "Zeami ve Noh, Hasegawa Tōhaku’nun Çam Ağaçları"],
    "In Praise of Shadows": ["Gölgeye Övgü", "Tanizaki’nin denemesi: Japon güzelliği loş ışıkta, lakeda ve kâğıtta yaşar.", "Karanlık, gölgede parlayan altın, lake, yarı saydam shoji, mum ışığı.", "Jun'ichirō Tanizaki, urushi lake"],
    "Ukiyo-e": ["Ukiyo-e", "Yüzen dünyanın ağaç baskıları: dalgalar, oyuncular, manzaralar.", "Düz renk, güçlü kontur, Prusya mavisi, cesur çaprazlar.", "Hokusai’nin Büyük Dalga’sı, Hiroshige, Utamaro"],
    "Rinpa": ["Rinpa", "Altın varak, cesur biçimler ve yakın plan doğayla süslemeci resim.", "Altın ve gümüş zeminler, süsenler, dalgalar, birikmiş mürekkep.", "Ogata Kōrin’in Süsenleri, Tawaraya Sōtatsu’nun Rüzgâr ve Gök Gürültüsü Tanrıları"],
    "Sumi-e": ["Sumi-e", "Tek fırça, tek mürekkep, pek çok gri: siste dağlar ve çamlar.", "Mürekkep lavi, beyaz boşluk, tek fırça darbeleri, siyahın tonları.", "Sesshū, Hasegawa Tōhaku"],
    "Mingei": ["Mingei", "Halk zanaatı: bilinmeyen ellerin yaptığı dürüst, kullanışlı eşyalar.", "Taşçini, çivit, ahşap, doğal sırlar, tekrar, kullanım.", "Yanagi Sōetsu, Hamada Shōji, Bernard Leach"],
    "Sukiya & the tea house": ["Sukiya ve çay evi", "Rustik incelik: ince ahşap, kâğıt bölmeler, tablo gibi çerçevelenmiş bahçeler.", "Boyasız ahşap, tatami, shoji, tokonoma nişi, ödünç manzara.", "Katsura İmparatorluk Villası, Tai-an çay odası"],
    "Yakisugi": ["Yakisugi", "Kömürleştirilmiş sedir kaplama: ateşle korunan, siyah ve gümüş ahşap.", "Timsah derisi gibi kömür dokusu, siyah ahşap, eskime, derin doku.", "Shou sugi ban, Terunobu Fujimori"],
    "Kamon": ["Kamon", "Aile armaları: bitki ve nesnelerden çizilmiş binlerce yuvarlak amblem.", "Daireler, katı simetri, tek renk, stilize doğa.", "Japon aile armaları"],
    "Shibori & aizome": ["Shibori ve aizome", "Yumuşak, ritmik desenler yapan çivit boya ve rezerv teknikleri.", "Açıktan neredeyse siyaha çivit, katlanmış ve bağlanmış desenler.", "Arimatsu shibori, boro"],
    "Kintsugi": ["Kintsugi", "Altınla onarılan kırık seramik; onarım güzelliğin kendisi olur.", "Altın dikişler, çatlak seramik, dürüst bir geçmiş.", "Urushi onarımı"],
    "Japanese modern graphics": ["Japon modern grafiği", "Japon mekân ve sembol duygusuyla modernist afişler.", "Cesur geometrik biçim, kırmızı daire, fotoğraf, büyük boş alanlar.", "Yusaku Kamekura’nın Tokyo 1964 afişleri, Ikko Tanaka, Tadanori Yokoo"],
    "Muji emptiness": ["Muji boşluğu", "Kullanıcı içeri girebilsin diye geri çekilen tasarım.", "Beyaz ve ham malzemeler, logo yok, sade yazı, bir vaat olarak boşluk.", "Kenya Hara, Naoto Fukasawa"],
    "Metabolism": ["Metabolizm", "Yaşayan organizmalar olarak şehirler: modüler kapsüller ve megayapılar.", "Beton çekirdekler, takılıp çıkarılan kapsüller, büyük ölçek, iyimserlik.", "Nakagin Kapsül Kulesi, Kenzo Tange, Expo 70"],
    "Superflat": ["Superflat", "Anime, ukiyo-e ve pop, tek bir parlak yüzeye düzleştirilmiş.", "Düz renk, derinlik yok, sevimli ve tekinsiz, yoğun desen.", "Takashi Murakami"],

    "Shan shui": ["Shan shui", "Siste dağlar ve sular: gözle içinde dolaştığınız bir manzara.", "Mürekkep, dikey tomarlar, katmanlı uzaklık, minik insan figürleri.", "Guo Xi’nin Erken Bahar’ı, Fan Kuan’ın Yolcuları"],
    "Song ceramics": ["Song seramikleri", "Gök, yeşim ya da ay ışığı gibi görünecek kadar sessiz sırlar.", "Seladon, Ru gök mavisi, çatlak sır, saf biçim.", "Ru seramiği, Longquan seladonu, Jun seramiği"],
    "Ming furniture": ["Ming mobilyası", "Nadir sert ağaçtan alim mobilyası: yalın çizgiler, çivisiz, kusursuz birleşimler.", "Huanghuali ağacı, zıvana birleşim, ölçülülük, alim taşları.", "Huanghuali, Ming sandalyesi"],
    "Joseon white & the moon jar": ["Joseon beyazı ve ay küpü", "Sade, dolgun ve bilerek biraz eğri Kore porseleni.", "Süt beyazı, yumuşak asimetrik biçim, sessiz özgüven.", "Dal hangari, Joseon beyaz porseleni"],
    "Dancheong": ["Dancheong", "Beş ana renkle Kore tapınak boyaması.", "Ahşap üzerinde yoğun bantlar hâlinde obangsaek mavi, kırmızı, sarı, beyaz ve siyah.", "Gyeongbokgung, obangsaek"],
    "Hanok": ["Hanok", "Mevsimlerle nefes alan ahşap, kâğıt ve kilden Kore evleri.", "Kavisli kiremit damlar, ondol zeminler, hanji kâğıt kapılar, avlular.", "Bukchon Hanok Köyü, hanji"],
    "Hong Kong neon": ["Hong Kong neonu", "Kaligrafik karakterlerle parlayan tabelalarla katmanlanmış sokaklar.", "Neon tüpler, gece, sık dikey tabelalar, ıslak yansımalar.", "Fan Ho’nun fotoğrafları, M+ NEONSIGNS.HK"],

    "Mughal miniature": ["Babür minyatürü", "Mücevher gibi saray resmi: altın kenarlar içinde bahçeler, avlar, portreler.", "İnce fırça işçiliği, altın kenarlar, çiçekler, düzleştirilmiş perspektif.", "Ekbername, Üstad Mansur"],
    "Truck art": ["Kamyon sanatı", "Renk ve şiirle boyanıp yürüyen türbelere dönüşmüş Pakistan kamyonları.", "Azami desen, aynalar, zincirler, doygun renk, el yazısı harfler.", "Jingle kamyonları"],
    "Block printing": ["Kalıp baskı", "Oyulmuş tahta kalıplarla elle, tekrar tekrar pamuğa basılan desenler.", "Ajrakh çivit ve kökboyası, Sanganer çiçekleri, hafif kaymalar.", "Ajrakh, Sanganer, Bagru"],
    "Indian modernism": ["Hint modernizmi", "Yeni bir ulusun iklimi ve ışığı için inşa edilmiş beton anıtlar.", "Brüt beton, güneş kırıcılar, gölge, su, anıtsal biçimler.", "Chandigarh, Balkrishna Doshi, Louis Kahn’ın IIM Ahmedabad’ı"],
    "Tropical modernism": ["Tropikal modernizm", "Bahçelere karışan, bitkilerin mimarinin parçası olduğu evler.", "Açık köşkler, avlular, derin saçaklar, verandalar, sarmaşık bürümüş yüzeyler.", "Geoffrey Bawa, Lunuganga, Kandalama"],
    "Khmer relief": ["Khmer kabartması", "Bitmeyen alaylar ve dansçılarla oyulmuş tapınak duvarları.", "Kumtaşı, kesintisiz anlatı bantları, kulelerde yüzler, orman.", "Angkor Wat kabartmaları, Bayon yüzleri"],

    "Islamic geometric pattern": ["İslami geometrik desen", "Pergel ve cetvelle kurulan sonsuz desenler.", "Girih yıldızları, geçmeler, simetri, sonsuz tekrar.", "Elhamra, Keith Critchlow’un Islamic Patterns kitabı"],
    "Square Kufic": ["Murabba Kufi", "Kare ızgara üzerine kurulu hat: yüzyıllık piksel sanatı.", "Tuğla ve çini, ızgara harfler, tekrar, labirent gibi bloklar.", "Bennai tuğla işçiliği, İsfahan Cuma Camii"],
    "Persian miniature": ["İran minyatürü", "Mücevher renkleri ve altınla cennet bahçeleri ve destanlar.", "Lacivert, malakit, altın, katmanlı mekân, kenarlarda şiir.", "Behzad, Şah Tahmasb Şehnamesi, Rıza Abbasi"],
    "Muqarnas": ["Mukarnas", "Işığı yüzlerce küçük yüzeye bölen petek tonozlar.", "Sarkıt hücreler, taş ya da alçı, başın üstünde katmanlı geometri.", "Elhamra’daki Abencerrajes Salonu, Şah Camii"],
    "Mashrabiya": ["Meşrebiye", "Işığı, havayı ve bakışı süzen oymalı ahşap kafesler.", "Torna ahşap, desenli gölge, mahremiyet, serinlik.", "Kahire evleri, Jean Nouvel’in Arap Dünyası Enstitüsü"],
    "Zellij": ["Zellij", "Elle kesilmiş sırlı çinilerden, hafif düzensiz ve parıldayan Fas mozaiği.", "Elle yontulmuş çiniler, yıldız desenleri, yeşil, mavi, beyaz, aşı.", "Ben Youssef Medresesi, Fes"],
    "Persian carpet": ["İran halısı", "Dürülebilen bir bahçe: madalyonlar, bordürler, simgesel çiçekler.", "Madalyon ve zemin, iç içe bordürler, kökboya, çivit, fildişi.", "Erdebil Halısı, Tebriz, İsfahan"],
    "Earth architecture": ["Toprak mimarisi", "Serin kalan ve gün batımında parlayan kerpiç yapılar.", "Kerpiç, kubbeler ve tonozlar, rüzgâr kuleleri, kalın yumuşak duvarlar.", "Hassan Fathy’nin Yeni Gurna’sı, Yezd rüzgâr kuleleri, Şibam"],
    "Mesopotamian glazed brick": ["Mezopotamya sırlı tuğlası", "Parlayan mavi tuğlada aslan ve ejder alayları.", "Lacivert sır, altın sarısı hayvanlar, kabartma tuğla.", "İştar Kapısı, Babil Tören Yolu"],

    "Cycladic": ["Kiklad sanatı", "Modern görünecek kadar yalın mermer figürler.", "Beyaz mermer, soyut yüzler, kavuşturulmuş kollar, pürüzsüz düzlemler.", "Kiklad Sanatı Müzesi"],
    "Neoclassicism": ["Neoklasisizm", "Yunan ve Roma’dan ödünç alınmış düzen, sütunlar ve sakin oran.", "Beyaz taş, simetri, ölçülülük, ideal biçimler.", "Canova, Jacques-Louis David, Schinkel"],
    "Gothic light": ["Gotik ışık", "Renkli cam duvarlara açılan taş.", "Sivri kemerler, kaburgalı tonozlar, vitray, dikeylik.", "Sainte-Chapelle, Chartres"],
    "Chiaroscuro & tenebrism": ["Kiyaroskuro ve tenebrizm", "Tek bir sert ışıkla karanlıktan çekip çıkarılan figürler.", "Siyah zeminler, tek ışık kaynağı, sıcak ten, dram.", "Caravaggio, Georges de La Tour, Rembrandt"],
    "Dutch Golden Age": ["Hollanda Altın Çağı", "Sessiz odalar, natürmortlar ve yumuşak pencere ışığı.", "Kuzey ışığı, koyu yeşil ve aşı, özenli doku, dinginlik.", "Vermeer, Pieter de Hooch, Rachel Ruysch"],
    "Romanticism & the sublime": ["Romantizm ve yüce", "Uçsuz bucaksız doğa karşısında küçük figürler: huşu, fırtına, sis.", "Dev gökyüzleri, sis, harabeler, arkadan görülen figür.", "Caspar David Friedrich, J. M. W. Turner"],
    "Natural history plates": ["Doğa tarihi levhaları", "Etiketlenip özenle yerleştirilmiş örneklerin titiz çizimleri.", "İnce çizgi, elle renklendirme, numaralı figürler, beyaz boşluk.", "Ernst Haeckel, Maria Sibylla Merian, Audubon"],
    "Arts and Crafts": ["Arts and Crafts hareketi", "Fabrika malına karşı bir itiraz: el yapımı, dürüst, doğal süsleme.", "Ağaç baskı desen, sarmaşıklar ve kuşlar, meşe, elle dizilmiş harf.", "William Morris, Kelmscott Press"],
    "Art Nouveau": ["Art Nouveau", "Her şey büyür: kamçı kıvrımları, saplar, dalgalanan saçlar.", "Organik çizgi, demir ve cam, bitkisel süsleme, yumuşak palet.", "Alphonse Mucha, Victor Horta, Gaudí"],
    "Vienna Secession": ["Viyana Sezessionu", "Kareyle disipline edilmiş süsleme: altın ve siyah ızgaralar.", "Izgaralar, kareler, varak altın, siyah ve beyaz, bütüncül tasarım.", "Gustav Klimt, Josef Hoffmann, Wiener Werkstätte"],
    "Futurism": ["Fütürizm", "Hız, makineler ve gürültü, dinamik çizgilerde dondurulmuş.", "Hareket çizgileri, parçalanmış biçimler, saldırgan tipografi.", "Boccioni, Balla, Depero"],
    "Metaphysical painting": ["Metafizik resim", "Boş meydanlar, uzun gölgeler ve tedirgin bir sükûnet.", "Derin gölgeler, revaklar, alçak güneş, tuhaf bir durgunluk.", "Giorgio de Chirico"],
    "De Stijl": ["De Stijl", "Saf soyutlama: düz çizgiler, dik açılar, ana renkler.", "Siyah ızgara, kırmızı, sarı, mavi, beyaz, asimetrik denge.", "Mondrian, Rietveld’in Schröder Evi"],
    "Russian Constructivism": ["Rus Konstrüktivizmi", "Yeni bir toplum için mühendislik olarak sanat.", "Kırmızı ve siyah, çapraz tipografi, fotomontaj, geometri.", "El Lissitzky, Rodçenko, Stepanova"],
    "Bauhaus": ["Bauhaus", "Sanat, zanaat ve sanayi tek bir okulda.", "Temel biçimler, tırnaksız yazı, çelik boru, asimetri.", "Herbert Bayer, Marianne Brandt, Moholy-Nagy"],
    "Art Deco": ["Art Deco", "Makine çağıyla buluşan ihtişam: kademeli biçimler, güneş ışınları, krom.", "Geometrik süsleme, altın ve siyah, simetri, zengin malzemeler.", "Chrysler Binası, A. M. Cassandre"],
    "Swiss style": ["İsviçre stili", "Izgaralar, nesnel fotoğraf ve temiz tırnaksız yazılar. Her şeyden önce açıklık.", "Modüler ızgara, Akzidenz ve Helvetica, sola yaslı metin, beyaz boşluk.", "Josef Müller-Brockmann, Armin Hofmann"],
    "Ulm & Braun": ["Ulm ve Braun", "Sistematik, sakin ürün tasarımı: daha az ama daha iyi.", "Açık gri, beyaz, tek işlevsel renk, dürüst kumandalar.", "Dieter Rams, Hans Gugelot, Braun SK 4"],
    "Scandinavian design": ["İskandinav tasarımı", "Sıcak modernizm: ahşap, ışık ve insani konfor.", "Bükülmüş kontrplak, açık renk ağaçlar, yumuşak biçimler, gün ışığı.", "Alvar Aalto, Hans Wegner, Poul Henningsen"],
    "Polish poster school": ["Polonya afiş okulu", "Resimsel, gerçeküstü film ve tiyatro afişleri.", "Dışavurumcu illüstrasyon, simgecilik, elle çizilmiş harfler.", "Henryk Tomaszewski, Roman Cieślewicz, Jan Lenica"],
    "Brutalism": ["Brütalizm", "Ham beton, kütlesel biçimler, dürüst strüktür.", "Kalıp izli beton, tekrar, ağır gölge.", "Barbican, Unité d'Habitation"],
    "Soviet modernism": ["Sovyet modernizmi", "Uçsuz bucaksız bir devlete yayılmış kozmik beton anıtlar ve otobüs durakları.", "Heykelsi beton, mozaikler, uzay çağı biçimleri, ölçek.", "Frédéric Chaubin’in CCCP kitabı, Yugoslav spomenikleri"],
    "Memphis": ["Memphis", "İyi zevke gürültülü bir tepki: çatışan renkler ve kıvrık çizgiler.", "Laminatlar, terrazzo, kıvrık çizgiler, pastel ile ana renk çatışması.", "Ettore Sottsass, Nathalie Du Pasquier"],

    "Hudson River School": ["Hudson River Okulu", "Romantik Amerikan manzaraları: vahşi doğanın üzerinde kırılan ışık.", "Altın ışık, geniş vadiler, küçük figürler, ilahi doğa.", "Thomas Cole, Albert Bierstadt, Frederic Church"],
    "Tonalism & nocturnes": ["Tonalizm ve noktürnler", "Ruh hâli resimleri: alacakaranlık, sis, tek bir kısık renk.", "Tek bir kırık ton, sis, gece suyu, yumuşak kenarlar.", "Whistler’ın Noktürnleri, George Inness, Steichen’in Pond Moonlight’ı"],
    "Shaker": ["Shaker", "İbadet olarak mobilya: yalın, kusursuz, kullanışlı.", "Açık renk ahşap, askı çıtaları, oval kutular, fazlası yok.", "Hancock Shaker Köyü"],
    "Prairie School": ["Prairie Okulu", "Toprağa sarılan alçak, yatay evler.", "Uzun saçaklar, yatay bantlar, sanat camı pencereler, toprak tonları.", "Frank Lloyd Wright’ın Robie Evi, Şelale Evi"],
    "Streamline Moderne": ["Streamline Moderne", "Her şey hızla hareket ediyormuş gibi biçimlenmiş.", "Yuvarlak köşeler, hız çizgileri, alüminyum, krem ve yeşil.", "Raymond Loewy, Henry Dreyfuss"],
    "WPA & national park posters": ["WPA ve milli park afişleri", "Düz renkli manzaralarla serigrafi afişler.", "Sınırlı mürekkepler, düz biçimler, bantlı gökyüzleri, sade yazı.", "Federal Sanat Projesi afişleri"],
    "Mid-century modern": ["Yüzyıl ortası modern", "İyimser, endüstriyel ve sıcak.", "Ceviz, kalıplanmış kontrplak, fiberglas, ana renk vurgular, cam duvarlar.", "Charles ve Ray Eames, Case Study Evleri"],
    "NASA graphics": ["NASA grafikleri", "Worm logosu ve uzay ajansını standartlaştıran kılavuz.", "Temiz modernist yazı, kırmızı ve beyaz, ızgaralar, teknik açıklık.", "NASA Grafik Standartları Kılavuzu, Danne & Blackburn"],
    "Minimalism": ["Minimalizm", "Kutulara, ızgaralara ve tekrara indirgenmiş nesneler.", "Endüstriyel malzemeler, seri biçimler, sessizlik.", "Donald Judd, Agnes Martin, Dan Flavin"],
    "Light and Space": ["Light and Space", "Işığın kendisinden yapılmış sanat: renk odaları, gökyüzüne açılan aralıklar.", "Saf renkli ışık, açık gökyüzü, nesne yok.", "James Turrell’ın Skyspace’leri, Robert Irwin"],
    "Barragán": ["Barragán", "Meksika ışığında saf renkli duvarlar, su ve sessizlik.", "Doygun pembe, aşı ve mor duvarlar, durgun su, gölge.", "Casa Gilardi, Cuadra San Cristóbal"],
    "Brazilian modernism": ["Brezilya modernizmi", "Beton kıvrımlar ve tropikal bahçeler.", "Serbest biçimli beton, pilotiler, dalgalı döşeme, gür bitki örtüsü.", "Oscar Niemeyer, Roberto Burle Marx, Lina Bo Bardi"],
    "Mexican muralism": ["Meksika muralizmi", "Bir ulusun tarihini anlatan kamusal duvarlar.", "Anıtsal figürler, toprak tonlu ve parlak renk, anlatı.", "Diego Rivera, Orozco, Siqueiros"],
    "Andean textiles": ["And dokumaları", "Kozmik anlam taşıyan dokunmuş geometri.", "Tocapu kareleri, basamaklı baklavalar, devegillerin yünü, kırmızı ve sarı.", "İnka tocapu, Paracas dokumaları"],
    "Psychedelic posters": ["Psikedelik afişler", "Konserler için eriyen harfler ve titreşen renk.", "Dalgalı yazı, çatışan tamamlayıcı renkler, Art Nouveau canlanması.", "Wes Wilson, Victor Moscoso, Bonnie MacLean"],
    "American Dynamism": ["Amerikan Dinamizmi", "Klasik resim ve kahramanca fotoğraf, yeni savunma ve sanayi teknolojisini satar.", "Yağlı boya kahramanlar, gerçek operasyon fotoğrafları, manifesto metni, ulusal gurur.", "Rainmaker, Anduril, Hadrian, Varda Space"],

    "Ancient Egypt": ["Antik Mısır", "Sonsuzluğun sanatı: katı kurallar, profiller, altın ve lacivert taşı.", "Kuşaklar, profil figürler, hiyeroglifler, altın, lacivert taşı, akik.", "Tutankamon’un maskesi, Ölüler Kitabı, Karnak"],
    "Kente": ["Kente", "Her desenin bir adı olan, şeritler hâlinde dokunmuş Gana kumaşı.", "Dar şeritler, altın, yeşil, kırmızı, siyah, blok geometri.", "Asante ve Ewe dokumacılığı"],
    "Kuba textiles": ["Kuba dokumaları", "Doğaçlama geometrik desenli rafya kumaş.", "Rafya, aplike, düzensiz tekrar, toprak tonları.", "Kuba kumaşı, Shoowa dokumaları"],
    "Ndebele painting": ["Ndebele boyaması", "Siyah konturlu cesur geometriyle boyanmış ev duvarları.", "Siyah konturlar, düz parlak renk, simetri.", "Esther Mahlangu"],
    "Adinkra": ["Adinkra", "Her biri bir atasözü taşıyan Gana sembolleri.", "Kumaşa basılmış siyah semboller, yalın cesur biçimler.", "Sankofa, Gye Nyame"],
    "Sudano-Sahelian": ["Sudan-Sahel mimarisi", "Her yıl topluluk tarafından yeniden sıvanan, ahşap çıkıntılı kerpiç camiler.", "Çamur sıva, toron kirişler, payandalar, yumuşak anıtsal biçimler.", "Cenne Ulu Camii, Timbuktu"],
    "Bògòlanfini": ["Bògòlanfini", "Mali çamur kumaşı: mayalanmış çamurla boyanan desenler.", "Toprak kahvesi, siyah ve krem, yoğun simgesel işaretler.", "Bogolan"],
    "Afrofuturism": ["Afrofütürizm", "Uzayda ve gelecekte yeniden hayal edilen Afrika mirası.", "Kozmik imgeler, metalikler, bilimkurguyla buluşan geleneksel desen.", "Sun Ra, Wangechi Mutu, Hannah Beachler"],

    "Technical illustration": ["Teknik illüstrasyon", "Şeylerin nasıl çalıştığını anlatan patlatılmış görünüşler ve kesitler.", "Çizgi çizim, izometrik görünüşler, açıklama okları, numaralı parçalar.", "David Macaulay’nin The Way Things Work kitabı, Haynes kılavuzları"],
    "Swiss cartography": ["İsviçre kartografyası", "Dağları oyulmuş gibi gösteren özenle gölgelendirilmiş haritalar.", "Kabartma gölgeleme, tarama, kırık yeşiller ve kahveler, ince yazı.", "Eduard Imhof, Swisstopo"],
    "Cassette futurism": ["Kaset fütürizmi", "Tıknaz düğmeler, CRT ekranlar ve bej plastikle hayal edilen gelecek.", "Bej ve gri kasalar, turuncu LED’ler, tıknaz anahtarlar, yeşil fosfor.", "Alien’daki Nostromo, Sony Walkman, Teenage Engineering"],
    "Pixel art": ["Piksel sanatı", "Görünür karelerden ve minik paletlerden kurulan görüntüler.", "Izgara, sınırlı palet, titreklik (dithering), keskin kenarlar.", "Game Boy grafikleri, Susan Kare’nin ikonları, eBoy"],
    "Cyberpunk": ["Siberpunk", "Yüksek teknoloji, düşük hayat: neon, yağmur ve yoğun şehirler.", "Siyah üzerine neon, yağmur, dikey tabelalar, krom.", "Blade Runner, Akira, Syd Mead"],
    "Solarpunk": ["Solarpunk", "Teknoloji ve bitkilerin birlikte büyüdüğü umutlu bir gelecek.", "Binalarda yeşillik, güneş camı, organik kıvrımlar, gün ışığı.", "Bosco Verticale, Gardens by the Bay"],
    "Y2K futurism": ["Y2K fütürizmi", "Yarı saydam plastikler, krom kabarcıklar ve gümüş iyimserlik.", "Yarı saydam mavi ve gümüş, kabarcıklar, krom yazı.", "iMac G3, The Designers Republic"],
    "Vaporwave": ["Vaporwave", "Nostaljik ironi: 90’ların bilgisayarları, mermer büstler, pembe gün batımları.", "Pastel pembe ve camgöbeği, Windows 95, Yunan heykelleri, ızgaralar.", "Floral Shoppe"],
    "Skeuomorphism": ["Skeuomorfizm", "Gerçek malzemeleri taklit eden ekranlar: deri, ahşap, fırçalanmış metal.", "Gerçekçi dokular, gölgeler, dikişler, dokunsal düğmeler.", "iOS 6"],
    "Glitch art": ["Glitch sanatı", "Bozuk veride bulunan güzellik.", "Piksel sıralama, RGB kayması, bozuk dosyalar, tarama çizgileri.", "Rosa Menkman"],
  };

  // Start-here notes, keyed by the English entry name
  const PICKS = {
    "Karagöz shadow theatre": "Gölge fikrimizin Türkçe sesi: karanlıkta parlayan renk.",
    "Ottoman miniature": "Matrakçı Nasuh şehirleri yukarıdan çizdi, dronlardan beş yüzyıl önce.",
    "Hammam": "Karanlık bir kubbede küçük gün ışığı yıldızları. Sükûnet ve gölgeden doğan ışık.",
    "Ottoman wooden house": "Ahşap, kafes ve süzülen ışık; sevdiğin Japon zevkine yakın.",
    "Square Kufic": "Kare ızgarada harfler, düzen tutan uçaklar gibi.",
    "Ebru: paper marbling": "Suyun üstünde hareket eden renk, gökte bir sürünün hareketi gibi.",
    "Hüzün": "Wabi-sabi’nin Türk kuzeni: ağırlık taşıyan güzellik.",
    "In Praise of Shadows": "Şimdiki yönümüzün başladığı yer.",
  };

  return { REGIONS, KINDS, era, E, PICKS };
})();
