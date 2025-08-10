import { motion } from "framer-motion";
import Hero from "../components/Hero";
import MagicBento from "../components/MagicBento";
import BottomMenu from '../components/BottomMenu';
import {
  HomeIcon,
  Archive,
  User,
  Settings,
  Github,
} from "lucide-react";

export default function Home() {

  const items = [
    { icon: <HomeIcon size={18} />, color:'#7C3AED', label: 'Home', onClick: () => navigate("/home")},
    { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <User size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
    { icon: <Github size={18} />, label: 'Github', onClick: () => window.open('https://github.com/kaiirashoovt') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">







    </div>
  );
}
