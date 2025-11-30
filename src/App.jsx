import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./components/Auth";
import Header from "./components/Header";
import Payments from "./components/Payments";
import Transactions from "./components/Transactions";
import Cards from "./components/Cards";
import Footer from "./components/Footer";
import Home from "./components/Home";

import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // 🔔 Сповіщення (тепер з localStorage)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

const addNotification = (text, type = "info") => {
  const newNote = {
    id: Date.now(),
    text,
    type,
    time: new Date().toLocaleTimeString(),
    read: false,
  };
  setNotifications((prev) => [newNote, ...prev]);
};

const markAllAsRead = () => {
  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
};

const removeNotification = (id) => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
};

  // Список карт — зберігаємо тут, якщо потрібно
  const [cards, setCards] = useState([
    { id: "c1", number: "1234 5678 9012 3456", bank: "Mono", balance: 5230 },
    { id: "c2", number: "4444 3333 2222 1111", bank: "Privat", balance: 11900 },
    { id: "c3", number: "9999 8888 7777 6666", bank: "A-Bank", balance: 800 },
  ]);

  useEffect(() => {
    const isLogged = localStorage.getItem("loggedIn");
    if (isLogged === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  return (
    <div className="app-wrapper">
      {!loggedIn ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Router>
          {/* 🔔 Передаємо сповіщення в хедер */}
          <Header
            onLogout={handleLogout}
            notifications={notifications}
            markAllAsRead={markAllAsRead}
            removeNotification={removeNotification}
          />

          <main className="content">
            <Routes>
              {/* ГОЛОВНА */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />

              {/* Платежі */}
              <Route
                path="/payments"
                element={<Payments addNotification={addNotification} />}
              />

              {/* Транзакції */}
              <Route
                path="/transactions"
                element={<Transactions addNotification={addNotification} />}
              />

              {/* Карти */}
              <Route
                path="/cards"
                element={
                  <Cards
                    addNotification={addNotification}
                    cards={cards}
                    setCards={setCards}
                  />
                }
              />

              {/* Якщо шлях неправильний — перекидуємо на головну */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </Router>
      )}
    </div>
  );
}

export default App;
