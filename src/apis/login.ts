import { request } from '@umijs/max';

export interface LoginRequest {
  username: string;
  password: string;
}

export const defaultLoginRequest: LoginRequest = {
  username: '',
  password: '',
};

export interface LoginResponse {
  id: number;
  token: string;
  username: string;
  email: string | null;
  address: string | null;
  roles: Account.Role[];
}

const loginApi = {
  login(data: LoginRequest) {
    return request<LoginResponse>('/api/login', {
      method: 'post',
      data,
    });
  },
};

export default loginApi;
