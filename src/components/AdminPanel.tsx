/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Check, 
  X, 
  Shield, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2, 
  Edit2, 
  Search, 
  Settings as SettingsIcon, 
  Save, 
  AlertTriangle, 
  IdCard, 
  DollarSign, 
  Award,
  Lock,
  Unlock,
  CheckCircle,
  TrendingUp,
  FileText,
  CreditCard,
  ArrowLeft
} from 'lucide-react';
import { UserProfile, Transaction, Language, PaymentGateway } from '../types';

interface AdminPanelProps {
  language: Language;
  usersList: UserProfile[];
  globalTransactions: Transaction[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onDeleteUser: (username: string) => void;
  onApproveDeposit: (txId: string) => void;
  onRejectDeposit: (txId: string) => void;
  onApproveWithdraw: (txId: string) => void;
  onRejectWithdraw: (txId: string) => void;
  onApproveKyc: (username: string) => void;
  onRejectKyc: (username: string) => void;
  onUpdateSupportLink: (newLink: string) => void;
  supportLink: string;
  isDarkMode: boolean;
  paymentGateways: PaymentGateway[];
  onUpdateGateway: (updated: PaymentGateway) => void;
  onAssignTransaction: (txId: string, assignedTo: string) => void;
}

export default function AdminPanel({
  language,
  usersList,
  globalTransactions,
  onUpdateUser,
  onDeleteUser,
  onApproveDeposit,
  onRejectDeposit,
  onApproveWithdraw,
  onRejectWithdraw,
  onApproveKyc,
  onRejectKyc,
  onUpdateSupportLink,
  supportLink,
  isDarkMode,
  paymentGateways,
  onUpdateGateway,
  onAssignTransaction
}: AdminPanelProps) {
  const isBangla = language === 'বাংলা';
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'deposits' | 'withdraws' | 'kyc' | 'gateways' | 'settings'>('users');
  
  // Search & Filters for Users
  const [userSearchText, setUserSearchText] = useState('');
  
  // Edit user state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editVipLevel, setEditVipLevel] = useState(0);

  // Edit gateway state
  const [editingGateway, setEditingGateway] = useState<PaymentGateway | null>(null);
  const [editGatewayNumber, setEditGatewayNumber] = useState('');
  const [editGatewayStatus, setEditGatewayStatus] = useState<'active' | 'deactive'>('active');
  const [editGatewayOwnerName, setEditGatewayOwnerName] = useState('');
  const [editGatewayPassword, setEditGatewayPassword] = useState('');
  
  // Reviewer assignment local state mapping
  const [selectedReviewers, setSelectedReviewers] = useState<Record<string, string>>({});
  
  // Support link state
  const [newSupportLink, setNewSupportLink] = useState(supportLink);

  // Filtered lists
  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(userSearchText.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchText.toLowerCase()) ||
    u.uid.includes(userSearchText)
  );

  const pendingDeposits = globalTransactions.filter(t => t.type === 'Deposit' && t.status === 'Pending');
  const pendingWithdrawals = globalTransactions.filter(t => t.type === 'Withdraw' && t.status === 'Pending');
  const pendingKycUsers = usersList.filter(u => u.kycStatus === 'Pending');

