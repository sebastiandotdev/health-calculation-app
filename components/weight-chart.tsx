"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface WeightChartProps {
  data: { day: number; weight: number }[]
  targetWeight: number
}

export function WeightChart({ data, targetWeight }: WeightChartProps) {
  // Add target weight line to data
  const chartData = data.map((point) => ({
    ...point,
    objetivo: targetWeight,
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" label={{ value: "Días", position: "insideBottom", offset: -5 }} stroke="#6b7280" />
          <YAxis
            label={{ value: "Peso (kg)", angle: -90, position: "insideLeft" }}
            stroke="#6b7280"
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => [`${value.toFixed(2)} kg`, ""]}
            labelFormatter={(label) => `Día ${label}`}
          />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#0066cc" strokeWidth={2} dot={false} name="Peso proyectado" />
          <Line
            type="monotone"
            dataKey="objetivo"
            stroke="#00c896"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Peso objetivo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
