import { useState, useEffect, useRef } from "react";
import "./Header.css";

export default function Header({
  onLogout,
  notifications,
  markAllAsRead,
  removeNotification,
}) {
  const [open, setOpen] = useState(false);

  const panelRef = useRef(null);
  const iconRef = useRef(null);
  const hideTimer = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // клік поза панеллю → закрити
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        iconRef.current &&
        !iconRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    const newState = !open;
    setOpen(newState);
    if (newState) {
      // відкрили панель → ставимо все як прочитане
      markAllAsRead();
    }
  };

  // автозакриття через 3 секунди після виходу мишки
  const startHideTimer = () => {
    hideTimer.current = setTimeout(() => setOpen(false), 3000);
  };

  const stopHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
  };

  return (
    <header className="header">
      <div className="logo">Cashless Payments</div>

      <div className="nav">
        <a href="/home">Головна</a>
        <a href="/payments">Платежі</a>
        <a href="/transactions">Термінал</a>
        <a href="/cards">Карти</a>

        {/* 🔔 Дзвіночок + червона крапка */}
        <div
          className="notif-wrapper"
          onClick={toggleNotifications}
          ref={iconRef}
        >
          <span className="notif-icon">🔔</span>
          {unreadCount > 0 && (
            <span className="notif-count">{unreadCount}</span>
          )}
        </div>

        <button className="logout-btn" onClick={onLogout}>
          Вийти
        </button>
      </div>

      {/* Панель сповіщень */}
      {open && (
        <div
          className="notif-panel"
          ref={panelRef}
          onMouseEnter={stopHideTimer}
          onMouseLeave={startHideTimer}
        >
          {notifications.length === 0 ? (
            <p className="empty">Сповіщень немає</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`notif-item ${n.type}`}>
                <div className="notif-text">
                  <b>{n.time}</b>
                  <br />
                  {n.text}
                </div>
                <button
                  className="notif-close"
                  onClick={() => removeNotification(n.id)}
                >
                  ✖
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </header>
  );
}
