import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  Archive,
  User,
  Settings,
  Github,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const items = [
    { icon: <HomeIcon size={18} />, color: '#7C3AED', label: 'Home', onClick: () => navigate("/home") },
    { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <User size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
    { icon: <Github size={18} />, label: 'Github', onClick: () => window.open('https://github.com/kaiirashoovt') },
  ];

  const listVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.4 + i * 0.2, duration: 0.5 }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-6 py-10">
      {/* Заголовок */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
      >
        О нас
      </motion.h1>

      {/* Основной текст */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="text-lg max-w-2xl text-center leading-relaxed space-y-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <strong>Kokonai Hub</strong> — это не просто сайт, а будущий (если повезёт 🤞) стартап,
          который собирается изучать все уголки и закоулки мира IT.
          Мы как кот в коробке Шрёдингера: то ли уже гениальные разработчики,
          то ли ещё только разбираемся, куда тут подключать Wi-Fi.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Что мы делаем:
        </motion.p>

        {/* Список с анимацией */}
        <ul className="list-disc list-inside text-left mx-auto w-fit space-y-2">
          {[
            "Пробуем всё, что движется (и даже то, что не движется, но можно заставить работать кодом)",
            "Исследуем разные IT-направления: от веба до искусственного интеллекта",
            "Запускаем проекты, которые могут стать чем-то большим… или просто мемом в чате",
          ].map((text, i) => (
            <motion.li
              key={i}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              className="hover:text-purple-400 transition-colors duration-300"
            >
              {text}
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Kokonai Hub — это про эксперименты, ошибки, открытия и вечную веру,
          что следующий проект точно «выстрелит». 🚀
        </motion.p>
      </motion.div>

      {/* Фото */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-10 relative group"
      >
        <img
          src="/logo-var-1.png"
          alt="Наша команда"
          className="rounded-2xl shadow-lg w-72 md:w-96 transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </div>
  );
}
