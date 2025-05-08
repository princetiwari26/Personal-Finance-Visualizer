"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { IndianRupee, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function BudgetStatistics({ transactions, budgets }) {
  const [viewMode, setViewMode] = useState("category");

  const spentByCategory = {};
  transactions.forEach((txn) => {
    spentByCategory[txn.category] = (spentByCategory[txn.category] || 0) + txn.amount;
  });

  const spentByMonth = {};
  transactions.forEach((txn) => {
    const monthYear = txn.monthYear || new Date(txn.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    spentByMonth[monthYear] = (spentByMonth[monthYear] || 0) + txn.amount;
  });

  let data = [];

  if (viewMode === "category") {
    data = budgets.map((budget) => ({
      name: budget.category,
      budgetLimit: parseFloat(budget.limit),
      spent: spentByCategory[budget.category] || 0,
    }));
  } else if (viewMode === "monthly") {
    const monthMap = {};

    budgets.forEach((budget) => {
      const key = budget.monthYear;
      if (!monthMap[key]) {
        monthMap[key] = {
          name: key,
          budgetLimit: 0,
          spent: 0,
        };
      }
      monthMap[key].budgetLimit += parseFloat(budget.limit);
    });

    Object.keys(spentByMonth).forEach(month => {
      if (monthMap[month]) {
        monthMap[month].spent = spentByMonth[month];
      }
    });

    data = Object.values(monthMap).sort((a, b) =>
      new Date(`1 ${a.name}`) - new Date(`1 ${b.name}`)
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-3 md:p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Budget Statistics</h3>
        </div>
        <div className="text-center py-8 text-white/50">
          No budget data available yet. Create budgets to see statistics.
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-500/10 blur-[60px]"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-pink-500/10 blur-[60px]"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-3 md:p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Budget Statistics</h3>

          {/* Right-aligned Select Menu */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-white/70 text-sm">View:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="bg-transparent border border-white/30 text-white text-sm rounded px-2 py-1 outline-none"
            >
              <option value="category">Category-wise</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="h-[300px] -ml-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barGap={0} barCategoryGap={20}>
              <defs>
                <linearGradient id="colorLimit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.7)' }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.7)' }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                content={({ payload, label }) => (
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
                    <p className="font-medium text-gray-800">{label}</p>
                    {payload?.map((entry, idx) => (
                      <p key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                        {entry.name}: <IndianRupee className="w-3 h-3 mx-1" />
                        {entry.value?.toFixed(2)}
                      </p>
                    ))}
                  </div>
                )}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', color: 'rgba(255,255,255,0.7)' }} />
              <Bar dataKey="budgetLimit" name="Budget Limit" fill="url(#colorLimit)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Amount Spent" fill="url(#colorSpent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xs">
          <span className="flex items-center text-green-400/90">
            <IndianRupee className="w-3 h-3 mr-1" />
            Total Budget: ₹{data.reduce((sum, item) => sum + item.budgetLimit, 0).toFixed(2)}
          </span>
          <span className="flex items-center mt-1 text-purple-400/90">
            <IndianRupee className="w-3 h-3 mr-1" />
            Total Spent: ₹{data.reduce((sum, item) => sum + item.spent, 0).toFixed(2)}
          </span>
        </div>
      </motion.div>
    </div>
  );
}