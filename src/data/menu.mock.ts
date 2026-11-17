import { MenuItem, OptionGroup } from "@/types";

// Common Reusable Option Groups
export const SPICINESS_OPTIONS: OptionGroup = {
  id: "spiciness",
  title: {
    lo: "ລະດັບຄວາມເຜັດ",
    th: "ระดับความเผ็ด",
    en: "Spiciness Level",
  },
  required: true,
  maxSelect: 1,
  options: [
    { id: "mild", name: { lo: "ເຜັດນ້ອຍ (Mild)", th: "เผ็ดน้อย (Mild)", en: "Mild" }, priceExtra: 0 },
    { id: "medium", name: { lo: "ເຜັດກາງ (Medium)", th: "เผ็ดปานกลาง (Medium)", en: "Medium" }, priceExtra: 0 },
    { id: "hot", name: { lo: "ເຜັດຫຼາຍ (Spicy)", th: "เผ็ดมาก (Spicy)", en: "Spicy" }, priceExtra: 0 },
    { id: "none", name: { lo: "ບໍ່ເຜັດ (Non-Spicy)", th: "ไม่เผ็ด (Non-Spicy)", en: "Non-Spicy" }, priceExtra: 0 },
  ],
};

export const SWEETNESS_OPTIONS: OptionGroup = {
  id: "sweetness",
  title: {
    lo: "ລະດັບຄວາມຫວານ",
    th: "ระดับความหวาน",
    en: "Sweetness Level",
  },
  required: true,
  maxSelect: 1,
  options: [
    { id: "sweet_100", name: { lo: "ຫວານປົກກະຕິ (100%)", th: "หวานปกติ (100%)", en: "Regular (100%)" }, priceExtra: 0 },
    { id: "sweet_50", name: { lo: "ຫວານໜ້ອຍ (50%)", th: "หวานน้อย (50%)", en: "Less Sweet (50%)" }, priceExtra: 0 },
    { id: "sweet_25", name: { lo: "ຫວານ 25%", th: "หวาน 25%", en: "Quarter Sweet (25%)" }, priceExtra: 0 },
    { id: "sweet_0", name: { lo: "ບໍ່ຫວານ (0%)", th: "ไม่หวาน (0%)", en: "Unsweetened (0%)" }, priceExtra: 0 },
  ],
};

export const DRINK_TEMPERATURE_OPTIONS: OptionGroup = {
  id: "temperature",
  title: {
    lo: "ຮູບແບບເຄື່ອງດື່ມ",
    th: "รูปแบบเครื่องดื่ม",
    en: "Drink Serving",
  },
  required: true,
  maxSelect: 1,
  options: [
    { id: "iced", name: { lo: "ເຢັນ (Iced)", th: "เย็น (Iced)", en: "Iced" }, priceExtra: 0 },
    { id: "hot", name: { lo: "ຮ້ອນ (Hot)", th: "ร้อน (Hot)", en: "Hot" }, priceExtra: 0 },
    { id: "frappe", name: { lo: "ປັ່ນ (Frappe)", th: "ปั่น (Frappe)", en: "Frappe" }, priceExtra: 5000 },
  ],
};

export const FOOD_TOPPINGS: OptionGroup = {
  id: "food_toppings",
  title: {
    lo: "ເພີ່ມທັອບປິ້ງພິເສດ",
    th: "เพิ่มท็อปปิ้งพิเศษ",
    en: "Add-ons & Toppings",
  },
  required: false,
  maxSelect: 3,
  options: [
    { id: "extra_egg", name: { lo: "ໄຂ່ດາວທອດກອບ", th: "ไข่ดาวกรอบ", en: "Crispy Fried Egg" }, priceExtra: 5000 },
    { id: "extra_rice", name: { lo: "ເຂົ້າຫອມມະລິພິເສດ", th: "ข้าวหอมมะลิเพิ่ม", en: "Extra Jasmine Rice" }, priceExtra: 6000 },
    { id: "extra_meat", name: { lo: "ເພີ່ມຊີ້ນພິເສດ", th: "เพิ่มเนื้อพิเศษ", en: "Extra Premium Meat" }, priceExtra: 25000 },
  ],
};

