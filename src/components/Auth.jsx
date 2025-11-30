import { useState } from "react";
import "./Auth.css";

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register

  // Поля реєстрації
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [ipn, setIpn] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Помилка
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!fullName.trim()) {
        return setError("Введіть ПІБ");
      }
      if (password !== confirmPassword) {
        return setError("Паролі не співпадають");
      }
      if (ipn.length !== 10) {
        return setError("ІПН має складатися з 10 цифр");
      }
      if (!phone.match(/^\+380\d{9}$/)) {
        return setError("Номер телефону повинен бути у форматі +380XXXXXXXXX");
      }
    }

    if (email && password) {
      onLogin(); // для тесту — вхід після реєстрації/логіну
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === "login" ? "Вхід" : "Реєстрація"}</h2>

        <form onSubmit={handleSubmit}>
          {/* ▦ ФОРМА ДЛЯ РЕЄСТРАЦІЇ */}
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="ПІБ"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="ІПН (10 цифр)"
                value={ipn}
                onChange={(e) => setIpn(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Номер телефону (+380...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}

          {/* ▦ СПІЛЬНІ ПОЛЯ */}
          <input
            type="email"
            placeholder="Електронна адреса"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "register" && (
            <input
              type="password"
              placeholder="Підтвердіть пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit">
            {mode === "login" ? "Увійти" : "Зареєструватися"}
          </button>
        </form>

        <p className="switch">
          {mode === "login" ? (
            <>
              Немає акаунта?
              <span onClick={() => setMode("register")}> Зареєструватися</span>
            </>
          ) : (
            <>
              Вже зареєстровані?
              <span onClick={() => setMode("login")}> Увійти</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
