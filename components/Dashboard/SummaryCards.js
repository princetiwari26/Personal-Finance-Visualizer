"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Clock, CalendarDays } from "lucide-react";

const SummaryCard = ({ title, value, icon, color }) => {
  const IconComponent = icon;
  const bgColor = color.replace('text-', 'bg-');

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full relative overflow-hidden">
      <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full ${bgColor}/10 blur-[40px] z-0`} />
      <Card className="bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all h-full relative z-10">
        <CardHeader className="flex flex-col items-center">
          <div className={`p-3 rounded-full ${color} bg-opacity-10 mb-2`}>
            <IconComponent className={`w-5 h-5 ${color}`} />
          </div>
          <CardTitle className="text-sm font-medium text-gray-300 text-center">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-2xl font-bold text-white">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function SummaryCards({ transactions }) {
  const [stats, setStats] = useState({
    totalExpense: 0,
    recentTransaction: null,
    avgDailySpend: 0,
  });

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
      const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      const dates = transactions.map(t => new Date(t.date).toDateString());
      const uniqueDays = [...new Set(dates)].length;
      const avgDaily = uniqueDays > 0 ? total / uniqueDays : 0;

      setStats({
        totalExpense: total,
        recentTransaction: sorted[0],
        avgDailySpend: avgDaily,
      });
    } else {
      setStats({
        totalExpense: 0,
        recentTransaction: null,
        avgDailySpend: 0,
      });
    }
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <SummaryCard
        title="Total Expenses"
        value={`₹${stats.totalExpense.toFixed(2)}`}
        icon={Wallet}
        color="text-blue-400"
      />
      <SummaryCard
        title="Most Recent"
        value={stats.recentTransaction ? `₹${stats.recentTransaction.amount.toFixed(2)}` : "N/A"}
        icon={Clock}
        color="text-green-400"
      />
      <SummaryCard
        title="Avg Daily Spend"
        value={`₹${stats.avgDailySpend.toFixed(2)}`}
        icon={CalendarDays}
        color="text-purple-400"
      />
    </div>
  );
}