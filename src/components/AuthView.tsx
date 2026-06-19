/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  UserPlus, 
  Phone, 
  HelpCircle, 
  CheckCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Key,
  Flame,
  Globe
} from 'lucide-react';
import { UserProfile, Language } from '../types';

interface AuthViewProps {
  language: Language;
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
  isDarkMode: boolean;
  onLanguageChange: (lang: Language) => void;
}

export default function AuthView({
  language,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  isDarkMode,
  onLanguageChange
}: AuthViewProps) {
  const isBangla = language === 'বাংলা';
  const [activeMode, setActiveMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'admin'>('user');
  const [adminKey, setAdminKey] = useState('');
  const [regError, setRegError] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Normalize username input: add '@' if missing
    let targetUsername = loginUsername.trim();
    if (targetUsername && !targetUsername.startsWith('@')) {
      targetUsername = '@' + targetUsername;
    }

    const found = registeredUsers.find(
      u => u.username.toLowerCase() === targetUsername.toLowerCase()
    );

    if (!found) {
      setLoginError(isBangla ? 'ভুল গ্রাহক ইউজারনেম!' : 'Incorrect credentials / member username not found!');
      return;
    }

    if (found.isBlocked) {
      setLoginError(isBangla ? 'দুঃখিত, আপনার অ্যাকাউন্টটি সাময়িকভাবে ব্লক বা স্থগিত রয়েছে!' : 'Acknowledge: This account is currently suspended!');
      return;
    }

    // Checking password
    const correctPassword = found.password || 'password123';
    if (loginPassword !== correctPassword) {
      setLoginError(isBangla ? 'ভুল সিকিউরিটি পাসওয়ার্ড!' : 'Invalid passcode / password!');
      return;
    }

    // Success login
    onLoginSuccess(found);
  };

  // Handle Registration submission
  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (regFullName.trim().length < 3) {
      setRegError(isBangla ? 'দয়া করে সঠিক পূর্ণ নাম প্রদান করুন!' : 'Name must be at least 3 letters.');
      return;
    }

    let targetUsername = regUsername.trim();
    if (!targetUsername) {
      setRegError(isBangla ? 'ইউজারনেম খালি হতে পারে না!' : 'Username is required.');
      return;
    }

    if (!targetUsername.startsWith('@')) {
      targetUsername = '@' + targetUsername;
    }

    if (targetUsername.length < 4) {
      setRegError(isBangla ? 'ইউজারনেম ৪ অক্ষরের বা বেশি হতে হবে!' : 'Username must be at least 4 letters.');
      return;
    }

    // Check availability
    const alreadyExists = registeredUsers.some(
      u => u.username.toLowerCase() === targetUsername.toLowerCase()
    );
    if (alreadyExists) {
      setRegError(isBangla ? 'এই ইউজারনেমটি আগে থেকেই রেজিস্টার্ড!' : 'This username is already occupied.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError(isBangla ? 'পাসওয়ার্ড অবশ্যই ৪ অক্ষরের বেশি হতে হবে!' : 'Password must be at least 4 digits.');
      return;
    }

    const uidRandom = String(Math.floor(1000 + Math.random() * 9000));
    
    // Always register as regular user to prevent unauthorised admin creation!
    const newUser: UserProfile = {
      name: regFullName.trim(),
      username: targetUsername,
      uid: uidRandom,
      password: regPassword,
      role: 'user',
      kycStatus: 'Not verified',
      kycDetails: null,
      balance: 0.00, // Starting balance is strictly 0 BDT.
      todayCommission: 0.00,
      totalCommission: 0.00,
      todayDeposit: 0.00,
      todayWithdraw: 0.00,
      vipLevel: 0,
      bKashNumber: regPhone.trim() || undefined,
      nagadNumber: undefined,
      rocketNumber: undefined
    };

    onRegisterUser(newUser);
    
    // Auto fill login credentials and show success
    setLoginUsername(targetUsername);
    setLoginPassword(regPassword);
    setActiveMode('login');
    alert(
      isBangla 
        ? 'আপনার অ্যাকাউন্টটি সঠিকভাবে নিবন্ধিত হয়েছে! অনুগ্রহ করে লগইন করুন।' 
        : `Your account was registered successfully! Please login to continue.`
    );
  };

  // Quick Account selector for smooth testing
  const handleQuickLogin = (uname: string, psw: string) => {
    setLoginUsername(uname);
    setLoginPassword(psw);
    setLoginError('');
    
    const found = registeredUsers.find(u => u.username === uname);
    if (found) {
      onLoginSuccess(found);
    }
  };

  const toggleLanguage = () => {
    onLanguageChange(language === 'English' ? 'বাংলা' : 'English');
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col justify-between py-6 px-4 transition-colors ${
      isDarkMode ? 'bg-[#060B14] text-white' : 'bg-gray-100 text-gray-800'
    }`} id="auth-parent-container">

      {/* Language Header bar on top */}
      <div className="w-full max-w-sm mx-auto flex justify-between items-center px-2">
        <div className="flex items-center gap-1.5">
          <Flame size={18} className="text-sky-450 animate-pulse text-sky-400" />
          <span className="text-xs font-black tracking-widest uppercase text-sky-400">PAYSECURE</span>
        </div>

        <button
          onClick={toggleLanguage}
          className="text-[10px] uppercase font-bold py-1 px-3 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg flex items-center gap-1 hover:bg-sky-500/20 cursor-pointer transition-all"
        >
          <Globe size={11} />
          {language === 'English' ? 'বাংলা' : 'English'}
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto my-auto py-8">
        {/* Core Widget box */}
        <div className="bg-[#0b121e]/90 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-extrabold tracking-tight heading-font text-[#E0E0E0]">
              {activeMode === 'login' 
                ? (isBangla ? 'পেমেন্ট গেটওয়েতে সাইন ইন' : 'E-Wallet Secure Access')
                : (isBangla ? 'নতুন অ্যাকাউন্ট নিবন্ধন করুন' : 'Open Secured Account')}
            </h1>
            <p className="text-[10.5px] text-gray-400 font-semibold tracking-wide">
              {activeMode === 'login'
                ? (isBangla ? 'আপনার ওয়ালেটে প্রবেশ করতে বিবরণ দিন' : 'Enter security credentials to open dashboard')
                : (isBangla ? 'আজই ফ্রি অ্যাকাউন্ট খুলে লেনদেন করুন' : 'Provide wallet details to register payout panel')}
            </p>
          </div>

          {/* Mode Tabs Select */}
          <div className="grid grid-cols-2 p-1 bg-[#070c14] rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveMode('login'); setLoginError(''); }}
              className={`py-2 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-gradient-to-r from-sky-400 to-cyan-500 text-black shadow-lg shadow-sky-500/15 font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {isBangla ? 'লগইন' : 'Sign In'}
            </button>
            <button
              onClick={() => { setActiveMode('register'); setRegError(''); }}
              className={`py-2 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeMode === 'register'
                  ? 'bg-gradient-to-r from-sky-400 to-cyan-500 text-black shadow-lg shadow-sky-500/15 font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {isBangla ? 'রেজিস্ট্রেশন' : 'Register'}
            </button>
          </div>

          {/* LOGIN VIEW PANEL */}
          {activeMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 leading-relaxed text-center">
                  {loginError}
                </div>
              )}

              {/* Username field */}
              <div>
                <label htmlFor="login_uname_inp" className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'ইউজারনেম' : 'Username / Phone'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <User size={14} />
                  </span>
                  <input
                    id="login_uname_inp"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="e.g. @rax1122"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#070c14] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-400 placeholder-gray-700"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="login_pass_inp" className="text-[10px] font-black uppercase text-gray-500 block">
                    {isBangla ? 'সিকিউরিটি পাসওয়ার্ড' : 'Security Password'}
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock size={14} />
                  </span>
                  <input
                    id="login_pass_inp"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#070c14] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-400 placeholder-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit button login */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/10 transition-all active:scale-95 cursor-pointer mt-2"
                id="login-submit-btn"
              >
                {isBangla ? 'লগইন করুন' : 'Login'}
              </button>
            </form>
          )}

          {/* REGISTER VIEW PANEL */}
          {activeMode === 'register' && (
            <form onSubmit={handleRegSubmit} className="space-y-4 pt-1">
              {regError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 leading-relaxed text-center">
                  {regError}
                </div>
              )}

              {/* Full Name field */}
              <div>
                <label htmlFor="reg_name_inp" className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'আপনার পূর্ণ নাম' : 'Full Legal Name'}
                </label>
                <input
                  id="reg_name_inp"
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. MD Rakib Ahmed"
                  className="w-full px-3 py-2.5 bg-[#070c14] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-400 placeholder-gray-700"
                  required
                />
              </div>

              {/* Username field */}
              <div>
                <label htmlFor="reg_uname_inp" className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'ইউজারনেম' : 'Username'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold font-mono">@</span>
                  <input
                    id="reg_uname_inp"
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="rax1122"
                    className="w-full pl-7 pr-3 py-2.5 bg-[#070c14] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-400 placeholder-gray-700"
                    required
                  />
                </div>
              </div>

              {/* Phone number target */}
              <div>
                <label htmlFor="reg_phone_inp" className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'মোবাইল ওয়ালেট নম্বর (ঐচ্ছিক)' : 'Mobile Account Number (Optional)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                    <Phone size={13} />
                  </span>
                  <input
                    id="reg_phone_inp"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#070c14] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-400 placeholder-gray-700"
                  />
                </div>
              </div>

              {/* Password credentials */}
              <div>
                <label htmlFor="reg_pass_inp" className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'ওয়ালেট পাসওয়ার্ড' : 'Secure Pin / Password'}
                </label>
                <input
                  id="reg_pass_inp"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="minimum 4 digits"
                  className="w-full px-3 py-2.5 bg-[#070c14] border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-sky-400 placeholder-gray-700"
                  required
                />
              </div>

              {/* Submit button register */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-sky-500/10 transition-all active:scale-95 cursor-pointer mt-2"
                id="reg-submit-btn"
              >
                {isBangla ? 'অ্যাকাউন্ট রেজিস্টার করুন' : 'Certify Secured Account'}
              </button>
            </form>
          )}

        </div>

      </div>

      {/* Footer copyright */}
      <div className="text-center">
        <span className="text-[9px] tracking-wider text-gray-600 block uppercase font-bold">
          {isBangla ? '© ২০২৬ সুরক্ষিত ব্যাংক পেমেন্টস পিএলসি' : '© 2026 PaySecure Systems Ltd.'}
        </span>
      </div>

    </div>
  );
}
