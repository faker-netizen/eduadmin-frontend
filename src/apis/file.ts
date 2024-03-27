import { request } from '@umijs/max';

export interface ArchiveSchemaCreationRequest {
  path: string;
  description: string;
}

export const defaultArchiveSchemaCreationRequest: ArchiveSchemaCreationRequest =
  {
    path: '',
    description: '',
  };

export interface ArchiveSchemaUpdateRequest {
  path?: string;
  description?: string;
}

const fileApi = {
  getAllArchiveSchemas() {
    return request<File.ArchiveSchemaInfo[]>('/api/archive-schemas', {
      method: 'GET',
    });
  },

  getArchiveSchema(id: number) {
    return request<File.ArchiveSchemaInfo>(`/api/archive-schema/${id}`, {
      method: 'GET',
    });
  },

  createArchiveSchema(data: ArchiveSchemaCreationRequest) {
    return request<''>('/api/archive-schema', {
      method: 'POST',
      data,
    });
  },

  updateArchiveSchema(id: number, data: ArchiveSchemaUpdateRequest) {
    return request<''>(`/api/archive-schema/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  deleteArchiveSchema(id: number) {
    return request<''>(`/api/archive-schema/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * List all files in a folder (only for admin).
   *
   * If the folder is empty, 400 is returned.
   * @param folder the folder to list, if '/', list all files in the root
   */
  listFiles(folder: string) {
    return request<File.FileInfo[]>('/api/files', {
      method: 'GET',
      params: { folder },
    });
  },

  /**
   * Download a file by pathname (only for admin and uploader himself).
   *
   * If the pathname is empty or not contains a filename, 400 is returned.
   * @param pathname The pathname to download the file from, filename is required.
   */
  downloadFile(pathname: string) {
    return request<Blob>(`/api/file`, {
      method: 'GET',
      params: { pathname },
      responseType: 'blob',
    });
  },

  /**
   * Upload a file.
   *
   * If the path is empty, 400 is returned.
   *
   * If the file already exists, 409 is returned.
   * @param path The path to upload the file to, if '/', upload to the root.
   * @param file The file to upload.
   * @param options The options to upload the file. Default is { category: 'OTHER', overwrite: false }.
   */
  uploadFile(
    path: string,
    file: File,
    options: {
      category?: File.FileCategory;
      overwrite?: 'OFF' | 'SAME_EXTENSION' | 'DIFFERENT_EXTENSION';
      filename?: string;
      extension?: string;
    } = {
      category: 'OTHER',
      overwrite: 'OFF',
    },
  ) {
    const formData = new FormData();
    formData.append('file', file);

    return request<''>(`/api/file`, {
      method: 'POST',
      params: {
        path,
        category: options.category ?? 'OTHER',
        overwrite: options.overwrite ?? 'OFF',
        filename: options.filename,
        extension: options.extension,
      },
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete a file by pathname (only for admin and uploader of the file).
   *
   * If the pathname is empty or not contains a filename, 400 is returned.
   * @param pathname The pathname to download the file from, filename is required.
   */
  deleteFile(pathname: string) {
    return request<''>(`/api/file`, {
      method: 'DELETE',
      params: { pathname },
    });
  },
};

export default fileApi;
