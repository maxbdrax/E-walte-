/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  X, 
  Plus, 
  ArrowDown, 
  CreditCard, 
  Wallet, 
  Home, 
  Crown, 
  Settings, 
  Send, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Language } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  isDarkMode: boolean;
  onLogout: () => void;
  userRole?: 'user' | 'admin';
}

export default function Sidebar({
  isOpen,
  onClose,
  balance,
  activeTab,
  setActiveTab,
  language,
  onOpenDeposit,
  onOpenWithdraw,
  isDarkMode,
  onLogout,
  userRole
}: SidebarProps) {
  const isBangla = language === 'বাংলা';

  const menuItems = [
    { 
      id: 'home' as ActiveTab, 
      label: isBangla ? 'ওভারভিউ' : 'Overview', 
      icon: Home 
    },
    { 
      id: 'wallet' as ActiveTab, 
      label: isBangla ? 'ওয়ালেট' : 'Wallet', 
      icon: Wallet 
    },
    { 
      id: 'vip' as ActiveTab, 
      label: isBangla ? 'ভিআইপি' : 'VIP', 
      icon: Crown 
    },
    ...(userRole === 'admin' ? [{
      id: 'admin' as ActiveTab,
      label: isBangla ? 'অ্যাডমিন প্যানেল' : 'Admin Panel',
      icon: Settings
    }] : []),
    { 
      id: 'account' as ActiveTab, 
      label: isBangla ? 'সেটিংস' : 'Settings', 
      icon: Settings 
    },
    { 
      id: 'support' as ActiveTab, 
      label: isBangla ? 'সাপোর্ট' : 'Support', 
      icon: Send,
      isExternal: true 
    },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
            id="sidebar-backdrop"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] ${
              isDarkMode ? 'bg-[#080808]/95 border-r border-[#222222] backdrop-blur-md text-[#E0E0E0]' : 'bg-white text-gray-800'
            } z-50 flex flex-col shadow-2xl overflow-y-auto`}
            id="sidebar-container"
          >
            {/* Header / Balance Card premium amber background */}
            <div className="p-5 bg-gradient-to-br from-amber-500 to-yellow-600 text-black rounded-b-2xl shadow-lg relative flex flex-col">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full bg-black/10 hover:bg-black/20 text-black transition-colors"
                id="sidebar-close-btn"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>

              <div id="sidebar-balance-header" className="mt-2">
                <span className="text-xs text-black/70 font-bold block uppercase tracking-wider">
                  {isBangla ? 'ব্যালেন্স' : 'Balance'}
                </span>
                <span className="text-3xl font-extrabold block mt-1 select-none font-sans">
                  ৳{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Four action icons list */}
              <div id="sidebar-quick-actions" className="grid grid-cols-4 gap-2 mt-6">
                <button
                  onClick={() => { onOpenDeposit(); onClose(); }}
                  className="flex flex-col items-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center border border-black/10 transition-all">
                    <Plus size={18} className="text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] text-black/80 mt-1 font-bold block text-center truncate w-full">
                    {isBangla ? 'ডিপোজিট' : 'Deposit'}
                  </span>
                </button>

                <button
                  onClick={() => { onOpenWithdraw(); onClose(); }}
                  className="flex flex-col items-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center border border-black/10 transition-all">
                    <ArrowDown size={18} className="text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] text-black/80 mt-1 font-bold block text-center truncate w-full">
                    {isBangla ? 'উইথড্র' : 'Withdraw'}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('wallet')}
                  className="flex flex-col items-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center border border-black/10 transition-all">
                    <CreditCard size={18} className="text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] text-black/80 mt-1 font-bold block text-center truncate w-full">
                    {isBangla ? 'গেটওয়ে' : 'Gateway'}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('wallet')}
                  className="flex flex-col items-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center border border-black/10 transition-all">
                    <Wallet size={18} className="text-black group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] text-black/80 mt-1 font-bold block text-center truncate w-full">
                    {isBangla ? 'ওয়ালেট' : 'Wallet'}
                  </span>
                </button>
              </div>
            </div>

            {/* Navigation links block */}
            <div className="flex-1 px-4 py-6" id="sidebar-menu-links">
              <span className={`text-xs ml-2 font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {isBangla ? 'মেনু' : 'MENU'}
              </span>

              <div className="mt-2 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-amber-500/10 text-amber-500 font-bold'
                          : `hover:bg-gray-100 ${isDarkMode ? 'text-[#E0E0E0] hover:bg-[#111]' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                      id={`sidebar-item-${item.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`${isActive ? 'text-amber-500' : 'text-gray-400'}`}>
                          <Icon size={20} />
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <ChevronRight size={16} className={`${isActive ? 'text-amber-500' : 'text-gray-400 opacity-70'}`} />
                    </button>
                  );
                })}
              </div>

              {/* OTHERS section */}
              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-slate-800/50">
                <span className={`text-xs ml-2 font-bold tracking-wider uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {isBangla ? 'অন্যান্য' : 'OTHERS'}
                </span>

                <div className="mt-2">
                  <button
                    onClick={onLogout}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                    id="sidebar-item-logout"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-red-500">
                        <LogOut size={20} />
                      </span>
                      <span className="text-sm font-bold">{isBangla ? 'লগ আউট' : 'Log out'}</span>
                    </div>
                    <ChevronRight size={16} className="text-red-400 opacity-75" />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer with branding */}
            <div className={`p-4 text-center border-t border-gray-200/30 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} text-[10px]`}>
              <span>Powered by E-Wallet Support</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