export const DRINK_TOPPINGS: OptionGroup = {
  id: "drink_toppings",
  title: {
    lo: "ເພີ່ມທັອບປິ້ງເຄື່ອງດື່ມ",
    th: "เพิ่มท็อปปิ้งเครื่องดื่ม",
    en: "Drink Toppings",
  },
  required: false,
  maxSelect: 2,
  options: [
    { id: "boba", name: { lo: "ໄຂ່ມຸກບາວຊູກ້າ", th: "ไข่มุกบราวน์ชูการ์", en: "Brown Sugar Pearls" }, priceExtra: 5000 },
    { id: "whipped_cream", name: { lo: "ວິບຄຣີມນົມສົດ", th: "วิปครีมนมสด", en: "Fresh Whipped Cream" }, priceExtra: 6000 },
    { id: "aloe_vera", name: { lo: "ວຸ້ນວ່າຮາງຈໍລະເຂ້", th: "ว่านหางจระเข้", en: "Aloe Vera Jelly" }, priceExtra: 5000 },
  ],
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // 1. Signature Food
  {
    id: "menu-01",
    sku: "FOOD-KPS-01",
    name: {
      lo: "ເຂົ້າປຽກເສັ້ນ ຊີ້ນໝູກອບພິເສດ",
      th: "ข้าวเปียกเส้น หมูกรอบสูตรพิเศษ",
      en: "Signature Crispy Pork Khao Piak Sen",
    },
    description: {
      lo: "ເຂົ້າປຽກເສັ້ນສົດຕົ້ມໃສ່ນ້ຳຊຸບກະດູກໝูຫວານກົມກ່ອມ ໂຮຍດ້ວຍໝູກອບ ແລະ ຫອมບົ່ວຈຽວ",
      th: "ก๋วยจั๊บญวนเส้นสดต้มน้ำซุปกระดูกหมูกลมกล่อม ท็อปด้วยหมูกรอบและหอมเจียวหอมกรุ่น",
      en: "Handmade tapioca noodles in rich pork broth topped with crispy roasted pork belly and shallots.",
    },
    category: "recommended",
    price: 45000,
    image: "/menu/khao-piak.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
    optionGroups: [FOOD_TOPPINGS],
  },
  {
    id: "menu-02",
    sku: "FOOD-LRB-02",
    name: {
      lo: "ລາບຊີ້ນງົວວາກິວ ຄົວກິນກັບຜັກສົດ",
      th: "ลาบเนื้อวากิว คลุกเคล้าผักเคียงสด",
      en: "Artisanal Wagyu Beef Larb",
    },
    description: {
      lo: "ຊີ້ນງົວວາກິວຄຸນນະພາບສູງ ປຸງແຕ່ງດ້ວຍເຂົ້າຂົ້ວຫອມ ພິກປົ່ນ ແລະ ສະໝຸນໄພພື້ນບ້ານ",
      th: "เนื้อวากิวสับคั่ว ปรุงรสด้วยข้าวคั่ว พริกป่น มะนาวสด และสมุนไพรท้องถิ่น",
      en: "Finely minced premium Wagyu beef tossed with roasted rice, fresh mint, lime juice, and chili.",
    },
    category: "recommended",
    price: 85000,
    image: "/menu/wagyu-larb.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
    optionGroups: [SPICINESS_OPTIONS, FOOD_TOPPINGS],
  },
  {
    id: "menu-03",
    sku: "FOOD-TYK-03",
    name: {
      lo: "ຕົ້ມຍຳກຸ້ງແມ່ພິກເຜົາ ນ້ຳຂົ້ນ",
      th: "ต้มยำกุ้งแม่น้ำ น้ำข้นรสเข้ม",
      en: "Creamy River Prawn Tom Yum Soup",
    },
    description: {
      lo: "ຕົ້ມຍຳກຸ້ງແມ່ຕິດມັນ ນ້ຳຂົ້ນໃສ່ນົມສົດ ແລະ ພິກເຜົາຫອມ ເຜັດສົ້ມກົມກ່ອມ",
      th: "ต้มยำกุ้งแม่น้ำตัวใหญ่ น้ำข้นเข้มข้นด้วยมันกุ้ง นมสด และเครื่องต้มยำสดใหม่",
      en: "Aromatic spicy and sour soup with giant river prawns, lemongrass, galangal, and kaffir lime.",
    },
    category: "food",
    price: 75000,
    image: "/menu/tom-yum.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 15,
    optionGroups: [SPICINESS_OPTIONS],
  },
  {
    id: "menu-04",
    sku: "FOOD-KPO-04",
    name: {
      lo: "ຜັດກະເພົາຊີ້ນງົວສັບ + ໄຂ່ດາວ",
      th: "ผัดกะเพราเนื้อสับพรีเมียม + ไข่ดาว",
      en: "Spicy Holy Basil Minced Beef with Fried Egg",
    },
    description: {
      lo: "ຊີ້ນງົວສັບຜັດໃບກະເພົາຫອມຮ້ອນໆ ເສີບພ້ອມເຂົ້າຫອມມະລິ ແລະ ໄຂ່ດາວຂອບກອບ",
      th: "เนื้อสับผัดใบกะเพราป่ารสจัดจ้าน เสิร์ฟพร้อมข้าวหอมมะลิร้อนๆ และไข่ดาวกรอบเยิ้ม",
      en: "Wok-fried minced beef with fiery Thai holy basil, garlic, and fresh chili over jasmine rice.",
    },
    category: "food",
    price: 52000,
    image: "/menu/basil-beef.jpg",
    isPopular: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
    optionGroups: [SPICINESS_OPTIONS, FOOD_TOPPINGS],
  },
  {
    id: "menu-05",
    sku: "APP-SPR-05",
    name: {
      lo: "ຢໍ່ຈືນກອບໄສ້ກຸ້ງ & ໝູສັບ",
      th: "เปาะเปี๊ยะทอดไส้กุ้งและหมูสับ",
      en: "Crispy Spring Rolls with Sweet Plum Dip",
    },
    description: {
      lo: "ຢໍ່ຈືນທອດກອບສີເຫຼືອງທອງ ໄສ້ກຸ້ງແໜ້ນໆ ກິນກັບນ້ຳຈິ້ມຫວານບ໊ວຍ",
      th: "เปาะเปี๊ยะทอดกรอบสีทองอัดแน่นด้วยกุ้งและผักสด เสิร์ฟคู่กับน้ำจิ้มบ๊วยเจี่ย",
      en: "Golden crispy fried rolls stuffed with minced prawns, vermicelli, and wood ear mushrooms.",
    },
    category: "appetizers",
    price: 38000,
    image: "/menu/spring-rolls.jpg",
    isPopular: false,
    isAvailable: true,
    preparationTimeMinutes: 8,
  },
  {
    id: "menu-06",
    sku: "APP-SAT-06",
    name: {
      lo: "ສະເຕ໊ະໄກ່ພ້ອມນ້ຳຈິ້ມຖົ່ວດິນ",
      th: "สะเต๊ะไก่ย่างเตาถ่านพร้อมอาจาด",
      en: "Charcoal Grilled Chicken Satay Skewers",
    },
    description: {
      lo: "ຊີ້ນໄກ່ໝັກເຄື່ອງເທດຍ່າງເຕົາຖ່ານຫອມໆ ເສີບພ້ອມນ້ຳຈິ້ມຖົ່ວຂົ້ນ ແລະ ອາຈາດ",
      th: "อกไก่หมักเครื่องแกงสะเต๊ะย่างหอมกรุ่น เสิร์ฟคู่น้ำจิ้มถั่วคั่วเข้มข้นและอาจาดแตงกวา",
      en: "Marinated chicken skewers grilled over charcoal, accompanied by spiced peanut dipping sauce.",
    },
    category: "appetizers",
    price: 42000,
    image: "/menu/chicken-satay.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
  },
  // 2. Drinks & Coffee
  {
    id: "menu-07",
    sku: "DRK-COF-07",
    name: {
      lo: "ກາເຟລາວບູຮານ ນົມຂົ້ນຫວານມັນ",
      th: "กาแฟโบราณลาว นมข้นเข้มข้น",
      en: "Signature Lao Traditional Iced Coffee",
    },
    description: {
      lo: "ເມັດກາເຟອາຣາບິກ້າພູພຽງບໍລະເວນ ຄົວກິນກັບນົມຂົ້ນຫວານມັນແບບດั้งเดิม",
      th: "กาแฟโรบัสต้าและอาราบิก้าจากที่ราบสูงโบลาเวน ชงเข้มข้นผสมนมข้นหวานมัน",
      en: "Bold Bolaven Plateau coffee brewed slow and poured over rich sweetened condensed milk.",
    },
    category: "drinks",
    price: 25000,
    image: "/menu/lao-coffee.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
    optionGroups: [DRINK_TEMPERATURE_OPTIONS, SWEETNESS_OPTIONS, DRINK_TOPPINGS],
  },
  {
    id: "menu-08",
    sku: "DRK-TEA-08",
    name: {
      lo: "ຊານົມໄທ ພຣີມຽມໃສ່ໄຂ່ມຸກ",
      th: "ชาไทยพรีเมียมไข่มุกบราวน์ชูการ์",
      en: "Royal Thai Milk Tea with Pearls",
    },
    description: {
      lo: "ຊາໄທໃບແທ້ສີສົ້ມຫອມນຸ້ມ ເສີບພ້ອມໄຂ່ມຸກບາວຊູກ້າໜຶບໜັບ",
      th: "ใบชาไทยคั่วหอมกรุ่นผสมนมสดแท้ ท็อปด้วยไข่มุกบราวน์ชูการ์หนุบหนับ",
      en: "Slow-brewed authentic orange Ceylon Thai tea blended with whole milk and brown sugar pearls.",
    },
    category: "drinks",
    price: 28000,
    image: "/menu/thai-tea.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
    optionGroups: [DRINK_TEMPERATURE_OPTIONS, SWEETNESS_OPTIONS, DRINK_TOPPINGS],
  },
  {
    id: "menu-09",
    sku: "DRK-MTC-09",
    name: {
      lo: "ມັດຊະລາເຕ້ ອູຈິແທ້ 100%",
      th: "มัทฉะลาเต้ แท้จากเมืองอูจิ 100%",
      en: "Ceremonial Uji Matcha Latte",
    },
    description: {
      lo: "ຜົງມັດຊະນຳເຂົ້າຈາກກຽວໂຕ ຕີຟອງກັບນົມສົດລະມຸນລີ້ນ",
      th: "มัทฉะเกรดพิธีการชงสด ผสมนมสดนุ่มละมุน ได้รสอูมามิแท้จากใบชาเขียว",
      en: "Pure stone-ground ceremonial green tea whisked with creamy steamed milk.",
    },
    category: "drinks",
    price: 36000,
    image: "/menu/matcha-latte.jpg",
    isPopular: false,
    isAvailable: true,
    preparationTimeMinutes: 5,
    optionGroups: [DRINK_TEMPERATURE_OPTIONS, SWEETNESS_OPTIONS, DRINK_TOPPINGS],
  },
  // 3. Desserts
  {
    id: "menu-10",
    sku: "DES-MNG-10",
    name: {
      lo: "ເຂົ້າໜຽວໝາກມ່ວງນ້ຳດອກໄມ້ ນ້ຳກະທິສົດ",
      th: "ข้าวเหนียวมะม่วงน้ำดอกไม้ ราดกะทิสด",
      en: "Fresh Mango Sticky Rice with Coconut Cream",
    },
    description: {
      lo: "ເຂົ້າໜຽວມູນໃບເຕີຍຫອມນຸ້ມ ເສີບກັບໝາກມ່ວງນ້ຳດອກໄມ້ສຸກຫວານ ແລະ ກະທິສົດຂຸ້ນ",
      th: "ข้าวเหนียวมูนกะทิหอมนุ่ม ทานคู่มะม่วงน้ำดอกไม้สีทองหวานฉ่ำ โรยถั่วทองกรุบกรอบ",
      en: "Sweet sticky rice infused with coconut milk and pandan, served with ripe golden mango slices.",
    },
    category: "desserts",
    price: 38000,
    image: "/menu/mango-sticky-rice.jpg",
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 6,
  },
  {
    id: "menu-11",
    sku: "DES-BBN-11",
    name: {
      lo: "ບົວລອຍເຜືອກໄຂ່ຫວານ ນ້ຳກະທິອົບຄັວນທຽນ",
      th: "บัวลอยเผือกมะพร้าวอ่อน ไข่หวาน",
      en: "Warm Taro Bua Loy with Sweet Poached Egg",
    },
    description: {
      lo: "ເມັດບົວລອຍເຜືອກໜຶບນຸ້ມ ນ້ຳກະທິໝາກພ້າວອ່ອນອົບຄັວນທຽນຫອມ",
      th: "เม็ดบัวลอยทำจากเผือกแท้และฟักทอง ในน้ำกะทิมะพร้าวอ่อนเคี่ยวกลิ่นควันเทียน",
      en: "Handmade taro and pumpkin rice dumplings in warm coconut broth with a soft-poached sweet egg.",
    },
    category: "desserts",
    price: 30000,
    image: "/menu/bua-loy.jpg",
    isPopular: false,
    isAvailable: true,
    preparationTimeMinutes: 7,
  },
];
