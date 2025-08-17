import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HomeIcon, Archive, User, Settings, Github } from "lucide-react";

// Варианты для контейнера (staggerChildren делает задержку автоматически)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // staggerChildren: 0.25, // автоматически задерживает элементы списка
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  "Пробуем всё, что движется (и даже то, что не движется, но можно заставить работать кодом)",
  "Исследуем разные IT-направления: от веба до искусственного интеллекта",
  "Запускаем проекты, которые могут стать чем-то большим… или просто мемом в чате",
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-6 py-10">
      

      {/* Фото */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-10  max-w-sm sm:max-w-md"
      >
        <img
          src="/logo-var-1.png"
          alt="Наша команда"
          loading="lazy"
          className="rounded-xl shadow-lg w-full transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>

      {/* Основной текст */}
      <section className="mt-8 text-base sm:text-lg max-w-2xl text-center leading-relaxed space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <strong>Kokonai Hub</strong> — это не просто сайт, а будущий (если
          повезёт <span aria-hidden="true">🤞</span>) стартап, который собирается
          изучать все уголки и закоулки мира IT.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-semibold"
        >
          Что мы делаем:
        </motion.p>

        {/* Список с анимацией (через containerVariants + staggerChildren) */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="list-disc pl-5 text-left w-full max-w-md mx-auto space-y-2"
        >
          {features.map((text, i) => (
            <motion.li
              key={i}
              variants={itemVariants}
              className="hover:text-purple-400 transition-colors duration-300"
            >
              {text}
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Kokonai Hub — это про эксперименты, ошибки, открытия и вечную веру, что
          следующий проект точно «выстрелит»{" "}
          <span aria-hidden="true">🚀</span>
        </motion.p>
      </section>
    </main>
  );
}
