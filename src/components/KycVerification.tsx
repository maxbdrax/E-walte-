/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { ArrowLeft, IdCard, Camera, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { KycDetails, Language } from '../types';

interface KycVerificationProps {
  language: Language;
  onBack: () => void;
  onSubmitKyc: (details: KycDetails) => void;
  isDarkMode: boolean;
}

export default function KycVerification({
  language,
  onBack,
  onSubmitKyc,
  isDarkMode
}: KycVerificationProps) {
  const isBangla = language === 'বাংলা';
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [docType, setDocType] = useState('ID Card');

  // File states (base64 image URLs or fake preview indicators)
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);

  // Submission animation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  // Invisible file input referrers
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !dob.trim() || !city.trim()) {
      alert(isBangla ? 'অনুগ্রহ করে সব তথ্য সঠিক দিন!' : 'Please fill all fields before proceeding!');
      return;
    }
    setStep(2);
  };

  const simulatePhotoUpload = (side: 'front' | 'back', file?: File) => {
    const setter = side === 'front' ? setFrontPhoto : setBackPhoto;
    const loader = side === 'front' ? setIsUploadingFront : setIsUploadingBack;

    loader(true);
    setTimeout(() => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setter(e.target?.result as string);
          loader(false);
        };
        reader.readAsDataURL(file);
      } else {
        // High-fidelity standard templates if clicking without real camera file
        const mockImg = side === 'front' 
          ? 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=200';
        setter(mockImg);
        loader(false);
      }
    }, 1000);
  };

  const handleFileChange = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulatePhotoUpload(side, file);
    }
  };

  const handleVerifySubmit = () => {
    if (!frontPhoto || !backPhoto) {
      alert(isBangla ? 'আইডি কার্ডের দুই পাশের ছবিই দেওয়া প্রয়োজন!' : 'Please captures or upload pictures for both front and back sides of your ID!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitKyc({
        firstName,
        lastName,
        dob,
        city,
        docType,
        frontPhoto,
        backPhoto
      });
      setIsSubmitting(false);
      setIsApproved(true);
    }, 2000);
  };

  if (isApproved) {
    return (
      <div className={`min-h-[550px] flex flex-col items-center justify-center p-6 text-center ${
        isDarkMode ? 'bg-[#0b1426] text-white' : 'bg-gray-50 text-gray-800'
      }`} id="kyc-success-panel">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
          <CheckCircle2 size={48} className="animate-bounce" />
        </div>
        <h3 className="text-2xl font-bold mb-2 font-sans">
          {isBangla ? 'ধন্যবাদ! ভেরিফিকেশন পেন্ডিং' : 'Application Pending!'}
        </h3>
        <p className={`text-sm max-w-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          {isBangla 
            ? 'আপনার আইডেন্টিটি ও জাতীয় পরিচয়পত্র সফলভাবে জমা দেওয়া হয়েছে। আমাদের সাপোর্ট ম্যানেজার ও সিস্টেম দ্রুত যাচাই করে ২ ঘণ্টার মধ্যে অনুমোদন দেবে।' 
            : 'Your ID documents have been successfully uploaded. Our support managers will audit your credentials and verify your profile within index time (max 2 hours).'}
        </p>
        <button
          onClick={onBack}
          className="w-full max-w-xs py-3 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold tracking-wide shadow-lg active:scale-95 transition-all cursor-pointer"
          id="kyc-success-back-btn"
        >
          {isBangla ? 'হোমে ফিরে যান' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-[600px] flex flex-col ${
      isDarkMode ? 'bg-[#0b1426] text-white' : 'bg-[#f8fafc] text-gray-800'
    }`} id="kyc-verification-wizard">
      
      {/* Top Banner (Header) */}
      <div className="flex items-center px-4 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md relative">
        <button
          onClick={step === 2 ? () => setStep(1) : onBack}
          className="p-1 rounded-full hover:bg-white/10 text-white transition-all cursor-pointer"
          id="kyc-back-btn"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-bold mx-auto -translate-x-3 heading-font tracking-tight select-none">
          {isBangla ? 'পরিচয় যাচাই করুন' : 'Verify Identity'}
        </h2>
      </div>

      {step === 1 ? (
        /* STEP 1: Details form inputs exactly matching screenshots */
        <div className="flex-1 p-5 flex flex-col justify-between" id="kyc-step-1">
          <form onSubmit={handleNextStep} className="space-y-5 mt-4">
            
            {/* First Name Input */}
            <div>
              <label htmlFor="first_name" className={`text-xs font-bold block mb-1.5 uppercase tracking-wide opacity-80 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {isBangla ? 'প্রথম নাম' : 'First Name'}
              </label>
              <input
                id="first_name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={isBangla ? 'আপনার প্রথম নাম দিন' : 'Enter first name'}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' 
                    : 'bg-white border-gray-200 text-gray-800 focus:border-sky-500 shadow-sm'
                }`}
                required
              />
            </div>

            {/* Last Name Input */}
            <div>
              <label htmlFor="last_name" className={`text-xs font-bold block mb-1.5 uppercase tracking-wide opacity-80 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {isBangla ? 'শেষ নাম' : 'Last Name'}
              </label>
              <input
                id="last_name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={isBangla ? 'আপনার শেষ নাম দিন' : 'Enter last name'}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' 
                    : 'bg-white border-gray-200 text-gray-800 focus:border-sky-500 shadow-sm'
                }`}
                required
              />
            </div>

            {/* Date of Birth Selection Dropdown-style list */}
            <div>
              <label htmlFor="dob" className={`text-xs font-bold block mb-1.5 uppercase tracking-wide opacity-80 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {isBangla ? 'জন্ম তারিখ' : 'Date of Birth'}
              </label>
              <div className="relative">
                <input
                  id="dob"
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all appearance-none cursor-pointer ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' 
                      : 'bg-white border-gray-200 text-gray-800 focus:border-sky-500 shadow-sm'
                  }`}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
              </div>
            </div>

            {/* Address/City Name Input */}
            <div>
              <label htmlFor="city" className={`text-xs font-bold block mb-1.5 uppercase tracking-wide opacity-80 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                {isBangla ? 'ঠিকানা/শহর' : 'Address/City'}
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={isBangla ? 'আপনার জেলার নাম বা ঠিকানা দিন' : 'Enter city name or address'}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 text-white focus:border-sky-500' 
                    : 'bg-white border-gray-200 text-gray-800 focus:border-sky-500 shadow-sm'
                }`}
                required
              />
            </div>

          </form>

          {/* Next Button bottom */}
          <div className="mt-8 mb-4">
            <button
              onClick={handleNextStep}
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-650 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all text-sm tracking-wider uppercase cursor-pointer"
              id="kyc-next-btn"
            >
              {isBangla ? 'পরবর্তী ধাপ' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: Custom Document Photo Upload Cards */
        <div className="flex-1 p-5 flex flex-col justify-between" id="kyc-step-2">
          
          <div className="space-y-6 mt-2">
            
            {/* Outline Card Wrap mirroring Screenshot */}
            <div className={`p-4 rounded-2xl border-2 border-dashed ${
              isDarkMode 
                ? 'border-slate-800 bg-[#121c33]/50 text-white shadow-xl' 
                : 'border-gray-200 bg-white text-gray-800 shadow-sm'
            }`}>
              {/* Header Box title */}
              <div className="flex items-center gap-3 border-b pb-4 mb-4 border-slate-800/60 dark:border-slate-800/60">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <IdCard size={20} />
                </div>
                <h3 className="font-bold text-sm tracking-wide heading-font select-none">
                  {isBangla ? 'আইডি কার্ডের ছবি আপলোড' : 'Upload ID photo'}
                </h3>
              </div>

              {/* Instructions text */}
              <p className={`text-xs leading-relaxed mb-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {isBangla 
                  ? 'জাতীয় পরিচয়পত্র বা আইডির স্পষ্ট ছবি তুলে আপলোড করুন এবং ভেরিফিকেশন তথ্য যাচাই করুন।' 
                  : 'Upload ID photos, verify identity information, and ensure that the picture is clear.'}
              </p>

              {/* Custom selection ID Card dropdown matching screenshot style */}
              <div className="relative mb-5">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className={`w-full py-3.5 px-4 pr-10 rounded-xl text-xs font-bold text-left border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-slate-200' 
                      : 'bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                  id="kyc-doc-type-select"
                >
                  <option value="ID Card">{isBangla ? 'জাতীয় পরিচয়পত্র (ID Card)' : 'ID Card'}</option>
                  <option value="Passport">{isBangla ? 'পাসপোর্ট (Passport)' : 'Passport'}</option>
                  <option value="Driving License">{isBangla ? 'ড্রাইভিং লাইসেন্স (Driving License)' : 'Driving License'}</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
              </div>

              {/* Upload Input Targets */}
              <input
                type="file"
                ref={frontInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange('front', e)}
                className="hidden"
                id="kyc-front-file-picker"
              />
              <input
                type="file"
                ref={backInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange('back', e)}
                className="hidden"
                id="kyc-back-file-picker"
              />

              {/* Front Side Upload Container */}
              <div className={`p-4 rounded-xl border-2 border-dashed flex items-center justify-between mb-4 transition-colors ${
                isDarkMode 
                  ? 'border-slate-800/80 bg-slate-900/30 text-white hover:bg-slate-900/50' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-800 hover:bg-gray-100/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-900' : 'bg-gray-200/80'
                  } text-sky-400 relative overflow-hidden group`}>
                    {frontPhoto ? (
                      <img src={frontPhoto} alt="Front ID preview" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    ) : (
                      <Camera size={20} />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{isBangla ? 'সামনের অংশ' : 'Front side'}</span>
                    <span className="text-[10px] text-gray-500 block">PNG, JPG (Max 5MB)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  disabled={isUploadingFront}
                  className="px-4 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  id="kyc-upload-front-btn"
                >
                  {isUploadingFront ? (
                    <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Uploading</span>
                  ) : (
                    isBangla ? 'ছবি তুলুন' : 'Take a picture'
                  )}
                </button>
              </div>

              {/* Back Side Upload Container */}
              <div className={`p-4 rounded-xl border-2 border-dashed flex items-center justify-between transition-colors ${
                isDarkMode 
                  ? 'border-slate-800/85 bg-slate-900/30 text-white hover:bg-slate-900/50' 
                  : 'border-gray-200 bg-gray-50/50 text-gray-800 hover:bg-gray-100/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-900' : 'bg-gray-200/80'
                  } text-sky-400 relative overflow-hidden`}>
                    {backPhoto ? (
                      <img src={backPhoto} alt="Back ID preview" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                    ) : (
                      <Camera size={20} />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{isBangla ? 'পেছনের অংশ' : 'Back side'}</span>
                    <span className="text-[10px] text-gray-500 block">PNG, JPG (Max 5MB)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => backInputRef.current?.click()}
                  disabled={isUploadingBack}
                  className="px-4 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-sky-500/5"
                  id="kyc-upload-back-btn"
                >
                  {isUploadingBack ? (
                    <span className="flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Uploading</span>
                  ) : (
                    isBangla ? 'ছবি তুলুন' : 'Take a picture'
                  )}
                </button>
              </div>

            </div>

            {/* Quick preset capture buttons if testing without webcam upload */}
            {!frontPhoto && (
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>
                  {isBangla 
                    ? 'টিপস: টেস্টিং এর ক্ষেত্রে সরাসরি ‘ছবি তুলুন’ এ ক্লিক করে অটো ডেমো আইডির ছবি অ্যাড করুন!' 
                    : 'Tip: For rapid testing, clean-click the camera button to load auto-simulated ID images!'}
                </span>
              </div>
            )}
          </div>

          {/* Verify submit button */}
          <div className="mt-8 mb-4">
            <button
              onClick={handleVerifySubmit}
              disabled={isSubmitting}
              className={`w-full py-3.5 bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-black font-extrabold rounded-xl shadow-lg active:scale-95 transition-all text-sm tracking-wider uppercase flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'
              }`}
              id="kyc-submit-verify-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isBangla ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}
                </>
              ) : (
                isBangla ? 'ভেরিফাই সাবমিট করুন' : 'Verify'
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
