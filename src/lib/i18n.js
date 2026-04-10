import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "explore_menu": "Explore our",
      "menu_highlight": "Menu",
      "top_rated": "Top Rated",
      "restaurants": "Restaurants",
      "find_us": "Find",
      "us": "Us",
      "search_placeholder": "Search food, restaurants...",
      "all_categories": "All Categories",
      "fast_food": "Fast Food",
      "traditional": "Traditional",
      "pizza": "Pizza",
      "healthy": "Healthy",
      "drinks": "Drinks",
      "desserts": "Desserts",
      "login": "Login",
      "cart": "Cart",
      "checkout": "Checkout",
      "total": "Total",
      "order_whatsapp": "Order via WhatsApp",
      "merchant_dashboard": "Merchant Dashboard",
      "admin_dashboard": "Admin Dashboard",
      "add_item": "Add Item",
      "inventory": "Inventory",
      "media": "Media",
      "live_orders": "Live Orders",
      "settings": "Settings",
      "empty_menu": "Menu is Empty",
      "view_menu": "View Menu & Order",
      "address": "Address",
      "hours": "Hours",
      "reviews": "Reviews",
      "write_review": "Write a Review",
      "submit_review": "Submit",
      "rating": "Rating",
      "comment": "Comment (optional)",
      "hot_list": "Hot List",
      "best_sellers": "Best Sellers"
    }
  },
  fr: {
    translation: {
      "home": "Accueil",
      "explore_menu": "Explorez notre",
      "menu_highlight": "Menu",
      "top_rated": "Les Mieux Notés",
      "restaurants": "Restaurants",
      "find_us": "Trouvez",
      "us": "Nous",
      "search_placeholder": "Rechercher des plats, restaurants...",
      "all_categories": "Toutes Catégories",
      "fast_food": "Restauration Rapide",
      "traditional": "Traditionnel",
      "pizza": "Pizza",
      "healthy": "Sain",
      "drinks": "Boissons",
      "desserts": "Desserts",
      "login": "Connexion",
      "cart": "Panier",
      "checkout": "Payer",
      "total": "Total",
      "order_whatsapp": "Commander via WhatsApp",
      "merchant_dashboard": "Tableau de bord Vendeur",
      "admin_dashboard": "Tableau de bord Admin",
      "add_item": "Ajouter un article",
      "inventory": "Inventaire",
      "media": "Médias",
      "live_orders": "Commandes en direct",
      "settings": "Paramètres",
      "empty_menu": "Le menu est vide",
      "view_menu": "Voir le Menu & Commander",
      "address": "Adresse",
      "hours": "Horaires",
      "reviews": "Avis",
      "write_review": "Rédiger un avis",
      "submit_review": "Soumettre",
      "rating": "Note",
      "comment": "Commentaire (optionnel)",
      "hot_list": "Liste Tendance",
      "best_sellers": "Meilleures ventes"
    }
  },
  ar: {
    translation: {
      "home": "الرئيسية",
      "explore_menu": "استكشف",
      "menu_highlight": "قائمة طعامنا",
      "top_rated": "الأعلى تقييماً",
      "restaurants": "المطاعم",
      "find_us": "ابحث",
      "us": "عنا",
      "search_placeholder": "ابحث عن طعام، مطاعم...",
      "all_categories": "جميع الفئات",
      "fast_food": "وجبات سريعة",
      "traditional": "تقليدي",
      "pizza": "بيتزا",
      "healthy": "صحي",
      "drinks": "مشروبات",
      "desserts": "حلويات",
      "login": "تسجيل الدخول",
      "cart": "عربة التسوق",
      "checkout": "الدفع",
      "total": "المجموع",
      "order_whatsapp": "أطلب عبر واتساب",
      "merchant_dashboard": "لوحة تحكم البائع",
      "admin_dashboard": "لوحة تحكم المشرف",
      "add_item": "إضافة عنصر",
      "inventory": "المخزون",
      "media": "الوسائط",
      "live_orders": "الطلبات المباشرة",
      "settings": "الإعدادات",
      "empty_menu": "القائمة فارغة",
      "view_menu": "عرض القائمة والطلب",
      "address": "العنوان",
      "hours": "ساعات العمل",
      "reviews": "التقييمات",
      "write_review": "كتابة تقييم",
      "submit_review": "إرسال",
      "rating": "التقييم",
      "comment": "تعليق (اختياري)",
      "hot_list": "القائمة الساخنة",
      "best_sellers": "أفضل المبيعات"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
