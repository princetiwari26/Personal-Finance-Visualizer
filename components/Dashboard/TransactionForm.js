"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, FileText, List, ChevronDown } from "lucide-react";
import PreLoader from "@/components/shared/PreLoader";
import Toast from "@/components/shared/Toast";

const categories = [
  "General", "Food", "Travel", "Shopping", "Health", "Entertainment",
  "Utilities", "Rent", "Transportation", "Groceries", "Education",
  "Personal", "Gifts"
];

export default function TransactionForm({ fetchTransactions }) {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "General"
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const validateForm = () => {
    const errors = {};
    if (!formData.amount) errors.amount = "Amount is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userToken = localStorage.getItem("finance-token");
    if (!userToken) {
      setToast({ show: true, message: "Please login first!", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/transactions", { ...formData, userToken });

      setFormData({ amount: "", date: "", description: "", category: "General" });
      setFormErrors({});
      fetchTransactions();

      setToast({ show: true, message: "Transaction added successfully!", type: "success" });
    } catch (error) {
      console.error("Error adding transaction:", error);
      setToast({ show: true, message: "Failed to add transaction", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="relative overflow-hidden">
      <PreLoader loading={isLoading} />
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
          ₹ Add Transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Amount</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50">₹</div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/30"
              />
            </div>
            {formErrors.amount && <p className="text-red-400 text-sm mt-1">{formErrors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>
            {formErrors.date && <p className="text-red-400 text-sm mt-1">{formErrors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What was this for?"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/30"
              />
            </div>
            {formErrors.description && <p className="text-red-400 text-sm mt-1">{formErrors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
            <div className="relative">
              <List className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-[#1e1e32] text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.category && <p className="text-red-400 text-sm mt-1">{formErrors.category}</p>}
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Add Transaction"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
