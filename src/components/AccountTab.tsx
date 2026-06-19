/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Plus, 
  ArrowDown, 
  Crown, 
  IdCard, 
  Moon, 
  Sun, 
  Bell, 
  Languages, 
  Settings, 
  Send, 
  ChevronRight,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { UserProfile, Language, ActiveTab } from '../types';

interface AccountTabProps {
  user: UserProfile;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export default function AccountTab({
  user,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  setActiveTab,
  onOpenDeposit,
  onOpenWithdraw
}: AccountTabProps) {
  const isBangla = language === 'বাংলা';

  // Toggle Language Handler
  const handleLanguageToggle = () => {
    const nextLang = language === 'English' ? 'বাংলা' : 'English';
    onLanguageChange(nextLang);
  };

  // KYC styling mapping
  const getKycBadge = () => {
    switch (user.kycStatus) {
      case 'Verified':
        return {
          text: isBangla ? 'কেওয়াইসি: ভেরিফাইড' : 'KYC : Verified',
          style: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        };
      case 'Pending':
        return {
          text: isBangla ? 'কেওয়াইসি: পেন্ডিং' : 'KYC : Pending',
          style: 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        };
      case 'Not verified':
      default:
        return {
          text: isBangla ? 'কেওয়াইসি: ভেরিফাইড নয়' : 'KYC : Not verified',
          style: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        };
    }
  };

  const kycConfig = getKycBadge();

  return (
    <div className={`p-4 pb-12 overflow-y-auto space-y-6 max-w-lg mx-auto ${
      isDarkMode ? 'text-[#E0E0E0]' : 'text-gray-800'
    }`} id="account-tab-panel">

      {/* Main Premium Gold Profile Card matching screenshot profile design */}
      <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-yellow-600 p-5 rounded-3xl text-black shadow-[0_8px_30px_rgba(245,158,11,0.2)] border border-amber-500/20 relative" id="account-teal-profile-card">
        
        {/* Profile Card Header row */}
        <div className="flex items-start gap-4">
          
          {/* Avatar frame */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-black/10 overflow-hidden bg-black/10 flex items-center justify-center select-none shadow">
              {/* Colored SVG avatar/image representation fallback matching screenshot */}
              <div className="w-14 h-14 rounded-full bg-amber-200 relative flex items-center justify-center overflow-hidden">
                {/* Hair */}
                <div className="absolute top-0 w-full h-8 bg-amber-450 rounded-b-full"></div>
                {/* Eyes and face */}
                <div className="w-12 h-12 rounded-full bg-amber-100 flex flex-col items-center justify-center mt-3 relative">
                  <div className="flex gap-2.5 mb-1 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  </div>
                  <div className="w-4 h-1 bg-rose-400 rounded-full z-10"></div>
                </div>
              </div>
            </div>

            {/* Verification small dot overlay */}
            <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center ${
              user.kycStatus === 'Verified' ? 'bg-emerald-500' : user.kycStatus === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
            }`}>
              {user.kycStatus === 'Verified' ? (
                <span className="text-[8px] text-white font-bold">✓</span>
              ) : (
                <span className="text-[8px] text-white font-bold">!</span>
              )}
            </span>
          </div>

          {/* Profile credentials */}
          <div className="flex-1 mt-0.5">
            <h3 className="font-extrabold text-base tracking-tight leading-tight select-none text-black">
              {user.name} <span className="text-black/80 text-xs font-semibold block sm:inline">({user.username})</span>
            </h3>
            
            <span className="text-[10px] text-black/80 font-bold block mt-1 tracking-wider uppercase">
              {isBangla ? `ইউআইডি : ${user.uid}` : `UID : ${user.uid}`}
            </span>

            {/* KYC State Display */}
            <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full mt-2 select-none uppercase ${kycConfig.style}`}>
              {kycConfig.text}
            </span>
          </div>
        </div>

        {/* Balance inside Profile Card */}
        <div className="mt-6 pt-4 border-t border-black/10">
          <span className="text-[10px] text-black/70 block uppercase font-bold tracking-wider opacity-90 select-none">
            {isBangla ? 'সর্বমোট ব্যালেন্স' : 'Total balance'}
          </span>
          <span className="text-3xl font-black block mt-0.5 font-sans tracking-wide text-black">
            ৳{user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Four grid Action Buttons under card */}
        <div className="grid grid-cols-4 gap-2 mt-6" id="account-card-quick-grids">
          <button
            onClick={onOpenDeposit}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-black/10 hover:bg-black/20 border border-black/5 flex items-center justify-center text-black transition-all">
              <Plus size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[9px] text-black font-bold mt-1.5 uppercase select-none">
              {isBangla ? 'ডিপোজিট' : 'Deposit'}
            </span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-black/10 hover:bg-black/20 border border-black/5 flex items-center justify-center text-black transition-all">
              <ArrowDown size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[9px] text-black font-bold mt-1.5 uppercase select-none">
              {isBangla ? 'উইথড্র' : 'Withdraw'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('vip')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-black/10 hover:bg-black/20 border border-black/5 flex items-center justify-center text-black transition-all">
              <Crown size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[9px] text-black font-bold mt-1.5 uppercase select-none">
              {isBangla ? 'ভিআইপি' : 'VIP'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kyc-flow')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all ${
              user.kycStatus === 'Verified'
                ? 'bg-emerald-500/20 border-emerald-500/20 text-emerald-800'
                : 'bg-black/10 hover:bg-black/20 border-black/5 text-black'
            }`}>
              <IdCard size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[9px] text-black font-bold mt-1.5 uppercase select-none">
              {isBangla ? 'কেওয়াইসি' : 'KYC'}
            </span>
          </button>
        </div>
      </div>

      {/* Menu Settings list */}
      <div className={`p-4 rounded-3xl border space-y-1.5 ${
        isDarkMode ? 'border-[#222222] bg-[#0C0C0C]' : 'border-gray-200 bg-white shadow-sm'
      }`} id="account-settings-list">
        
        {/* Toggle Dark Mode switch */}
        <div className="flex items-center justify-between px-3 py-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl ${isDarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-605'}`}>
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </span>
            <div>
              <span className="text-sm font-bold block leading-tight">{isBangla ? 'ডার্ক মোড' : 'Darkmode'}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">On / Off</span>
            </div>
          </div>
          
          {/* Toggle Switch Pill */}
          <button
            onClick={onToggleDarkMode}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors focus:ring-1 focus:ring-amber-500 focus:outline-none relative cursor-pointer ${
              isDarkMode ? 'bg-amber-500' : 'bg-gray-300'
            }`}
            id="dark-mode-toggle"
            aria-label="Toggle dark mode"
          >
            <span className={`w-5 h-5 rounded-full bg-white block shadow transition-transform ${
              isDarkMode ? 'translate-x-5' : 'translate-x-0'
            }`}></span>
          </button>
        </div>

        {/* Notifications config */}
        <button
          onClick={() => alert(isBangla ? 'কোনো নতুন বিজ্ঞপ্তি নেই!' : 'Your e-wallet notification log is clean!')}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#111111]/40 text-left transition-all`}
          id="account-notif-btn"
        >
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl bg-orange-500/10 text-orange-500`}>
              <Bell size={18} />
            </span>
            <div>
              <span className="text-sm font-bold block leading-tight">{isBangla ? 'বিজ্ঞপ্তি' : 'Notification'}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">{isBangla ? 'সব নোটিফিকেশন' : 'All notifications'}</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        {/* Languages config */}
        <button
          onClick={handleLanguageToggle}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#111111]/40 text-left transition-all`}
          id="account-lang-btn"
        >
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl bg-blue-500/10 text-blue-550`}>
              <Languages size={18} />
            </span>
            <div>
              <span className="text-sm font-bold block leading-tight">{isBangla ? 'ভাষা' : 'Language'}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">{language}</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        {/* Profile and general security */}
        <button
          onClick={() => alert(isBangla ? 'পাসওয়ার্ড পরিবর্তন করতে টেলিগ্রাম সাপোর্টে যোগাযোগ করুন।' : 'Password settings has been locked. Contact assistance.')}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#111111]/40 text-left transition-all`}
          id="account-security-btn"
        >
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl bg-amber-500/10 text-amber-500`}>
              <Settings size={18} />
            </span>
            <div>
              <span className="text-sm font-bold block leading-tight">{isBangla ? 'নিরাপত্তা অপশন' : 'Setting'}</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">{isBangla ? 'প্রোফাইল এবং সিকিউরিটি' : 'Profile & Security'}</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Service Center section matching layout */}
      <div className="space-y-3" id="service-center-section">
        <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-3 block">
          {isBangla ? 'সার্ভিস সেন্টার' : 'Service center'}
        </span>

        <div className={`p-4 rounded-3xl border ${
          isDarkMode ? 'border-[#222222] bg-[#0C0C0C]' : 'border-gray-200 bg-white shadow-sm'
        }`}>
          {/* Support telegram link button */}
          <a
            href="https://t.me/rax1122" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-1.5 focus:outline-none select-none rounded-xl"
            id="account-support-btn"
          >
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 rounded-full bg-[#24A1DE]/10 text-[#24A1DE] flex items-center justify-center`}>
                <Send size={18} className="translate-x-[-1px] translate-y-[0px] rotate-[-5deg]" />
              </span>
              <div>
                <span className="text-sm font-bold block leading-tight">{isBangla ? 'সাপোর্ট সাহায্য' : 'Support'}</span>
                <span className="text-[10px] text-[#24A1DE] font-semibold block mt-0.5">Telegram</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </a>
        </div>
      </div>

    </div>
  );
}
