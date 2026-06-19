/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Crown, CheckCircle2, ChevronRight, Lock, Award, DollarSign } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface VipDashboardProps {
  user: UserProfile;
  language: Language;
  onUpgradeVip: (level: number, cost: number) => void;
  isDarkMode: boolean;
}

export default function VipDashboard({
  user,
  language,
  onUpgradeVip,
  isDarkMode
}: VipDashboardProps) {
  const isBangla = language === 'বাংলা';

  const vipLevels = [
    {
      level: 0,
      name: 'VIP 0 (Regular)',
      cost: 0,
      commissionRate: 1.0,
      benefits: isBangla 
        ? ['স্ট্যান্ডার্ড কমিশন রেট ১.০%', 'দৈনিক ৩টি উইথড্র সুবিধা', 'মেট্রিক সাপোর্ট সেন্টার অ্যাক্সেস'] 
        : ['Standard commission rate 1.0%', 'Daily 3 withdrawal allowance', 'Standard support center access'],
    },
    {
      level: 1,
      name: 'VIP 1 (Elite)',
      cost: 500,
      commissionRate: 1.8,
      benefits: isBangla 
        ? ['উচ্চ কমিশন রেট ১.৮%', 'দৈনিক ৫টি উইথড্র সুবিধা', 'ভিআইপি চ্যাট অ্যাসিস্ট্যান্ট ১', '৫% রেফারেল বোনাস'] 
        : ['High commission rate 1.8%', 'Daily 5 withdrawal allowance', 'VIP Chat Assistant 1', '5% Referral bonus'],
    },
    {
      level: 2,
      name: 'VIP 2 (Pro)',
      cost: 2000,
      commissionRate: 2.5,
      benefits: isBangla 
        ? ['প্রিমিয়াম কমিশন রেট ২.৫%', 'দৈনিক আনলিমিটেড উইথড্র', 'উইথড্রয়াল প্রসেসিং ফি ০%', 'ডেডিকেটেড ২৪/৭ অ্যাকাউন্ট ম্যানেজার'] 
        : ['Premium commission rate 2.5%', 'Unlimited daily withdrawals', '0% Payout charges', 'Dedicated 24/7 Account manager'],
    },
    {
      level: 3,
      name: 'VIP 3 (Master)',
      cost: 10000,
      commissionRate: 3.8,
      benefits: isBangla 
        ? ['মাস্টার কমিশন রেট ৩.৮%', 'সর্বোচ্চ ফাস্ট ট্র্যাকিং উইথড্রল', '১০% বোনাস ডিপোজিট কমিশন', 'সারপ্রাইজ রিওয়ার্ড এয়ারড্রপস'] 
        : ['Master commission rate 3.8%', 'Priority lightning-fast withdrawals', '10% Bonus deposit commission', 'Surprise reward airdrops'],
    },
    {
      level: 4,
      name: 'VIP 4 (Legend)',
      cost: 50000,
      commissionRate: 5.5,
      benefits: isBangla 
        ? ['সর্বোচ্চ কমিশন রেট ৫.৫%', 'ব্যক্তিগত এজেন্ট সাপোর্ট গ্রুপ', 'অন-ডিমান্ড গ্যারান্টিড লোন সুবিধা', 'বার্ষিক স্পেশাল এক্সক্লুসিভ গিফটস'] 
        : ['Maximum commission rate 5.5%', 'Personalized agent support group', 'On-demand guaranteed micro-loans', 'Annual physical gift hampers'],
    }
  ];

  const handleUpgradeClick = (level: number, cost: number) => {
    if (level <= user.vipLevel) {
      alert(isBangla ? 'আপনি ইতিমধ্যে এই লেভেল বা এর চেয়ে উচ্চ লেভেলে আছেন!' : 'You already unlocked this tier level or a higher one!');
      return;
    }
    
    if (user.balance < cost) {
      alert(
        isBangla 
          ? `দুঃখিত! এই ভিআইপি লেভেল আনলক করতে আপনার ব্যালেন্স পর্যাপ্ত নয়। লেভেলটি আনলক করতে ৳${cost} প্রয়োজন। দয়া করে আগে ডিপোজিট করুন!` 
          : `Insufficient balance! Unlocking VIP ${level} requires ৳${cost.toFixed(2)}. Your current balance is ৳${user.balance.toFixed(2)}. Please make a deposit first!`
      );
      return;
    }

    if (confirm(isBangla ? `আপনি কি ৳${cost} দিয়ে VIP ${level} আনলক করতে চান?` : `Are you sure you want to unlock VIP ${level} for ৳${cost}?`)) {
      onUpgradeVip(level, cost);
    }
  };

  return (
    <div className={`p-4 pb-12 overflow-y-auto space-y-6 max-w-lg mx-auto ${
      isDarkMode ? 'text-[#E0E0E0]' : 'text-gray-800'
    }`} id="vip-dashboard">
      
      {/* Header Profile VIP Card */}
      <div className="bg-gradient-to-tr from-amber-500 via-yellow-600 to-[#0C0C0C] p-5 rounded-3xl text-white shadow-[0_8px_30px_rgba(245,158,11,0.15)] border border-amber-500/20 relative overflow-hidden flex flex-col justify-between h-40">
        <div className="absolute top-0 right-0 translate-x-5 -translate-y-5 opacity-10 pointer-events-none">
          <Crown size={180} />
        </div>

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-xl text-white">
              <Award size={22} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight select-none text-white">
                {isBangla ? 'ভিআইপি মেম্বারশিপ' : 'VIP privileges'}
              </h2>
              <span className="text-[10px] text-white/80 font-medium uppercase tracking-wider block">
                {user.name}
              </span>
            </div>
          </div>
          
          <div className="bg-white/25 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full select-none border border-white/20">
            {isBangla ? `বর্তমান স্তর: VIP ${user.vipLevel}` : `Current tier: VIP ${user.vipLevel}`}
          </div>
        </div>

        <div className="mt-4">
          <span className="text-[10px] text-white/70 block uppercase tracking-wide">
            {isBangla ? 'কমিশন বুস্ট বোনাস' : 'Commission Multiplier'}
          </span>
          <span className="text-2xl font-black block font-sans text-amber-400">
            {(vipLevels.find(v => v.level === user.vipLevel)?.commissionRate || 1.0).toFixed(1)}% {isBangla ? 'কমিশন' : 'Commission Rate'}
          </span>
        </div>
      </div>

      {/* Guide subtitle */}
      <div className="px-1">
        <h3 className="font-bold text-sm tracking-tight heading-font mb-1">
          {isBangla ? 'উপলব্ধ ভিআইপি লেভেল' : 'Explore VIP Packages'}
        </h3>
        <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {isBangla 
            ? 'আপনার মেম্বারশিপ লেভেল আপগ্রেড করুন এবং প্রতিটি ট্রানজেকশনে আকর্ষণীয় পেমেন্ট বোনাস বা অতিরিক্ত দৈনিক ইনকাম আর্ন করুন।' 
            : 'Unlocks advanced privileges and premium daily earnings multiplication. High multipliers ensure faster transactional growths.'}
        </p>
      </div>

      {/* VIP level lists */}
      <div className="mt-4 space-y-4" id="vip-levels-items-group">
        {vipLevels.map((vip) => {
          const isUnlocked = vip.level <= user.vipLevel;
          const isNextLevel = vip.level === user.vipLevel + 1;

          return (
            <div
              key={vip.level}
              className={`p-4 rounded-xl border relative transition-all ${
                isUnlocked
                  ? 'border-amber-500/30 bg-amber-500/[0.03] shadow-sm shadow-amber-500/5'
                  : isDarkMode
                    ? 'border-[#222222] bg-[#0C0C0C] opacity-90'
                    : 'border-gray-200 bg-white shadow-sm'
              }`}
              id={`vip-level-card-${vip.level}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-amber-500/10 text-amber-500'
                      : isDarkMode
                        ? 'bg-[#111] text-gray-500 border border-[#222]'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isUnlocked ? <Crown size={20} /> : <Lock size={18} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight select-none">{vip.name}</h4>
                    <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">
                      {isBangla ? `কমিশন রেট: ${vip.commissionRate}%` : `Commission Rate: ${vip.commissionRate}%`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">
                    {isBangla ? 'আনলক মূল্য' : 'Cost'}
                  </span>
                  <span className="text-sm font-extrabold font-sans text-amber-500 block">
                    {vip.cost === 0 ? (isBangla ? 'ফ্রি' : 'Free') : `৳${vip.cost}`}
                  </span>
                </div>
              </div>

              {/* Benefits lists */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200/50 dark:border-[#222222]">
                <ul className="space-y-1.5">
                  {vip.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-[11px] font-medium leading-normal">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Unlock button */}
              <div className="mt-4 flex justify-end">
                {isUnlocked ? (
                  <span className="text-[11px] font-extrabold text-amber-500 bg-amber-500/10 py-1.5 px-3 rounded-lg flex items-center gap-1.5 leading-none">
                    <CheckCircle2 size={13} />
                    {isBangla ? 'সক্রিয় আছে' : 'Active Tier'}
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgradeClick(vip.level, vip.cost)}
                    className={`text-[11px] font-bold py-2 px-4 rounded-xl shadow cursor-pointer transition-all ${
                      isNextLevel
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_4px_10px_rgba(245,158,11,0.2)]'
                        : isDarkMode
                          ? 'bg-[#1A1A1A] border border-[#333] hover:bg-[#222] text-[#E0E0E0]'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    id={`vip-unlock-btn-${vip.level}`}
                  >
                    {isBangla ? 'আনলক করুন' : 'Unlock Now'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
