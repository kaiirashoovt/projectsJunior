import { motion } from "framer-motion";

export default function Card2({ index, title, description, link }) {
  return (
    <motion.div
      className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-indigo-500/20 transition"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.2, duration: 0.7 }}
      whileHover={{ scale: 1.03 }}
    >
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <a href={link} className="text-indigo-400 hover:underline">
        Подробнее →
      </a>
    </motion.div>
  );
}
