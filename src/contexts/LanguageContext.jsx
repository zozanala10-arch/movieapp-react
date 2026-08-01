import { createContext, useState, useContext, useEffect } from "react";

const LanguageContext = createContext();

const translation = {
  en : {
    appName: "Movie App",  
    home: "Home",
    favorites: "Favorites",
    searchPlaceholder: "Search for movies...",
    searchBtn: "Search",
    loading: "Loading...",
    errorLoad: "Failed to load movies...",
    errorSearch: "Failed to search movies...",
    yourFavorites: "Your Favorites",
    noFavorites: "No favorite movies yet",
    favoritesDesc: "Start adding movies to your favorites and they will appear here",
    backBrowse: "← Back to Browse",
    rating: "Rating:",
    overview: "Overview",
    loadingDetails: "Loading details...",
    movieNotFound: "Movie not found",
    backHome: "Back to Home",
    error: "Error",
    footerDesc: "Your ultimate destination for movie details, ratings, and saving your favorites.",
    followUs: "Follow Us",
    rights: "All rights reserved.",
    headerTitle: "Find Your Next Story",
    headerSubtitle: "Explore thousands of movies, keep track of your favorites, and search by genre.",
    catTrending: "Trending",
    catAction: "Action",
    catComedy: "Comedy",
    catDrama: "Drama",
    catSciFi: "Sci-Fi",
    
  },
  ar: {
    appName: "تطبيق الأفلام",
    home: "الرئيسية",
    favorites: "المفضلة",
    searchPlaceholder: "ابحث عن أفلام...",
    searchBtn: "بحث",
    loading: "جاري التحميل...",
    errorLoad: "فشل تحميل الأفلام...",
    errorSearch: "فشل البحث عن الأفلام...",
    yourFavorites: "أفلامك المفضلة",
    noFavorites: "لا توجد أفلام مفضلة بعد",
    favoritesDesc: "ابدأ بإضافة الأفلام إلى مفضلتك وستظهر هنا",
    backBrowse: "← العودة للتصفح",
    rating: "التقييم:",
    overview: "نبذة عن الفيلم",
    loadingDetails: "جاري تحميل التفاصيل...",
    movieNotFound: "الفيلم غير موجود",
    backHome: "العودة للرئيسية",
    error: "خطأ",
    footerDesc: "وجهتك النهائية للحصول على تفاصيل الأفلام، والتقييمات، وحفظ أفلامك المفضلة.",
    followUs: "تابعنا",
    rights: "جميع الحقوق محفوظة.",
    headerTitle: "ابحث عن قصتك التالية",
    headerSubtitle: "استكشف آلاف الأفلام، وتابع أفلامك المفضلة، وابحث حسب التصنيف.",
    catTrending: "الشائع",
    catAction: "أكشن",
    catComedy: "كوميدي",
    catDrama: "دراما",
    catSciFi: "خيال علمي",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("appLanguage") || "en";
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("appLanguage", lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translation[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
