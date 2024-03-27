import { request } from '@umijs/max';

export interface PaymentCreationRequest {
  studentId: number;
  year: number;
  month: Month;
  total: number;
  category?: Payment.PaymentCategory;
  type: string;
  description?: string;
  method?: Payment.PaymentMethod;
}

export const defaultPaymentCreationRequest: PaymentCreationRequest = {
  studentId: 0,
  year: 0,
  month: 'JANUARY',
  total: 0,
  category: 'REGULAR',
  type: '',
  description: '',
};

export interface RefundCreationRequest {
  studentId: number;
  year: number;
  month: Month;
  total: number;
  type: string;
  description?: string;
  method?: Payment.RefundMethod;
}

export const defaultRefundCreationRequest: RefundCreationRequest = {
  studentId: 0,
  year: 0,
  month: 'JANUARY',
  total: 0,
  type: '',
  description: '',
};

export interface PaymentConfirmationRequest {
  method: Payment.PaymentMethod;
}

const paymentApi = {
  getWeChatPaymentCode() {
    return request<Blob>(`/api/payment-code/wechat`, {
      method: 'GET',
      responseType: 'blob',
    });
  },

  updateWeChatPaymentCode(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return request<''>(`/api/payment-code/wechat`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAlipayPaymentCode() {
    return request<Blob>(`/api/payment-code/alipay`, {
      method: 'GET',
      responseType: 'blob',
    });
  },

  updateAlipayPaymentCode(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return request<''>(`/api/payment-code/alipay`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getAllTransactions() {
    return await request<Payment.TransactionInfo[]>('/api/transactions', {
      method: 'GET',
    });
  },

  async getAllPayments() {
    return await request<Payment.PaymentInfo[]>('/api/payments', { method: 'GET' });
  },

  async getAllRefunds() {
    return await request<Payment.RefundInfo[]>('/api/refunds', { method: 'GET' });
  },

  async getPayment(id: number) {
    return await request<Payment.PaymentInfo>(`/api/payment/${id}`, {
      method: 'GET',
    });
  },

  async getRefund(id: number) {
    return await request<Payment.RefundInfo>(`/api/refund/${id}`, {
      method: 'GET',
    });
  },

  async createPayment(data: PaymentCreationRequest) {
    return await request<Payment.PaymentInfo>('/api/payment', {
      method: 'POST',
      data,
    });
  },

  async createRefund(data: RefundCreationRequest) {
    return await request<Payment.RefundInfo>('/api/refund', {
      method: 'POST',
      data,
    });
  },

  confirmPayment(
    id: number,
    data: PaymentConfirmationRequest,
    screenshot?: File,
  ) {
    const formData = new FormData();
    formData.append(
      'req',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
    );
    if (screenshot !== undefined) {
      formData.append('screenshot', screenshot);
    }

    return request<Payment.PaymentInfo>(`/api/payment/${id}/confirm`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  verifyPayment(id: number) {
    return request<Payment.PaymentInfo>(`/api/payment/${id}/verify`, {
      method: 'POSt',
    });
  },

  deletePayment(id: number) {
    return request<''>(`/api/payment/${id}`, { method: 'DELETE' });
  },
};

export default paymentApi;
