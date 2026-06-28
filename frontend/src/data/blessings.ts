// Food blessings data - embedded for GitHub Pages compatibility
// Tradition keys: ashkenaz, sephardi, mizrachi, chabad

export interface FoodBlessing {
  food_name: string;
  hebrew_name: string;
  category: string;
  tradition: string;
  first_blessing: string;
  last_blessing: string;
  note: string;
  requires_clarification: boolean;
}

export const BLESSINGS_DATA: FoodBlessing[] = [
  { food_name: "cucumber", hebrew_name: "מלפפון", category: "ירק", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "cola", hebrew_name: "קולה", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "coffee", hebrew_name: "קפה", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "meat", hebrew_name: "בשר", category: "בשר", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "fish", hebrew_name: "דג", category: "דג", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "pizza", hebrew_name: "פיצה", category: "מאפה", tradition: "הכל", first_blessing: "תלוי בכמות", last_blessing: "ברכת המזון / על המחיה", note: "דורש שאלת הבהרה", requires_clarification: true },
  { food_name: "apple", hebrew_name: "תפוח", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם נאכל שיעור", requires_clarification: false },
  { food_name: "bread", hebrew_name: "לחם", category: "לחם", tradition: "הכל", first_blessing: "המוציא לחם מן הארץ", last_blessing: "ברכת המזון", note: "אם נאכל כזית", requires_clarification: false },
  { food_name: "wine", hebrew_name: "יין", category: "יין", tradition: "הכל", first_blessing: "בורא פרי הגפן", last_blessing: "על הגפן", note: "אם שתה רביעית", requires_clarification: false },
  { food_name: "cake", hebrew_name: "עוגה", category: "עוגה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם נאכל שיעור", requires_clarification: false },
  { food_name: "olives", hebrew_name: "זיתים", category: "שבעת המינים", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "על העץ", note: "אם נאכל שיעור", requires_clarification: false },
  { food_name: "sweet_bun", hebrew_name: "לחמנייה מתוקה", category: "לחמנייה מתוקה", tradition: "אשכנז / חב״ד", first_blessing: "המוציא", last_blessing: "ברכת המזון", note: "לפי מנהג אשכנז", requires_clarification: false },
  { food_name: "sweet_bun", hebrew_name: "לחמנייה מתוקה", category: "לחמנייה מתוקה", tradition: "ספרד / עדות המזרח", first_blessing: "מזונות", last_blessing: "על המחיה", note: "לפי מנהג עדות המזרח", requires_clarification: false },
  { food_name: "water", hebrew_name: "מים", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "tea", hebrew_name: "תה", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "orange", hebrew_name: "תפוז", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "banana", hebrew_name: "בננה", category: "פרי האדמה", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "watermelon", hebrew_name: "אבטיח", category: "פרי האדמה", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "melon", hebrew_name: "מלון", category: "פרי האדמה", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "tomato", hebrew_name: "עגבנייה", category: "ירק", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "carrot", hebrew_name: "גזר", category: "ירק", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "rice", hebrew_name: "אורז", category: "תבשיל", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "בורא נפשות", note: "לפי מנהג רוב הפוסקים", requires_clarification: false },
  { food_name: "pasta", hebrew_name: "פסטה", category: "מזונות", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "מעל כוס פסטה נחשב שיעור", requires_clarification: false },
  { food_name: "couscous", hebrew_name: "קוסקוס", category: "מזונות", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "borekas", hebrew_name: "בורקס", category: "מאפה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "בורקס אחד לפחות בגודל סטנדרטי נחשב לשיעור", requires_clarification: false },
  { food_name: "falafel", hebrew_name: "פלאפל", category: "קטניות / מטוגן", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "יש לבדוק אם נאכל בפיתה", requires_clarification: true },
  { food_name: "hummus", hebrew_name: "חומוס", category: "קטניות", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם נאכל לבד", requires_clarification: false },
  { food_name: "schnitzel", hebrew_name: "שניצל", category: "בשר / עוף", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "fruit_salad", hebrew_name: "סלט פירות", category: "פירות", tradition: "הכל", first_blessing: "תלוי ברוב הפירות", last_blessing: "תלוי בהרכב", note: "אם יש שבעת המינים יש לבדוק", requires_clarification: true },
  { food_name: "egg", hebrew_name: "ביצה", category: "ביצה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "cheese", hebrew_name: "גבינה", category: "חלבון / חלבי", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "yogurt", hebrew_name: "יוגורט", category: "חלבי", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "malawach", hebrew_name: "מלווח", category: "מאפה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם קובע סעודה יש לשאול רב", requires_clarification: true },
  { food_name: "jachnun", hebrew_name: "ג'חנון", category: "מאפה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם קובע סעודה יש לשאול רב", requires_clarification: true },
  { food_name: "soup", hebrew_name: "מרק", category: "תבשיל / נוזל", tradition: "הכל", first_blessing: "תלוי ברכיבים", last_blessing: "תלוי ברכיבים", note: "מקרה מורכב – להפנות לשאלת רב", requires_clarification: true },
  { food_name: "mixed_salad", hebrew_name: "סלט ירקות", category: "ירקות", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם רובו ירקות", requires_clarification: false },
  { food_name: "avocado", hebrew_name: "אבוקדו", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "grapes", hebrew_name: "ענבים", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם לא נעשו יין", requires_clarification: false },
  { food_name: "dates", hebrew_name: "תמרים", category: "שבעת המינים", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "על העץ", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "figs", hebrew_name: "תאנים", category: "שבעת המינים", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "על העץ", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "pomegranate", hebrew_name: "רימון", category: "שבעת המינים", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "על העץ", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "peach", hebrew_name: "אפרסק", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "pear", hebrew_name: "אגס", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "mango", hebrew_name: "מנגו", category: "פרי העץ", tradition: "הכל", first_blessing: "בורא פרי העץ", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "strawberry", hebrew_name: "תות שדה", category: "פרי האדמה", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "peanuts", hebrew_name: "בוטנים", category: "קטניות", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "popcorn", hebrew_name: "פופקורן", category: "חטיף תירס", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "corn", hebrew_name: "תירס", category: "ירק", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "potato", hebrew_name: "תפוח אדמה", category: "ירק", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "french_fries", hebrew_name: "צ'יפס", category: "תפוח אדמה", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "chips", hebrew_name: "חטיפי תפוח אדמה", category: "חטיף תפוח אדמה", tradition: "הכל", first_blessing: "בורא פרי האדמה", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "cereal", hebrew_name: "דגני בוקר", category: "דגנים", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "oatmeal", hebrew_name: "שיבולת שועל", category: "דגן", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "crackers", hebrew_name: "קרקרים", category: "מאפה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "pretzels", hebrew_name: "בייגלה", category: "מאפה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "chocolate", hebrew_name: "שוקולד", category: "ממתק", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "candy", hebrew_name: "ממתק", category: "ממתק", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "ice_cream", hebrew_name: "גלידה", category: "קינוח חלבי", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "cookies", hebrew_name: "עוגיות", category: "עוגיות", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "croissant", hebrew_name: "קרואסון", category: "מאפה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "donut", hebrew_name: "סופגנייה", category: "סופגנייה", tradition: "הכל", first_blessing: "בורא מיני מזונות", last_blessing: "על המחיה", note: "אם אכל שיעור", requires_clarification: false },
  { food_name: "burger", hebrew_name: "המבורגר", category: "מנה מורכבת", tradition: "הכל", first_blessing: "דורש שאלת הבהרה", last_blessing: "תלוי בהרכב", note: "לחם ובשר יחד", requires_clarification: true },
  { food_name: "hot_dog", hebrew_name: "הוט דוג", category: "לחם", tradition: "הכל", first_blessing: "המוציא/מזונות", last_blessing: "על המחיה / ברכת המזון", note: "לחם ובשר יחד", requires_clarification: true },
  { food_name: "shawarma", hebrew_name: "שווארמה", category: "מנה מורכבת", tradition: "הכל", first_blessing: "דורש שאלת הבהרה", last_blessing: "תלוי אם בפיתה", note: "מנה מורכבת", requires_clarification: true },
  { food_name: "sabich", hebrew_name: "סביח", category: "מנה מורכבת", tradition: "הכל", first_blessing: "דורש שאלת הבהרה", last_blessing: "תלוי בהרכב", note: "מנה מורכבת", requires_clarification: true },
  { food_name: "toast", hebrew_name: "טוסט", category: "מאפה ממולא", tradition: "הכל", first_blessing: "תלוי בכמות", last_blessing: "על המחיה / ברכת המזון", note: "מאפה ממולא", requires_clarification: true },
  { food_name: "sushi", hebrew_name: "סושי", category: "אורז ודג", tradition: "הכל", first_blessing: "דורש שאלת הבהרה", last_blessing: "תלוי בהרכב", note: "מנה מורכבת", requires_clarification: true },
  { food_name: "beer", hebrew_name: "בירה", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "juice", hebrew_name: "מיץ", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "smoothie", hebrew_name: "סמוט'י", category: "משקה פירות", tradition: "הכל", first_blessing: "תלוי בהרכב", last_blessing: "תלוי בהרכב", note: "דורש בדיקה", requires_clarification: true },
  { food_name: "energy_drink", hebrew_name: "משקה אנרגיה", category: "משקה", tradition: "הכל", first_blessing: "שהכל נהיה בדברו", last_blessing: "בורא נפשות", note: "אם שתה שיעור", requires_clarification: false },
  { food_name: "sweet_bun", hebrew_name: "לחמנייה מתוקה", category: "לחמנייה מתוקה", tradition: "ספרד", first_blessing: "המוציא", last_blessing: "ברכת המזון", note: "לפי מנהג ספרד - קרוב למנהג אשכנז", requires_clarification: false },
  { food_name: "sweet_bun", hebrew_name: "לחמנייה מתוקה", category: "לחמנייה מתוקה", tradition: "עדות המזרח", first_blessing: "מזונות", last_blessing: "על המחיה", note: "לפי מנהג עדות המזרח", requires_clarification: false },
];

// Full text of after-blessings (ברכה אחרונה) - identical across all traditions
export const BLESSING_FULL_TEXT: Record<string, string> = {
  "על המחיה": "בָּרוּךְ אַתָּה יְהֹוָה, אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם\nעַל הַמִּחְיָה וְעַל הַכַּלְכָּלָה\nוְעַל תְּנוּבַת הַשָּׂדֶה, וְעַל אֶרֶץ חֶמְדָּה טוֹבָה וּרְחָבָה שֶׁרָצִיתָ וְהִנְחַלְתָּ לַאֲבוֹתֵינוּ, לֶאֱכֹל מִפִּרְיָהּ וְלִשְׂבֹּעַ מִטּוּבָהּ.\nרַחֵם יְהֹוָה אֱלֹהֵינוּ, עָלֵינוּ וְעַל יִשְׂרָאֵל עַמָּךְ, וְעַל יְרוּשָׁלַיִם עִירָךְ, וְעַל הַר צִיּוֹן מִשְׁכַּן כְּבוֹדָךְ, וְעַל מִזְבָּחָךְ וְעַל הֵיכָלָךְ. וּבְנֵה יְרוּשָׁלַיִם עִיר הַקֹּדֶשׁ בִּמְהֵרָה בְיָמֵינוּ. וְהַעֲלֵנוּ לְתוֹכָהּ. וְשַׂמְּחֵנוּ בְּבִנְיָנָהּ וּנְבָרְכָךְ עָלֶיהָ בִּקְדֻשָּׁה וּבְטָהֳרָה.\n(בְּרֹאשׁ חֹדֶשׁ: וְזָכְרֵֽנוּ לְטוֹבָה בְּיוֹם רֹאשׁ חֹֽדֶשׁ הַזֶּה)\n(בְּרֹאשׁ הַשָּׁנָה: וְזָכְרֵֽנוּ לְטוֹבָה בְּיוֹם הַזִּכָּרוֹן הַזֶּה)\n(בְּפֶסַח: וְשַׂמְּחֵֽנוּ בְּיוֹם חַג הַמַּצּוֹת הַזֶּה, בְּיוֹם טוֹב מִקְרָא קֹדֶשׁ הַזֶּה)\n(בְּשָׁבוּעוֹת: וְשַׂמְּחֵֽנוּ בְּיוֹם חַג הַשָּׁבוּעוֹת הַזֶּה בְּיוֹם טוֹב מִקְרָא קֹֽדֶשׁ הַזֶּה)\n(בְּסֻכּוֹת: וְשַׂמְּחֵֽנוּ בְּיוֹם הַסֻּכּוֹת הַזֶּה, בְּיוֹם טוֹב מִקְרָא קֹֽדֶשׁ הַזֶּה)\n(בְּשְׁמִינִי עֲצֶֽרֶת: וְשַׂמְּחֵֽנוּ בְּיוֹם שְׁמִינִי חַג עֲצֶֽרֶת הַזֶּה בְּיוֹם טוֹב מִקְרָא קֹֽדֶשׁ הַזֶּה)\nכִּי אַתָּה טוֹב וּמֵטִיב לַכֹּל, וְנוֹדֶה לְּךָ עַל הָאָרֶץ וְעַל הַמִּחְיָה.\nבָּרוּךְ אַתָּה יְהֹוָה, עַל הָאָרֶץ וְעַל הַמִּחְיָה.",
  "בורא נפשות": "בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם בּוֹרֵא נְפָשׁוֹת רַבּוֹת וְחֶסְרוֹנָן עַל כָּל מַה שֶּׁבָּרָאתָ לְהַחֲיוֹת בָּהֶם נֶפֶשׁ כָּל חָי בָּרוּךְ חֵי הָעוֹלָמִים",
  "על הגפן": "בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עַל הַגֶּפֶן וְעַל פְּרִי הַגֶּפֶן וְעַל טוּבְךָ שֶׁהֶחֱיָתָנוּ וְקִיְּמָתָנוּ וְהִגִּיעָנוּ לִזְמַן הַזֶּה",
  "על העץ": "בָּרוּךְ אַתָּה ה׳ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם עַל הָעֵץ וְעַל פְּרִי הָעֵץ וְעַל טוּבְךָ שֶׁהֶחֱיָתָנוּ וְקִיְּמָתָנוּ וְהִגִּיעָנוּ לִזְמַן הַזֶּה",
  "ברכת המזון": "ברכת המזון (ברכה ארוכה - יש לומר מתוך סידור)",
};

// Food name aliases for fuzzy matching
export const FOOD_ALIASES: Record<string, string[]> = {
  "borekas": ["bourekas", "burekas", "börek", "burek", "bourek", "burikas", "בורקס", "בורקסים"],
  "falafel": ["falafel", "פלאפל"],
  "hummus": ["hummus", "chummus", "חומוס"],
  "shawarma": ["shawarma", "shwarma", "שווארמה"],
  "schnitzel": ["schnitzel", "שניצל"],
  "malawach": ["malawach", "malawah", "מלווח"],
  "jachnun": ["jachnun", "jahnun", "ג'חנון"],
  "sabich": ["sabich", "sabih", "סביח"],
  "croissant": ["croissant", "קרואסון"],
  "donut": ["donut", "doughnut", "סופגנייה", "סופגניה"],
  "pizza": ["pizza", "פיצה"],
  "burger": ["burger", "hamburger", "המבורגר", "בורגר"],
  "hot_dog": ["hot_dog", "hotdog", "הוט דוג", "נקניקייה"],
  "pretzels": ["pretzels", "pretzel", "בייגלה", "בייגלעך"],
  "crackers": ["crackers", "cracker", "קרקרים"],
  "couscous": ["couscous", "קוסקוס"],
  "ice_cream": ["ice_cream", "icecream", "גלידה"],
  "cookies": ["cookies", "cookie", "עוגיות", "עוגייה"],
  "chocolate": ["chocolate", "שוקולד"],
  "popcorn": ["popcorn", "פופקורן"],
  "french_fries": ["french_fries", "fries", "chips", "צ'יפס", "טוגנים"],
  "chips": ["chips", "potato_chips", "צ'יפס"],
  "toast": ["toast", "טוסט", "טוסט ממולא"],
  "sushi": ["sushi", "סושי"],
  "smoothie": ["smoothie", "סמוט'י", "שייק"],
  "energy_drink": ["energy_drink", "אנרג'י דרינק", "משקה אנרגיה"],
  "fruit_salad": ["fruit_salad", "סלט פירות"],
  "mixed_salad": ["mixed_salad", "סלט ירקות", "סלט"],
  "soup": ["soup", "מרק"],
};

// Tradition mapping
const TRADITION_MAP: Record<string, string[]> = {
  "ashkenaz": ["אשכנז / חב״ד", "הכל"],
  "sephardi": ["ספרד", "ספרד / עדות המזרח", "הכל"],
  "mizrachi": ["עדות המזרח", "הכל"],
  "chabad": ["אשכנז / חב״ד", "הכל"],
};

// Hotline numbers
export const HOTLINE_MAP: Record<string, string> = {
  "ashkenaz": "072-215-2222",
  "sephardi": "02-652-5555",
  "mizrachi": "*3030",
  "chabad": "077-225-1770",
};

// Find canonical food name from alias
export function findCanonicalFoodName(inputName: string): string | null {
  const normalized = inputName.trim().toLowerCase().replace(/\s+/g, "_");
  if (BLESSINGS_DATA.some(f => f.food_name === normalized)) return normalized;
  
  for (const [canonical, aliases] of Object.entries(FOOD_ALIASES)) {
    const allNames = [canonical, ...aliases].map(n => n.toLowerCase().replace(/\s+/g, "_"));
    if (allNames.includes(normalized)) return canonical;
    for (const name of allNames) {
      if (name.includes(normalized) || normalized.includes(name)) return canonical;
    }
  }
  return null;
}

// Get blessing for a food and tradition
export function getBlessing(foodName: string, tradition: string, hebrewName?: string) {
  const traditionValues = TRADITION_MAP[tradition] || ["הכל"];
  
  // Try exact match with tradition
  let food = BLESSINGS_DATA.find(f => f.food_name === foodName && traditionValues.includes(f.tradition));
  
  // Try canonical name
  if (!food) {
    const canonical = findCanonicalFoodName(foodName);
    if (canonical) {
      food = BLESSINGS_DATA.find(f => f.food_name === canonical && traditionValues.includes(f.tradition));
    }
  }
  
  // Fallback to universal
  if (!food) {
    food = BLESSINGS_DATA.find(f => f.food_name === foodName && f.tradition === "הכל");
  }
  
  // Fallback to canonical universal
  if (!food) {
    const canonical = findCanonicalFoodName(foodName);
    if (canonical) {
      food = BLESSINGS_DATA.find(f => f.food_name === canonical && f.tradition === "הכל");
    }
  }
  
  // Partial match
  if (!food) {
    food = BLESSINGS_DATA.find(f => 
      (foodName.toLowerCase().includes(f.food_name) || f.food_name.includes(foodName.toLowerCase())) 
      && traditionValues.includes(f.tradition)
    );
  }
  if (!food) {
    food = BLESSINGS_DATA.find(f => 
      foodName.toLowerCase().includes(f.food_name) || f.food_name.includes(foodName.toLowerCase())
    );
  }
  
  if (!food) return null;
  
  const hotline = food.requires_clarification ? HOTLINE_MAP[tradition] : null;
  
  return {
    food_name: foodName,
    hebrew_name: hebrewName || food.hebrew_name,
    category: food.category,
    tradition,
    first_blessing: food.first_blessing,
    last_blessing: food.last_blessing,
    note: food.note,
    requires_clarification: food.requires_clarification,
    hotline,
  };
}

// Get all known food names for AI prompt
export function getKnownFoodNames(): string[] {
  return [...new Set(BLESSINGS_DATA.map(f => f.food_name))];
}