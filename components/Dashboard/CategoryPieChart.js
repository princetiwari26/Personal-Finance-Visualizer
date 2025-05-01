'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Tag, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = [
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#f97316', '#f59e0b', '#10b981',
  '#14b8a6', '#0ea5e9', '#3b82f6', '#6366f1'
];

export default function CategoryPieChart({ transactions }) {
  const prepareChartData = () => {
    if (!transactions || transactions.length === 0) return [];

    const categoryMap = {};
    const total = transactions.reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

    transactions.forEach((tx) => {
      const category = tx.category || 'Other';
      if (!categoryMap[category]) {
        categoryMap[category] = {
          value: 0,
          percentage: 0
        };
      }
      categoryMap[category].value += Math.abs(parseFloat(tx.amount));
    });

    // Calculate percentages
    Object.keys(categoryMap).forEach(category => {
      categoryMap[category].percentage = (categoryMap[category].value / total) * 100;
    });

    return Object.keys(categoryMap).map((category) => ({
      name: category,
      value: categoryMap[category].value,
      percentage: categoryMap[category].percentage,
    })).sort((a, b) => b.value - a.value);
  };

  const categoryData = prepareChartData();
  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0);

  if (categoryData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <PieChartIcon className="w-5 h-5 text-white" />
          <h3 className="text-lg font-semibold text-white">Spending by Category</h3>
        </div>
        <div className="text-center py-8 text-white/50">
          No transaction data available yet.
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden">

      <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 z-0"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PieChartIcon className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Spending by Category</h3>
          </div>
          <div className="text-sm text-white/70 flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            Total: {totalAmount.toFixed(2)}
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percentage }) => percentage > 5 ? `${name} ${percentage.toFixed(0)}%` : ''}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => (
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: payload?.[0]?.payload?.fill }}
                      />
                      <p className="font-medium text-gray-800 capitalize">{payload?.[0]?.name}</p>
                    </div>
                    <div className="flex items-center text-purple-600">
                      <IndianRupee className="w-3 h-3 mr-1" />
                      {payload?.[0]?.value?.toFixed(2) || 0}
                      <span className="text-gray-500 ml-2">
                        ({payload?.[0]?.payload?.percentage?.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                )}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                height={40}
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry, index) => (
                  <span className="text-white/80 text-xs capitalize">
                    {value}
                  </span>
                )}
                iconType="circle"
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {categoryData.slice(0, 6).map((category, index) => (
            <div
              key={index}
              className="flex items-center text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10"
            >
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-white/80 capitalize">{category.name}</span>
              <span className="text-white/60 ml-1">{category.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}