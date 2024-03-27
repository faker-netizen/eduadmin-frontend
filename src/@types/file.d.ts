declare namespace File {
  type FileCategory = 'TEMPLATE' | 'OTHER';

  interface ArchiveSchemaInfo {
    path: string;
    description: string;
  }

  interface FileInfo {
    id: number;
    name: string;
    path: string;
    size: number;
    category: FileCategory;
    type: string;
    uploadDateTime: string;
    uploader: Account.AccountInfo;
  }
}
