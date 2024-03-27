import { defaultAccountInfo } from './accountDefaults';

export const defaultArchiveSchemaInfo: File.ArchiveSchemaInfo = {
  path: '',
  description: '',
};

export const defaultFileInfo: File.FileInfo = {
  id: 0,
  name: '',
  path: '',
  size: 0,
  category: 'OTHER',
  type: '',
  uploadDateTime: '',
  uploader: defaultAccountInfo,
};
