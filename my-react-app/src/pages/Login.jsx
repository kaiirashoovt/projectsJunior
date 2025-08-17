import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      toast.error("Заполните все поля");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Введите корректный email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "https://my-fastapi-backend-f4e2.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.message || "Ошибка авторизации"
        );
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      toast.success("Вы успешно вошли!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Левая часть с приветствием */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-900 via-cyan-800 to-gray-900 text-white items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-10"
        >
          <h1 className="text-5xl font-extrabold mb-6">Добро пожаловать</h1>
          <p className="text-lg text-gray-100 max-w-md mx-auto">
            Войдите в систему, чтобы получить доступ к вашему профилю и персонализированным функциям.
          </p>
        </motion.div>
      </div>

      {/* Правая часть с формой */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-900 px-6">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Вход</h2>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Введите Email"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Войти"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-cyan-400 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </motion.div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
