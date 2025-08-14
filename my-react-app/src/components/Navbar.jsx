import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth/isAuthenticated";

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const location = useLocation();
    const token = localStorage.getItem("token");


  const commonMenuItems = [
    { to: "/", label: "Главная" },
    { to: "/about", label: "О нас" },
    { to: "/contact", label: "Контакты" },
  ];

  // Закрываем меню при смене маршрута
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Получаем статус авторизации асинхронно
  useEffect(() => {
    async function checkAuth() {
      const result = await isAuthenticated();
      setAuth(result);
    }
    checkAuth();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
{/* <Link
  to="/"
  className="group flex items-center gap-2 text-2xl font-semibold tracking-wide text-white hover:text-indigo-400 transition-colors"
>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1024 1024"
    className="w-8 h-8 fill-white transition-colors duration-200 group-hover:fill-indigo-400"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0,1024) scale(0.1,-0.1)"
      stroke="none"
    >
<path d="M4985 8536 c-349 -68 -618 -308 -716 -641 -21 -71 -24 -101 -24 -255
0 -153 3 -185 23 -255 88 -306 317 -547 612 -644 249 -82 519 -53 737 79 216
132 359 317 428 555 38 131 45 313 16 450 -23 113 -54 194 -105 281 -118 197
-336 360 -556 415 -108 26 -315 34 -415 15z"/>
<path d="M2904 8173 c-48 -113 -98 -365 -115 -578 -68 -846 300 -1637 996
-2137 440 -316 1034 -482 1570 -438 754 62 1463 490 1845 1115 155 253 275
585 325 900 22 137 31 483 16 615 -18 154 -56 341 -93 455 -40 122 -41 122
-195 69 -481 -166 -832 -439 -1001 -779 -16 -33 -50 -125 -76 -204 -107 -329
-199 -452 -491 -656 -82 -58 -183 -138 -224 -178 -85 -83 -169 -204 -212 -309
-36 -87 -79 -246 -80 -297 l-1 -36 -9 30 c-5 17 -14 55 -20 85 -24 131 -82
275 -154 385 -72 111 -163 198 -307 295 -175 118 -251 181 -318 265 -84 107
-131 199 -195 385 -98 284 -158 391 -310 549 -150 155 -323 273 -557 378 -135
60 -315 123 -354 123 -19 0 -29 -8 -40 -37z m433 -476 c281 -162 446 -358 574
-677 37 -93 83 -199 104 -236 97 -181 224 -315 421 -445 250 -166 327 -256
411 -478 24 -65 24 -83 0 -63 -8 7 -88 50 -178 98 -232 121 -330 181 -467 283
-200 149 -354 313 -502 534 -40 59 -77 106 -84 104 -22 -8 -8 -74 40 -186 153
-360 374 -617 719 -839 61 -39 154 -99 208 -134 98 -62 223 -173 265 -235 l22
-31 -62 14 c-225 52 -382 106 -542 186 -532 267 -919 743 -1066 1313 -53 204
-76 466 -60 683 5 76 13 152 16 169 l6 32 47 -22 c25 -12 83 -43 128 -70z
m3852 -134 c22 -376 -45 -727 -199 -1049 -260 -546 -754 -935 -1389 -1096 -64
-16 -124 -27 -134 -26 -14 2 -3 20 53 80 83 90 157 146 340 256 166 99 235
147 341 237 167 142 315 338 426 565 68 138 111 266 96 281 -18 18 -38 -1 -83
-74 -108 -175 -279 -367 -450 -506 -135 -110 -254 -188 -473 -308 -106 -58
-206 -116 -223 -129 l-32 -23 20 67 c60 205 157 326 380 474 300 199 432 364
558 698 129 344 323 563 647 732 l98 50 8 -43 c4 -24 11 -108 16 -186z"/>
<path d="M2635 4329 c-248 -49 -441 -216 -519 -449 -80 -241 -51 -505 76 -703
120 -184 333 -297 563 -297 280 0 510 148 625 404 49 108 64 188 63 331 -1
187 -39 310 -140 453 -81 114 -220 210 -358 247 -73 20 -242 28 -310 14z m228
-309 c239 -74 338 -449 179 -684 -98 -146 -286 -197 -440 -119 -163 82 -238
315 -176 543 38 136 127 232 246 264 74 20 115 19 191 -4z"/>
<path d="M5239 4321 c-127 -28 -236 -88 -329 -181 -283 -282 -277 -803 12
-1076 125 -117 257 -172 438 -181 202 -11 366 53 510 197 131 130 192 270 206
468 12 167 -32 348 -117 479 -88 134 -242 247 -394 288 -96 25 -226 28 -326 6z
m309 -322 c63 -31 117 -88 155 -164 26 -52 47 -159 47 -236 0 -234 -130 -399
-327 -416 -226 -19 -384 151 -385 417 -1 223 97 378 271 427 71 20 164 9 239
-28z"/>
<path d="M983 4304 c-10 -5 -13 -154 -13 -700 l0 -694 163 2 162 3 3 299 2
298 143 -203 c78 -112 174 -248 211 -301 l69 -98 189 0 c207 0 216 3 181 57
-10 15 -76 109 -147 208 -72 99 -174 242 -229 318 l-98 139 41 55 c72 95 399
552 410 574 25 45 12 49 -167 49 -92 0 -173 -4 -179 -8 -7 -4 -74 -97 -149
-207 -75 -110 -166 -244 -203 -298 l-67 -97 -5 302 -5 303 -150 2 c-82 1 -156
-1 -162 -3z"/>
<path d="M3610 4291 c-11 -21 -15 -1336 -4 -1365 5 -14 29 -16 165 -16 l159 0
0 302 0 301 58 -81 c31 -45 106 -152 166 -239 60 -87 129 -186 153 -221 l44
-62 187 2 c160 3 187 5 190 19 3 14 -71 121 -365 532 l-121 169 58 76 c118
157 383 528 393 549 22 50 11 53 -173 53 -164 0 -171 -1 -190 -22 -22 -26
-343 -495 -374 -548 l-21 -35 -5 300 -5 300 -152 3 c-142 2 -153 1 -163 -17z"/>
<path d="M6232 4302 c-10 -7 -12 -153 -10 -698 l3 -689 155 0 155 0 5 398 5
397 185 -290 c102 -160 217 -339 255 -398 l71 -107 143 -3 c109 -2 146 1 153
10 9 15 11 1348 2 1372 -5 14 -29 16 -155 16 -142 0 -150 -1 -157 -21 -4 -11
-8 -195 -7 -408 l0 -389 -39 62 c-21 33 -131 207 -244 386 -113 179 -214 335
-225 348 -19 21 -28 22 -151 22 -72 0 -137 -4 -144 -8z"/>
<path d="M7983 4298 c-6 -7 -33 -78 -61 -158 -289 -826 -413 -1183 -415 -1202
l-2 -23 169 0 170 0 45 132 46 133 237 0 236 0 44 -132 45 -133 167 -3 c137
-2 167 0 172 12 3 8 -72 232 -166 498 -94 265 -200 565 -235 664 -35 100 -68
191 -74 203 -11 20 -19 21 -190 21 -131 0 -181 -3 -188 -12z m337 -840 c0 -5
-68 -8 -151 -8 -117 0 -150 3 -146 13 4 9 86 255 143 426 4 12 153 -408 154
-431z"/>
<path d="M8983 4298 c-9 -16 -13 -1305 -4 -1351 l7 -32 164 0 165 0 0 695 0
695 -162 3 c-122 2 -163 -1 -170 -10z"/>
</g>
</svg>

  Kokonai Hub
</Link> */}
<Link
  to="/"
  className="group flex items-center gap-2 text-2xl font-semibold tracking-wide text-white transition-colors"
>
  <svg
    viewBox="0 0 1600 200"
    className="w-60 h-12 transition-transform duration-200 group-hover:scale-110"
    aria-label="Kokonai Hub logo"
  >
    <image
      href="/logo-var-1.png"
      x="0"
      y="0"
      width="1600"
      height="200"
      preserveAspectRatio="xMidYMid slice"
      className="transition-filter duration-200 group-hover:brightness-110"
    />
  </svg>
</Link>




        <div className="hidden md:flex gap-8 items-center">
          {commonMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative text-white/90 hover:text-white transition-colors duration-200"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {!auth && (
            <Link
              to="/login"
              className="text-white/90 hover:text-white transition-colors duration-200"
            >
              Войти
            </Link>
          )}

          {auth && (
            <div className="flex items-center gap-4 text-white">
              <span>Привет, {user?.name || "User"}</span>
              <button
                onClick={async () => {
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
                    }}
                className="text-indigo-400 hover:text-indigo-600 transition-colors text-left"
              >
                Выйти
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-3xl text-white focus:outline-none hover:text-indigo-400 transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть меню"
        >
          ☰
        </button>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900/80 backdrop-blur-lg border-l border-white/10 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-white">Меню</h2>
          <button
            className="text-2xl text-white hover:text-red-400 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6 text-white">
          {commonMenuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {!auth && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="hover:text-indigo-400 transition-colors"
            >
              Войти
            </Link>
          )}

          {auth && (
            <div className="flex flex-col gap-2 mt-4">
              <span>Привет, {user?.name || "User"}</span>
              <button
                onClick={async () => {
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
                    }}
                className="text-indigo-400 hover:text-indigo-600 transition-colors text-left"
              >
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </nav>
  );
}
