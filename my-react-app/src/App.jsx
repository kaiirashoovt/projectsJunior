import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import BottomMenu from './components/BottomMenu';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import {HomeIcon,Archive,User,Settings,Github} from "lucide-react";

function AppWrapper() {
  const navigate = useNavigate();
  const items = [
    { icon: <HomeIcon size={18} />, color:'#7C3AED', label: 'Home', onClick: () => navigate("/home") },
    { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <User size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
    { icon: <Github size={18} />, label: 'Github', onClick: () => window.open('https://github.com/kaiirashoovt') },
  ];

  return (
    <div >
      <main >
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>
              <BottomMenu 
        className="fixed bottom-0  z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
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
