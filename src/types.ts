/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  number: string;
  type: 'Deposit' | 'Withdraw' | 'Commission' | 'Transfer';
  method: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
  username?: string;
  senderNumber?: string;
  receiverNumber?: string;
  assignedTo?: string; // username of user assigned to process
  assignedBy?: string; // usually 'admin'
  approvedBy?: string; // username of user/admin who actually approved
}

export interface KycDetails {
  firstName: string;
  lastName: string;
  dob: string;
  city: string;
  docType: string;
  frontPhoto: string | null;
  backPhoto: string | null;
}

export interface UserProfile {
  name: string;
  username: string;
  uid: string;
  password?: string; // For local auth persistence
  role?: 'user' | 'admin'; // Authorization levels
  isBlocked?: boolean; // Admin can block accounts
  kycStatus: 'Not verified' | 'Pending' | 'Verified';
  kycDetails: KycDetails | null;
  balance: number;
  todayCommission: number;
  totalCommission: number;
  todayDeposit: number;
  todayWithdraw: number;
  vipLevel: number;
  bKashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  paymentGateways?: PaymentGateway[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}

export type ActiveTab = 'home' | 'vip' | 'wallet' | 'account' | 'kyc-flow' | 'admin';
export type KycStep = 1 | 2;
export type Language = 'English' | 'বাংলা';

export interface PaymentGateway {
  id: string;
  name: string;
  type: string; // 'Personal' | 'Merchant' | 'Agent'
  brand: 'bkash' | 'nagad' | 'rocket';
  status: 'active' | 'deactive';
  number: string;
  ownerName?: string; // e.g. "Rakib" as shown in screenshot
}
