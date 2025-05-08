"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { IndianRupee, Calendar, TrendingUp } from 'lucide-react';

export default function MonthlyExpensesChart({ transactions }) {
  const prepareChartData = () => {
    if (!transactions || transactions.length === 0) return [];

    const monthMap = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthMap[monthYear]) {
        monthMap[monthYear] = {
          label: monthLabel,
          amount: 0
        };
      }
      monthMap[monthYear].amount += parseFloat(tx.amount);
    });

    return Object.keys(monthMap)
      .map(monthYear => ({
        month: monthMap[monthYear].label,
        amount: monthMap[monthYear].amount
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const monthlyData = prepareChartData();
  const totalAmount = monthlyData.reduce((sum, item) => sum + item.amount, 0);

  if (monthlyData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-3 md:p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Monthly Transactions</h3>
        </div>
        <div className="text-center py-8 text-white/50">
          No transaction data available yet.
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden">

      <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 z-0"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-3 md:p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Monthly Transactions</h3>
          <div className="ml-auto text-sm text-white/70 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="h-[300px] -ml-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                strokeOpacity={0.1}
                vertical={false}
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                content={({ payload, label }) => (
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
                    <p className="font-medium text-gray-800">{label}</p>
                    <p className={`flex items-center ${payload?.[0]?.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <IndianRupee className="w-3 h-3 mr-1" />
                      {payload?.[0]?.value?.toFixed(2) || 0}
                    </p>
                  </div>
                )}
              />
              <Bar
                dataKey="amount"
                fill="url(#colorAmount)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xs text-white/50 flex justify-between">
          <span className={`flex items-center ${totalAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <IndianRupee className="w-3 h-3 mr-1" />
            Total: {Math.abs(totalAmount).toFixed(2)}
          </span>
          <span>{monthlyData.length} {monthlyData.length === 1 ? 'month' : 'months'} shown</span>
        </div>
      </motion.div>
    </div>
  );
}