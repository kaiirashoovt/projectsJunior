import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Github,
  Newspaper,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useTracking } from "../hooks/useTracking";
import { updates } from "../updates";
import StatsWidget from "../components/StatsWidget";
import NewsWidget from "../components/NewsWidget";
import CalendarWidget from "../components/CalendarWidget";
import TasksWidget from "../components/TasksWidget";
import ChatBox from "../components/ChatBox";

const quickActions = [
  {
    title: "Профиль",
    description: "Данные аккаунта, аватар и краткое описание.",
    icon: UserRound,
    to: "/profile",
  },
  {
    title: "AI чат",
    description: "Быстро задать вопрос ассистенту проекта.",
    icon: Bot,
    href: "#ai-chat",
  },
  {
    title: "GitHub",
    description: "Репозитории и исходный код проекта.",
    icon: Github,
    href: "https://github.com/kaiirashoovt",
  },
  {
    title: "Контакты",
    description: "Связаться и посмотреть доступные каналы.",
    icon: CalendarCheck,
    to: "/contact",
  },
];

const healthItems = [
  { label: "API", value: "online", tone: "text-emerald-300" },
  { label: "Auth", value: "active", tone: "text-sky-300" },
  { label: "Build", value: "stable", tone: "text-amber-300" },
];

function QuickAction({ action }) {
  const Icon = action.icon;
  const className =
    "group flex min-h-28 flex-col justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.07]";

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-cyan-200">
          <Icon size={20} />
        </span>
        <ArrowRight
          size={17}
          className="text-white/35 transition group-hover:translate-x-0.5 group-hover:text-cyan-200"
        />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{action.title}</h3>
        <p className="mt-1 text-sm leading-5 text-slate-300">{action.description}</p>
      </div>
    </>
  );

  if (action.href) {
    return (
      <a
        href={action.href}
        target={action.href.startsWith("#") ? undefined : "_blank"}
        rel={action.href.startsWith("#") ? undefined : "noreferrer"}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={action.to} className={className}>
      {content}
    </Link>
  );
}

function UpdatesPanel() {
  const latestUpdates = [...updates].reverse().slice(0, 3);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-amber-300" />
          <h2 className="text-lg font-semibold text-white">Последние обновления</h2>
        </div>
        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
          changelog
        </span>
      </div>

      <div className="space-y-3">
        {latestUpdates.map((release) => (
          <article
            key={`${release.version}-${release.date}`}
            className="rounded-lg border border-white/10 bg-black/20 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <strong className="text-sm text-emerald-200">{release.version}</strong>
              <time className="text-xs text-slate-400">{release.date}</time>
            </div>
            <ul className="space-y-1 text-sm leading-5 text-slate-300">
              {release.changes.slice(0, 3).map((change, index) => (
                <li key={index}>{change}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  useTracking("/home");

  return (
    <div className="min-h-screen bg-[#090b10] text-white">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <section className="grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(17,24,39,0.82))] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src="/logo-var-1.png"
                    alt="Kokonai Hub"
                    className="h-10 w-36 rounded object-contain"
                  />
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
                    рабочий центр
                  </span>
                </div>
                <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Kokonai Hub
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                  Главная собрана как панель управления: быстрые переходы, состояние
                  проекта, задачи, календарь, обновления и AI чат без лишней суеты.
                </p>
              </div>

              <div className="grid min-w-52 grid-cols-3 gap-2 sm:grid-cols-1">
                {healthItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <p className="text-xs uppercase text-slate-500">
                      {item.label}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${item.tone}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-200" />
              <h2 className="text-lg font-semibold">Быстрые действия</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <QuickAction key={action.title} action={action} />
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <StatsWidget />
          <div id="ai-chat">
            <ChatBox />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <TasksWidget />
          <CalendarWidget />
          <UpdatesPanel />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <NewsWidget />
          <div>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <h2 className="text-lg font-semibold">Фокус на сегодня</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Почистить UI", "Проверить API", "Обновить контент"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
