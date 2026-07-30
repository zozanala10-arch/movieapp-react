import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Footer.css";

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <h2>{t("appName")}</h2>
          <p>{t("footerDesc")}</p>
        </div>

        <div className="footer-section links">
          <h3>{t("home")} & {t("favorites")}</h3>
          <ul>
            <li>
              <Link to="/">{t("home")}</Link>
            </li>
            <li>
              <Link to="/favorites">{t("favorites")}</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3>{t("followUs")}</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              FB
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              TW
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              IG
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {t("appName")}. {t("rights")}</p>
      </div>
    </footer>
  );
}

export default Footer;
