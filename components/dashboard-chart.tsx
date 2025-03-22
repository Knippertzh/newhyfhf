"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { BarChart2, PieChartIcon } from "lucide-react"

// Mock data - replace with actual data
const mockExpertsData = [
  { name: "Machine Learning", value: 18 },
  { name: "NLP", value: 12 },
  { name: "Computer Vision", value: 9 },
  { name: "Reinforcement Learning", value: 7 },
  { name: "Robotics", value: 5 },
  { name: "Ethics", value: 3 },
]

const mockCompaniesData = [
  { name: "Research", value: 10 },
  { name: "Products", value: 8 },
  { name: "Services", value: 6 },
  { name: "Healthcare", value: 4 },
]

const mockSpecializationsData = [
  { name: "Machine Learning", value: 24 },
  { name: "NLP", value: 18 },
  { name: "Computer Vision", value: 15 },
  { name: "Robotics", value: 9 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

interface DashboardChartProps {
  type: "experts" | "companies" | "specializations"
}

export function DashboardChart({ type }: DashboardChartProps) {
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  // Select data based on type prop
  const data = type === "experts" ? mockExpertsData : type === "companies" ? mockCompaniesData : mockSpecializationsData

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Button
            variant={chartType === "bar" ? "dark-solid" : "dark-outline"}
            size="sm"
            onClick={() => setChartType("bar")}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Bar
          </Button>
          <Button
            variant={chartType === "pie" ? "dark-solid" : "dark-outline"}
            size="sm"
            onClick={() => setChartType("pie")}
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            Pie
          </Button>
        </div>
      </div>

      <div className="h-[300px] text-white">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444", color: "#fff" }} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#444", color: "#fff" }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

