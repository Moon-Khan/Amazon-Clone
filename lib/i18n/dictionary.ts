export type Locale = "en" | "es";

export const LOCALES: { value: Locale; label: string; flag: string }[] = [
  { value: "en", label: "English - EN", flag: "🇺🇸" },
  { value: "es", label: "español - ES", flag: "🇪🇸" },
];

const en = {
  deliveringToAccount: "Delivering to your area",
  updateLocation: "Update location",
  returns: "Returns",
  andOrders: "& Orders",
  cart: "Cart",
  helloSignIn: "Hello, sign in",
  helloName: "Hello, {name}",
  accountAndLists: "Account & Lists",
  todaysDeals: "Today's Deals",
  buyAgain: "Buy Again",
  groceries: "Groceries",
  electronics: "Electronics",
  fashion: "Fashion",
  homeKitchen: "Home & Kitchen",
  fastFreeDelivery: "Fast, free delivery on eligible orders",
  all: "All",
  backToTop: "Back to top",
  getToKnowUs: "Get to Know Us",
  makeMoneyWithUs: "Make Money with Us",
  paymentProducts: "Payment Products",
  letUsHelpYou: "Let Us Help You",
  changeLanguage: "Change language",
  shoppingOn: "You are shopping on Amazon Clone.",
} as const;

const es: Record<keyof typeof en, string> = {
  deliveringToAccount: "Entregando en tu zona",
  updateLocation: "Actualizar ubicación",
  returns: "Devoluciones",
  andOrders: "y pedidos",
  cart: "Carrito",
  helloSignIn: "Hola, identifícate",
  helloName: "Hola, {name}",
  accountAndLists: "Cuentas y listas",
  todaysDeals: "Ofertas de hoy",
  buyAgain: "Comprar de nuevo",
  groceries: "Supermercado",
  electronics: "Electrónica",
  fashion: "Moda",
  homeKitchen: "Hogar y cocina",
  fastFreeDelivery: "Entrega gratis y rápida en pedidos elegibles",
  all: "Todo",
  backToTop: "Volver arriba",
  getToKnowUs: "Conócenos",
  makeMoneyWithUs: "Gana dinero con nosotros",
  paymentProducts: "Productos de pago",
  letUsHelpYou: "Ayúdanos a ayudarte",
  changeLanguage: "Cambiar idioma",
  shoppingOn: "Estás comprando en Amazon Clone.",
};

export const DICTIONARIES: Record<Locale, Record<keyof typeof en, string>> = { en, es };
export type DictionaryKey = keyof typeof en;
