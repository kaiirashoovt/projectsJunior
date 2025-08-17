import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import BottomMenu from './components/BottomMenu';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import PrivateRoute from "./auth/PrivateRoute"
import { isAuthenticated } from "./auth/isAuthenticated";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from 'react-router-dom';

// import { FaDiscord } from "react-icons/fa";
import {HomeIcon,Archive,User,Settings,Github,LogOut } from "lucide-react";

function AppWrapper() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const items = [
    { icon: <HomeIcon color="#ffffffff" size={18} />, label: 'Домой', onClick: () => navigate("/home") },
    { icon: <Archive color="#ffffffff" size={18} />, label: 'Архив', onClick: () => alert('Ведутся технические работы!') },
    { icon: <User  color="#ffffffff" size={18} />, label: 'Профиль', onClick: async () => {
        const auth = await isAuthenticated();
        if (auth) {
          // console.log("Все ок");
          //   toast.success("Успешно!");

          navigate("/profile");
        } else {
          console.log(auth)
          toast.error("Сначала авторизуйтесь");
          navigate("/login");
        }
      },
    }, 
    { icon: <Settings color="#ffffffff" size={18} />, label: 'Настройки', onClick: () => alert('Ведутся технические работы!') },
    { icon: <Github  color="#ffffffff"size={18} />, label: 'Профиль в Github', onClick: () => window.open('https://github.com/kaiirashoovt') },
    // { lable: 'Наш Discord', onclick: () => window.open('https://discord.gg/KJkGhGCQ') },
  ];

  if (token) {
  items.push({
    icon: <LogOut color="#7C3AED" size={18} />,
    label: "Выйти",
    onClick: async () => {
      try {
        const response = await fetch("https://my-fastapi-backend-f4e2.onrender.com/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          console.warn("Ошибка при logout:", response.status);
        }
      } catch (error) {
        console.error("Ошибка logout:", error);
      } finally {
        localStorage.removeItem("token");
        navigate("/login");
        toast.info("Вы вышли!", {
          className: "bg-green-600 text-white font-bold",
          bodyClassName: "text-sm",
          progressClassName: "bg-white"
        });
      }
    }
  });
}

  return (
    <div >
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/welcome" element={<WelcomePage />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/error" element={<Error />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        {location.pathname !== '/login' && location.pathname !== '/register' && (
          <BottomMenu 
            className="fixed bottom-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        )}
<ToastContainer
  position="bottom-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>

      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
