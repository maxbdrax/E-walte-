/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Wallet, CreditCard, Pencil, Check, Plus, Send, ShieldCheck, ArrowRightLeft, Copy } from 'lucide-react';
import { UserProfile, Language, PaymentGateway } from '../types';

interface WalletTabProps {
  user: UserProfile;
  language: Language;
  onUpdateWallets: (bKash?: string, nagad?: string, rocket?: string) => void;
  onTransfer: (uid: string, amount: number) => boolean;
  isDarkMode: boolean;
  paymentGateways: PaymentGateway[];
}

export default function WalletTab({
  user,
  language,
  onUpdateWallets,
  onTransfer,
  isDarkMode,
  paymentGateways
}: WalletTabProps) {
  const isBangla = language === 'বাংলা';

  // State to manage three tabs inside Wallet section: gateways (default), transfer, linked
  const [activeSubTab, setActiveSubTab] = useState<'gateways' | 'transfer' | 'linked'>('gateways');

  // Toggle edit state
  const [isEditing, setIsEditing] = useState(false);
  const [bKash, setBKash] = useState(user.bKashNumber || '');
  const [nagad, setNagad] = useState(user.nagadNumber || '');
  const [rocket, setRocket] = useState(user.rocketNumber || '');

  // Transfer states
  const [transferUid, setTransferUid] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handleSaveWallets = () => {
    onUpdateWallets(bKash, nagad, rocket);
    setIsEditing(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferUid.trim() || !transferAmount.trim()) {
      alert(isBangla ? 'অনুগ্রহ করে সঠিক তথ্য দিন!' : 'Please fill out all transfer fields!');
      return;
    }

    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      alert(isBangla ? 'অনুগ্রহ করে সঠিক অংক দিন!' : 'Please enter a valid transfer amount!');
      return;
    }

    if (user.balance < amt) {
      alert(isBangla ? 'দুঃখিত! আপনার ব্যালেন্স অপর্যাপ্ত!' : 'Insufficient balance for transfer!');
      return;
    }

    if (transferUid.trim() === user.uid) {
      alert(isBangla ? 'আপনি নিজের ইউআইডিতে টাকা পাঠাতে পারবেন না!' : 'Cannot send money to your own UID!');
      return;
    }

    setIsTransferring(true);
    setTimeout(() => {
      const success = onTransfer(transferUid, amt);
      setIsTransferring(false);
      if (success) {
        setTransferUid('');
        setTransferAmount('');
        alert(isBangla ? `সাফল্যের সাথে ট্রান্সফার সম্পন্ন হয়েছে! ৳${amt} পাঠানো হয়েছে UID: ${transferUid}-এ।` : `Transfer success! ৳${amt.toFixed(2)} sent successfully to UID: ${transferUid}.`);
      } else {
        alert(isBangla ? 'ট্রান্সফার সফল হয়নি। সার্ভারে অনুগ্রহপূর্বক পুনরায় চেষ্টা করুন' : 'Transfer failed. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className={`p-4 pb-12 overflow-y-auto space-y-6 max-w-lg mx-auto ${
      isDarkMode ? 'text-[#E0E0E0]' : 'text-gray-800'
    }`} id="wallet-management-tab">

      {/* Wallet Balance Card summary */}
      <div className="bg-[#0C0C0C] p-5 rounded-2xl text-white shadow-xl flex items-center justify-between border border-[#222222]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Wallet size={24} />
          </div>
          <div>
            <span className="text-xs text-gray-500 block font-bold">
              {isBangla ? 'আমার ওয়ালেট ব্যালেন্স' : 'My Wallet Balance'}
            </span>
            <span className="text-2xl font-black block mt-0.5 font-sans text-amber-500">
              ৳{user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-amber-500 bg-amber-500/10 py-1 px-2.5 rounded-full font-bold select-none uppercase tracking-wide">
            {isBangla ? 'নিরাপদ' : 'Secure'}
          </span>
        </div>
      </div>

      {/* Sub-tab segment selector - exactly matching premium designs */}
      <div className="flex bg-[#0E1724] p-1.5 rounded-2xl border border-slate-800/60 max-w-sm mx-auto" id="wallet-sub-segments">
        <button
          type="button"
          onClick={() => setActiveSubTab('gateways')}
          className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wide rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'gateways'
              ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {isBangla ? 'গেটওয়েস' : 'Gateways'}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('transfer')}
          className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wide rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'transfer'
              ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {isBangla ? 'ট্রান্সফার' : 'Transfer'}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('linked')}
          className={`flex-1 py-2.5 text-center text-xs font-black uppercase tracking-wide rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'linked'
              ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {isBangla ? 'অ্যাকাউন্ট লিংক' : 'Link Wallet'}
        </button>
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}

      {activeSubTab === 'gateways' && (
        <div className="space-y-6" id="user-system-payment-gateways">
          {/* Top aesthetic guide block mapping the logo card style */}
          <div className="p-4 rounded-3xl bg-[#1A2536] border border-slate-700/60 shadow-xl space-y-1 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-24 h-24 rounded-full bg-[#5D5FEF]/10 blur-xl pointer-events-none"></div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
              {isBangla ? 'সিস্টেম পেমেন্ট গেটওয়েস' : 'Available Deposit/Withdraw Gateways'}
            </h3>
            <p className="text-[10.5px] text-gray-300 font-semibold leading-relaxed">
              {isBangla 
                ? 'ডিপোজিট বা রিচার্জ করার পূর্বে যেকোনো গেটওয়ে নির্বাচন করে নম্বর কপি করে নিন।' 
                : 'Copy any active mobile account wallet address to quickly deposit or withdraw BDT credits.'}
            </p>
          </div>

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
                        {gw.number ? (
                          <div className="text-[11px] text-[#24A1DE] font-mono font-bold mt-0.5 tracking-wide">
                            {gw.number} {gw.ownerName ? `(${gw.ownerName})` : ''}
                          </div>
                        ) : (
                          <div className="text-[10px] text-rose-400 font-bold mt-0.5">
                            {isBangla ? 'ধাপটি সাময়িকভাবে নিষ্ক্রিয়' : 'Channel offline'}
                          </div>
                        )}
                      </div>
                    </div>

                    {gw.status === 'active' && gw.number ? (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(gw.number);
                          alert(isBangla ? `বিকাশ নম্বর ${gw.number} কপি করা হয়েছে!` : `${gw.number} copied successfully!`);
                        }}
                        className="py-1.5 px-5 bg-[#5D5FEF]/10 hover:bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30 hover:border-[#5D5FEF]/60 text-[11px] font-black uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm flex items-center gap-1"
                      >
                        <Copy size={11} />
                        <span>{isBangla ? 'কপি' : 'Copy'}</span>
                      </button>
                    ) : (
                      <button 
                        type="button"
                        disabled
                        className="py-1.5 px-4 bg-slate-800 text-slate-500 text-[10px] uppercase font-black tracking-wide rounded-xl cursor-not-allowed border border-slate-800/80"
                      >
                        {isBangla ? 'নিষ্ক্রিয়' : 'Offline'}
                      </button>
                    )}
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
                        {gw.number ? (
                          <div className="text-[11px] text-[#24A1DE] font-mono font-bold mt-0.5 tracking-wide">
                            {gw.number} {gw.ownerName ? `(${gw.ownerName})` : ''}
                          </div>
                        ) : (
                          <div className="text-[10px] text-rose-400 font-bold mt-0.5">
                            {isBangla ? 'ধাপটি সাময়িকভাবে নিষ্ক্রিয়' : 'Channel offline'}
                          </div>
                        )}
                      </div>
                    </div>

                    {gw.status === 'active' && gw.number ? (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(gw.number);
                          alert(isBangla ? `নগদ নম্বর ${gw.number} কপি করা হয়েছে!` : `${gw.number} copied successfully!`);
                        }}
                        className="py-1.5 px-5 bg-[#5D5FEF]/10 hover:bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30 hover:border-[#5D5FEF]/60 text-[11px] font-black uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm flex items-center gap-1"
                      >
                        <Copy size={11} />
                        <span>{isBangla ? 'কপি' : 'Copy'}</span>
                      </button>
                    ) : (
                      <button 
                        type="button"
                        disabled
                        className="py-1.5 px-4 bg-slate-800 text-slate-500 text-[10px] uppercase font-black tracking-wide rounded-xl cursor-not-allowed border border-slate-800/80"
                      >
                        {isBangla ? 'নিষ্ক্রিয়' : 'Offline'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ROCKET BLOCK */}
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
                        {gw.number ? (
                          <div className="text-[11px] text-[#24A1DE] font-mono font-bold mt-0.5 tracking-wide">
                            {gw.number} {gw.ownerName ? `(${gw.ownerName})` : ''}
                          </div>
                        ) : (
                          <div className="text-[10px] text-rose-400 font-bold mt-0.5">
                            {isBangla ? 'ধাপটি সাময়িকভাবে নিষ্ক্রিয়' : 'Channel offline'}
                          </div>
                        )}
                      </div>
                    </div>

                    {gw.status === 'active' && gw.number ? (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(gw.number);
                          alert(isBangla ? `রকেট নম্বর ${gw.number} কপি করা হয়েছে!` : `${gw.number} copied successfully!`);
                        }}
                        className="py-1.5 px-5 bg-[#5D5FEF]/10 hover:bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30 hover:border-[#5D5FEF]/60 text-[11px] font-black uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm flex items-center gap-1"
                      >
                        <Copy size={11} />
                        <span>{isBangla ? 'কপি' : 'Copy'}</span>
                      </button>
                    ) : (
                      <button 
                        type="button"
                        disabled
                        className="py-1.5 px-4 bg-slate-800 text-slate-500 text-[10px] uppercase font-black tracking-wide rounded-xl cursor-not-allowed border border-slate-800/80"
                      >
                        {isBangla ? 'নিষ্ক্রিয়' : 'Offline'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'linked' && (
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'border-[#222222] bg-[#0C0C0C]' : 'border-gray-250 bg-white shadow-sm'
        }`} id="registered-wallets">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-amber-500" />
              <h3 className="font-bold text-sm tracking-tight heading-font">
                {isBangla ? 'সংযুক্ত পেমেন্ট অ্যাকাউন্ট' : 'Linked Mobile Accounts'}
              </h3>
            </div>
            
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveWallets();
                } else {
                  setIsEditing(true);
                }
              }}
              className="p-1 px-3 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold hover:bg-amber-500/20 cursor-pointer transition-all flex items-center gap-1 leading-none"
              id="wallet-edit-toggle-btn"
            >
              {isEditing ? (
                <>
                  <Check size={12} />
                  {isBangla ? 'সংরক্ষণ' : 'Save'}
                </>
              ) : (
                <>
                  <Pencil size={12} />
                  {isBangla ? 'পরিবর্তন' : 'Link'}
                </>
              )}
            </button>
          </div>

          <div className="space-y-3.5">
            {/* bKash field */}
            <div className="flex items-center justify-between border-b border-gray-105 dark:border-[#222222] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-xs select-none">
                  bK
                </div>
                <span className="text-xs font-bold">bKash</span>
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={bKash}
                  onChange={(e) => setBKash(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className={`text-right text-xs bg-[#111111] border border-[#222222] focus:outline-none focus:border-amber-500 w-36 px-2 py-1 rounded-md text-white`}
                />
              ) : (
                <span className={`text-xs font-semibold ${user.bKashNumber ? 'text-[#10B981]' : 'text-gray-400'}`}>
                  {user.bKashNumber || (isBangla ? 'সংযুক্ত নেই' : 'Not linked')}
                </span>
              )}
            </div>

            {/* Nagad field */}
            <div className="flex items-center justify-between border-b border-gray-105 dark:border-[#222222] pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs select-none">
                  Ng
                </div>
                <span className="text-xs font-bold">Nagad</span>
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={nagad}
                  onChange={(e) => setNagad(e.target.value)}
                  placeholder="e.g. 018XXXXXXXX"
                  className={`text-right text-xs bg-[#111111] border border-[#222222] focus:outline-none focus:border-amber-500 w-36 px-2 py-1 rounded-md text-white`}
                />
              ) : (
                <span className={`text-xs font-semibold ${user.nagadNumber ? 'text-[#10B981]' : 'text-gray-400'}`}>
                  {user.nagadNumber || (isBangla ? 'সংযুক্ত নেই' : 'Not linked')}
                </span>
              )}
            </div>

            {/* Rocket field */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs select-none">
                  Rk
                </div>
                <span className="text-xs font-bold">Rocket</span>
              </div>
              
              {isEditing ? (
                <input
                  type="text"
                  value={rocket}
                  onChange={(e) => setRocket(e.target.value)}
                  placeholder="e.g. 019XXXXXXXX"
                  className={`text-right text-xs bg-[#111111] border border-[#222222] focus:outline-none focus:border-amber-500 w-36 px-2 py-1 rounded-md text-white`}
                />
              ) : (
                <span className={`text-xs font-semibold ${user.rocketNumber ? 'text-[#10B981]' : 'text-gray-400'}`}>
                  {user.rocketNumber || (isBangla ? 'সংযুক্ত নেই' : 'Not linked')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'transfer' && (
        <div className={`p-4 rounded-xl border ${
          isDarkMode ? 'border-[#222222] bg-[#0C0C0C]' : 'border-gray-200 bg-white shadow-sm'
        }`} id="transfer-balance-form">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft size={18} className="text-amber-500" />
            <h3 className="font-bold text-sm tracking-tight heading-font">
              {isBangla ? 'তাৎক্ষণিক মানি ট্রান্সফার' : 'Instant Balance Transfer'}
            </h3>
          </div>

          <form onSubmit={handleTransferSubmit} className="space-y-4">
            {/* Transfer Target UID */}
            <div>
              <label htmlFor="transfer_uid" className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                {isBangla ? 'গ্রাহক ইউআইডি (UID)' : 'Recipient Wallet UID'}
              </label>
              <input
                id="transfer_uid"
                type="text"
                value={transferUid}
                onChange={(e) => setTransferUid(e.target.value)}
                placeholder="e.g. 1508"
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold border focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 ${
                  isDarkMode 
                    ? 'bg-[#111111] border-[#222222] text-white shadow-inner' 
                    : 'bg-gray-55 border-gray-200 text-gray-800 shadow-inner'
                }`}
                required
              />
            </div>

            {/* Transfer amount */}
            <div>
              <label htmlFor="transfer_amount" className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                {isBangla ? 'অংক (টাকা ৳)' : 'Amount (BDT ৳)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm font-bold">৳</span>
                <input
                  id="transfer_amount"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  min="10"
                  step="any"
                  className={`w-full py-2.5 pl-8 pr-3 rounded-xl text-xs font-extrabold border focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 ${
                    isDarkMode 
                      ? 'bg-[#111111] border-[#222222] text-white shadow-inner' 
                      : 'bg-gray-55 border-gray-200 text-gray-800 shadow-inner'
                  }`}
                  required
                />
              </div>
            </div>

            {/* Secure transfer submission badge/button */}
            <button
              type="submit"
              disabled={isTransferring}
              className={`w-full py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase rounded-xl tracking-wider shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer`}
              id="wallet-transfer-submit-btn"
            >
              {isTransferring ? (
                isBangla ? 'পাঠানো হচ্ছে...' : 'Sending BDT...'
              ) : (
                <>
                  <Send size={13} />
                  {isBangla ? 'ব্যালেন্স ট্রান্সফার করুন' : 'Confirm & Transfer'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Safety notice info card */}
      <div className="flex items-start gap-2.5 p-3.5 bg-amber-500/[0.04] text-amber-500 border border-amber-500/15 rounded-xl">
        <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
        <p className="text-[10px] leading-relaxed font-medium">
          {isBangla
            ? 'পরামর্শ: প্রতিটি ট্রানজেকশন পিআর এসএসএল লেয়ার দ্বারা এনক্রিপ্ট করা হয়। টাকা পাঠানোর পূর্বে প্রাপকের ইউআইডি সঠিক কিনা তা অবশ্যই চেক করে নিন।'
            : 'Security Notice: P2P deposits and instant payouts operate securely inside our SSL shield. Verify UID inputs before transmitting funds as transfer operations are immediate.'}
        </p>
      </div>

    </div>
  );
}
