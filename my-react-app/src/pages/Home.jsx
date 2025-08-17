import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";
import MagicBento from "../components/MagicBento";
import { useTracking } from "../hooks/useTracking";
import { updates } from "../updates";


export default function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);


  useTracking("/home");



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
      
      {/* Основная зона */}
      <main className="flex-1 flex flex-col mt-18">
        {/* Приветствие */}
        <section className="py-10 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
            <div>
              <img src="./logo-var-1.svg"></img>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Привет, гость! 👋</h2>
              <p className="text-gray-400">
                Добро пожаловать на наш проект. Здесь вы найдёте всё самое интересное!
              </p>
            </div>
          </div>

        </section>
        <hr className="text-gray-700"/>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
          <div></div>
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
        

        {/* Места для будущих виджетов */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
          <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">📊 Виджет статистики</h3>
            <p className="text-gray-400">Здесь будет отображаться аналитика.</p>
          </div>
          <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">📰 Новости</h3>
            <p className="text-gray-400">Последние публикации и обновления.</p>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-10">
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
          <div className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">📰 Новости</h3>
            <p className="text-gray-400">Последние публикации и обновления.</p>
          </div>
        </section>
        

        {/* <BottomMenu /> */}
      </main>

      <div className="fixed bottom-4 right-4 w-72">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-t-lg border border-gray-700"
        >
          <span>📢 Обновления</span>
          {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-lg border border-t-0 border-gray-700 rounded-b-lg p-3 max-h-64 overflow-y-auto"
          >
            <ul className="space-y-2 text-sm text-gray-300">
              {updates.map((r, i) => (
                <li
                  key={i}
                  className="p-2 bg-gray-800/40 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="text-green-500">{r.version}</span>
                    <span>{r.date}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {r.changes.map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

          </motion.div>
        )}
      </div>
    </div>
  );
}
