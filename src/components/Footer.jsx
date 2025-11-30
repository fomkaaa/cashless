import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <p className="footer-title">Контакти</p>
        <p>Email: support@cashless.com</p>
        <p>Телефон: +380 50 123 45 67</p>
        <a
          href="https://t.me/your_bot"
          target="_blank"
          className="footer-link footer-bot"
        >
          💬 Telegram чат-бот
        </a>
      </div>

      <div className="footer-section">
        <a href="#" className="footer-link">
          Політика конфіденційності
        </a>
        <a href="#" className="footer-link">
          Умови використання
        </a>
      </div>

      <div className="footer-section">
        <p>Зроблено з ♡ в Україні</p>
        <p>© {new Date().getFullYear()} Cashless Payments</p>
      </div>
    </footer>
  );
}
