import React, { useState, useEffect } from "react";
import "./Cards.css";
import cardImage from "../components/cards.png";

export default function CardsPage({ addNotification }) {
  const defaultCards = [
    { id: "c1", number: "1234 5678 9012 3456", bank: "Mono", balance: 5230 },
    { id: "c2", number: "4444 3333 2222 1111", bank: "Privat", balance: 11900 },
    { id: "c3", number: "9999 8888 7777 6666", bank: "A-Bank", balance: 800 },
  ];

  // Використовуємо функцію для початкового стану, щоб врахувати localStorage
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Помилка при парсингу карт:", e);
      }
    }
    return defaultCards;
  });

  const [showModal, setShowModal] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newBank, setNewBank] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Зберігаємо карти в localStorage при будь-якій зміні
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const formatCardNumber = (value) => {
    const onlyNums = value.replace(/\D/g, "").slice(0, 16);
    return onlyNums.replace(/(.{4})/g, "$1 ").trim();
  };

  const addCard = () => {
    if (newNumber.replace(/\s/g, "").length !== 16) {
      alert("Номер картки має містити 16 цифр");
      return;
    }
    if (!newBank.trim()) {
      alert("Вкажіть банк");
      return;
    }

    const randomBalance = Math.floor(Math.random() * 15000 + 500);

    const newCard = {
      id: "card_" + Date.now(),
      number: newNumber,
      bank: newBank,
      balance: randomBalance,
    };

    setCards([...cards, newCard]);
    setShowModal(false);
    setNewNumber("");
    setNewBank("");

    setMessageType("success");
    setSuccessMessage("Картку успішно додано!");
    setTimeout(() => setSuccessMessage(""), 2000);
    addNotification("Карта успішно додана!", "success");
  };

  const deleteCard = (id) => {
    const cardToDelete = cards.find((c) => c.id === id);
    setCards(cards.filter((c) => c.id !== id));

    if (cardToDelete) {
      setMessageType("error");
      setSuccessMessage(`Картку ${cardToDelete.number} успішно видалено!`);
      setTimeout(() => setSuccessMessage(""), 2000);
      addNotification("Карту видалено!", "error");
    }
  };

  return (
    <div className="cards-page">
      {successMessage && (
        <div
          className={
            messageType === "success" ? "success-popup" : "error-popup"
          }
        >
          {successMessage}
        </div>
      )}

      <h1 className="title">Ваші карти</h1>

      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="card-item">
            <img src={cardImage} alt="card" className="card-img" />
            <p className="card-number">{card.number}</p>
            <p className="card-bank">Банк: {card.bank}</p>
            <p className="card-balance">Баланс: {card.balance} ₴</p>
            <button className="delete-btn" onClick={() => deleteCard(card.id)}>
              Видалити
            </button>
          </div>
        ))}

        <div className="card-add" onClick={() => setShowModal(true)}>
          <span>+</span>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Додати нову карту</h2>

            <label>Номер картки:</label>
            <input
              type="text"
              value={newNumber}
              onChange={(e) => setNewNumber(formatCardNumber(e.target.value))}
              placeholder="____ ____ ____ ____"
              className="modal-input"
            />

            <label>Банк:</label>
            <input
              type="text"
              value={newBank}
              onChange={(e) => setNewBank(e.target.value)}
              placeholder="Наприклад: Mono, Privat"
              className="modal-input"
            />

            <div className="modal-buttons">
              <button onClick={addCard} className="modal-add-btn">
                Додати карту
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="modal-cancel-btn"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
