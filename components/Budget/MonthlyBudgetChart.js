"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function MonthlyBudgetChart({ budgets }) {
    const sortedData = [...budgets].sort((a, b) => {
        const getDate = (str) => new Date(`1 ${str}`);
        return getDate(a.monthYear) - getDate(b.monthYear);
    });

    const chartData = sortedData.map((b) => ({
        month: b.monthYear,
        budget: b.limit,
    }));

    if (budgets.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Monthly Budget</h3>
                </div>
                <div className="text-center py-8 text-white/50">
                    No budget data available yet.
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-[60px]"></div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">Monthly Budget</h3>
                </div>

                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="month" stroke="white" />
                            <YAxis tickFormatter={(value) => `₹${value}`} stroke="white" />
                            <Tooltip
                                formatter={(value) => `₹${value}`}
                                contentStyle={{ backgroundColor: "#111", borderColor: "#333", color: "#fff" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="budget"
                                name="Budget Limit"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}