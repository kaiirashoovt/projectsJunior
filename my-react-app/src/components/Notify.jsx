import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const notifySuccess = () => toast.success("Успех! Операция выполнена.");
  const notifyError = () => toast.error("Ошибка! Что-то пошло не так.");
  const notifyInfo = () => toast.info("Информация: обновление доступно.");
  const notifyWarning = () => toast.warn("Внимание! Проверьте данные.");

  return (
    <div style={{ padding: 20 }}>
      <h1>Пример React-Toastify</h1>
      <button onClick={notifySuccess} style={{ marginRight: 10 }}>
        Показать успех
      </button>
      <button onClick={notifyError} style={{ marginRight: 10 }}>
        Показать ошибку
      </button>
      <button onClick={notifyInfo} style={{ marginRight: 10 }}>
        Показать информацию
      </button>
      <button onClick={notifyWarning}>Показать предупреждение</button>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
