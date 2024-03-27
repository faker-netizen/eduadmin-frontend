import { Roles } from '@/constants/auth';

export const defaultAccountInfo: Account.AccountInfo = {
  id: 0,
  creationDateTime: '1900-01-01T00:00:00.000Z',
  status: 'ACTIVE',
  username: '',
  email: '',
  phone: '',
  roles: [Roles.ADMIN],
  routes: [],
  boundTo: 'NONE',
  boundId: null,
};

export const defaultStudentInfo: Account.StudentInfo = {
  id: 0,
  creationDateTime: '1900-01-01T00:00:00.000Z',
  studentNumber: '',
  name: '',
  sex: 'MALE',
  birth: '1900-01-01',
  age: 0,
  disorderType: '',
  idno: '',
  user: null,
  parents: [],
};

export const defaultStudentProfileSchemaEntry: Account.StudentProfileSchemaEntry =
  {
    id: 0,
    name: '',
    type: 'text',
    isArray: false,
    required: false,
    sortOrder: 1,
    description: '',
  };

export const defaultStudentProfileSchema: Account.StudentProfileSchema = [
  defaultStudentProfileSchemaEntry,
];

export const defaultStudentProfileEntry: Account.StudentProfileEntry = {
  id: 0,
  schemaEntry: defaultStudentProfileSchemaEntry,
  value: '',
};

export const defaultStudentProfile: Account.StudentProfile = [
  defaultStudentProfileEntry,
];

export const defaultTeacherProfileSchemaEntry: Account.TeacherProfileSchemaEntry =
  {
    id: 0,
    name: '',
    type: 'text',
    isArray: false,
    required: false,
    sortOrder: 1,
    description: '',
  };

export const defaultTeacherProfileSchema: Account.TeacherProfileSchema = [
  defaultTeacherProfileSchemaEntry,
];

export const defaultTeacherProfileEntry: Account.TeacherProfileEntry = {
  id: 0,
  schemaEntry: defaultTeacherProfileSchemaEntry,
  value: '',
};

export const defaultTeacherProfile: Account.TeacherProfile = [
  defaultTeacherProfileEntry,
];

export const defaultParentInfo: Account.ParentInfo = {
  id: 0,
  name: '',
  idno: '',
  phone: '',
};

export const defaultTeacherInfo: Account.TeacherInfo = {
  id: 0,
  creationDateTime: '1900-01-01T00:00:00.000Z',
  staffNumber: '',
  name: '',
  sex: 'MALE',
  birth: '1900-01-01',
  age: 0,
  idno: '',
  phone: '',
  department: '',
  position: '',
  user: null,
};

export const defaultTeacherWithConflictLessonsInfo: Account.TeacherWithConflictLessonsInfo =
  { ...defaultTeacherInfo, conflictLessons: [] };

export const defaultStudentWithConflictLessonsInfo: Account.StudentWithConflictLessonsInfo =
  { ...defaultStudentInfo, conflictLessons: [] };
