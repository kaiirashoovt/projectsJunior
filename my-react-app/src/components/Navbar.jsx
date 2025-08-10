import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-semibold tracking-wide text-white hover:text-indigo-400 transition-colors"
        >
          Kokonai Hub
        </Link>

        <div className="hidden md:flex gap-8">
          {[
            { to: "/home", label: "Главная" },
            { to: "/about", label: "О нас" },
            { to: "/contact", label: "Контакты" },
            { to: "/login", label: "Войти" },

          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-white/90 hover:text-white transition-colors duration-200"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <button
          className="md:hidden text-3xl text-white focus:outline-none hover:text-indigo-400 transition-colors"
          onClick={() => setIsOpen(true)}
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
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6">
          {[
            { to: "/", label: "Главная" },
            { to: "/about", label: "О нас" },
            { to: "/contact", label: "Контакты" },
            { to: "/login", label: "Войти" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </nav>
  );
}
