import { ChartSpline } from "lucide-react";
import Widget from "./Widget";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    <Widget icon={ChartSpline} title="Виджет статистики">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
}
