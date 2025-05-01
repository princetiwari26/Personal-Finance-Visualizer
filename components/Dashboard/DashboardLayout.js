"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import MonthlyExpensesChart from "./MonthlyExpensesChart";
import SummaryCards from "./SummaryCards";
import CategoryPieChart from "./CategoryPieChart";
import BudgetManager from "../Budget/BudgetManager";
import SpendingInsights from "../Insights/SpendingInsights";
import BudgetStatistics from "../Budget/BudgetStatistics";
import MonthlyBudgetChart from "../Budget/MonthlyBudgetChart";

export default function DashboardLayout() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const userToken = typeof window !== "undefined" ? localStorage.getItem("finance-token") : null;

  const fetchTransactions = useCallback(async () => {
    if (!userToken) return;
    try {
      const { data } = await axios.get("/api/transactions", { params: { userToken } });
      if (data.success) setTransactions(data.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userToken]);

  const fetchBudgets = useCallback(async () => {
    if (!userToken) return;
    try {
      const { data } = await axios.get("/api/budgets", { params: { userToken } });
      if (data.success) setBudgets(data.data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }, [userToken]);

  const handleBudgetUpdate = (updatedBudgets) => {
    setBudgets(updatedBudgets);
  };

  console.log(budgets)
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, [fetchTransactions, fetchBudgets]);

  const cardClasses = "bg-white dark:bg-black p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 60, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      />

      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent mb-12 mt-6 text-center">
          Personal Finance Visualizer
        </h1>

        {/* Summary Cards */}
        <div className="mt-3">
          <SummaryCards transactions={transactions} />
        </div>

        {/* Form and Budget Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <div className={cardClasses}>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Budgets</h2>
            <BudgetManager
              transactions={transactions}
              budgets={budgets}
              onBudgetUpdate={handleBudgetUpdate}
            />
          </div>
          <div className={cardClasses}>
            <TransactionForm fetchTransactions={fetchTransactions} />
          </div>

        </div>

        {/* Transaction List */}
        <div className="mb-6">
          <div className={cardClasses}>
            <TransactionList transactions={transactions} fetchTransactions={fetchTransactions} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={cardClasses}>
            <MonthlyExpensesChart transactions={transactions} />
          </div>
          <div className={cardClasses}>
            <CategoryPieChart transactions={transactions} />
          </div>
        </div>

        {/* Monthly Budget Chart */}
        <div className="mb-6">
          <div className={cardClasses}>
            <MonthlyBudgetChart budgets={budgets} />
          </div>
        </div>

        {/* Spending Insights */}
        <div className="mb-6">
          <div className={cardClasses}>
            <SpendingInsights transactions={transactions} />
          </div>
        </div>

        {/* Budget Statistics */}
        <div className={cardClasses}>
          <BudgetStatistics transactions={transactions} budgets={budgets} />
        </div>
      </div>
    </div>
  );
}