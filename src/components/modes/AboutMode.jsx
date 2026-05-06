import React from 'react';
import { motion } from 'framer-motion';

export default function AboutMode() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-navy-950/80 backdrop-blur-sm"
    >
      <div className="glass-panel p-8 max-w-xl w-full text-center border border-white/10 shadow-2xl" dir="rtl">
        <div className="mb-6 flex justify-center">
          <svg viewBox="0 0 32 32" className="w-12 h-12">
            <circle cx="16" cy="16" r="12" fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7" />
            <circle cx="16" cy="16" r="4" fill="#00f0ff" opacity="0.9" />
          </svg>
        </div>
        
        <h2 className="text-3xl text-accent-cyan font-bold mb-6 border-b border-white/10 pb-4">
          عن المشروع
        </h2>
        
        <div className="text-white text-lg space-y-2 leading-relaxed font-medium">
          <p className="text-accent-cyan font-bold text-xl mb-4">اتم انجاز المشروع بواسطة:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm">
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">فتحي عبد الخالق سيد احمد</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">احمد حسن محمد</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">فارس احمد زيان</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">احمد سمير صلاح</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">احمد سعيد محفوظ</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">السيد خميس السيد</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">مصطفى اسامه السيد</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">عبدالحميد ابراهيم ابراهيم</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">أمين صالح محمد محمد</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">يوسف وائل عوض متولى</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">محمد مسعد عبدهللا عرنسة</p>
            <p className="bg-white/5 py-2 px-2 rounded-lg border border-white/5 hover:border-accent-cyan/30 hover:bg-white/10 transition-colors">محمد اسامه رمضان جوده</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-accent-orange font-bold text-xl">تحت اشراف</p>
            <p className="text-2xl mt-2 text-white">د. حسين المصري</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
