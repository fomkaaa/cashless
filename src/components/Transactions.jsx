import React, { useState, useEffect } from "react";
import "./Transactions.css";

export default function TransactionsPage({ addNotification }) {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [currentCardBalance, setCurrentCardBalance] = useState(null);

  // Завантажуємо карти з localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("cards");
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error("Помилка при парсингу карт:", e);
      }
    }
  }, []);

  // Коли вибрали карту — оновлюємо поточний баланс
  useEffect(() => {
    if (selectedCard) {
      const card = cards.find((c) => c.number === selectedCard);
      if (card) {
        setCurrentCardBalance(card.balance);
      }
    } else {
      setCurrentCardBalance(null);
    }
  }, [selectedCard, cards]);

  // Кнопки +100/+200/+500 (сума додається, а не замінюється)
  const addQuickAmount = (value) => {
    setAmount((prev) => {
      const num = Number(prev) || 0;
      return num + value;
    });
  };

  // Створення транзакції (надходження коштів)
  const handleTransaction = () => {
    if (!amount || !selectedCard) {
      alert("Введіть суму і виберіть карту!");
      return;
    }

    // 1. Витягуємо наявні платежі
    const existingPayments = JSON.parse(localStorage.getItem("payments")) || [];

    // 2. Формуємо дату і час
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toLocaleTimeString("uk-UA"); // ГГ:ХХ:СС

    // 3. Створюємо новий платіж
    const newPayment = {
      id: Date.now(),
      amount: Number(amount),
      date: date,
      time: time, // ← нове поле ЧАС
      status: "В обробці",
      method: "Картка",
      note: "Очікує підтвердження",
      category: category || "Без категорії",
      recipientAccount: selectedCard,
    };

    const updatedPayments = [...existingPayments, newPayment];
    localStorage.setItem("payments", JSON.stringify(updatedPayments));

    // 5. Сповіщення
    setSuccessMessage("Прикладіть карту!");
    setTimeout(() => setSuccessMessage(""), 3000);
    addNotification("Створено платіж: Очікує обробки", "info");

    // 6. Очистка полів
    setAmount("");
    setCategory("");
    setSelectedCard("");
    setCurrentCardBalance(null);
  };

  return (
    <div className="transactions-page">
      {successMessage && <div className="success-popup">{successMessage}</div>}

      <h1>Нова транзакція</h1>

      <div className="transaction-form">
        <label>Сума:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введіть суму"
        />

        {/* Кнопки швидкого додавання суми */}
        <div className="quick-buttons">
          <button onClick={() => addQuickAmount(100)}>+100</button>
          <button onClick={() => addQuickAmount(200)}>+200</button>
          <button onClick={() => addQuickAmount(500)}>+500</button>
        </div>

        <label>Карта для зарахування:</label>
        <select
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
        >
          <option value="">Оберіть карту</option>
          {cards.map((card) => (
            <option key={card.id} value={card.number}>
              {card.number} ({card.bank})
            </option>
          ))}
        </select>

        {currentCardBalance !== null && (
          <p className="balance-info">
            Поточний баланс: <b>{currentCardBalance} ₴</b>
          </p>
        )}

        <label>Категорія надходження:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Наприклад: Зарплата, Переказ від друга..."
        />

        <button onClick={handleTransaction}>Готово</button>
      </div>
    </div>
  );
}
