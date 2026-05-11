import { motion } from "framer-motion";

export default function Widget({ icon: Icon, title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon /> {title}
      </h3>
      <div className="text-gray-400">{children}</div>
    </motion.div>
  );
}
