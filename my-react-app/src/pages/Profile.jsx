import React, { useState, useEffect } from "react";
import { Settings, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import Tiptap from "../components/TipTap";
import { Loader2 } from "lucide-react";

async function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const mod = await import("jwt-decode");
    const decodeFunc = mod.jwtDecode;
    const decoded = decodeFunc(token);
    return decoded.sub || null;
  } catch (e) {
    console.error("Ошибка декодирования токена:", e);
    return null;
  }
}

function ProfilePage() {
  const [user_email, setUserEmail] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bioDraft, setBioDraft] = useState(formData.bio);

  useEffect(() => {
    if (!isEditing) {
      setBioDraft(formData.bio);
    }
  }, [formData.bio, isEditing]);

  useEffect(() => {
    async function loadUserEmail() {
      const email = await getUserIdFromToken();
      if (email) {
        setUserEmail(email);
      } else {
        setError("Пользователь не авторизован");
      }
    }
    loadUserEmail();
  }, []);

  useEffect(() => {
    if (!user_email) return;

    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://my-fastapi-backend-f4e2.onrender.com/api/users/${user_email}`
        );
        if (!res.ok) throw new Error("Не удалось загрузить профиль");
        const data = await res.json();
        setUser(data);
        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          avatarUrl: data.avatarurl || "",
        });
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [user_email]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    try {
      const updatedData = { ...formData, bio: bioDraft };
      const res = await fetch(
        `https://my-fastapi-backend-f4e2.onrender.com/api/user_update/${user_email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) throw new Error("Ошибка при сохранении");
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (error && !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white bg-gradient-to-br from-teal-500 via-teal-400 to-cyan-500 gap-4">
        <p>{error}</p>
        <a href="/login" className="text-teal-100 hover:underline">
          Войти
        </a>
      </div>
    );
  }

  if (!user_email) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gradient-to-br from-teal-500 via-teal-400 to-cyan-500">
        {error || "Пользователь не найден"}
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-teal-500 via-teal-400 to-cyan-500 text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
        <p className="text-lg">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-400 to-cyan-500 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 mt-20"
      >
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-teal-400"
            />
          ) : (
            <CircleUserRound className="w-24 h-24 rounded-full text-teal-300" />
          )}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-semibold">
              {user?.fullname || user?.email || "Пользователь"}
            </h1>
            {user?.fullname && <p className="text-white/80">{user?.email}</p>}
            <p className="text-white/70">{user?.phone || ""}</p>
          </div>
        </header>

        {/* Body */}
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6 max-w-lg mx-auto"
          >
            <div>
              <label htmlFor="fullname" className="block mb-1 font-medium">
                ФИО
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder:text-white/60 border border-white/30 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/20 text-white placeholder:text-white/60 border border-white/30 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-1 font-medium">
                Телефон
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/20 text-white placeholder:text-white/60 border border-white/30 rounded focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block mb-1 font-medium">
                О себе
              </label>
              <Tiptap value={bioDraft} onChange={setBioDraft} />
            </div>
          </form>
        ) : (
          <section className="max-w-lg prose prose-invert">
            <h2 className="text-xl font-bold">О себе</h2>
            {user?.bio ? (
              <div dangerouslySetInnerHTML={{ __html: user.bio }} />
            ) : (
              <p className="text-white/70">
                Пользователь пока ничего не написал.
              </p>
            )}
          </section>
        )}

        {/* Buttons */}
        {isEditing ? (
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition flex items-center"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              Сохранить
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition"
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="mt-6 ml-auto px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition flex items-center"
          >
            <Settings className="mr-2" />
            Редактировать
          </button>
        )}
      </motion.div>
    </div>
  );
}

export default ProfilePage;