  // Handle Edit User Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: UserProfile = {
      ...editingUser,
      balance: parseFloat(editBalance) || 0,
      vipLevel: editVipLevel
    };

    onUpdateUser(updated);
    setEditingUser(null);
    alert(isBangla ? 'ইউজার তথ্য পরিবর্তন করা হয়েছে!' : 'User metrics customized successfully!');
  };

  const handleToggleBlock = (user: UserProfile) => {
    const updated: UserProfile = {
      ...user,
      isBlocked: !user.isBlocked
    };
    onUpdateUser(updated);
    alert(
      isBangla
        ? `${user.name} কে সফলভাবে ${user.isBlocked ? 'আনব্লক' : 'ব্লক'} করা হয়েছে।`
        : `${user.name} has been ${user.isBlocked ? 'unblocked' : 'suspended'} successfully.`
    );
  };

  // Navigation Sub-Tabs
  const gatewaysCount = paymentGateways.filter(g => g.status === 'active').length;

  if (activeSubTab === 'gateways') {
    return (
      <div className="min-h-screen text-[#E0E0E0] pb-16 bg-[#0E1724]" id="admin-gateways-photo-view">
        {/* Dynamic header */}
        <div className="bg-[#1A2536] p-4 flex items-center relative select-none border-b border-slate-800">
          <button 
            type="button"
            onClick={() => {
              setActiveSubTab('users');
              setEditingGateway(null);
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm absolute left-4"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-full text-center text-sm font-black tracking-wide text-white uppercase font-sans">
            {isBangla ? 'পেমেন্ট গেটওয়েস' : 'Payment Gateways'}
          </div>
        </div>

        {/* Deep body container */}
        <div className="p-4 space-y-6 max-w-lg mx-auto relative">
          
          {/* POPUP OVERLAY MODAL (Exactly matches the requested screenshot photo) */}
          {editingGateway && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 animate-fade-in">
              <div 
                className="bg-[#121B2D] border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6 space-y-5"
                id="edit-gateway-dialog-screen"
              >
                {/* Close Button X */}
                <button
                  type="button"
                  onClick={() => setEditingGateway(null)}
                  className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>

                {/* Edit Title */}
                <h3 className="text-xl font-black text-white tracking-tight heading-font mt-1">
                  {isBangla ? 'গেটওয়ে এডিট করুন' : 'Edit Gateway'}
                </h3>

                {/* Form fields mimicking photo inputs */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingGateway) {
                      onUpdateGateway({
                        ...editingGateway,
                        number: editGatewayNumber,
                        status: editGatewayStatus,
                        ownerName: editGatewayOwnerName
                      });
                      setEditingGateway(null);
                      setEditGatewayPassword('');
                      alert(isBangla ? 'পেমেন্ট গেটওয়ে সফলভাবে আপডেট করা হয়েছে!' : 'Gateway parameters successfully updated!');
                    }
                  }} 
                  className="space-y-4"
                >
                  {/* Field 1: Name / Owner */}
                  <div>
                    <input
                      type="text"
                      value={editGatewayOwnerName}
                      onChange={(e) => setEditGatewayOwnerName(e.target.value)}
                      placeholder={isBangla ? 'নাম লিখুন (রকিব)' : 'Name (e.g. Rakib)'}
                      className="w-full bg-[#0F1726]/90 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Field 2: Number */}
                  <div>
                    <input
                      type="text"
                      value={editGatewayNumber}
                      onChange={(e) => setEditGatewayNumber(e.target.value)}
                      placeholder={isBangla ? 'মোবাইল নম্বর লিখুন' : '01314940236'}
                      className="w-full bg-[#0F1726]/90 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all font-mono tracking-wide placeholder-gray-500"
                      required
                    />
                  </div>

                  {/* Field 3: Status Dropdown select */}
                  <div className="relative">
                    <select
                      value={editGatewayStatus}
                      onChange={(e) => setEditGatewayStatus(e.target.value as any)}
                      className="w-full bg-[#0F1726]/90 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="active">active (সক্রিয়)</option>
                      <option value="deactive">deactive (নিষ্ক্রিয়)</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                  </div>

                  {/* Field 4: Password field */}
                  <div>
                    <input
                      type="password"
                      value={editGatewayPassword}
                      onChange={(e) => setEditGatewayPassword(e.target.value)}
                      placeholder={isBangla ? 'পাসওয়ার্ড দিন' : 'Enter Your Password'}
                      className="w-full bg-[#0F1726]/90 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none transition-all placeholder-gray-500"
                    />
                  </div>

                  {/* Submit Button purple */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#5D5FEF] hover:bg-[#4E50D1] text-white text-sm font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-lg flex items-center justify-center shadow-[#5D5FEF]/20"
                  >
                    {isBangla ? 'সাবমিট করুন' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Grouped lists of all gateways */}
          <div className="space-y-6">
            
            {/* BKASH BLOCK */}
            <div className="space-y-3">
              <div className="text-[11px] font-black text-gray-500 tracking-widest pl-1">
                BKASH
              </div>
              <div className="space-y-3">
                {paymentGateways.filter(gw => gw.brand === 'bkash').map(gw => (
                  <div 
                    key={gw.id} 
                    className="bg-[#0D192D] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Pink Bkash Logo circle */}
                      <div className="w-12 h-12 bg-[#E2125B] text-white flex items-center justify-center rounded-full flex-shrink-0 shadow-inner">
                        <span className="font-extrabold text-sm tracking-tighter">bKash</span>
                      </div>
                      <div>
                        <div className="text-[12px] font-black text-white tracking-wide uppercase leading-tight font-sans">
                          {gw.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-bold">
                          <span>Status:</span>
                          <span className={gw.status === 'active' ? 'text-[#10B981] font-extrabold animate-pulse' : 'text-rose-500'}>
                            {gw.status === 'active' ? 'active' : 'deactive'}
                          </span>
                        </div>
                        {gw.number && (
                          <div className="text-[11px] text-[#24A1DE] font-mono font-bold mt-0.5 tracking-wide">
                            {gw.number} {gw.ownerName ? `(${gw.ownerName})` : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingGateway(gw);
                        setEditGatewayNumber(gw.number);
                        setEditGatewayStatus(gw.status);
                        setEditGatewayOwnerName(gw.ownerName || '');
                        setEditGatewayPassword('');
                      }}
                      className="py-1.5 px-5 bg-[#5D5FEF]/10 hover:bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30 hover:border-[#5D5FEF]/60 text-[11px] font-black uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      {isBangla ? 'এডিট' : 'Edit'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* NAGAD BLOCK */}
            <div className="space-y-3">
              <div className="text-[11px] font-black text-gray-500 tracking-widest pl-1">
                NAGAD
              </div>
              <div className="space-y-3">
                {paymentGateways.filter(gw => gw.brand === 'nagad').map(gw => (
                  <div 
                    key={gw.id} 
                    className="bg-[#0D192D] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Red-Orange Nagad Logo circle */}
                      <div className="w-12 h-12 bg-[#F15A22] text-white flex items-center justify-center rounded-full flex-shrink-0 shadow-inner">
                        <span className="font-extrabold text-sm tracking-tighter">Nagad</span>
                      </div>
                      <div>
                        <div className="text-[12px] font-black text-white tracking-wide uppercase leading-tight font-sans">
                          {gw.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-bold">
                          <span>Status:</span>
                          <span className={gw.status === 'active' ? 'text-[#10B981] font-extrabold animate-pulse' : 'text-rose-500'}>
                            {gw.status === 'active' ? 'active' : 'deactive'}
                          </span>
                        </div>
                        {gw.number && (
                          <div className="text-[11px] text-[#24A1DE] font-mono font-bold mt-0.5 tracking-wide">
                            {gw.number} {gw.ownerName ? `(${gw.ownerName})` : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingGateway(gw);
                        setEditGatewayNumber(gw.number);
                        setEditGatewayStatus(gw.status);
                        setEditGatewayOwnerName(gw.ownerName || '');
                        setEditGatewayPassword('');
                      }}
                      className="py-1.5 px-5 bg-[#5D5FEF]/10 hover:bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30 hover:border-[#5D5FEF]/60 text-[11px] font-black uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      {isBangla ? 'এডিট' : 'Edit'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ROCKET BLOCK (Violet branding) */}
            <div className="space-y-3">
              <div className="text-[11px] font-black text-gray-500 tracking-widest pl-1">
                ROCKET
              </div>
              <div className="space-y-3">
                {paymentGateways.filter(gw => gw.brand === 'rocket').map(gw => (
                  <div 
                    key={gw.id} 
                    className="bg-[#0D192D] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between shadow-md hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Deep purple/rocket branding circle */}
                      <div className="w-12 h-12 bg-[#8C3093] text-white flex items-center justify-center rounded-full flex-shrink-0 shadow-inner">
                        <span className="font-extrabold text-[11px] tracking-tighter">Rocket</span>
                      </div>
                      <div>
                        <div className="text-[12px] font-black text-white tracking-wide uppercase leading-tight font-sans">
                          {gw.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 font-bold">
                          <span>Status:</span>
                          <span className={gw.status === 'active' ? 'text-[#10B981] font-extrabold animate-pulse' : 'text-rose-500'}>
                            {gw.status === 'active' ? 'active' : 'deactive'}
                          </span>
                        </div>
                        {gw.number && (
                          <div className="text-[11px] text-[#24A1DE] font-mono font-bold mt-0.5 tracking-wide">
                            {gw.number} {gw.ownerName ? `(${gw.ownerName})` : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingGateway(gw);
                        setEditGatewayNumber(gw.number);
                        setEditGatewayStatus(gw.status);
                        setEditGatewayOwnerName(gw.ownerName || '');
                        setEditGatewayPassword('');
                      }}
                      className="py-1.5 px-5 bg-[#5D5FEF]/10 hover:bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30 hover:border-[#5D5FEF]/60 text-[11px] font-black uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      {isBangla ? 'এডিট' : 'Edit'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 pb-16 space-y-6 max-w-lg mx-auto ${
      isDarkMode ? 'text-[#E0E0E0]' : 'text-gray-805 text-gray-800'
    }`} id="admin-management-module">
      
      {/* Module Title Banner */}
      <div className="bg-[#0C0C0C] border border-[#222222] p-4 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight heading-font text-amber-500">
              {isBangla ? 'অ্যাডমিন কন্ট্রোল পোর্টাল' : 'Admin Control Terminal'}
            </h2>
            <span className="text-[10px] text-gray-500 font-bold block mt-0.5">
              {isBangla ? 'পদ্ধতি ও ইউজার নিয়ন্ত্রণ' : 'Full Platform Authority'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-[#24A1DE] bg-[#24A1DE]/10 py-1 px-2 rounded-full font-extrabold tracking-wide uppercase">
            SECURE ACCESS
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-6 gap-1 p-1 bg-[#111111]/80 rounded-xl border border-[#222222]" id="admin-tabs-nav">
        {[
          { id: 'users', label: isBangla ? 'ইউজার' : 'Users', icon: Users },
          { id: 'deposits', label: isBangla ? 'ডিপোজিট' : 'Recharges', icon: ArrowUpRight, count: pendingDeposits.length },
          { id: 'withdraws', label: isBangla ? 'উইথড্র' : 'Payouts', icon: ArrowDownLeft, count: pendingWithdrawals.length },
          { id: 'kyc', label: isBangla ? 'কেওয়াইসি' : 'KYC', icon: IdCard, count: pendingKycUsers.length },
          { id: 'gateways', label: isBangla ? 'গেটওয়ে' : 'Gateway', icon: CreditCard },
          { id: 'settings', label: isBangla ? 'সেটিংস' : 'Setting', icon: SettingsIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setEditingUser(null);
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all relative cursor-pointer ${
                isActive 
                  ? 'bg-amber-500 text-black font-extrabold shadow' 
                  : 'text-gray-400 hover:bg-[#222222]/30 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="text-[9px] mt-1 tracking-tight font-sans leading-none">{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 ? (
                <span className={`absolute top-1 right-1 px-1 min-w-[13px] h-[13px] text-[8px] font-bold rounded-full flex items-center justify-center ${
                  isActive ? 'bg-black text-amber-500' : 'bg-red-500 text-white animate-pulse'
                }`}>
                  {tab.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* SUB-PANEL 1: USER MANAGEMENT */}
      {activeSubTab === 'users' && !editingUser && (
        <div className="space-y-4">
          {/* User Search Row */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={userSearchText}
              onChange={(e) => setUserSearchText(e.target.value)}
              placeholder={isBangla ? 'ইউজার নাম, ইউআইডি দিয়ে খুঁজুন...' : 'Search by Name, Username or UID...'}
              className="w-full pl-9 pr-3 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-3" id="admin-users-list">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500">
                {isBangla ? 'কোনো ইউজার খুঁজে পাওয়া যায়নি!' : 'No matching member record found.'}
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.username} className="bg-[#0C0C0C] border border-[#222222] p-3.5 rounded-xl space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{u.name}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                          VIP {u.vipLevel}
                        </span>
                        {u.role === 'admin' && (
                          <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 block mt-0.5 font-mono">
                        {u.username} | UID: {u.uid}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-amber-500 block">
                        ৳{u.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block uppercase select-none ${
                        u.kycStatus === 'Verified' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : u.kycStatus === 'Pending' 
                            ? 'bg-yellow-500/10 text-yellow-500' 
                            : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        KYC: {u.kycStatus}
                      </span>
                    </div>
                  </div>

                  {/* Operational Action Buttons Row */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#222222]/60">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setEditBalance(String(u.balance));
                        setEditVipLevel(u.vipLevel);
                      }}
                      className="flex-1 py-1 px-2.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500 text-[10px] uppercase font-bold hover:text-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit2 size={11} /> {isBangla ? 'এডিট' : 'Change'}
                    </button>

                    <button
                      onClick={() => handleToggleBlock(u)}
                      className={`flex-1 py-1 px-2.5 text-[10px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        u.isBlocked 
                          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black' 
                          : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black'
                      }`}
                    >
                      {u.isBlocked ? <Unlock size={11} /> : <Lock size={11} />}
                      {u.isBlocked ? (isBangla ? 'আনব্লক' : 'Unsuspend') : (isBangla ? 'ব্লক' : 'Suspend')}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(isBangla ? `আপনি কি নিশ্চিত যে আপনি ${u.name}-এর অ্যাকাউন্ট রিমুভ করতে চান?` : `Are you sure you want to permanently delete user: ${u.username}?`)) {
                          onDeleteUser(u.username);
                        }
                      }}
                      disabled={u.role === 'admin'}
                      className={`flex-1 py-1 px-2.5 bg-rose-500/11 text-rose-400 hover:bg-rose-600 hover:text-white text-[10px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        u.role === 'admin' ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    >
                      <Trash2 size={11} /> {isBangla ? 'রিমুভ' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EDITING COMPONENT ROW */}
      {activeSubTab === 'users' && editingUser && (
        <form onSubmit={handleEditSubmit} className="bg-[#0C0C0C] border border-[#222222] p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
            <h3 className="font-extrabold text-xs text-amber-500 uppercase tracking-wider">
              {isBangla ? `ইউজার এডিট করুন: ${editingUser.name}` : `Adjust metrics: ${editingUser.name}`}
            </h3>
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
              {isBangla ? 'ব্যালেন্স (৳)' : 'Balance (৳)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-sans font-bold text-xs">৳</span>
              <input
                type="number"
                step="any"
                value={editBalance}
                onChange={(e) => setEditBalance(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[#111111] border border-[#222222] rounded-lg text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
              VIP Level
            </label>
            <select
              value={editVipLevel}
              onChange={(e) => setEditVipLevel(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-[#111111] border border-[#222222] rounded-lg text-xs font-bold text-white focus:outline-none focus:border-amber-500"
            >
              <option value={0}>VIP 0 (1.0% Rate)</option>
              <option value={1}>VIP 1 (1.8% Rate)</option>
              <option value={2}>VIP 2 (2.5% Rate)</option>
              <option value={3}>VIP 3 (3.8% Rate)</option>
              <option value={4}>VIP 4 (5.5% Rate)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="flex-1 py-2 bg-[#111111] hover:bg-[#222222] text-xs font-bold rounded-lg uppercase tracking-wider text-gray-300 transition-all cursor-pointer"
            >
              {isBangla ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Save size={13} />
              {isBangla ? 'সংরক্ষণ করুন' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* SUB-PANEL 2: PENDING DEPOSITS LIST */}
      {activeSubTab === 'deposits' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-extrabold block">
            {isBangla ? `অপেক্ষমান ডিপোজিট সমূহ (${pendingDeposits.length})` : `Pending Recharge orders (${pendingDeposits.length})`}
          </div>

          {pendingDeposits.length === 0 ? (
            <div className="text-center py-10 bg-[#0C0C0C] border border-[#222222] rounded-xl text-xs text-gray-500">
              {isBangla ? 'কোনো অপেক্ষমান ডিপোজিট রিকোয়েস্ট নেই।' : 'No pending recharge credentials present.'}
            </div>
          ) : (
            pendingDeposits.map((tx) => (
              <div key={tx.id} className="bg-[#0C0C0C] border border-[#222222] p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-white block">৳{tx.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-amber-500 uppercase font-bold mt-1 block">
                      Gateway: {tx.method}
                    </span>
                    <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">
                      User: {(tx as any).username || 'N/A'}
                    </span>
                    {(tx as any).senderNumber && (
                      <span className="text-[10px] text-sky-400 font-mono font-bold block mt-0.5">
                        Sender: {(tx as any).senderNumber}
                      </span>
                    )}
                    {tx.assignedTo && (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase">
                        <span>Assigned to: @{tx.assignedTo}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-mono block">{tx.number}</span>
                    <span className="text-[9px] text-gray-655 text-gray-400 block mt-0.5">{tx.date}</span>
                  </div>
                </div>

                {/* Assignment Dropdown Selector */}
                <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1.5">
                  <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">
                    {isBangla ? 'রিকোয়েস্ট রিভিউ করার দায়িত্ব অর্পণ করুন (অ্যাসাইন)' : 'Assign anyone to approve/process request'}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedReviewers[tx.id] || ''}
                      onChange={(e) => setSelectedReviewers(prev => ({ ...prev, [tx.id]: e.target.value }))}
                      className="flex-1 px-2 py-1.5 bg-[#0A0E17] border border-slate-800 rounded-lg text-[10.5px] font-bold text-white focus:outline-none focus:border-[#5D5FEF] cursor-pointer"
                    >
                      <option value="">{isBangla ? '-- ইউজার সিলেক্ট করুন --' : '-- Choose User Username --'}</option>
                      {usersList.map(u => (
                        <option key={u.username} value={u.username}>
                          {u.username} ({u.name})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const targetUser = selectedReviewers[tx.id];
                        if (!targetUser) {
                          alert(isBangla ? 'অনুগ্রহ করে একজন ইউজার নির্বাচন করুন!' : 'Please select a reviewer user first!');
                          return;
                        }
                        onAssignTransaction(tx.id, targetUser);
                        alert(isBangla ? `রিভিউ কাজ সফলভাবে @${targetUser} কে অ্যাসাইন করা হয়েছে!` : `Review task assigned to @${targetUser} successfully!`);
                      }}
                      className="px-3 py-1 bg-[#5D5FEF] hover:bg-[#4E50D1] text-white text-[11px] font-black uppercase rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                    >
                      {isBangla ? 'অ্যাসাইন' : 'Assign'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#222222]/50">
                  <button
                    onClick={() => onRejectDeposit(tx.id)}
                    className="flex-1 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X size={12} /> {isBangla ? 'প্রত্যাখ্যান' : 'Decline'}
                  </button>

                  <button
                    onClick={() => onApproveDeposit(tx.id)}
                    className="flex-1 py-1.5 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-black text-[10px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check size={12} /> {isBangla ? 'অনুমোদন দিন' : 'Approve'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-PANEL 3: PENDING WITHDRAWALS LIST */}
      {activeSubTab === 'withdraws' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-extrabold block">
            {isBangla ? `অপেক্ষমান উইথড্র সমূহ (${pendingWithdrawals.length})` : `Pending Cashout processing list (${pendingWithdrawals.length})`}
          </div>

          {pendingWithdrawals.length === 0 ? (
            <div className="text-center py-10 bg-[#0C0C0C] border border-[#222222] rounded-xl text-xs text-gray-500">
              {isBangla ? 'কোনো অপেক্ষমান আউটপুট বা ক্যাশআউট রিকোয়েস্ট নেই।' : 'No billing pending payout requests.'}
            </div>
          ) : (
            pendingWithdrawals.map((tx) => (
              <div key={tx.id} className="bg-[#0C0C0C] border border-[#222222] p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-rose-500 block">৳{tx.amount.toFixed(2)}</span>
                    <span className="text-[10px] text-amber-500 uppercase font-bold mt-1 block">
                      Target: {tx.method}
                    </span>
                    <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">
                      User: {(tx as any).username || 'N/A'}
                    </span>
                    {(tx as any).receiverNumber && (
                      <span className="text-[10px] text-sky-400 font-mono font-bold block mt-0.5 animate-pulse">
                        Pay To: {(tx as any).receiverNumber}
                      </span>
                    )}
                    {tx.assignedTo && (
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase">
                        <span>Assigned to: @{tx.assignedTo}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-mono block">{tx.number}</span>
                    <span className="text-[9px] text-gray-655 text-gray-400 block mt-0.5">{tx.date}</span>
                  </div>
                </div>

                {/* Assignment Dropdown Selector */}
                <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1.5">
                  <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest block">
                    {isBangla ? 'রিকোয়েস্ট রিভিউ করার দায়িত্ব অর্পণ করুন (অ্যাসাইন)' : 'Assign anyone to approve/process request'}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedReviewers[tx.id] || ''}
                      onChange={(e) => setSelectedReviewers(prev => ({ ...prev, [tx.id]: e.target.value }))}
                      className="flex-1 px-2 py-1.5 bg-[#0A0E17] border border-slate-800 rounded-lg text-[10.5px] font-bold text-white focus:outline-none focus:border-[#5D5FEF] cursor-pointer"
                    >
                      <option value="">{isBangla ? '-- ইউজার সিলেক্ট করুন --' : '-- Choose User Username --'}</option>
                      {usersList.map(u => (
                        <option key={u.username} value={u.username}>
                          {u.username} ({u.name})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const targetUser = selectedReviewers[tx.id];
                        if (!targetUser) {
                          alert(isBangla ? 'অনুগ্রহ করে একজন ইউজার নির্বাচন করুন!' : 'Please select a reviewer user first!');
                          return;
                        }
                        onAssignTransaction(tx.id, targetUser);
                        alert(isBangla ? `রিভিউ কাজ সফলভাবে @${targetUser} কে অ্যাসাইন করা হয়েছে!` : `Review task assigned to @${targetUser} successfully!`);
                      }}
                      className="px-3 py-1 bg-[#5D5FEF] hover:bg-[#4E50D1] text-white text-[11px] font-black uppercase rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
                    >
                      {isBangla ? 'অ্যাসাইন' : 'Assign'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#222222]/50">
                  <button
                    onClick={() => onRejectWithdraw(tx.id)}
                    className="flex-1 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X size={12} /> {isBangla ? 'প্রত্যাখ্যান' : 'Decline & Refund'}
                  </button>

                  <button
                    onClick={() => onApproveWithdraw(tx.id)}
                    className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black text-[10px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check size={12} /> {isBangla ? 'অনুমোদন দিন' : 'Disburse BDT'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-PANEL 4: KYC VERIFICATION PENDING */}
      {activeSubTab === 'kyc' && (
        <div className="space-y-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider font-extrabold block">
            {isBangla ? `অপেক্ষমান কেওয়াইসি ভেরিফিকেশন (${pendingKycUsers.length})` : `KYC Document Audits list (${pendingKycUsers.length})`}
          </div>

          {pendingKycUsers.length === 0 ? (
            <div className="text-center py-10 bg-[#0C0C0C] border border-[#222222] rounded-xl text-xs text-gray-500">
              {isBangla ? 'কোনো অপেক্ষমান কেওয়াইসি ডকুমেন্ট আবেদনের তালিকা নেই।' : 'No candidate KYC application is queued.'}
            </div>
          ) : (
            pendingKycUsers.map((u) => (
              <div key={u.username} className="bg-[#0C0C0C] border border-[#222222] p-4 rounded-xl space-y-3.5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{u.name} ({u.username})</span>
                    <span className="text-[10px] text-gray-500">UID: {u.uid}</span>
                  </div>
                  {u.kycDetails && (
                    <div className="space-y-3.5">
                      <div className="mt-2.5 p-3 bg-[#111111] border border-[#222222]/80 rounded-lg text-[11px] font-medium space-y-1">
                        <div><strong className="text-gray-400">{isBangla ? 'পূর্ণ নাম:' : 'Full name:'}</strong> {u.kycDetails.firstName} {u.kycDetails.lastName}</div>
                        <div><strong className="text-gray-400">{isBangla ? 'জন্ম তারিখ:' : 'Birth date:'}</strong> {u.kycDetails.dob}</div>
                        <div><strong className="text-gray-400">{isBangla ? 'শহর / সিটি:' : 'Residence City:'}</strong> {u.kycDetails.city}</div>
                        <div><strong className="text-gray-400">{isBangla ? 'ডকুমেন্ট বিবরণ:' : 'Document format:'}</strong> {u.kycDetails.docType}</div>
                      </div>
                      
                      {/* Uploaded NID Photos */}
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {u.kycDetails.frontPhoto && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold block">{isBangla ? 'এনআইডি ফ্রন্ট সাইড' : 'NID Front Side'}</span>
                            <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 aspect-video flex items-center justify-center p-1">
                              <img 
                                src={u.kycDetails.frontPhoto} 
                                alt="NID Front" 
                                className="max-h-28 max-w-full object-contain rounded-lg transition-transform hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        )}
                        {u.kycDetails.backPhoto && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold block">{isBangla ? 'এনআইডি ব্যাক সাইড' : 'NID Back Side'}</span>
                            <div className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 aspect-video flex items-center justify-center p-1">
                              <img 
                                src={u.kycDetails.backPhoto} 
                                alt="NID Back" 
                                className="max-h-28 max-w-full object-contain rounded-lg transition-transform hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onRejectKyc(u.username)}
                    className="flex-1 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X size={12} /> {isBangla ? 'বাতিল / রিজেক্ট' : 'Reject'}
                  </button>

                  <button
                    onClick={() => onApproveKyc(u.username)}
                    className="flex-1 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black text-[10px] uppercase font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check size={12} /> {isBangla ? 'ভেরিফাই করুন' : 'Accept verified'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUB-PANEL 5: GLOBAL PLATFORM TERMINAL SETTINGS */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-[#0C0C0C] border border-[#222222] p-4 rounded-xl space-y-4">
            <div>
              <label htmlFor="p_support_input" className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                {isBangla ? 'টেলিগ্রাম সাপোর্ট চ্যানেল লিংক' : 'Telegram Support Endpoint'}
              </label>
              <input
                id="p_support_input"
                type="text"
                value={newSupportLink}
                onChange={(e) => setNewSupportLink(e.target.value)}
                placeholder="e.g. https://t.me/your_bot_support"
                className="w-full px-3 py-2 bg-[#111111] border border-[#222222] rounded-lg text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => {
                onUpdateSupportLink(newSupportLink);
                alert(isBangla ? 'অ্যাডমিন পোর্টাল: সাপোর্ট ঠিকানা সফলভাবে পরিবর্তন করা হলো!' : 'Telegram help-desk redirect link configured securely!');
              }}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save size={13} />
              {isBangla ? 'সেভ চেঞ্জেস' : 'Apply Configuration'}
            </button>
          </div>

          <div className="p-3.5 bg-amber-500/[0.03] border border-amber-500/20 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold uppercase">
              <AlertTriangle size={14} />
              <span>{isBangla ? 'সিস্টেম নোট' : 'Platform Alert'}</span>
            </div>
            <p className="text-[10.5px] leading-relaxed text-gray-500">
              {isBangla 
                ? 'অ্যাডমিন প্যানেল থেকে যেকোনো ডিপোজিট এপ্রুভ করার সাথে সাথে সংশ্লিষ্ট ব্যবহারকারীর কমিশন ক্যালকুলেট হয়ে ব্যালেন্স যোগ হয়।' 
                : 'Any Deposit request triggered under "Pending" status directly coordinates user level VIP margins upon click approval.'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
