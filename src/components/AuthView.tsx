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
      setRegError(isBangla ? 'এই ইউজারনেমটি আগে থেকেই রেজিস্টার্ড!' : 'This username is already occupied details!');
      return;
    }

    if (regPassword.length < 4) {
      setRegError(isBangla ? 'পাসওয়ার্ড অত্যন্ত দুর্বল! ৪ অঙ্কের বেশি দিন।' : 'Password is too short.');
      return;
    }

    // Checking secret activation token if register role is Admin
    if (regRole === 'admin') {
      if (adminKey.trim() !== 'admin') {
        setRegError(isBangla ? 'ভুল অ্যাডমিন সিক্রেট কী! (ডিফল্ট কী: "admin")' : 'Incorrect Admin Secret Key! (Default Key: "admin")');
        return;
      }
    }

    // Create custom user profile
    const uidRandom = String(Math.floor(1000 + Math.random() * 9000));
    
    const newUser: UserProfile = {
      name: regFullName.trim(),
      username: targetUsername,
      uid: uidRandom,
      password: regPassword,
      role: regRole,
      kycStatus: 'Not verified',
      kycDetails: null,
      balance: regRole === 'admin' ? 99999.00 : 500.00, // Prefilled 500 BDT bonus for user registration!
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
        ? 'সফলভাবে নতুন অ্যাকাউন্ট তৈরি হয়েছে! ৳৫০০ অভিনন্দন বোনাস ওয়ালেটে যোগ হলো।' 
        : `Registered successfully! ৳500 BDT sign-up reward added. Login to get started.`
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
      isDarkMode ? 'bg-[#090D1A] text-white' : 'bg-gray-100 text-gray-800'
    }`} id="auth-parent-container">

      {/* Language Header bar on top */}
      <div className="w-full max-w-sm mx-auto flex justify-between items-center px-2">
        <div className="flex items-center gap-1.5">
          <Flame size={18} className="text-amber-500 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase text-amber-500">PAYSECURE</span>
        </div>
        
        <button
          onClick={toggleLanguage}
          className="text-[10px] uppercase font-bold py-1 px-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg flex items-center gap-1 hover:bg-amber-500/20 cursor-pointer transition-all"
        >
          <Globe size={11} />
          {language === 'English' ? 'বাংলা' : 'English'}
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto my-auto py-8">
        {/* Core Widget box */}
        <div className="bg-[#0C0C0C]/90 border border-[#222222] p-6 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-extrabold tracking-tight heading-font text-[#E0E0E0]">
              {activeMode === 'login' 
                ? (isBangla ? 'পেমেন্ট গেটওয়েতে সাইন ইন' : 'E-Wallet Secure Access')
                : (isBangla ? 'নতুন অ্যাকাউন্ট নিবন্ধন করুন' : 'Open Secured Account')}
            </h1>
            <p className="text-[10.5px] text-gray-500 font-semibold tracking-wide">
              {activeMode === 'login'
                ? (isBangla ? 'আপনার ওয়ালেটে প্রবেশ করতে বিবরণ দিন' : 'Enter security credentials to open dashboard')
                : (isBangla ? 'আজই ফ্রি অ্যাকাউন্ট খুলে লেনদেন করুন' : 'Provide wallet details to register payout panel')}
            </p>
          </div>

          {/* Mode Tabs Select */}
          <div className="grid grid-cols-2 p-1 bg-[#111111] rounded-xl border border-[#222222]">
            <button
              onClick={() => { setActiveMode('login'); setLoginError(''); }}
              className={`py-2 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {isBangla ? 'লগইন' : 'Sign In'}
            </button>
            <button
              onClick={() => { setActiveMode('register'); setRegError(''); }}
              className={`py-2 text-[11px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeMode === 'register'
                  ? 'bg-amber-500 text-black shadow'
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
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 leading-relaxed text-center">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 placeholder-gray-700"
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
                    className="w-full pl-9 pr-10 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 placeholder-gray-700"
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
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer mt-2"
                id="login-submit-btn"
              >
                {isBangla ? 'প্রবেশ করুন' : 'Unlock Dashboard'}
              </button>
            </form>
          )}

          {/* REGISTER VIEW PANEL */}
          {activeMode === 'register' && (
            <form onSubmit={handleRegSubmit} className="space-y-4 pt-1">
              {regError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 leading-relaxed text-center">
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
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 placeholder-gray-700"
                  required
                />
              </div>

              {/* Username field */}
              <div>
                <label htmlFor="reg_uname_inp" className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'ইউজারনেম' : 'Username'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">@</span>
                  <input
                    id="reg_uname_inp"
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="rax1122"
                    className="w-full pl-7 pr-3 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 placeholder-gray-700"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 placeholder-gray-700"
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
                  className="w-full px-3 py-2.5 bg-[#111111] border border-[#222222] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500 placeholder-gray-700"
                  required
                />
              </div>

              {/* Role Select options */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 block mb-1">
                  {isBangla ? 'অ্যাকাউন্ট ক্যাটাগরি' : 'Account Role'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('user')}
                    className={`py-2 text-[10.5px] font-bold border rounded-lg transition-all relative cursor-pointer ${
                      regRole === 'user' 
                        ? 'bg-[#111111] border-amber-500 text-amber-500' 
                        : 'bg-[#111111] border-[#222222] text-gray-400 hover:text-white'
                    }`}
                  >
                    {isBangla ? 'সাধারন মেম্বার' : 'Regular Member'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`py-2 text-[10.5px] font-bold border rounded-lg transition-all relative cursor-pointer ${
                      regRole === 'admin' 
                        ? 'bg-[#111111] border-red-500 text-red-500' 
                        : 'bg-[#111111] border-[#222222] text-gray-400 hover:text-white'
                    }`}
                  >
                    {isBangla ? 'প্ল্যাটফর্ম অ্যাডমিন' : 'Admin Panel'}
                  </button>
                </div>
              </div>

              {/* Render Admin Activation Code input if Admin role is selected */}
              {regRole === 'admin' && (
                <div>
                  <label htmlFor="reg_adminkey_inp" className="text-[10px] font-black uppercase text-red-500 block mb-1">
                    {isBangla ? 'অ্যাডমিন সিক্রেট পাসকোড' : 'Admin Authority Secret Key'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500/80">
                      <Key size={13} />
                    </span>
                    <input
                      id="reg_adminkey_inp"
                      type="password"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="Enter 'admin' to test"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#111111] border border-red-500/30 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-red-500 placeholder-gray-800"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit button register */}
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer mt-2"
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
        <span className="text-[9px] text-gray-650 tracking-wider text-gray-600 block uppercase font-bold">
          {isBangla ? '© ২০২৬ সুরক্ষিত ব্যাংক পেমেন্টস পিএলসি' : '© 2026 PaySecure Systems Ltd.'}
        </span>
      </div>

    </div>
  );
}
