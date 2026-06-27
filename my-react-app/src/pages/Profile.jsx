import React, { useState, useEffect } from "react";
import { Settings, CircleUserRound, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Tiptap from "../components/TipTap";
import { Loader2 } from "lucide-react";
import { getCurrentUserEmail } from "../shared/api/auth";
import { getUserByEmail, updateUserByEmail } from "../shared/api/users";
import { Link } from "react-router-dom";

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
    function loadUserEmail() {
      const email = getCurrentUserEmail();
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
        const data = await getUserByEmail(user_email);
        setUser(data);
        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
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
      const updatedUser = await updateUserByEmail(user_email, updatedData);
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
      <div className="min-h-screen bg-[#090b10] text-white">
        <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-white/10 bg-black/20 p-6">
            <p className="text-slate-300 mb-4">{error}</p>
            <Link to="/login" className="text-cyan-300 hover:text-cyan-200 transition flex items-center gap-2">
              <ArrowLeft size={18} />
              Вернуться к входу
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!user_email) {
    return (
      <div className="min-h-screen bg-[#090b10] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-300 mx-auto mb-4" />
          <p className="text-slate-300">{error || "Пользователь не найден"}</p>
        </div>
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#090b10] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-300 mx-auto mb-4" />
          <p className="text-slate-300">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-white">
      <main className="mx-auto w-full max-w-7xl px-4 pt-24 pb-24 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link 
          to="/home" 
          className="mb-6 inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition text-sm"
        >
          <ArrowLeft size={18} />
          Назад
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Avatar & Info Card */}
          <div className="lg:col-span-1 rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(17,24,39,0.82))] p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-2 border-cyan-400/50"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-black/30 border-2 border-cyan-400/30 flex items-center justify-center">
                    <CircleUserRound className="w-16 h-16 text-cyan-300/70" />
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-semibold text-white">
                {user?.fullname || user?.email || "Пользователь"}
              </h1>
              {user?.fullname && (
                <p className="text-sm text-slate-400 mt-2">{user?.email}</p>
              )}
              {user?.phone && (
                <p className="text-sm text-slate-400 mt-1">{user?.phone}</p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(17,24,39,0.82))] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">О себе</h2>
              </div>

              {isEditing ? (
                <div>
                  <label htmlFor="bio" className="block mb-3 text-sm font-medium text-slate-300">
                    Описание профиля
                  </label>
                  <Tiptap value={bioDraft} onChange={setBioDraft} />
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {user?.bio ? (
                    <div 
                      className="text-slate-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: user.bio }} 
                    />
                  ) : (
                    <p className="text-slate-400 italic text-sm">
                      Пользователь пока ничего не написал.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Form Fields */}
            {isEditing && (
              <div className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(17,24,39,0.82))] p-6 space-y-4">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-slate-300 mb-2">
                    ФИО
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Введите ваше имя"
                    className="w-full px-4 py-2.5 bg-black/20 text-white placeholder:text-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent focus:outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 bg-black/20 text-white placeholder:text-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent focus:outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    Телефон
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    className="w-full px-4 py-2.5 bg-black/20 text-white placeholder:text-white/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg transition text-sm font-medium border border-white/10"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition text-sm font-medium flex items-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Сохранить
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition text-sm font-medium flex items-center gap-2"
                >
                  <Settings size={18} />
                  Редактировать 
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProfilePage;