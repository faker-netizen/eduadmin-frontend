import { request } from '@umijs/max';

export interface LabelCreationRequest {
  name: string;
  category: string;
  description: string;
}

export const defaultLabelCreationRequest: LabelCreationRequest = {
  name: '',
  category: '',
  description: '',
};

export interface LabelUpdateRequest {
  name?: string;
  category?: string;
  description?: string;
}

export const defaultLabelUpdateRequest: LabelUpdateRequest = {
  name: '',
  category: '',
  description: '',
};

const labelApi = {
  getAllLabels() {
    return request<Label.LabelInfo[]>('/api/labels', {
      method: 'GET',
    });
  },

  getLabel(id: number) {
    return request<Label.LabelInfo>(`/api/label/${id}`, {
      method: 'GET',
    });
  },

  createLabel(data: LabelCreationRequest) {
    return request<''>('/api/label', {
      method: 'POST',
      data,
    });
  },

  updateLabel(id: number, data: LabelUpdateRequest) {
    return request<''>(`/api/label/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  deleteLabel(id: number) {
    return request<''>(`/api/label/${id}`, {
      method: 'DELETE',
    });
  },
};

export default labelApi;
