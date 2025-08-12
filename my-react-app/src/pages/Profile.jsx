import React, { useState, useEffect } from "react";
import {Settings,CircleUserRound } from  "lucide-react"
import { motion } from "framer-motion";
import Tiptap from "../components/TipTap";



async function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const mod = await import("jwt-decode");
    const decodeFunc = mod.jwtDecode;
    const decoded = decodeFunc(token);
    console.log(decoded);
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
      const res = await fetch(`https://my-fastapi-backend-f4e2.onrender.com/api/users/${user_email}`);
      if (!res.ok) throw new Error("Не удалось загрузить профиль");
      const data = await res.json();
      setUser(data);
      setFormData({
        fullname: data.fullname || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        avatarurl: data.avatarurl || "",
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
        console.log("Отправляем данные:", user_email, formData);
      const updatedData = { ...formData, bio: bioDraft };
      const res = await fetch(`https://my-fastapi-backend-f4e2.onrender.com/api/user_update/${user_email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
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

  if (!user_email) {
    return (
      <div className="text-red-500 p-4 bg-gray-900 rounded max-w-md mx-auto mt-10 text-center">
        {error || "Пользователь не найден"}
      </div>
    );
  }

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 bg-gray-900">
        Загрузка профиля...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="text-red-600 text-center mt-10 bg-gray-900 p-4 max-w-md mx-auto">
        Ошибка: {error}
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-8">
                {/* min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white */}
  <motion.div className="w-full max-w-3xl  rounded-lg shadow-lg p-8 mt-12 mt-6 mb-8">
        <header className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
  {formData.avatarUrl ? (
    <img
      src={formData.avatarUrl}
      alt="Avatar"
      className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
    />
  ) : (
    <CircleUserRound className="w-24 h-24 rounded-full text-purple-600" />
  )}
  <div className="text-center sm:text-left flex-1">
    <h1 className="text-3xl font-semibold">{user?.fullname || user?.email || "Пользователь"}</h1>
    {user?.fullname && <p className="text-gray-400">{user?.email}</p>}
    <p className="text-gray-400">{user?.phone || ""}</p>
  </div>

</header>


      {isEditing ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        
      }}
      className="space-y-6 max-w-lg mx-auto px-2 sm:px-0"
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
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="ФИО отсутствует"
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
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Телефон отсутствует"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1 font-medium">
              О себе
            </label>
                <Tiptap value={bioDraft} onChange={setBioDraft} />

          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      ) : (
            <section className="max-w-lg prose prose-invert">
            <h2>О себе</h2>
            {user?.bio ? (
              <div
                dangerouslySetInnerHTML={{ __html: user.bio }}
              />
            ) : (
              <p>Пользователь пока ничего не написал.</p>
            )}
          </section>

        
      )}

            {isEditing ? (
<div className="mt-4 sm:mt-0 ml-auto flex space-x-4 ">
  <button
    onClick={() => handleSave()}
    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors focus:outline-none flex items-center"
    aria-label="Сохранить"
  > 
    {loading ? (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white items-center"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
    ) : (
      "Сохранить"
    )}
  </button>

  <button
    onClick={() => setEditing(false)}
    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors flex items-center"
    aria-label="Отмена"
  >
    Отмена
  </button>
</div>

) : (
  <button
    onClick={() => setEditing(true)}
    className="mt-4 sm:mt-0 ml-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors focus:outline-none flex items-center"
    aria-label="Редактировать профиль"
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
