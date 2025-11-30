import React, { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    const savedPayments = JSON.parse(localStorage.getItem("payments")) || [];

    setCards(savedCards);
    setPayments(savedPayments);
  }, []);

  // 1. Загальний баланс по всіх картках
  const totalBalance = cards.reduce(
    (sum, card) => sum + (card.balance || 0),
    0
  );

  // 2. Кількість транзакцій за сьогодні
  const today = new Date().toISOString().split("T")[0];
  const todayTransactions = payments.filter((p) => p.date === today).length;

  // 3. Платежі в обробці
  const processingPayments = payments.filter(
    (p) => p.status === "В обробці"
  ).length;

  // 4. Останні 5 транзакцій
  const lastPayments = [...payments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="home-page">
      {/* Вітання */}
      <h1 className="welcome">Вітаємо у Cashless Payments!</h1>
      <p className="description">Ваш персональний центр керування платежами.</p>

      {/* Основна статистика */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Загальний баланс</h3>
          <p className="stat-value">{totalBalance} ₴</p>
        </div>

        <div className="stat-card">
          <h3>Транзакцій сьогодні</h3>
          <p className="stat-value">{todayTransactions}</p>
        </div>

        <div className="stat-card">
          <h3>В обробці</h3>
          <p className="stat-value">{processingPayments}</p>
        </div>
      </div>

      {/* Останні 5 транзакцій */}
      <div className="last-transactions">
        <h2>Останні 5 транзакцій</h2>

        {lastPayments.length === 0 ? (
          <p>Немає транзакцій</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Сума</th>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {lastPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.amount} ₴</td>
                  <td>{p.date}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Банер безпеки */}
      <div className="security-banner">
        <h2>🔒 Безпека понад усе</h2>
        <p>
          Всі ваші операції шифруються та обробляються відповідно до сучасних
          стандартів безпеки. Ніколи не передавайте дані вашої картки третім
          особам.
        </p>
      </div>

      {/* Оголошення */}
      <div className="announcements">
        <h2>Оголошення</h2>

        <div className="announcement-card">
          <h3>⚠️ Технічні роботи</h3>
          <p>12 грудня з 03:00 до 06:00 система буде тимчасово недоступна.</p>
        </div>

        <div className="announcement-card">
          <h3>🎉 Нова функція!</h3>
          <p>
            Додано можливість перегляду історії останніх транзакцій на головній
            сторінці.
          </p>
        </div>

        <div className="announcement-card">
          <h3>💰 Акція!</h3>
          <p>Повернення 5% кешбеку на всі платежі до кінця місяця.</p>
        </div>
      </div>

      {/* Партнери */}
      <div className="partners">
        <h2>Наші партнери</h2>

        <div className="partner-logos">
          <div className="partner-item">VISA</div>
          <div className="partner-item">Mastercard</div>
          <div className="partner-item">MonoBank</div>
          <div className="partner-item">PrivatBank</div>
        </div>
      </div>
    </div>
  );
}
