import { useState } from "react";
import "./Payments.css";
import html2pdf from "html2pdf.js";

export default function Payments({ addNotification }) {
  const initialPayments = [
    {
      id: Date.now() + 1,
      amount: 1200,
      date: "2025-11-28",
      status: "Завершено",
      method: "Картка",
      note: "Оплачено вчасно",
      recipientAccount: "UA123456789012345678901234",
    },
    {
      id: Date.now() + 2,
      amount: 500,
      date: "2025-11-27",
      status: "В обробці",
      method: "Картка",
      note: "Очікує підтвердження",
      recipientAccount: "UA987654321098765432109876",
    },
    {
      id: Date.now() + 3,
      amount: 800,
      date: "2025-11-26",
      status: "Відхилено",
      method: "Картка",
      note: "Недостатньо коштів",
      recipientAccount: "UA112233445566778899001122",
    },
  ];

  // ---------------------- STATE ----------------------

  const [payments, setPayments] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("payments"));
    if (saved && saved.length > 0) return saved;
    localStorage.setItem("payments", JSON.stringify(initialPayments));
    return initialPayments;
  });

  const [filterStatus, setFilterStatus] = useState("Всі");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalPayment, setModalPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  // POP-UP СТАВИМО ТУТ
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  // ---------------------- DELETE ----------------------

  const deletePayment = (id) => {
    const updated = payments.filter((p) => p.id !== id);
    setPayments(updated);
    localStorage.setItem("payments", JSON.stringify(updated));

    // 🔔 глобально у Header
    addNotification("Платіж скасовано!", "error");

    // 🔽 локально справа знизу
    setPopupType("error");
    setPopupMessage("Платіж успішно скасовано!");

    setTimeout(() => setPopupMessage(""), 2500);
  };

  // ---------------------- RECEIPT PDF ----------------------

  const downloadReceipt = (payment) => {
    const receiptHTML = `
    <html>
      <head>
        <title>Квитанція ${payment.id}</title>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
          h2 { text-align: center; margin-bottom: 20px; }
          .field b { width: 160px; display: inline-block; }
        </style>
      </head>
      <body>
        <h2>Квитанція про платіж</h2>
        <p class="field"><b>ID:</b> ${payment.id}</p>
        <p class="field"><b>Сума:</b> ${payment.amount} грн</p>
        <p class="field"><b>Дата:</b> ${payment.date}</p>
        <p class="field"><b>Статус:</b> ${payment.status}</p>
        <p class="field"><b>Метод оплати:</b> ${payment.method}</p>
        <p class="field"><b>Рахунок отримувача:</b> ${payment.recipientAccount}</p>
        <p class="field"><b>Примітка:</b> ${payment.note}</p>
      </body>
    </html>
  `;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // ---------------------- FILTER / SORT ----------------------

  const filteredPayments = payments
    .filter((p) => (filterStatus === "Всі" ? true : p.status === filterStatus))
    .filter((p) => {
      if (!searchTerm) return true;
      return (
        p.id.toString().includes(searchTerm.toLowerCase()) ||
        p.amount.toString().includes(searchTerm.toLowerCase())
      );
    });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === "dateAsc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "dateDesc") return new Date(b.date) - new Date(a.date);
    if (sortBy === "amountAsc") return a.amount - b.amount;
    if (sortBy === "amountDesc") return b.amount - a.amount;
    return 0;
  });

  const totalPages = Math.ceil(sortedPayments.length / paymentsPerPage);

  const currentPayments = sortedPayments.slice(
    (currentPage - 1) * paymentsPerPage,
    currentPage * paymentsPerPage
  );

  // ---------------------- RETURN JSX ----------------------

  return (
    <div className="payments-container">
      {/* ⬇⬇⬇ pop-up справа знизу */}
      {popupMessage && (
        <div className={`bottom-popup ${popupType}`}>{popupMessage}</div>
      )}
      {/* ⬆⬆⬆ pop-up */}

      <h2>Платежі</h2>

      <div className="search-payment">
        <input
          type="text"
          placeholder="Пошук по ID або сумі"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters">
        <label>
          Фільтр по статусу:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>Всі</option>
            <option>Завершено</option>
            <option>В обробці</option>
            <option>Відхилено</option>
          </select>
        </label>

        <label>
          Сортування:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dateDesc">Дата ↓</option>
            <option value="dateAsc">Дата ↑</option>
            <option value="amountDesc">Сума ↓</option>
            <option value="amountAsc">Сума ↑</option>
          </select>
        </label>
      </div>

      {/* 📊 Статистика */}
      <div className="payment-stats">
        <div className="stat in-progress">
          <span className="dot blue"></span>В обробці:{" "}
          <b>{payments.filter((p) => p.status === "В обробці").length}</b>
        </div>
        <div className="stat completed">
          <span className="dot green"></span>
          Завершено:{" "}
          <b>{payments.filter((p) => p.status === "Завершено").length}</b>
        </div>
        <div className="stat declined">
          <span className="dot red"></span>
          Відхилено:{" "}
          <b>{payments.filter((p) => p.status === "Відхилено").length}</b>
        </div>
      </div>

      {/* 🧾 Таблиця */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Сума</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Дії</th>
          </tr>
        </thead>

        <tbody>
          {currentPayments.map((p) => (
            <tr key={p.id} className={`status-${p.status.replace(/\s/g, "-")}`}>
              <td>{p.id}</td>
              <td>{p.amount} грн</td>
              <td>{p.date}</td>
              <td>{p.status}</td>

              <td>
                {p.status === "В обробці" && (
                  <button onClick={() => deletePayment(p.id)}>Скасувати</button>
                )}
                {p.status === "Завершено" && (
                  <button
                    onClick={() => downloadReceipt(p)}
                    style={{ background: "#28a745", color: "white" }}
                  >
                    Квитанція
                  </button>
                )}
                <button
                  onClick={() => setModalPayment(p)}
                  style={{
                    marginLeft: "5px",
                    background: "#1e90ff",
                    color: "white",
                  }}
                >
                  Деталі
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 Пагінація */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Попередня
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active-page" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Наступна
        </button>
      </div>

      {/* 🔍 Модалка */}
      {modalPayment && (
        <div className="modal-overlay" onClick={() => setModalPayment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Деталі платежу</h3>

            <p>
              <b>ID:</b> {modalPayment.id}
            </p>
            <p>
              <b>Сума:</b> {modalPayment.amount} грн
            </p>
            <p>
              <b>Дата:</b> {modalPayment.date}
            </p>
            <p>
              <b>Статус:</b> {modalPayment.status}
            </p>
            <p>
              <b>Метод:</b> {modalPayment.method}
            </p>
            <p>
              <b>Рахунок отримувача:</b> {modalPayment.recipientAccount}
            </p>
            <p>
              <b>Примітки:</b> {modalPayment.note}
            </p>
            <p>
              <b>Категорія:</b> {modalPayment.category}
            </p>

            <button onClick={() => setModalPayment(null)}>Закрити</button>
          </div>
        </div>
      )}

      <div id="receipt-template" style={{ display: "none" }}></div>
    </div>
  );
}
