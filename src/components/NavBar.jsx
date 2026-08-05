import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Navbar.css";

function NavBar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">{t("appName")}</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          {t("home")}
        </Link>
        <Link to="/favorites" className="nav-link">
          {t("favorites")}
        </Link>

        <select
          className="lang-select-btn"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
          <option value="ckb">کوردی</option>
        </select>
      </div>
    </nav>
  );
}

export default NavBar;