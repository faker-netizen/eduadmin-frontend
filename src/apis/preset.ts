import { request } from '@umijs/max';

interface TimescalePresetRaw {
  id: number;
  name: string;
  description: string;
  value: string[];
}

export interface TimescalePresetCreationRequest {
  name: string;
  description: string;
  value: Array<[string, string]>;
}

export interface TimescalePresetUpdateRequest {
  name?: string;
  description?: string;
  value?: Array<[string, string]>;
}

const presetApi = {
  async getAllTimescalePresets(): Promise<Preset.TimescalePresetInfo[]> {
    const response = await request<TimescalePresetRaw[]>(
      '/api/timescale-presets',
      {
        method: 'GET',
      },
    );

    return response.map((preset) => ({
      ...preset,
      value: preset.value.map((v) => v.split('-', 2) as [string, string]),
    }));
  },

  async getTimescalePreset(id: number): Promise<Preset.TimescalePresetInfo> {
    const response = await request<TimescalePresetRaw>(
      `/api/timescale-preset/${id}`,
      {
        method: 'GET',
      },
    );

    return {
      ...response,
      value: response.value.map((v) => v.split('-', 2) as [string, string]),
    };
  },

  async createTimescalePreset(
    data: TimescalePresetCreationRequest,
  ): Promise<Preset.TimescalePresetInfo> {
    const response = await request<TimescalePresetRaw>(
      '/api/timescale-preset',
      {
        method: 'POST',
        data: {
          ...data,
          value: data.value.map((v) => v.join('-')),
        },
      },
    );

    return {
      ...response,
      value: response.value.map((v) => v.split('-', 2) as [string, string]),
    };
  },

  async updateTimescalePreset(
    id: number,
    data: TimescalePresetUpdateRequest,
  ): Promise<Preset.TimescalePresetInfo> {
    const response = await request<TimescalePresetRaw>(
      `/api/timescale-preset/${id}`,
      {
        method: 'PATCH',
        data: {
          ...data,
          value: data.value?.map((v) => v.join('-')),
        },
      },
    );

    return {
      ...response,
      value: response.value.map((v) => v.split('-', 2) as [string, string]),
    };
  },

  async deleteTimescalePreset(id: number): Promise<''> {
    return await request<''>(`/api/timescale-preset/${id}`, {
      method: 'DELETE',
    });
  },
};

export default presetApi;
