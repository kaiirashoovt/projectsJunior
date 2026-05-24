import { motion } from "framer-motion";

export default function Widget({ icon: Icon, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="h-full rounded-lg border border-white/10 bg-white/[0.04] p-5"
    >
      <header className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-cyan-200" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </header>
      <div className="text-slate-300">{children}</div>
    </motion.section>
  );
}
