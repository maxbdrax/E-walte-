/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Language } from '../types';

interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

interface ChatWidgetProps {
  user: UserProfile;
  language: Language;
  onNavigate: (tab: 'home' | 'vip' | 'wallet' | 'account' | 'kyc-flow') => void;
  isDarkMode: boolean;
}

export default function ChatWidget({ user, language, onNavigate, isDarkMode }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBangla = language === 'বাংলা';

  // Memoize translation resources to satisfy dependency constraints
  const translations = useMemo(() => {
    return {
      welcomeMsg: isBangla 
        ? `হ্যালো ${user.name}! আমি ই-ওয়ালেট কাস্টমার অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?`
        : `Hello ${user.name}! I am your E-Wallet virtual assistant. How can I assist you today?`,
      msgPlaceholder: isBangla ? 'এখানে আপনার বার্তা লিখুন...' : 'Type a message...',
      helpTopic1: isBangla ? 'কীভাবে ডিপোজিট করব?' : 'How to Deposit?',
      helpTopic2: isBangla ? 'কেওয়াইসি (KYC) ভেরিফাই কীভাবে করব?' : 'How to verify KYC?',
      helpTopic3: isBangla ? 'ব্যালেন্স দেখতে চাই' : 'Check Balance',
      helpTopic4: isBangla ? 'ভিআইপি (VIP) এর সুবিধা কী?' : 'VIP Membership Benefits',
      botTyping: isBangla ? 'অ্যাসিস্ট্যান্ট লিখছে...' : 'Assistant is typing...',
      supportClosed: isBangla ? 'সাপোর্ট চ্যাট বন্ধ করুন' : 'Close Support Chat',
      askSupport: isBangla ? 'সাপোর্ট টিমকে আপনার প্রশ্ন করুন' : 'Ask our Support Team'
    };
  }, [isBangla, user.name]);

  useEffect(() => {
    // Initial welcome message
    const welcomeText = translations.welcomeMsg;
    setMessages([
      {
        sender: 'agent',
        text: welcomeText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [translations]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Handle auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const rawVal = textToSend !== undefined ? textToSend : inputText;
    if (!rawVal.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: rawVal,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (textToSend === undefined) {
      setInputText('');
    }

    // Simulate Agent typing response
    setTimeout(() => {
      let responseText = '';
      const lowercaseMsg = rawVal.toLowerCase();

      if (lowercaseMsg.includes('deposit') || lowercaseMsg.includes('ডিপোজিট') || lowercaseMsg.includes('recharge') || lowercaseMsg.includes('টাকা রিচার্জ')) {
        responseText = isBangla
          ? `আপনার ব্যালেন্স ডিপোজিট করতে হোম স্ক্রিনে 'Deposit' বাটনে ট্যাপ করুন। এরপর আপনার পছন্দের মেথড (bKash/Nagad/Rocket/Gateway) সিলেক্ট করুন এবং টাকা পাঠিয়ে ট্রানজেকশন আইডি সাবমিট করুন। আমরা ২ মিনিটের মধ্যে সফলভাবে ট্রান্সফার সম্পন্ন করব!`
          : `To deposit, tap 'Deposit' on the dashboard, select your gateway (bKash, Nagad, Rocket or card), pay to the number or address provided, enter your payment transaction hash/reference, and submit! Deposits are cleared in 2 minutes.`;
      } else if (lowercaseMsg.includes('kyc') || lowercaseMsg.includes('ভেরিফাই') || lowercaseMsg.includes('verify') || lowercaseMsg.includes('identity')) {
        responseText = isBangla
          ? `আইডেন্টিটি ভেরিফিকেশনের জন্য 'Account' ট্যাবে যান এবং 'KYC' ভেরিফিকেশন সেকশন খুলুন। আপনার প্রথম নাম, শেষ নাম, জন্মতারিখ এবং শহরের নাম প্রবিষ্ট করার পর, আপনার জাতীয় পরিচয়পত্র বা আইডির ফ্রন্ট এবং ব্যাক ছবির আপলোড করুন। ২ ঘণ্টার মধ্যে এটি রিভিউ করা হবে।`
          : `For KYC verification, head over to the 'Account' tab, tap 'KYC', fill out your name/DOB, upload clear photos of your ID Card (front and back), and submit! Reviews take under 2 hours.`;
      } else if (lowercaseMsg.includes('balance') || lowercaseMsg.includes('টাকা') || lowercaseMsg.includes('ব্যালেন্স')) {
        responseText = isBangla
          ? `আপনার বর্তমান ই-ওয়ালেট ব্যালেন্স হচ্ছে ৳${user.balance.toFixed(2)}।`
          : `Your current E-Wallet balance is ৳${user.balance.toFixed(2)}.`;
      } else if (lowercaseMsg.includes('vip') || lowercaseMsg.includes('ভিআইপি')) {
        responseText = isBangla
          ? `ভিআইপি মেম্বারশিপে আপনাকে প্রতিটি মেম্বার ডিপোজিট এবং উইথড্র তে অতিরিক্ত অংশ বা কমিশন দেয়া হয়! বর্তমানে আপনি VIP ${user.vipLevel} স্তরে আছেন। ভিআইপি আপগ্রেড করতে VIP মেনু ট্যাবে গিয়ে আনলক করুন!`
          : `VIP membership yields premium extra commissions on deposits and transactions! You are currently on VIP ${user.vipLevel}. Check out our VIP levels screen to unlock premium rates directly using your balance.`;
      } else if (lowercaseMsg.includes('withdraw') || lowercaseMsg.includes('উইথড্র') || lowercaseMsg.includes('ক্যাশ আউট') || lowercaseMsg.includes('টাকা তুলব')) {
        responseText = isBangla
          ? `ভিআইপি প্যানেল অথবা ড্যাশবোর্ডের 'Withdraw' বাটনে ক্লিক করে আপনি দ্রুত টাকা তুলতে পারবেন। যেকোনো bKash বা Nagad নম্বরে উইথড্র উইন্ডো ২৪/৭ চালূ থাকে!`
          : `To withdraw, tap the 'Withdraw' button on the dashboard or account settings, input your payout phone number or gateway, select your amount, and hit confirm! Fast processing guaranteed.`;
      } else {
        responseText = isBangla
          ? `ধন্যবাদ আপনার বার্তার জন্য! আপনার ই-ওয়ালেট ব্যালেন্স ৳${user.balance.toFixed(2)}। আপনি বিস্তারিত জানতে ড্যাশবোর্ডের উপরের বামদিকের মেনুটি খুলতে পারেন অথবা আমাদের টেলিগ্রাম সাপোর্টে যোগাযোগ করতে পারেন।`
          : `Thank you for your query! Your balance is ৳${user.balance.toFixed(2)}. To resolve custom issues immediately, you can contact our 24/7 dedicated Telegram Support under the Service Center list.`;
      }

      setMessages(prev => [...prev, {
        sender: 'agent',
        text: responseText,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 850);
  };

  return (
    <>
      {/* Floating Headset Bubble */}
      <div className="fixed bottom-20 right-5 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#0C0C0C] border border-[#222222] text-amber-500 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all relative cursor-pointer"
          id="chat-bubble-trigger"
          aria-label="Open support chat"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={26} />}
          {hasNewMessage && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] text-white flex items-center justify-center font-bold">1</span>
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Box Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className={`fixed bottom-36 right-5 ${
              isDarkMode 
                ? 'bg-[#0C0C0C] border border-[#222222] text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)]' 
                : 'bg-white border border-gray-100 text-gray-800 shadow-[0_10px_30px_rgba(30,30,50,0.15)]'
            } w-[340px] max-w-[calc(100vw-40px)] h-[460px] rounded-2xl z-40 flex flex-col overflow-hidden`}
            id="chat-window"
          >
            {/* Box Header */}
            <div className="bg-[#111111] border-b border-[#222222] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-amber-500/20 bg-amber-500/10 overflow-hidden flex items-center justify-center">
                    {/* Circle illustration */}
                    <div className="w-6 h-6 rounded-full border-2 border-amber-500/80 bg-amber-200 relative flex items-center justify-center">
                      <div className="absolute inset-x-0 bottom-0 bg-amber-600 h-2 rounded-b-full"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-700 mb-1"></div>
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#111111]"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight heading-font text-amber-500">E-Wallet Support</h4>
                  <span className="text-[10px] text-gray-500 font-semibold block uppercase tracking-wider">● Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                id="chat-header-close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body messages list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080808]" id="chat-messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-semibold leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-black rounded-br-none'
                        : isDarkMode
                          ? 'bg-[#111111] text-[#E0E0E0] border border-[#222222] rounded-bl-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className={`text-[9px] mt-0.5 px-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Helper Topics Buttons */}
            <div className={`p-2 border-t px-3 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none ${
              isDarkMode ? 'border-[#222222] bg-[#111111]' : 'border-gray-100 bg-gray-50/50'
            }`}>
              {[
                { label: translations.helpTopic1, query: 'deposit' },
                { label: translations.helpTopic2, query: 'kyc' },
                { label: translations.helpTopic3, query: 'balance' },
                { label: translations.helpTopic4, query: 'vip' },
              ].map((topic, id) => (
                <button
                  key={id}
                  onClick={() => handleSendMessage(topic.label)}
                  className={`text-[10px] px-2.5 py-1.5 bg-[#0C0C0C] border border-[#222222] rounded-full font-medium transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'hover:bg-amber-500/10 hover:border-amber-500/20 text-gray-300 hover:text-amber-500' 
                      : 'bg-gray-200/70 hover:bg-gray-300/80 text-gray-700'
                  }`}
                  id={`chat-quick-topic-${id}`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {/* Message input panel */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className={`p-3 border-t flex gap-2 items-center ${
                isDarkMode ? 'border-[#222222] bg-[#111111]' : 'border-gray-100 bg-white'
              }`}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={translations.msgPlaceholder}
                className={`flex-1 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                  isDarkMode 
                    ? 'bg-[#080808] border border-[#222222] text-white placeholder-gray-600' 
                    : 'bg-gray-100 text-gray-800 placeholder-gray-400'
                }`}
                id="chat-input-text"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`p-2 rounded-xl transition-all ${
                  inputText.trim() 
                    ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer' 
                    : 'bg-gray-300 dark:bg-[#0C0C0C] text-gray-600 hover:scale-100 cursor-not-allowed'
                }`}
                id="chat-submit-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
