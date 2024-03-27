declare namespace Payment {
  type PaymentCategory = 'REGULAR' | 'OTHER';

  type PaymentMethod = 'WECHAT' | 'ALIPAY' | 'OTHER';

  type RefundMethod = 'WECHAT' | 'ALIPAY' | 'OTHER';

  type PaymentStatus = 'UNCONFIRMED' | 'CONFIRMED' | 'VERIFIED';

  interface PaymentInfo {
    id: number;
    studentId: number;
    year: number;
    month: Month;
    total: number;
    creator: Account.AccountInfo;
    creationDateTime: string;
    confirmationDateTime: string | null;
    verificationDateTime: string | null;
    category: PaymentCategory;
    type: string;
    description: string;
    method: PaymentMethod | null;
    screenshotPathname: string | null;
    status: PaymentStatus;
  }

  interface RefundInfo {
    id: number;
    studentId: number;
    year: number;
    month: Month;
    total: number;
    creator: Account.AccountInfo;
    creationDateTime: string;
    type: string;
    description: string;
    method: PaymentMethod | null;
  }

  type TransactionInfo = PaymentInfo | RefundInfo;
}
