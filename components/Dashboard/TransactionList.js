"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, List, IndianRupee, Edit, Trash2, X, Save } from "lucide-react";
import PreLoader from "@/components/shared/PreLoader";
import Toast from "@/components/shared/Toast";

export default function TransactionList({ transactions, fetchTransactions }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    description: "",
    amount: "",
    category: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const categories = [
    "General", "Food", "Travel", "Shopping", 
    "Health", "Entertainment", "Utilities", 
    "Rent", "Transportation", "Groceries",
    "Education", "Personal", "Gifts"
  ];

  const deleteTransaction = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/transactions/${id}`);
      fetchTransactions();
      setToast({
        show: true,
        message: "Transaction deleted successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setToast({
        show: true,
        message: "Failed to delete transaction",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (txn) => {
    setEditData({
      id: txn._id,
      description: txn.description,
      amount: txn.amount,
      category: txn.category,
      date: txn.date.slice(0, 10),
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    try {
      setIsLoading(true);
      await axios.put(`/api/transactions/${editData.id}`, {
        description: editData.description,
        amount: editData.amount,
        category: editData.category,
        date: editData.date,
      });
      setIsEditing(false);
      fetchTransactions();
      setToast({
        show: true,
        message: "Transaction updated successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      setToast({
        show: true,
        message: "Failed to update transaction",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <PreLoader loading={isLoading} />
      {toast.show && (
        <Toast message={toast.message} type={toast.type} />
      )}

      <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" /> Transaction History
          </h2>
          <div className="text-sm text-white/70">
            {transactions.length} {transactions.length === 1 ? "record" : "records"}
          </div>
        </div>

        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-white/50"
          >
            No transactions found. Add your first transaction!
          </motion.div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {transactions.map((txn) => (
                <motion.div
                  key={txn._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex justify-between items-center px-4 py-1 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{txn.description}</p>
                    <div className="flex items-center text-sm text-white/70 mt-1 flex-wrap gap-x-2">
                      <span className="flex items-center capitalize">
                        <List className="w-3 h-3 mr-1" /> {txn.category}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> {new Date(txn.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <p className={`font-semibold whitespace-nowrap ${txn.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      <IndianRupee className="inline w-3 h-3 mr-0.5" />
                      {Math.abs(txn.amount).toFixed(2)}
                    </p>
                    <Button
                      onClick={() => handleEditClick(txn)}
                      size="sm"
                      variant="outline"
                      className="border-white/20 hover:bg-blue-500/50 p-2 text-white/80"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteTransaction(txn._id)}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white/80 hover:bg-red-500/20 hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

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
                    <Edit className="w-5 h-5" /> Edit Transaction
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
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Amount
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="number"
                          name="amount"
                          value={editData.amount}
                          onChange={handleEditChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="date"
                          name="date"
                          value={editData.date}
                          onChange={handleEditChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Category
                    </label>
                    <div className="relative">
                      <List className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <select
                        name="category"
                        value={editData.category}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white appearance-none"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
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
    </div>
  );
}