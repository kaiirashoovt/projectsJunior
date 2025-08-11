import React, { useState, useEffect } from "react";
import {Settings} from  "lucide-react"



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

      const res = await fetch(`https://my-fastapi-backend-f4e2.onrender.com/api/user_update/${user_email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 font-sans p-8 mx-auto">
      <header className="flex items-center space-x-6 mt-10 mb-8">
        <img
          src={formData.avatarUrl || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border-2 border-purple-600"
        />
        <div>
          <h1 className="text-3xl font-semibold">{user?.fullname || user?.email || "Пользователь"}</h1>
          {user?.fullname && <p className="text-gray-400">{user?.email}</p>}
          <p className="text-gray-400">{user?.phone || ""}</p>
        </div>
        <button
        onClick={() => setEditing((v) => !v)}
        className="ml-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none flex items-center"
        aria-label={isEditing ? "Отменить редактирование" : "Редактировать профиль"}
        >
        {isEditing ? (
        "Отмена"
        ) : (
        <>
            <Settings className="mr-2" />
            Редактировать
        </>
        )}
        </button>
      </header>

      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6 max-w-lg"
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
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Расскажите о себе"
              className="w-full px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              type="button"
              onClick={() => setEditing(false)}
              className="px-6 py-3 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              Отмена
            </button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      ) : (
        <section className="max-w-lg prose prose-invert">
          <h2>О себе</h2>
          <p>{user?.bio || "Пользователь пока ничего не написал."}</p>
        </section>
      )}
    </div>
  );
}

export default ProfilePage;
