import { motion } from "framer-motion";
import { useNavigate  } from "react-router-dom";
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
  const navigate = useNavigate();
  const cards = [
    { title: "О нас", description: "Ознакомьтесь с нашими проектами и узнайте о нас больше", link: "#" },
    { title: "Контакты", description: "Контакты, социальные сети и прочее", link: "/contact" },
    { title: "Мой GitHub", description: "Ссылка на мой профиль GitHub", link: "https://github.com/kaiirashoovt" },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <section className="py-20 flex flex-col items-center justify-center">
        <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="85, 0, 255"
        />
      </section>


    </div>
  );
}
