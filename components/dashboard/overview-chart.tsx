'use client';
// components/dashboard/overview-chart.tsx

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", submissions: 20, verifications: 15 },
  { name: "Feb", submissions: 30, verifications: 25 },
  { name: "Mar", submissions: 40, verifications: 35 },
  { name: "Apr", submissions: 45, verifications: 40 },
  { name: "May", submissions: 55, verifications: 45 },
  { name: "Jun", submissions: 65, verifications: 55 },
];

export function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="submissions"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="verifications"
          stroke="hsl(var(--secondary))"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}