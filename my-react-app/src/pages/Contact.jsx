import { motion } from "framer-motion";
import BottomMenu from '../components/BottomMenu';
import {
  HomeIcon,
  Archive,
  User,
  Settings,
  Github,
} from "lucide-react";

export default function Contact() {
    const items = [
    { icon: <HomeIcon size={18} />, color:'#7C3AED', label: 'Home', onClick: () => navigate("/home")},
    { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <User size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
    { icon: <Github size={18} />, label: 'Github', onClick: () => window.open('https://github.com/kaiirashoovt') },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4">
      <motion.div
        className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-4">Свяжитесь с нами</h1>
        <p className="text-gray-300 mb-6">
          Мы всегда готовы ответить на ваши вопросы.
        </p>
        <p className="text-indigo-400 text-lg font-medium">
          example@mail.com
        </p>
      </motion.div>

    </div>
  );
}
