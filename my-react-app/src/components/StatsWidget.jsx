import { ChartSpline } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Widget from "./Widget";

const data = [
  { name: "Янв", value: 30 },
  { name: "Фев", value: 50 },
  { name: "Мар", value: 45 },
  { name: "Апр", value: 70 },
  { name: "Май", value: 100 },
  { name: "Июн", value: 85 },
];

export default function StatsWidget() {
  return (
    <Widget icon={ChartSpline} title="Активность проекта">
      <div className="mb-4 grid grid-cols-3 divide-x divide-white/10">
        {[
          ["Визиты", "1.8k"],
          ["Пик", "100"],
          ["Рост", "+24%"],
        ].map(([label, value]) => (
          <div key={label} className="px-3 first:pl-0 last:pr-0">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#263241" />
            <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                color: "#e2e8f0",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#67E8F9"
              strokeWidth={3}
              dot={{ r: 3, fill: "#67E8F9" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}
