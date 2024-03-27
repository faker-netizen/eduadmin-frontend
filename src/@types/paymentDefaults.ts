import { defaultAccountInfo } from './accountDefaults';

export const defaultPaymentInfo: Payment.PaymentInfo = {
  id: 0,
  studentId: 0,
  year: 0,
  month: 'JANUARY',
  total: 0,
  creator: defaultAccountInfo,
  creationDateTime: '',
  confirmationDateTime: null,
  verificationDateTime: null,
  category: 'REGULAR',
  type: '',
  description: '',
  method: null,
  screenshotPathname: null,
  status: 'UNCONFIRMED',
};

export const defaultRefundInfo: Payment.RefundInfo = {
  id: 0,
  studentId: 0,
  year: 0,
  month: 'JANUARY',
  total: 0,
  creator: defaultAccountInfo,
  creationDateTime: '',
  type: '',
  description: '',
  method: null,
};

export const defaultTransactionInfo: Payment.TransactionInfo =
  defaultPaymentInfo;
