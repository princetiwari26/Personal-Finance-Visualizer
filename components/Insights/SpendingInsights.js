"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpRight, Wallet, Award, BarChart, PieChart, TrendingUp, AlertCircle } from "lucide-react";

const InsightItem = ({ title, value, icon: Icon, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1 }}
    whileHover={{ scale: 1.03 }}
    className="relative overflow-hidden bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg hover:shadow-xl transition-all"
  >

    <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full ${color.replace('text-', 'bg-')}/10 blur-[40px] z-0`}></div>

    <div className="relative z-10 flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default function SpendingInsights({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">

        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-500/10 blur-[60px]"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-500/10 blur-[60px]"></div>

        <div className="relative z-10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-white" />
              Spending Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-gray-300">
              <AlertCircle className="w-4 h-4 mr-2" />
              No transactions to analyze
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Calculate insights
  const totalSpent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const highestSpending = transactions.reduce((prev, curr) =>
    prev.amount > curr.amount ? prev : curr
  );

  // Spending by Category
  const categorySpend = {};
  transactions.forEach((t) => {
    if (!categorySpend[t.category]) {
      categorySpend[t.category] = 0;
    }
    categorySpend[t.category] += t.amount;
  });

  const mostSpentCategory = Object.keys(categorySpend).reduce((a, b) =>
    categorySpend[a] > categorySpend[b] ? a : b
  );

  const avgTransaction = totalSpent / transactions.length;

  return (
    <Card className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">

      <div className="absolute -top-40 -left-28 w-64 h-64 rounded-full bg-purple-500/20 blur-[60px]"></div>
      <div className="absolute -bottom-40 -right-28 w-64 h-64 rounded-full bg-sky-500/20 blur-[60px]"></div>

      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-white" />
            Spending Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightItem
              title="Total Spent"
              value={`₹${totalSpent.toFixed(2)}`}
              icon={Wallet}
              color="text-blue-400"
              delay={0}
            />

            <InsightItem
              title="Highest Expense"
              value={`₹${highestSpending.amount.toFixed(2)}`}
              icon={ArrowUpRight}
              color="text-red-400"
              delay={1}
            />

            <InsightItem
              title="Top Category"
              value={mostSpentCategory}
              icon={Award}
              color="text-purple-400"
              delay={2}
            />

            <InsightItem
              title="Total Transactions"
              value={transactions.length}
              icon={BarChart}
              color="text-green-400"
              delay={3}
            />

            <InsightItem
              title="Avg Transaction"
              value={`₹${avgTransaction.toFixed(2)}`}
              icon={TrendingUp}
              color="text-yellow-400"
              delay={4}
            />

            <InsightItem
              title="Spent on Top Category"
              value={`₹${categorySpend[mostSpentCategory].toFixed(2)}`}
              icon={PieChart}
              color="text-indigo-400"
              delay={5}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}