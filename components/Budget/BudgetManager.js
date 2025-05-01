"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { List, IndianRupee, Edit2, Trash2, X, Save, Calendar } from "lucide-react";
import PreLoader from "@/components/shared/PreLoader";
import Toast from "@/components/shared/Toast";

const BudgetItem = ({ budget, spent, onEdit, onDelete }) => {
  const percentage = Math.min(Math.round((spent / budget.limit) * 100), 100);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="px-4 py-3 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 shadow-sm mb-3 last:mb-0"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <List className="w-4 h-4 text-white/70" />
            <h3 className="font-medium text-white capitalize">{budget.category}</h3>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
              {budget.monthYear}
            </span>
          </div>

          <div className="flex items-center text-sm text-white/90 mb-2">
            <IndianRupee className="w-3 h-3 mr-1" />
            <span>Limit: {budget.limit}</span>
            <span className="mx-2">•</span>
            <IndianRupee className="w-3 h-3 mr-1" />
            <span>Spent: {spent || 0}</span>
            <span className="mx-2">•</span>
            <div>
              {percentage}% of budget used
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Button
            onClick={() => onEdit(budget)}
            size="sm"
            variant="outline"
            className="border-white/20 hover:bg-blue-500/50 p-2 text-white/80"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(budget._id)}
            size="sm"
            variant="outline"
            className="border-white/20 text-white/80 hover:bg-red-500/20 hover:text-red-400 p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function BudgetManager({ transactions, budgets, onBudgetUpdate }) {
  const [formData, setFormData] = useState({
    category: "Food",
    limit: "",
    month: getCurrentMonth(),
    year: getCurrentYear()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    category: "",
    limit: "",
    month: "",
    year: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  function getCurrentMonth() {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[new Date().getMonth()];
  }

  function getCurrentYear() {
    return new Date().getFullYear().toString();
  }

  function getMonthOptions() {
    return [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  }

  function getYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = -10; i <= 2; i++) {
      years.push((currentYear + i).toString());
    }
    return years;
  }

  const categories = [
    "General", "Food", "Travel", "Shopping",
    "Health", "Entertainment", "Utilities",
    "Rent", "Transportation", "Groceries",
    "Education", "Personal", "Gifts"
  ];

  const monthOptions = getMonthOptions();
  const yearOptions = getYearOptions();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem("finance-token");

    if (!formData.limit || !formData.category || !formData.month || !formData.year) {
      showToast("All fields are required!", "error");
      return;
    }

    const monthYear = `${formData.month} ${formData.year}`;

    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/budgets", {
        ...formData,
        monthYear,
        userToken
      });

      if (data.success) {
        resetForm();
        onBudgetUpdate([...budgets, data.data]);
        showToast("Budget added successfully!");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to add budget", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const { data } = await axios.delete(`/api/budgets/${id}`);
      if (data.success) {
        onBudgetUpdate(budgets.filter(budget => budget._id !== id));
        showToast("Budget deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete budget", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (budget) => {
    const [month, year] = budget.monthYear.split(" ");
    setEditData({
      id: budget._id,
      category: budget.category,
      limit: budget.limit,
      month,
      year
    });
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    if (!editData.limit || !editData.category || !editData.month || !editData.year) {
      showToast("All fields are required!", "error");
      return;
    }

    const monthYear = `${editData.month} ${editData.year}`;

    try {
      setIsLoading(true);
      const userToken = localStorage.getItem("finance-token");
      const { data } = await axios.put(`/api/budgets/${editData.id}`, {
        category: editData.category,
        limit: editData.limit,
        monthYear,
        userToken
      });

      if (data.success) {
        setIsEditing(false);
        onBudgetUpdate(budgets.map(budget => 
          budget._id === editData.id ? data.data : budget
        ));
        showToast("Budget updated successfully!");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update budget", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      category: "Food", 
      limit: "",
      month: getCurrentMonth(),
      year: getCurrentYear()
    });
  };

  // Calculate spent per category
  const spentByCategory = {};
  transactions.forEach((txn) => {
    spentByCategory[txn.category] = (spentByCategory[txn.category] || 0) + txn.amount;
  });

  return (
    <div className="relative">
      <PreLoader loading={isLoading} />
      {toast.show && <Toast message={toast.message} type={toast.type} />}

      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Category
              </label>
              <div className="relative">
                <List className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Budget Limit (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/30"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Month
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                  required
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                  required
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
            disabled={isLoading}
          >
            Add Budget
          </Button>
        </form>

        <div className="space-y-3 relative z-10 max-h-[400px] overflow-y-auto pr-2">
          {budgets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-white/50"
            >
              No budgets set yet. Add your first budget!
            </motion.div>
          ) : (
            budgets.map((budget) => (
              <BudgetItem
                key={budget._id}
                budget={budget}
                spent={spentByCategory[budget.category] || 0}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsEditing(false)}
              />

              <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-xl w-full max-w-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Edit2 className="w-5 h-5" /> Edit Budget
                    </h2>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Category
                      </label>
                      <div className="relative">
                        <List className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <select
                          name="category"
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                          required
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Budget Limit (₹)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="number"
                          name="limit"
                          placeholder="0.00"
                          value={editData.limit}
                          onChange={(e) => setEditData({ ...editData, limit: e.target.value })}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/30"
                          required
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Month
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                          <select
                            value={editData.month}
                            onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                            required
                          >
                            {monthOptions.map((month) => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Year
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                          <select
                            value={editData.year}
                            onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                            required
                          >
                            {yearOptions.map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-white/20 hover:bg-white/10 text-white"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditSave}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx global>{`
        select option {
          background: rgba(30, 30, 50, 0.95);
          color: white;
        }
        select:focus option:checked {
          background: linear-gradient(to right, #7c3aed, #4f46e5);
          color: white;
        }
      `}</style>
    </div>
  );
}