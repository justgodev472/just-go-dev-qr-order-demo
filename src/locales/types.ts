export type Locale = "lo" | "th" | "en";

export interface QrOrderDictionary {
  brand: {
    name: string;
    tagline: string;
    table: string;
    guests: string;
  };
  nav: {
    menu: string;
    cart: string;
    status: string;
    callService: string;
    kitchen: string;
  };
  categories: {
    all: string;
    recommended: string;
    food: string;
    drinks: string;
    desserts: string;
    appetizers: string;
  };
  menu: {
    searchPlaceholder: string;
    add: string;
    popular: string;
    soldOut: string;
    mins: string;
    customizationTitle: string;
    required: string;
    optional: string;
    specialNotePlaceholder: string;
    addToCart: string;
    updateCart: string;
    price: string;
  };
  cart: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    subtotal: string;
    serviceCharge: string;
    vat: string;
    total: string;
    sendToKitchen: string;
    confirmTitle: string;
    confirmDesc: string;
    confirmBtn: string;
    cancelBtn: string;
    itemsCount: string;
    clearCart: string;
  };
  status: {
    title: string;
    stepReceived: string;
    stepCooking: string;
    stepReady: string;
    stepServing: string;
    stepPending: string;
    stepServed: string;
    currentCooking: string;
    estimatedWait: string;
    orderRound: string;
    requestBillBtn: string;
    callWaiterBtn: string;
    noActiveOrders: string;
    noActiveOrdersDesc: string;
  };
  service: {
    title: string;
    desc: string;
    callWaiter: string;
    callWaiterDesc: string;
    refillWater: string;
    refillWaterDesc: string;
    extraCutlery: string;
    extraCutleryDesc: string;
    requestBill: string;
    requestBillDesc: string;
    requestSent: string;
    pendingStaff: string;
    detailsTitle: string;
    waterKind: string;
    waterQty: string;
    cutleryKind: string;
    cutleryQty: string;
    noteLabel: string;
    notePlaceholder: string;
    confirm: string;
    back: string;
    unitGlass: string;
    unitPiece: string;
  };
  bill: {
    title: string;
    desc: string;
    tableNumber: string;
    paymentMethods: string;
    onepayQr: string;
    cash: string;
    card: string;
    scanToPay: string;
    scanDesc: string;
    paidSuccessfully: string;
    thankYou: string;
    thankYouDesc: string;
    viewReceipt: string;
    backToHome: string;
  };
  settings: {
    title: string;
    desc: string;
    language: string;
    currency: string;
    demoSection: string;
    reset: string;
    resetDesc: string;
    resetConfirm: string;
  };
  kitchen: {
    title: string;
    activeTables: string;
    pendingOrders: string;
    markCooking: string;
    markServed: string;
    markServing: string;
    accept: string;
    round: string;
    serviceRequests: string;
    done: string;
  };
}
