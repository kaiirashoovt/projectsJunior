import { useState } from "react";
import { motion } from "framer-motion";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Можно получить ошибку с бэка
        throw new Error(data.message || "Ошибка регистрации");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      alert("Регистрация прошла успешно!");
      window.location.href = "/dashboard"; // редирект после регистрации
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Регистрация</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 bg-red-600 text-white p-3 rounded"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400 text-center">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Войти
          </a>
        </p>
      </motion.div>
    </div>
  );
}
