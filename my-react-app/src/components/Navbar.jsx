import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth/isAuthenticated";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const { theme, toggle } = useTheme();

  const commonMenuItems = [
    { to: "/", label: "Главная" },
    { to: "/about", label: "О нас" },
    { to: "/contact", label: "Контакты" },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    async function checkAuth() {
      const result = await isAuthenticated();
      setAuth(result);
    }
    checkAuth();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      <Link
        to="/"
        className="group flex items-center gap-2 text-2xl font-semibold tracking-wide text-white transition-colors"
      >
        <svg
          viewBox="0 0 1600 200"
          className="w-60 h-12 transition-transform duration-200 group-hover:scale-110"
          aria-label="Kokonai Hub logo"
        >
          <image
            href="/logo-var-1.png"
            x="0"
            y="0"
            width="1600"
            height="200"
            preserveAspectRatio="xMidYMid slice"
            className="transition-filter duration-200 group-hover:brightness-110"
          />
        </svg>
      </Link>



        <div className="hidden md:flex gap-8 items-center">
          {commonMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-white/90 hover:text-white transition-colors duration-200"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {!auth && (
            <Link
              to="/login"
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              Войти
            </Link>
          )}

          {auth && (
            <div className="flex items-center gap-4 text-white">
              <span>Привет, {user?.name || "User"}</span>
              <button
                onClick={async () => {
                      try {
                        const response = await fetch("https://my-fastapi-backend-f4e2.onrender.com/api/logout", {
                          method: "POST",
                          headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                          }
                        });
                
                        if (!response.ok) {
                          console.warn("Ошибка при logout:", response.status);
                        }
                      } catch (error) {
                        console.error("Ошибка logout:", error);
                      } finally {
                        localStorage.removeItem("token");
                        navigate("/login");
                        toast.info("Вы вышли!", {
                          className: "bg-green-600 text-white font-bold",
                          bodyClassName: "text-sm",
                          progressClassName: "bg-white"
                        });
                      }
                    }}
                className="text-indigo-400 hover:text-indigo-600 transition-colors text-left"
              >
                Выйти
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-3xl text-white focus:outline-none hover:text-indigo-400 transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть меню"
        >
          ☰
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900/80 backdrop-blur-lg border-l border-white/10 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">Меню</h2>
          <button
            className="text-2xl text-white hover:text-red-400 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6 text-white">
          {commonMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {!auth && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-400 transition-colors"
            >
              Войти
            </Link>
          )}

          {auth && (
            <div className="flex flex-col gap-2 mt-4">
              <span>Привет, {user?.name || "User"}</span>
              <button
                onClick={async () => {
                      try {
                        const response = await fetch("https://my-fastapi-backend-f4e2.onrender.com/api/logout", {
                          method: "POST",
                          headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                          }
                        });
                
                        if (!response.ok) {
                          console.warn("Ошибка при logout:", response.status);
                        }
                      } catch (error) {
                        console.error("Ошибка logout:", error);
                      } finally {
                        localStorage.removeItem("token");
                        navigate("/login");
                        toast.info("Вы вышли!", {
                          className: "bg-green-600 text-white font-bold",
                          bodyClassName: "text-sm",
                          progressClassName: "bg-white"
                        });
                      }
                    }}
                className="text-indigo-400 hover:text-indigo-600 transition-colors text-left"
              >
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </nav>
  );
}
