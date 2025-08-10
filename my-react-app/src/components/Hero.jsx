import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.header
      className="text-center mt-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      <h2 className="text-5xl font-extrabold leading-tight">
        Создаём будущее <span className="text-indigo-400">вместе</span>
      </h2>
      <p className="mt-6 text-lg text-gray-300">
        Качественный продукт. Современные технологии. Минимум лишнего.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-lg text-lg font-medium transition"
      >
        Начать сейчас
      </motion.button>
    </motion.header>
  );
}
