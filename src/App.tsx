/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Plus, 
  ArrowDown, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Home,
  Crown,
  Wallet,
  User,
  HelpCircle,
  Loader2,
  Trash2,
  Info,
  UserPlus,
  UserMinus,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents import
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VipDashboard from './components/VipDashboard';
import WalletTab from './components/WalletTab';
import AccountTab from './components/AccountTab';
import KycVerification from './components/KycVerification';
import ChatWidget from './components/ChatWidget';
import AuthView from './components/AuthView';
import AdminPanel from './components/AdminPanel';

// Types import
import { UserProfile, Transaction, ActiveTab, Language, KycDetails, PaymentGateway } from './types';

export default function App() {
  // Global States
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Users database preseed & synchronization
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('paysecure_users');
    if (saved) {
      return JSON.parse(saved);
    }
    const seed: UserProfile[] = [
      {
        name: 'MD Rakib Akon',
        username: '@rax1122',
        password: 'password123',
        role: 'user',
        uid: '1405',
        kycStatus: 'Not verified',
        kycDetails: null,
        balance: 13500.00,
        todayCommission: 243.00,
        totalCommission: 1540.00,
        todayDeposit: 500.00,
        todayWithdraw: 0.00,
        vipLevel: 1,
        bKashNumber: '01726053311',
        nagadNumber: '01855230911',
        rocketNumber: ''
      },
      {
        name: 'Control Admin',
        username: '@admin',
        password: 'admin123',
        role: 'admin',
        uid: '1001',
        kycStatus: 'Verified',
        kycDetails: null,
        balance: 999999.00,
        todayCommission: 0.00,
        totalCommission: 0.00,
        todayDeposit: 0.00,
        todayWithdraw: 0.00,
        vipLevel: 4,
        bKashNumber: '',
        nagadNumber: '',
        rocketNumber: ''
      }
    ];
    localStorage.setItem('paysecure_users', JSON.stringify(seed));
    return seed;
  });

  // Current session active user
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('paysecure_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Support link custom state
  const [supportLink, setSupportLink] = useState(() => {
    return localStorage.getItem('paysecure_support_link') || 'https://t.me/PaySecureSupport_Bot';
  });

  // Core transaction logs
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('paysecure_transactions');
    if (saved) {
      return JSON.parse(saved);
    }
    const seed: (Transaction & { username?: string })[] = [
      {
        id: 'tx_seed_1',
        number: '№000370',
        type: 'Deposit',
        method: 'bkash',
        date: '19/06/2026, 12:03',
        amount: 500.00,
        status: 'Completed',
        username: '@rax1122'
      }
    ];
    localStorage.setItem('paysecure_transactions', JSON.stringify(seed));
    return seed;
  });

  // Sync session changes back to users list
  useEffect(() => {
    if (user) {
      localStorage.setItem('paysecure_current_user', JSON.stringify(user));
      setRegisteredUsers(prev => {
        const idx = prev.findIndex(u => u.username === user.username);
        if (idx !== -1) {
          const next = [...prev];
          next[idx] = user;
          localStorage.setItem('paysecure_users', JSON.stringify(next));
          return next;
        }
        return prev;
      });
    } else {
      localStorage.removeItem('paysecure_current_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('paysecure_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('paysecure_support_link', supportLink);
  }, [supportLink]);

  // Modals state triggers
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isUserWDOpen, setIsUserWDOpen] = useState(false);
  const [isUserDepOpen, setIsUserDepOpen] = useState(false);

  // Core dynamic payment gateways state
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(() => {
    const saved = localStorage.getItem('paysecure_gateways');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.some((gw: any) => gw.brand === 'rocket')) {
          return parsed;
        }
      } catch (e) {}
    }
    const seed: PaymentGateway[] = [
      { id: 'bkash_personal', name: 'BKASH PERSONAL', type: 'Personal', brand: 'bkash', status: 'active', number: '01726053311', ownerName: 'Rakib' },
      { id: 'bkash_merchant', name: 'BKASH MERCHANT', type: 'Merchant', brand: 'bkash', status: 'deactive', number: '', ownerName: '' },
      { id: 'bkash_agent', name: 'BKASH AGENT', type: 'Agent', brand: 'bkash', status: 'deactive', number: '', ownerName: '' },
      { id: 'nagad_personal', name: 'NAGAD PERSONAL', type: 'Personal', brand: 'nagad', status: 'active', number: '01855230911', ownerName: 'Shakil' },
      { id: 'nagad_merchant', name: 'NAGAD MERCHANT', type: 'Merchant', brand: 'nagad', status: 'deactive', number: '', ownerName: '' },
      { id: 'nagad_agent', name: 'NAGAD AGENT', type: 'Agent', brand: 'nagad', status: 'deactive', number: '', ownerName: '' },
      { id: 'rocket_personal', name: 'ROCKET PERSONAL', type: 'Personal', brand: 'rocket', status: 'deactive', number: '01911223344', ownerName: 'Habib' },
      { id: 'rocket_merchant', name: 'ROCKET MERCHANT', type: 'Merchant', brand: 'rocket', status: 'deactive', number: '', ownerName: '' },
      { id: 'rocket_agent', name: 'ROCKET AGENT', type: 'Agent', brand: 'rocket', status: 'deactive', number: '', ownerName: '' }
    ];
    localStorage.setItem('paysecure_gateways', JSON.stringify(seed));
    return seed;
  });

  useEffect(() => {
    localStorage.setItem('paysecure_gateways', JSON.stringify(paymentGateways));
  }, [paymentGateways]);

  const handleUpdateGateway = (updatedGateway: PaymentGateway) => {
    setPaymentGateways(prev => prev.map(gw => gw.id === updatedGateway.id ? updatedGateway : gw));
  };

  // Form input controllers inside modals
  const [depMethod, setDepMethod] = useState('BKASH PERSONAL');
  const [depAmount, setDepAmount] = useState('');
  const [depTxId, setDepTxId] = useState('');
  const [depSenderPhone, setDepSenderPhone] = useState('');
  const [isDepSubmitting, setIsDepSubmitting] = useState(false);

  const [wdMethod, setWdMethod] = useState('bkash');
  const [wdAmount, setWdAmount] = useState('');
  const [wdNumber, setWdNumber] = useState('');
  const [isWdSubmitting, setIsWdSubmitting] = useState(false);

  const [randomUserWDName, setRandomUserWDName] = useState('Ariful Islam');
  const [randomUserWDMethod, setRandomUserWDMethod] = useState('bkash');
  const [randomUserWDAmount, setRandomUserWDAmount] = useState('500');

  const [mockDepAmount, setMockDepAmount] = useState('1000');

  // Trigger correct HTML Root theme classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  // Helper generator for custom formatted sequential transactions number
  const generateTxNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `№${String(random).substring(0, 6)}`;
  };

  // Helper date formatter
  const getFormattedDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // 1. Submit User Deposit Request
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depAmount);
    if (!user) return;
    if (isNaN(amt) || amt <= 0) {
      alert(language === 'বাংলা' ? 'সঠিক অংক দয়া করে প্রদান করুন!' : 'Please enter a valid deposit size!');
      return;
    }

    setIsDepSubmitting(true);
    setTimeout(() => {
      const isAdmin = user.role === 'admin';
      
      // Append transaction with username tag
      const newTx: Transaction & { username?: string, senderNumber?: string } = {
        id: `dep_${Date.now()}`,
        number: depTxId.trim() ? depTxId.trim() : generateTxNumber(),
        type: 'Deposit',
        method: depMethod,
        date: getFormattedDate(),
        amount: amt,
        status: isAdmin ? 'Completed' : 'Pending',
        username: user.username,
        senderNumber: depSenderPhone.trim()
      };

      setTransactions(prev => [newTx, ...prev]);
      
      if (isAdmin) {
        // Calculate commission instantly for administrators
        const vRates = [1.0, 1.8, 2.5, 3.8, 5.5];
        const rate = vRates[user.vipLevel] || 1.0;
        const commissionEarned = (amt * rate) / 100;

        setUser(prev => prev ? ({
          ...prev,
          balance: prev.balance + amt + commissionEarned,
          todayDeposit: prev.todayDeposit + amt,
          todayCommission: prev.todayCommission + commissionEarned,
          totalCommission: prev.totalCommission + commissionEarned
        }) : null);

        alert(
          language === 'বাংলা' 
            ? `সফলভাবে ৳${amt.toFixed(2)} ডিপোজিট ক্লিয়ার করা হয়েছে! অতিরিক্ত ৳${commissionEarned.toFixed(2)} কমিশন যোগ হয়েছে।` 
            : `Deposit of ৳${amt.toFixed(2)} successfully loaded! +৳${commissionEarned.toFixed(2)} commission reward unlocked.`
        );
      } else {
        alert(
          language === 'বাংলা'
            ? `ডিপোজিট রিকোয়েস্ট সফলভাবে প্রেরণ করা হয়েছে! অ্যাডমিন আপনার ট্রানজেকশন যাচাই করে ওয়ালেটে টাকা যোগ করে দেবে।`
            : `Your deposit request of ৳${amt.toFixed(2)} is submitted and pending admin verification.`
        );
      }

      setIsDepSubmitting(false);
      setIsDepositOpen(false);
      setDepAmount('');
      setDepTxId('');
      setDepSenderPhone('');
    }, 1500);
  };

  // 2. Submit Withdrawal Request
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(wdAmount);
    if (!user) return;
    if (isNaN(amt) || amt <= 0) {
      alert(language === 'বাংলা' ? 'দয়া করে সঠিক উইথড্র অংক প্রবেশ করুন!' : 'Please input a valid withdraw amount!');
      return;
    }

    if (user.balance < amt) {
      alert(
        language === 'বাংলা' 
          ? 'দুঃখিত! ট্রানজেকশনের জন্য আপনার ব্যালেন্স পর্যাপ্ত নেই।' 
          : 'Insufficient balance to trigger payouts!'
      );
      return;
    }

    setIsWdSubmitting(true);
    setTimeout(() => {
      const isAdmin = user.role === 'admin';

      const newTx: Transaction & { username?: string, receiverNumber?: string } = {
        id: `wd_${Date.now()}`,
        number: generateTxNumber(),
        type: 'Withdraw',
        method: wdMethod.toUpperCase(),
        date: getFormattedDate(),
        amount: amt,
        status: isAdmin ? 'Completed' : 'Pending',
        username: user.username,
        receiverNumber: wdNumber.trim()
      };

      setTransactions(prev => [newTx, ...prev]);

      // Locked / Deduct user funds immediately
      setUser(prev => prev ? ({
        ...prev,
        balance: prev.balance - amt,
        todayWithdraw: prev.todayWithdraw + amt
      }) : null);

      setIsWdSubmitting(false);
      setIsWithdrawOpen(false);
      setWdAmount('');
      setWdNumber('');

      if (isAdmin) {
        alert(
          language === 'বাংলা'
            ? `৳${amt.toFixed(2)} ক্যাশআউট সাকসেসফুল! আপনার ব্যালেন্স সফলভাবে আপডেট করা হয়েছে।`
            : `Withdrawal payout request of ৳${amt.toFixed(2)} completed successfully!`
        );
      } else {
        alert(
          language === 'বাংলা'
            ? `আপনার ক্যাশআউট আবেদন সফল হয়েছে এবং পেন্ডিং অবস্থায় আছে! অডিট শেষ হলে টাকা পৌঁছে যাবে।`
            : `Withdrawal request of ৳${amt.toFixed(2)} logged! Funds lock active pending approval.`
        );
      }
    }, 1500);
  };

  // 3. Upgrade VIP Tiers
  const handleUpgradeVip = (level: number, cost: number) => {
    if (!user) return;
    setUser(prev => prev ? ({
      ...prev,
      balance: prev.balance - cost,
      vipLevel: level
    }) : null);

    // Add upgrade transaction with username
    const newTx: Transaction & { username?: string } = {
      id: `vip_${Date.now()}`,
      number: generateTxNumber(),
      type: 'Transfer',
      method: `VIP ${level} Upgrade Fee`,
      date: getFormattedDate(),
      amount: cost,
      status: 'Completed',
      username: user.username
    };

    setTransactions(prev => [newTx, ...prev]);

    alert(
      language === 'বাংলা'
        ? `অভিনন্দন! আপনি সফলভাবে VIP ${level} স্তরে উন্নীত হয়েছেন। আপনার বর্ধিত আয় শুরু হয়েছে!`
        : `Congratulations! You have successfully upgraded to VIP ${level}. Enjoy premium boost commissions!`
    );
  };

  // 4. Update Connected payment channels details
  const handleUpdateWallets = (bKashNum?: string, nagadNum?: string, rocketNum?: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        bKashNumber: bKashNum !== undefined ? bKashNum : prev.bKashNumber,
        nagadNumber: nagadNum !== undefined ? nagadNum : prev.nagadNumber,
        rocketNumber: rocketNum !== undefined ? rocketNum : prev.rocketNumber
      };
    });

    alert(
      language === 'বাংলা'
        ? 'আপনার পেমেন্ট অ্যাকাউন্ট তথ্য সফলভাবে যুক্ত ও আপডেট করা হয়েছে!'
        : 'Linked payment channels saved securely!'
    );
  };

  const handleUpdateUserGateways = (updatedGateways: PaymentGateway[]) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        paymentGateways: updatedGateways
      };
    });
  };

  // 5. Instantly Transfer BDT to another UID (P2P Send Money)
  const handleTransfer = (targetUid: string, amt: number): boolean => {
    if (!user) return false;
    
    setUser(prev => prev ? ({
      ...prev,
      balance: prev.balance - amt
    }) : null);

    const currentUserTx: Transaction & { username?: string } = {
      id: `p2p_out_${Date.now()}`,
      number: generateTxNumber(),
      type: 'Transfer',
      method: `P2P to UID ${targetUid}`,
      date: getFormattedDate(),
      amount: amt,
      status: 'Completed',
      username: user.username
    };

    // Credit target recipient if they exist in PaySecure database
    const foundTarget = registeredUsers.find(u => u.uid === targetUid);
    if (foundTarget) {
      setRegisteredUsers(all => {
        return all.map(u => {
          if (u.username === foundTarget.username) {
            return {
              ...u,
              balance: u.balance + amt
            };
          }
          return u;
        });
      });
      
      const targetUserTx: Transaction & { username?: string } = {
        id: `p2p_in_${Date.now()}`,
        number: generateTxNumber(),
        type: 'Transfer',
        method: `P2P from UID ${user.uid}`,
        date: getFormattedDate(),
        amount: amt,
        status: 'Completed',
        username: foundTarget.username
      };

      setTransactions(prev => [currentUserTx, targetUserTx, ...prev]);
    } else {
      setTransactions(prev => [currentUserTx, ...prev]);
    }

    return true;
  };

  // 6. Complete KYC identity submit
  const handleKycSubmit = (details: KycDetails) => {
    if (!user) return;
    setUser(prev => prev ? ({
      ...prev,
      kycStatus: 'Pending',
      kycDetails: details
    }) : null);
  };

  // 7. Interactive Mock Generator - User Deposit tool
  const handleSimulateUserDep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amt = parseFloat(mockDepAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction & { username?: string } = {
      id: `mock_dep_${Date.now()}`,
      number: generateTxNumber(),
      type: 'Deposit',
      method: 'admin_panel',
      date: getFormattedDate(),
      amount: amt,
      status: 'Completed',
      username: user.username
    };

    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => prev ? ({
      ...prev,
      balance: prev.balance + amt,
      todayDeposit: prev.todayDeposit + amt
    }) : null);

    setMockDepAmount('1000');
    setIsUserDepOpen(false);

    alert(
      language === 'বাংলা'
        ? `সিমুলেশন সফল! আপনার ওয়ালেটে ৳${amt.toFixed(2)} ক্রেডিট করা হয়েছে।`
        : `Simulation complete! ৳${amt.toFixed(2)} BDT instantly added to your test balance.`
    );
  };

  // 8. Interactive Mock Generator - Other Users Platform activity (User W/D)
  const handleSimulateUserWD = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(randomUserWDAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: `random_user_${Date.now()}`,
      number: generateTxNumber(),
      type: 'Withdraw',
      method: `${randomUserWDMethod} (${randomUserWDName})`,
      date: getFormattedDate(),
      amount: amt,
      status: 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsUserWDOpen(false);

    alert(
      language === 'বাংলা'
        ? `${randomUserWDName}-এর ৳${amt.toFixed(2)} উইথড্র ট্রানজেকশন সফলভাবে ব্রডকাস্ট করা হয়েছে!`
        : `Broadcasted withdraw payload: ${randomUserWDName} withdrew ৳${amt.toFixed(2)} BDT.`
    );
  };

  // Clean / wipe transactions lists
  const handleResetWallet = () => {
    if (confirm(language === 'বাংলা' ? 'আপনি কি ট্রানজেকশন হিস্ট্রি রিসেট করতে চান?' : 'Are you sure you want to reset your transaction dashboard history?')) {
      setTransactions([]);
      setUser(prev => prev ? ({
        ...prev,
        balance: 0.00,
        todayDeposit: 0.00,
        todayWithdraw: 0.00,
        todayCommission: 0.00,
        totalCommission: 0.00,
        kycStatus: 'Not verified'
      }) : null);
    }
  };

  // Core admin control systems
  const handleUpdateUser = (updatedUser: UserProfile) => {
    if (user && updatedUser.username === user.username) {
      setUser(updatedUser);
    } else {
      setRegisteredUsers(prev => {
        const next = prev.map(u => u.username === updatedUser.username ? updatedUser : u);
        localStorage.setItem('paysecure_users', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleDeleteUser = (username: string) => {
    setRegisteredUsers(prev => {
      const next = prev.filter(u => u.username !== username);
      localStorage.setItem('paysecure_users', JSON.stringify(next));
      return next;
    });
    // If deleted current user, logout
    if (user && user.username === username) {
      setUser(null);
    }
  };

  const handleApproveDeposit = (txId: string) => {
    setTransactions(prev => {
      return prev.map(tx => {
        if (tx.id === txId) {
          const targetUName = (tx as any).username;
          setRegisteredUsers(all => {
            return all.map(u => {
              if (u.username === targetUName) {
                const amt = tx.amount;
                const vRates = [1.0, 1.8, 2.5, 3.8, 5.5];
                const rate = vRates[u.vipLevel] || 1.0;
                const commissionEarned = (amt * rate) / 100;
                
                const updated = {
                  ...u,
                  balance: u.balance + amt + commissionEarned,
                  todayDeposit: u.todayDeposit + amt,
                  todayCommission: u.todayCommission + commissionEarned,
                  totalCommission: u.totalCommission + commissionEarned
                };
                
                if (user && user.username === targetUName) {
                  setTimeout(() => setUser(updated), 0);
                }
                return updated;
              }
              return u;
            });
          });
          return { ...tx, status: 'Completed' as const };
        }
        return tx;
      });
    });
    alert(isBangla ? 'ডিপোজিট সফলভাবে অনুমোদন করা হয়েছে!' : 'Deposit approved successfully!');
  };

  const handleRejectDeposit = (txId: string) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'Failed' as const } : tx));
    alert(isBangla ? 'ডিপোজিট বাতিল করা হয়েছে!' : 'Deposit declined successfully.');
  };

  const handleApproveWithdraw = (txId: string) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'Completed' as const } : tx));
    alert(isBangla ? 'উইথড্র সাকসেসফুলি ডিসবার্স বা অনুমোদন দেওয়া হয়েছে!' : 'Payout processed successfully!');
  };

  const handleRejectWithdraw = (txId: string) => {
    setTransactions(prev => {
      return prev.map(tx => {
        if (tx.id === txId) {
          const targetUName = (tx as any).username;
          setRegisteredUsers(all => {
            return all.map(u => {
              if (u.username === targetUName) {
                const updated = {
                  ...u,
                  balance: u.balance + tx.amount,
                  todayWithdraw: Math.max(0, u.todayWithdraw - tx.amount)
                };
                if (user && user.username === targetUName) {
                  setTimeout(() => setUser(updated), 0);
                }
                return updated;
              }
              return u;
            });
          });
          return { ...tx, status: 'Failed' as const };
        }
        return tx;
      });
    });
    alert(isBangla ? 'উইথড্র রিজেক্ট করা হয়েছে এবং বিডিটি রিফান্ড হয়েছে!' : 'Payout cancelled and BDT balance restored!');
  };

  const handleApproveKyc = (username: string) => {
    const updateKyc = (u: UserProfile) => ({ ...u, kycStatus: 'Verified' as const });
    setRegisteredUsers(all => all.map(u => u.username === username ? updateKyc(u) : u));
    if (user && user.username === username) {
      setUser(prev => prev ? updateKyc(prev) : null);
    }
    alert(isBangla ? 'ডকুমেন্ট এপ্রুভ ও ভেরিফাইড করা হয়েছে!' : 'Account document verified successfully!');
  };

  const handleRejectKyc = (username: string) => {
    const updateKyc = (u: UserProfile) => ({ ...u, kycStatus: 'Not verified' as const, kycDetails: null });
    setRegisteredUsers(all => all.map(u => u.username === username ? updateKyc(u) : u));
    if (user && user.username === username) {
      setUser(prev => prev ? updateKyc(prev) : null);
    }
    alert(isBangla ? 'কেওয়াইসি ডকুমেন্ট রিজেক্ট করা হয়েছে!' : 'Account document rejected.');
  };

  const handleAssignTransaction = (txId: string, assignedTo: string) => {
    setTransactions(prev => {
      const next = prev.map(tx => tx.id === txId ? { ...tx, assignedTo } : tx);
      localStorage.setItem('paysecure_transactions', JSON.stringify(next));
      return next;
    });
  };

  const handleApproveAssignedTx = (txId: string) => {
    if (!user) return;
    setTransactions(prev => {
      const next = prev.map(tx => {
        if (tx.id === txId) {
          const targetUName = (tx as any).username;
          if (tx.type === 'Deposit') {
            setRegisteredUsers(all => {
              const updatedAll = all.map(u => {
                if (u.username === targetUName) {
                  const amt = tx.amount;
                  const vRates = [1.0, 1.8, 2.5, 3.8, 5.5];
                  const rate = vRates[u.vipLevel] || 1.0;
                  const commissionEarned = (amt * rate) / 100;
                  const updated = {
                    ...u,
                    balance: u.balance + amt + commissionEarned,
                    todayDeposit: u.todayDeposit + amt,
                    todayCommission: u.todayCommission + commissionEarned,
                    totalCommission: u.totalCommission + commissionEarned
                  };
                  if (user && user.username === targetUName) {
                    setTimeout(() => setUser(updated), 0);
                  }
                  return updated;
                }
                return u;
              });
              localStorage.setItem('paysecure_users', JSON.stringify(updatedAll));
              return updatedAll;
            });
          }
          return { ...tx, status: 'Completed' as const, approvedBy: user.username };
        }
        return tx;
      });
      localStorage.setItem('paysecure_transactions', JSON.stringify(next));
      return next;
    });
  };

  const handleRejectAssignedTx = (txId: string) => {
    if (!user) return;
    setTransactions(prev => {
      const next = prev.map(tx => {
        if (tx.id === txId) {
          const targetUName = (tx as any).username;
          if (tx.type === 'Withdraw') {
            setRegisteredUsers(all => {
              const updatedAll = all.map(u => {
                if (u.username === targetUName) {
                  const updated = {
                    ...u,
                    balance: u.balance + tx.amount,
                    todayWithdraw: Math.max(0, u.todayWithdraw - tx.amount)
                  };
                  if (user && user.username === targetUName) {
                    setTimeout(() => setUser(updated), 0);
                  }
                  return updated;
                }
                return u;
              });
              localStorage.setItem('paysecure_users', JSON.stringify(updatedAll));
              return updatedAll;
            });
          }
          return { ...tx, status: 'Failed' as const, approvedBy: user.username };
        }
        return tx;
      });
      localStorage.setItem('paysecure_transactions', JSON.stringify(next));
      return next;
    });
  };

  const isBangla = language === 'বাংলা';

  if (!user) {
    return (
      <AuthView
        language={language}
        onLoginSuccess={(loggedIn) => {
          setUser(loggedIn);
          setActiveTab('home');
        }}
        registeredUsers={registeredUsers}
        onRegisterUser={(newUser) => {
          setRegisteredUsers(prev => {
            const next = [...prev, newUser];
            localStorage.setItem('paysecure_users', JSON.stringify(next));
            return next;
          });
        }}
        isDarkMode={isDarkMode}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // Filter transactions to user's rows if not admin
  const userTransactions = transactions.filter(t => user.role === 'admin' || (t as any).username === user.username);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-150 flex flex-col justify-between ${
      isDarkMode ? 'bg-[#090e1a] text-white' : 'bg-[#f1f5f9] text-gray-800'
    }`} id="app-root-wrapper">

      {/* FIXED BANNER / APP HEADER */}
      <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white shadow-xl px-4 py-3 flex items-center justify-between" id="app-viewport-header">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 px-1.5 rounded-xl hover:bg-white/10 text-white transition-all select-none cursor-pointer"
            id="header-sidebar-trigger"
            aria-label="Open sidebar menu"
          >
            <Menu size={22} />
          </button>
          
          <h1 className="text-base font-extrabold tracking-tight heading-font select-none uppercase">
            {activeTab === 'home' ? (isBangla ? 'ই-ওয়ালেট' : 'E-Wallet') :
             activeTab === 'vip' ? (isBangla ? 'ভিআইপি মেম্বার' : 'VIP Privileges') :
             activeTab === 'wallet' ? (isBangla ? 'ওয়ালেট' : 'My Gateway') :
             activeTab === 'account' ? (isBangla ? 'অ্যাকাউন্ট প্রোফাইল' : 'Account Details') :
             (isBangla ? 'আইডি ভেরিফিকেশন' : 'Verify Identity')}
          </h1>
        </div>

        {/* Action icons right */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert(isBangla ? 'আপনার ই-ওয়ালেট সিকিউরড কানেকশন সক্রিয়!' : 'Your e-wallet secures and encrypts all operations!')}
            className="p-1 px-2 text-xs bg-white/10 hover:bg-white/15 rounded-full font-bold select-none text-white tracking-widest hidden sm:inline"
            id="status-capsule-badge"
          >
            SSL
          </button>

          {/* Quick trigger alerts button */}
          <button
            onClick={() => alert(isBangla ? 'ম্যানেজার টিম নোটিফিকেশন: আজকের জন্য সকল উইথড্র ফি ০%!' : 'Platform update: Withdrawal processing charges set to 0% for premium users today!')}
            className="p-2 rounded-xl hover:bg-white/10 text-white transition-all relative cursor-pointer"
            id="header-notif-bell"
            aria-label="View notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
          </button>

          {/* Header avatar picture fallback */}
          <button
            onClick={() => setActiveTab('account')}
            className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-slate-800 flex items-center justify-center cursor-pointer relative"
            id="header-avatar-trigger"
            aria-label="View profile"
          >
            <div className="w-7 h-7 rounded-full bg-amber-200 relative flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 w-full h-4 bg-amber-450 rounded-b-full"></div>
              <div className="w-6 h-6 rounded-full bg-amber-100 flex flex-col items-center justify-center mt-1">
                <div className="flex gap-1 mb-0.5">
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* CORE VIEWPORT BODY / SCROLL PAGES */}
      <main className="flex-1 w-full max-w-lg mx-auto relative px-0 py-2 sm:px-2 z-10" id="main-viewport-scroller">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Dashboard
                user={user}
                language={language}
                transactions={userTransactions}
                globalTransactions={transactions}
                onApproveAssignedTx={handleApproveAssignedTx}
                onRejectAssignedTx={handleRejectAssignedTx}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
                onOpenUserWD={() => setIsUserWDOpen(true)}
                onOpenUserDep={() => setIsUserDepOpen(true)}
                setActiveTab={setActiveTab}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}

          {activeTab === 'vip' && (
            <motion.div
              key="vip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <VipDashboard
                user={user}
                language={language}
                onUpgradeVip={handleUpgradeVip}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <WalletTab
                user={user}
                language={language}
                onUpdateWallets={handleUpdateWallets}
                onTransfer={handleTransfer}
                isDarkMode={isDarkMode}
                paymentGateways={paymentGateways}
                onUpdateUserGateways={handleUpdateUserGateways}
              />
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AccountTab
                user={user}
                language={language}
                onLanguageChange={handleLanguageChange}
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                setActiveTab={setActiveTab}
                onOpenDeposit={() => setIsDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'admin' && user?.role === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <AdminPanel
                language={language}
                usersList={registeredUsers}
                globalTransactions={transactions}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onApproveDeposit={handleApproveDeposit}
                onRejectDeposit={handleRejectDeposit}
                onApproveWithdraw={handleApproveWithdraw}
                onRejectWithdraw={handleRejectWithdraw}
                onApproveKyc={handleApproveKyc}
                onRejectKyc={handleRejectKyc}
                onUpdateSupportLink={setSupportLink}
                supportLink={supportLink}
                isDarkMode={isDarkMode}
                paymentGateways={paymentGateways}
                onUpdateGateway={handleUpdateGateway}
                onAssignTransaction={handleAssignTransaction}
              />
            </motion.div>
          )}

          {activeTab === 'kyc-flow' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <KycVerification
                language={language}
                onBack={() => setActiveTab('account')}
                onSubmitKyc={handleKycSubmit}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global reset data log developer button if empty space */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-center p-3 text-center opacity-60 hover:opacity-100 select-none">
            <button
              onClick={handleResetWallet}
              className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer transition-all border border-red-500/10 px-3 py-1.5 rounded-xl bg-red-500/[0.02]"
              id="global-reset-btn"
            >
              <Trash2 size={12} />
              {isBangla ? 'রিসেট ওয়ালেট ডাটা' : 'Reset Wallet Database'}
            </button>
          </div>
        )}
      </main>

      {/* PORTABLE MODAL - USER DEPOSIT SLIDER */}
      <AnimatePresence>
        {isDepositOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDepositOpen(false)}
              className="fixed inset-0 bg-black z-40"
              id="deposit-modal-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className={`fixed inset-x-4 max-w-sm mx-auto bottom-6 ${
                isDarkMode ? 'bg-[#0f172a] border border-slate-800 text-white' : 'bg-white border text-gray-800'
              } rounded-2xl z-50 p-5 shadow-2xl`}
              id="deposit-modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm uppercase tracking-wider heading-font">
                  {isBangla ? 'ব্যালেন্স রিচার্জ / ডিপোজিট' : 'Recharge Wallet'}
                </h3>
                <button
                  onClick={() => setIsDepositOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 cursor-pointer"
                  id="close-deposit-modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4 mt-4 text-[11px]">
                {/* Dynamic Channel Select dropdown */}
                <div>
                  <label htmlFor="modal_dep_method" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'পেমেন্ট মেথড বাছাই করুন' : 'Deposit Gateway'}
                  </label>
                  <div className="relative">
                    <select
                      id="modal_dep_method"
                      value={depMethod}
                      onChange={(e) => setDepMethod(e.target.value)}
                      className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:border-sky-500 text-xs font-bold appearance-none cursor-pointer ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-100 border-gray-250'
                      }`}
                    >
                      {paymentGateways.filter(gw => gw.status === 'active').map(gw => (
                        <option key={gw.id} value={gw.name}>{gw.name}</option>
                      ))}
                      {paymentGateways.filter(gw => gw.status === 'active').length === 0 && (
                        <option value="Manual BDT">Manual BDT Transfer (ম্যানুয়াল)</option>
                      )}
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>

                {/* Receiver Info & Copy Button */}
                {(() => {
                  const currentGW = paymentGateways.find(gw => gw.name === depMethod) || paymentGateways.find(gw => gw.status === 'active');
                  if (!currentGW || !currentGW.number) return null;
                  return (
                    <div className="p-3 bg-sky-500/[0.04] border border-sky-500/20 rounded-xl space-y-2 select-none">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold text-sky-400 tracking-wider uppercase">
                          {isBangla ? `${currentGW.name} নম্বর (টাকা পাঠান)` : `Send Money to ${currentGW.name}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(currentGW.number);
                            alert(isBangla ? 'নম্বরটি কপি করা হয়েছে!' : 'Wallet number copied!');
                          }}
                          className="py-1 px-2.5 bg-sky-500 hover:bg-sky-400 text-black text-[9px] font-extrabold uppercase rounded-md transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                          {isBangla ? 'কপি' : 'Copy'}
                        </button>
                      </div>
                      <div className="text-sm font-black font-mono tracking-widest text-amber-500">
                        {currentGW.number}
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        {isBangla 
                          ? 'প্রথমে এই নম্বরে বিকাশ/নগদ অ্যাপ দিয়ে টাকা পাঠান, তারপর নিচের তথ্য পূরণ করুন।' 
                          : 'Recharge via your wallet to this phone, then enter sender credentials below.'}
                      </p>
                    </div>
                  );
                })()}

                {/* Amount input block */}
                <div>
                  <label htmlFor="modal_dep_amount" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'টাকা বা অংক (৳)' : 'Recharge Amount (৳)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-xs font-bold text-gray-400">৳</span>
                    <input
                      id="modal_dep_amount"
                      type="number"
                      value={depAmount}
                      onChange={(e) => setDepAmount(e.target.value)}
                      placeholder="e.g. 500"
                      min="10"
                      className={`w-full py-2.5 pl-8 pr-3 rounded-xl border focus:outline-none focus:border-sky-500 text-xs font-bold ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-105 border-gray-250 shadow-inner'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Sender mobile number input */}
                <div>
                  <label htmlFor="modal_dep_sender" className="text-[10px] font-bold uppercase text-gray-400 block mb-1" id="dep-sender-label">
                    {isBangla ? 'যে নম্বর থেকে টাকা পাঠিয়েছেন (বিকাশ/নগদ)' : 'Your Sender Mobile (bKash/Nagad)'}
                  </label>
                  <input
                    id="modal_dep_sender"
                    type="text"
                    value={depSenderPhone}
                    onChange={(e) => setDepSenderPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:border-sky-500 text-xs font-bold ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-105 border-gray-300'
                    }`}
                    required
                  />
                </div>

                {/* TxID token */}
                <div>
                  <label htmlFor="modal_dep_txid" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'ট্রানজেকশন আইডি (TxID)' : 'Transaction hash / TxID'}
                  </label>
                  <input
                    id="modal_dep_txid"
                    type="text"
                    value={depTxId}
                    onChange={(e) => setDepTxId(e.target.value)}
                    placeholder="e.g. 8N7K3S2"
                    className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:border-sky-500 text-xs font-bold ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-105 border-gray-300'
                    }`}
                    required
                  />
                </div>

                {/* Submit button inside deposit */}
                <button
                  type="submit"
                  disabled={isDepSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-sky-450 from-sky-400 via-sky-500 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                  id="deposit-submit-btn"
                >
                  {isDepSubmitting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    isBangla ? 'ডিপোজিট রিকোয়েস্ট পাঠান' : 'Submit Deposit Request'
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PORTABLE MODAL - USER WITHDRAW SLIDER */}
      <AnimatePresence>
        {isWithdrawOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWithdrawOpen(false)}
              className="fixed inset-0 bg-black z-40"
              id="withdraw-modal-backdrop"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className={`fixed inset-x-4 max-w-sm mx-auto bottom-6 ${
                isDarkMode ? 'bg-[#0f172a] border border-slate-800 text-white' : 'bg-white border text-gray-800'
              } rounded-2xl z-50 p-5 shadow-2xl`}
              id="withdraw-modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm uppercase tracking-wider heading-font">
                  {isBangla ? 'ক্যাশআউট / উইথড্র ফর্ম' : 'Withdrawal Request'}
                </h3>
                <button
                  onClick={() => setIsWithdrawOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 cursor-pointer"
                  id="close-withdraw-modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleWithdrawSubmit} className="space-y-4 mt-4">
                {/* Method selector */}
                <div>
                  <label htmlFor="modal_wd_method" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'উইথড্র চ্যানেল' : 'Payout Channel'}
                  </label>
                  <div className="relative">
                    <select
                      id="modal_wd_method"
                      value={wdMethod}
                      onChange={(e) => setWdMethod(e.target.value)}
                      className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:border-sky-505 focus:border-sky-500 text-xs font-bold appearance-none cursor-pointer ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-100 border-gray-250'
                      }`}
                    >
                      <option value="bkash">bKash (বিকাশ)</option>
                      <option value="nagad">Nagad (নগদ)</option>
                      <option value="rocket">Rocket (রকেট)</option>
                    </select>
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>

                {/* Withdraw Target number */}
                <div>
                  <label htmlFor="modal_wd_number" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'মোবাইল ওয়ালেট নম্বর' : 'Mobile Payout Phone Number'}
                  </label>
                  <input
                    id="modal_wd_number"
                    type="text"
                    value={wdNumber}
                    onChange={(e) => setWdNumber(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className={`w-full py-2.5 px-3 rounded-xl border focus:outline-none focus:border-sky-500 text-xs font-bold ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-105 border-gray-300'
                    }`}
                    required
                  />
                </div>

                {/* Amount input block inside withdraw */}
                <div>
                  <label htmlFor="modal_wd_amount" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'অংক বা টাকা (৳)' : 'Withdraw Amount (৳)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-xs font-bold text-gray-400">৳</span>
                    <input
                      id="modal_wd_amount"
                      type="number"
                      value={wdAmount}
                      onChange={(e) => setWdAmount(e.target.value)}
                      placeholder="e.g. 500"
                      min="10"
                      className={`w-full py-2.5 pl-8 pr-3 rounded-xl border focus:outline-none focus:border-sky-500 text-xs font-bold ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-105 border-gray-250 shadow-inner'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Submit button inside withdraw modal */}
                <button
                  type="submit"
                  disabled={isWdSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                  id="withdraw-submit-btn"
                >
                  {isWdSubmitting ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    isBangla ? 'উইথড্র সম্পন্ন করুন' : 'Confirm Cashout'
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PORTABLE MODAL - USER DEPOSITION MOCK SIMULATION PANEL */}
      <AnimatePresence>
        {isUserDepOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserDepOpen(false)}
              className="fixed inset-0 bg-black z-45"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-[90%] mx-auto ${
                isDarkMode ? 'bg-[#0f172a] border border-slate-800 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)]' : 'bg-white border text-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.15)]'
              } rounded-2xl z-50 p-5`}
              id="simulate-user-dep-modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <UserPlus size={16} />
                  </span>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider heading-font">
                    {isBangla ? 'ইউজার ডিপোজিট ডেমো' : 'Test Recharge Tool'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsUserDepOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSimulateUserDep} className="space-y-4 mt-4">
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {isBangla 
                    ? 'এই টুলটির মাধ্যমে কোডিং রিভিউয়ার বা ইউজার এক ক্লিকে নিজের ওয়ালেটে মেগা টেস্টিং ব্যালেন্স যুক্ত করতে পারেন।' 
                    : 'Provides instant BDT credit simulating real admin actions. Ideal for checking VIP unlocks or transaction speeds.'}
                </p>

                <div>
                  <label htmlFor="mock_dep_amount" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'রিচার্জ অংক (টাকা ৳)' : 'BDT Recharge Amount (৳)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans font-bold text-gray-400 text-xs">৳</span>
                    <input
                      id="mock_dep_amount"
                      type="number"
                      value={mockDepAmount}
                      onChange={(e) => setMockDepAmount(e.target.value)}
                      placeholder="1000"
                      className={`w-full py-2 px-3 pl-8 text-xs font-black rounded-xl border focus:outline-none ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-50 border-gray-350'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {[500, 1000, 5000, 25000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setMockDepAmount(String(v))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        mockDepAmount === String(v)
                          ? 'bg-sky-500 text-white border-sky-400'
                          : isDarkMode 
                            ? 'bg-slate-800 hover:bg-slate-750 text-gray-300 border-slate-700' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                      }`}
                    >
                      ৳{v}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow active:scale-95 transition-all cursor-pointer mt-2"
                >
                  {isBangla ? 'ইনস্ট্যান্ট ক্রেডিট যোগ করুন' : 'Inject Free test Cash'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PORTABLE MODAL - USER WITHDRAWAL BROADCAST MOCK SIMULATION (User W/D) */}
      <AnimatePresence>
        {isUserWDOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserWDOpen(false)}
              className="fixed inset-0 bg-black z-45"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm w-[90%] mx-auto ${
                isDarkMode ? 'bg-[#0f172a] border border-slate-800 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)]' : 'bg-white border text-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.15)]'
              } rounded-2xl z-50 p-5`}
              id="simulate-user-wd-modal"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                    <UserMinus size={16} />
                  </span>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider heading-font">
                    {isBangla ? 'ইউজার উইথড্র ব্রডকাস্ট' : 'Simulate platform payouts'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsUserWDOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSimulateUserWD} className="space-y-4 mt-4">
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {isBangla 
                    ? 'অন্যান্য প্রাঙ্গনে কোনো মেম্বার বা ডেমো ইউজার ব্যালেন্স তুলে নিলে তা প্ল্যাটফর্মের অ্যাক্টিভিটি হিসেবে ফিডে দেখানোর টুল।' 
                    : 'Broadcasts mock payout actions with custom credentials to simulate live activity on the transactions feed.'}
                </p>

                {/* Name select */}
                <div>
                  <label htmlFor="wd_mock_name" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'ডেমো মেম্বার নাম' : 'Demo Member Name'}
                  </label>
                  <select
                    id="wd_mock_name"
                    value={randomUserWDName}
                    onChange={(e) => setRandomUserWDName(e.target.value)}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-50 border-gray-350'
                    }`}
                  >
                    <option value="Ariful Islam">Ariful Islam</option>
                    <option value="Anisur Rahman">Anisur Rahman</option>
                    <option value="Tuhin Mollah">Tuhin Mollah</option>
                    <option value="Mst Farhana">Mst Farhana</option>
                    <option value="Sabbir Ahmed">Sabbir Ahmed</option>
                  </select>
                </div>

                {/* Method select */}
                <div>
                  <label htmlFor="wd_mock_method" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'পেমেন্ট গেটওয়ে মেথড' : 'Payout Gateway'}
                  </label>
                  <select
                    id="wd_mock_method"
                    value={randomUserWDMethod}
                    onChange={(e) => setRandomUserWDMethod(e.target.value)}
                    className={`w-full py-2 px-3 text-xs font-bold rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-50 border-gray-350'
                    }`}
                  >
                    <option value="bkash">bKash (বিকাশ)</option>
                    <option value="nagad">Nagad (নগদ)</option>
                    <option value="rocket">Rocket (রকেট)</option>
                  </select>
                </div>

                {/* Amount select */}
                <div>
                  <label htmlFor="wd_mock_amount" className="text-[10px] font-bold uppercase text-gray-500 block mb-1">
                    {isBangla ? 'উইথড্র অংক (৳)' : 'Withdraw Amount (৳)'}
                  </label>
                  <input
                    id="wd_mock_amount"
                    type="number"
                    value={randomUserWDAmount}
                    onChange={(e) => setRandomUserWDAmount(e.target.value)}
                    placeholder="500"
                    className={`w-full py-2 px-3 text-xs font-bold rounded-xl border focus:outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-gray-50 border-gray-350'
                    }`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow active:scale-95 transition-all cursor-pointer mt-2"
                >
                  {isBangla ? 'ব্রডকাস্ট সিমুলেশন করুন' : 'Confirm Mock Cashout'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FIXED BOTTOM NAVIGATION BAR TAB WRAPPERS */}
      <footer className={`sticky bottom-0 z-30 w-full border-t flex items-center justify-around px-4 py-2 ${
        isDarkMode 
          ? 'bg-[#0f172a] border-slate-800 text-gray-400' 
          : 'bg-white border-gray-200 text-gray-500 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]'
      }`} id="app-bottom-navbar">
        
        {/* NAV 1: HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 py-1.5 flex-1 relative cursor-pointer ${
            activeTab === 'home' 
              ? 'text-sky-400 font-extrabold scale-105' 
              : 'hover:text-sky-400'
          }`}
          id="nav-btn-home"
        >
          <Home size={20} />
          <span className="text-[10px] leading-tight tracking-tight">
            {isBangla ? 'হোম' : 'Home'}
          </span>
          {activeTab === 'home' && (
            <span className="absolute bottom-[-2px] h-[3px] w-6 bg-sky-400 rounded-full"></span>
          )}
        </button>

        {/* NAV 2: VIP */}
        <button
          onClick={() => setActiveTab('vip')}
          className={`flex flex-col items-center gap-1.5 py-1.5 flex-1 relative cursor-pointer ${
            activeTab === 'vip' 
              ? 'text-sky-400 font-extrabold scale-105' 
              : 'hover:text-sky-400'
          }`}
          id="nav-btn-vip"
        >
          <Crown size={20} />
          <span className="text-[10px] leading-tight tracking-tight">
            VIP
          </span>
          {activeTab === 'vip' && (
            <span className="absolute bottom-[-2px] h-[3px] w-6 bg-sky-400 rounded-full"></span>
          )}
        </button>

        {/* NAV 3: WALLET */}
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center gap-1.5 py-1.5 flex-1 relative cursor-pointer ${
            activeTab === 'wallet' 
              ? 'text-sky-400 font-extrabold scale-105' 
              : 'hover:text-sky-400'
          }`}
          id="nav-btn-wallet"
        >
          <Wallet size={20} />
          <span className="text-[10px] leading-tight tracking-tight">
            {isBangla ? 'ওয়ালেট' : 'Wallet'}
          </span>
          {activeTab === 'wallet' && (
            <span className="absolute bottom-[-2px] h-[3px] w-6 bg-sky-400 rounded-full"></span>
          )}
        </button>

        {/* NAV 4: ACCOUNT */}
        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center gap-1.5 py-1.5 flex-1 relative cursor-pointer ${
            activeTab === 'account' 
              ? 'text-sky-400 font-extrabold scale-105' 
              : 'hover:text-sky-400'
          }`}
          id="nav-btn-account"
        >
          <User size={20} />
          <span className="text-[10px] leading-tight tracking-tight">
            {isBangla ? 'প্রোফাইল' : 'Account'}
          </span>
          {activeTab === 'account' && (
            <span className="absolute bottom-[-2px] h-[3px] w-6 bg-sky-400 rounded-full"></span>
          )}
        </button>

      </footer>

      {/* FLOAT SUPPORT CHAT VIRTUAL ASSISTANT */}
      <ChatWidget
        user={user}
        language={language}
        onNavigate={setActiveTab}
        isDarkMode={isDarkMode}
      />

      {/* MODULAR COMPLIANT ASYNC DRAWER SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        balance={user.balance}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        onOpenDeposit={() => setIsDepositOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        isDarkMode={isDarkMode}
        userRole={user.role}
        onLogout={() => {
          setIsSidebarOpen(false);
          setUser(null);
          setActiveTab('home');
          alert(isBangla ? 'সফলভাবে লগ আউট করা হয়েছে!' : 'Successfully logged out!');
        }}
      />

    </div>
  );
}
