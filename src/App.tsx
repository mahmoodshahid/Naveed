/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  Send, 
  Plus, 
  Minus, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown,
  Calculator
} from 'lucide-react';
import { DEFAULT_EXPENSES, WHATSAPP_NUMBER } from './constants';
import { ExpenseState } from './types';

export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sale1, setSale1] = useState<string>('');
  const [expenses, setExpenses] = useState<ExpenseState>(
    DEFAULT_EXPENSES.reduce((acc, curr) => ({
      ...acc,
      [curr.id]: { checked: false, amount: '' }
    }), {})
  );

  const totalSale = useMemo(() => {
    return (parseFloat(sale1) || 0);
  }, [sale1]);

  const totalExpense = useMemo(() => {
    return DEFAULT_EXPENSES.reduce((acc, item) => {
      const exp = expenses[item.id];
      return acc + (exp.checked ? (parseFloat(exp.amount) || 0) : 0);
    }, 0);
  }, [expenses]);

  const profit = totalSale - totalExpense;

  const handleExpenseToggle = (id: string) => {
    setExpenses(prev => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked }
    }));
  };

  const handleExpenseAmountChange = (id: string, amount: string) => {
    setExpenses(prev => ({
      ...prev,
      [id]: { ...prev[id], amount }
    }));
  };

  const sendToWhatsApp = () => {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    };
    const displayDate = dateObj.toLocaleDateString('ur-PK', options);

    let expenseDetails = '';
    DEFAULT_EXPENSES.forEach(item => {
      const exp = expenses[item.id];
      if (exp.checked && parseFloat(exp.amount) > 0) {
        expenseDetails += `${item.name}: ${parseFloat(exp.amount).toLocaleString()}\n`;
      }
    });

    const resultType = profit >= 0 ? 'نفع' : 'نقصان';
    
    let reportText = '\u200F'; 
    reportText += `*ایم نوید چسکا پوائنٹ - روزانہ رپورٹ*\n\n`;
    reportText += `*تاریخ:* ${displayDate}\n`;
    reportText += `-----------------------------\n`;
    reportText += `سیل: ${(parseFloat(sale1) || 0).toLocaleString()}\n`;
    reportText += `*ٹوٹل سیل: ${totalSale.toLocaleString()}*\n\n`;
    
    reportText += `*اخراجات*\n`;
    if (expenseDetails) {
      reportText += expenseDetails;
    } else {
      reportText += `کوئی خرچہ نہیں\n`;
    }
    reportText += `*ٹوٹل خرچہ: ${totalExpense.toLocaleString()}*\n`;
    reportText += `-----------------------------\n`;
    reportText += `*نتیجہ*\n`;
    reportText += `*کل ${resultType}: ${Math.abs(profit).toLocaleString()}*\n`;
    reportText += `-----------------------------\n`;
    reportText += `_ہمیشہ نماز کی پابندی کریں_`;

    const encodedText = encodeURIComponent(reportText);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen font-serif py-8 px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto space-y-6"
      >
        {/* Header */}
        <header className="text-center space-y-3 pb-6 border-b border-orange-100">
          <div className="flex justify-center">
            <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-200">
              <Coffee className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-orange-600 font-urdu">ایم نوید چسکا پوائنٹ</h1>
          <p className="text-slate-500 font-urdu">رینالہ خورد</p>
          
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="relative group">
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Sales Card */}
          <motion.section variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800">
              <TrendingUp className="w-6 h-6 text-green-500" />
              فروخت (Sales)
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xl font-bold text-slate-700 block text-right">کل سیل (Total Sale)</label>
                <input 
                  type="number" 
                  value={sale1}
                  onChange={(e) => setSale1(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none text-left ltr text-2xl font-bold transition-all"
                />
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-2xl flex justify-between items-center">
              <span className="text-xl font-bold text-green-700">ٹوٹل سیل</span>
              <span className="text-2xl font-bold text-green-800 tabular-nums">
                {totalSale.toLocaleString()}
              </span>
            </div>
          </motion.section>

          {/* Expenses Card */}
          <motion.section variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-800">
              <TrendingDown className="w-6 h-6 text-red-500" />
              اخراجات (Expenses)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {DEFAULT_EXPENSES.map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    expenses[item.id].checked 
                      ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox"
                        checked={expenses[item.id].checked}
                        onChange={() => handleExpenseToggle(item.id)}
                        className="w-6 h-6 rounded-lg accent-orange-500 cursor-pointer"
                      />
                    </div>
                    <span className="text-xl font-urdu leading-none pt-1">{item.name}</span>
                  </label>
                  
                  <AnimatePresence>
                    {expenses[item.id].checked && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="w-24"
                      >
                        <input 
                          type="number" 
                          value={expenses[item.id].amount}
                          onChange={(e) => handleExpenseAmountChange(item.id, e.target.value)}
                          placeholder="رقم"
                          autoFocus
                          className="w-full px-2 py-1 bg-white border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-left ltr text-sm"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50 rounded-2xl flex justify-between items-center">
              <span className="text-xl font-bold text-red-700">ٹوٹل خرچہ</span>
              <span className="text-2xl font-bold text-red-800 tabular-nums">
                {totalExpense.toLocaleString()}
              </span>
            </div>
          </motion.section>

          {/* Result Card */}
          <motion.section 
            variants={itemVariants}
            className={`rounded-3xl p-6 shadow-lg border-2 transition-colors ${
              profit >= 0 
                ? 'bg-emerald-600 border-emerald-400 text-white' 
                : 'bg-rose-600 border-rose-400 text-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-white/80 text-lg">نتیجہ (Result)</p>
                <h3 className="text-3xl font-bold font-urdu">
                  {profit >= 0 ? 'نفع (Profit)' : 'نقصان (Loss)'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold tabular-nums">
                  {Math.abs(profit).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.section>

          {/* Action Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={sendToWhatsApp}
            className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 text-2xl font-bold hover:shadow-2xl transition-all"
          >
            <Send className="w-7 h-7" />
            <span className="font-urdu pt-1">واٹس ایپ پر بھیجیں</span>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <footer className="text-center pt-8 text-slate-400 space-y-2">
          <p className="font-urdu text-lg italic">ہمیشہ نماز کی پابندی کریں</p>
          <div className="flex justify-center gap-1 opacity-50">
            <Calculator className="w-4 h-4" />
            <span className="text-xs uppercase tracking-widest">Digital Register</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
