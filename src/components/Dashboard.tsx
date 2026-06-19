/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp,
  CreditCard, 
  UserMinus, 
  UserPlus, 
  Plus, 
  TrendingUp, 
  Search, 
  ChevronRight,
  SlidersHorizontal,
  DollarSign,
  Check,
  X,
  History
} from 'lucide-react';
import { UserProfile, Transaction, Language, ActiveTab } from '../types';

interface DashboardProps {
  user: UserProfile;
  language: Language;
  transactions: Transaction[];
  globalTransactions?: Transaction[];
  onApproveAssignedTx?: (txId: string) => void;
  onRejectAssignedTx?: (txId: string) => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenUserWD: () => void;
  onOpenUserDep: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
}

export default function Dashboard({
  user,
  language,
  transactions,
  globalTransactions = [],
  onApproveAssignedTx,
  onRejectAssignedTx,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenUserWD,
  onOpenUserDep,
  setActiveTab,
  isDarkMode
}: DashboardProps) {
  const isBangla = language === 'বাংলা';
  const [historyTab, setHistoryTab] = useState<'all' | 'deposit' | 'withdraw'>('all');
  
  // Filter core review task approvals assigned to this user by administration
  const assignedTasks = globalTransactions.filter(
    (tx) => tx.assignedTo === user.username && tx.status === 'Pending'
  );

  return (
    <div className={`p-4 pb-12 overflow-y-auto space-y-5 max-w-lg mx-auto ${
      isDarkMode ? 'text-white' : 'text-gray-800'
    }`} id="dashboard-viewport">

      {/* Assigned Review Duties Section */}
      {assignedTasks.length > 0 && (
        <div 
          className="p-4 rounded-3xl bg-[#1A2536] border border-slate-700/60 shadow-xl space-y-3 relative overflow-hidden"
          id="user-assigned-tasks-payout-box"
        >
          {/* Subtle gold decoration bubble */}
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-24 h-24 rounded-full bg-[#5D5FEF]/10 blur-xl pointer-events-none"></div>

          <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
            <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center justify-between w-full">
              <span>{isBangla ? '📥 আপনার নির্ধারিত রিভিউ কাজ' : '📥 Assigned Review Orders'}</span>
              <span className="text-[10px] bg-yellow-500/10 text-yellow-500 font-black px-2 py-0.5 rounded-full">
                {assignedTasks.length} {isBangla ? 'টি বাকি' : 'Pending'}
              </span>
            </h3>
          </div>

          <p className="text-[10.5px] text-gray-300 font-semibold leading-relaxed">
            {isBangla 
              ? 'অ্যাডমিন আপনাকে নিচের লেনদেনগুলো যাচাই করে অনুমোদন (\'Approve\') অথবা বাতিল (\'Reject\') করার দায়িত্ব দিয়েছেন:' 
              : 'The administration has delegated core verification review of the following orders onto you:'}
          </p>

          <div className="space-y-3 mt-1.5">
            {assignedTasks.map((tx) => (
              <div 
                key={tx.id} 
                className="bg-[#0E1724]/90 border border-slate-800 p-3 rounded-2xl space-y-2.5 shadow-inner"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[12px] font-black text-white block">
                      ৳{tx.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-amber-500 font-black block mt-0.5">
                      Type: {tx.type === 'Deposit' ? 'Deposit (ডিপোজিট)' : 'Withdraw (উইথড্র)'} ({tx.method})
                    </span>
                    <span className="text-[10px] text-sky-400 font-bold block">
                      Owner: @{tx.username}
                    </span>
                    {tx.type === 'Deposit' && (tx as any).senderNumber && (
                      <span className="text-[9.5px] text-indigo-300 font-mono block mt-0.5 font-bold">
                        Sender: {(tx as any).senderNumber}
                      </span>
                    )}
                    {tx.type === 'Withdraw' && (tx as any).receiverNumber && (
                      <span className="text-[9.5px] text-indigo-300 font-mono block mt-0.5 font-bold">
                        Target Wallet: {(tx as any).receiverNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 block font-bold">{tx.date}</span>
                    <span className="text-[8.5px] text-gray-500 block font-mono mt-0.5">ID: {tx.id.substring(0, 8)}</span>
                  </div>
                </div>

                {/* Approve/Reject actionable options directly handled by user reviewer */}
                <div className="flex gap-2.5 pt-1.5 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      if (onRejectAssignedTx) {
                        onRejectAssignedTx(tx.id);
                        alert(isBangla ? 'লেনদেনটি সফলভাবে প্রত্যাখ্যান করা হয়েছে।' : 'Transaction request successfully declined.');
                      }
                    }}
                    className="flex-1 py-1 px-3 bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border border-rose-500/20"
                  >
                    <X size={12} /> {isBangla ? 'বাতিল' : 'Reject'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onApproveAssignedTx) {
                        onApproveAssignedTx(tx.id);
                        alert(isBangla ? 'লেনদেনটি সফলভাবে অনুমোদন করা হয়েছে!' : 'Transaction approval disbursed!');
                      }
                    }}
                    className="flex-1 py-1 px-3 bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981] hover:text-black text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 border border-[#10B981]/25"
                  >
                    <Check size={12} /> {isBangla ? 'অনুমোদন দিন' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core E-Wallet Balance Card mirroring screenshots */}
      <div className={`p-5 rounded-3xl ${
        isDarkMode 
          ? 'bg-[#111111] border border-[#222222] shadow-[0_4px_25px_rgba(0,0,0,0.6)]' 
          : 'bg-white border border-gray-150 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
      } relative overflow-hidden`} id="main-balance-box">
        
        {/* Rounded Gold Bubble Background effect */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-24 h-24 rounded-full bg-amber-500/5 pointer-events-none blur-xl"></div>

        <div className="flex justify-between items-start">
          <div>
            <span className={`text-[10px] uppercase tracking-wider font-extrabold ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {isBangla ? 'সর্বমোট ব্যালেন্স' : 'Total Balance'}
            </span>
            <span className="text-3xl font-black block mt-1.5 select-none font-sans text-amber-500">
              ৳{user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Core circular '+' trigger */}
          <button
            onClick={onOpenDeposit}
            className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            id="dashboard-deposit-plus-btn"
            aria-label="Make a deposit"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Premium three horizontal shortcut buttons below balance box */}
        <div className="grid grid-cols-3 gap-2.5 mt-6" id="dashboard-shortcuts-row">
          {/* Deposit emerald/green */}
          <button
            onClick={onOpenDeposit}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 flex items-center justify-center shadow-md transition-all">
              <ArrowUp size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] text-center font-extrabold tracking-tight opacity-90 truncate w-full">
              {isBangla ? 'ডিপোজিট' : 'Deposit'}
            </span>
          </button>

          {/* Withdraw reddish pink */}
          <button
            onClick={onOpenWithdraw}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/25 flex items-center justify-center shadow-md transition-all">
              <ArrowDown size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] text-center font-extrabold tracking-tight opacity-90 truncate w-full">
              {isBangla ? 'উইথড্র' : 'Withdraw'}
            </span>
          </button>

          {/* Gateway purple card */}
          <button
            onClick={() => setActiveTab('wallet')}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/25 flex items-center justify-center shadow-md transition-all">
              <CreditCard size={22} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] text-center font-extrabold tracking-tight opacity-90 truncate w-full">
              {isBangla ? 'গেটওয়ে' : 'Gateway'}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of statistics: Today Commission, Total Commission, Today Deposit, Today Withdraw */}
      <div className="grid grid-cols-2 gap-3" id="stats-grid">
        {/* Today Commission green */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-white shadow-sm'
        }`}>
          <span className="text-[10px] text-gray-500 tracking-wider uppercase font-bold block">
            {isBangla ? 'আজকের কমিশন' : 'Today Commission'}
          </span>
          <span className="text-lg font-black text-emerald-500 block mt-1 font-sans">
            ৳{user.todayCommission.toFixed(2)}
          </span>
        </div>

        {/* Total Commission pink/red */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-white shadow-sm'
        }`}>
          <span className="text-[10px] text-gray-500 tracking-wider uppercase font-bold block">
            {isBangla ? 'মোট কমিশন' : 'Total Commission'}
          </span>
          <span className="text-lg font-black text-rose-500 block mt-1 font-sans">
            ৳{user.totalCommission.toFixed(2)}
          </span>
        </div>

        {/* Today Deposit grey */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-white shadow-sm'
        }`}>
          <span className="text-[10px] text-gray-500 tracking-wider uppercase font-bold block">
            {isBangla ? 'আজকের ডিপোজিট' : 'Today Deposit'}
          </span>
          <span className="text-lg font-black text-amber-500 block mt-1 font-sans">
            ৳{user.todayDeposit.toFixed(2)}
          </span>
        </div>

        {/* Today Withdraw grey */}
        <div className={`p-4 rounded-2xl border ${
          isDarkMode ? 'border-[#222222] bg-[#111111]' : 'border-gray-200 bg-white shadow-sm'
        }`}>
          <span className="text-[10px] text-gray-500 tracking-wider uppercase font-bold block">
            {isBangla ? 'আজকের উইথড্র' : 'Today Withdraw'}
          </span>
          <span className="text-lg font-black text-blue-400 block mt-1 font-sans">
            ৳{user.todayWithdraw.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="space-y-3.5" id="transactions-log-section">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <History size={16} className="text-amber-500" />
            <h3 className="font-bold text-sm tracking-tight heading-font">
              {isBangla ? 'লেনদেনের বিবরণী' : 'Transactions'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('wallet')}
            className="text-xs text-amber-500 font-bold hover:underline select-none cursor-pointer"
            id="view-all-transactions-btn"
          >
            {isBangla ? 'সব দেখান' : 'View All'}
          </button>
        </div>

        {/* Dynamic customized sub-tab filter segmented bar */}
        <div className="flex bg-[#0E1724] p-1 rounded-xl border border-slate-800/60" id="history-filter-segments">
          <button
            type="button"
            onClick={() => setHistoryTab('all')}
            className={`flex-1 py-2 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              historyTab === 'all'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isBangla ? 'সব হিস্ট্রি' : 'All History'}
          </button>
          <button
            type="button"
            onClick={() => setHistoryTab('deposit')}
            className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              historyTab === 'deposit'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isBangla ? 'ডিপোজিট হিস্ট্রি' : 'Deposit'}
          </button>
          <button
            type="button"
            onClick={() => setHistoryTab('withdraw')}
            className={`flex-1 py-1.5 text-center text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              historyTab === 'withdraw'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {isBangla ? 'উইথড্র হিস্ট্রি' : 'Withdraw'}
          </button>
        </div>

        {/* Transactions list wrapper */}
        <div className="space-y-2.5">
          {(() => {
            const displayTransactions = transactions.filter(tx => {
              if (historyTab === 'all') return tx.type === 'Deposit' || tx.type === 'Withdraw';
              if (historyTab === 'deposit') return tx.type === 'Deposit';
              if (historyTab === 'withdraw') return tx.type === 'Withdraw';
              return false;
            });
            if (displayTransactions.length === 0) {
              return (
                <div className={`text-center py-8 rounded-2xl border border-dashed ${
                  isDarkMode ? 'border-[#222222] text-gray-600' : 'border-gray-200 text-gray-400'
                }`}>
                  <p className="text-xs">
                    {historyTab === 'deposit'
                      ? (isBangla ? 'কোনো ডিপোজিট রেকর্ড পাওয়া যায়নি!' : 'No deposit records found!')
                      : historyTab === 'withdraw'
                      ? (isBangla ? 'কোনো উইথড্র রেকর্ড পাওয়া যায়নি!' : 'No withdraw records found!')
                      : (isBangla ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি!' : 'No transaction records found!')}
                  </p>
                </div>
              );
            }
            return displayTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                  isDarkMode 
                    ? 'border-[#1A1A1A] bg-[#0C0C0C] hover:bg-[#111]' 
                    : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-800 hover:shadow-sm'
                }`}
                id={`transaction-item-${tx.id}`}
              >
                <div className="flex items-center gap-3">
                  {/* Left Cash Banknote green icon wrapper */}
                  <div className={`w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm select-none`}>
                    ৳
                  </div>
                  
                  <div>
                    <span className="text-xs font-bold block">
                      {tx.number} • {tx.type === 'Deposit' ? (isBangla ? 'ডিপোজিট' : 'Deposit') : (isBangla ? 'উইথড্র' : 'Withdraw')}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      {tx.method} • {tx.date}
                    </span>
                    {tx.assignedTo && tx.status === 'Pending' && (
                      <span className="text-[9px] bg-yellow-500/10 text-yellow-500 font-extrabold px-1.5 py-0.5 rounded inline-block mt-1">
                        {isBangla ? `রিভিউয়ার: @${tx.assignedTo}` : `Reviewer: @${tx.assignedTo}`}
                      </span>
                    )}
                    {tx.approvedBy && (
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded inline-block mt-1">
                        {isBangla ? `অনুমোদনকারী: @${tx.approvedBy}` : `Approved by: @${tx.approvedBy}`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Amount block with status indicator */}
                <div className="text-right">
                  <span className={`text-xs font-extrabold font-sans block ${
                    tx.type === 'Withdraw' ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {tx.type === 'Withdraw' ? '-' : '+'}৳{tx.amount.toFixed(2)}
                  </span>
                  <span className={`text-[9px] font-bold block mt-0.5 uppercase tracking-wide opacity-80 ${
                    tx.status === 'Completed' ? 'text-emerald-500' : tx.status === 'Pending' ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {tx.status === 'Completed' ? (isBangla ? 'সম্পন্ন' : 'Completed') : tx.status === 'Pending' ? (isBangla ? 'পেন্ডিং' : 'Pending') : (isBangla ? 'ব্যর্থ' : 'Failed')}
                  </span>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

    </div>
  );
}
