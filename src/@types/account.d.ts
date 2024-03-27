declare namespace Account {
  type Role = 'super_admin' | 'admin' | 'teacher' | 'student' | 'financial';

  type AccountStatus = 'ACTIVE' | 'INACTIVE';

  type AccountInfo = {
    id: number;
    creationDateTime: string;
    status: AccountStatus;
    username: string;
    email: string;
    phone: string;
    roles: Role[];
    routes: string[];
  } & AccountBoundInfo;

  type BoundEntity = StudentInfo | TeacherInfo | null;

  type AccountBoundInfo =
    | { boundTo: 'TEACHER' | 'STUDENT'; boundId: number }
    | { boundTo: 'NONE'; boundId: null };

  interface _BaseProfileSchemaEntry {
    id: number;
    name: string;
    required: boolean;
    isArray: boolean;
    sortOrder: number;
    description: string;
  }

  interface BlobProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'pic' | 'file';
  }

  interface TextProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'text';
  }

  interface NumberProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'number';
  }

  interface BooleanProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'boolean';
  }

  interface DateTimeProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'datetime';
  }

  interface DateProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'date';
  }

  interface TimeProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: 'time';
  }

  interface SelectionProfileSchemaEntry extends _BaseProfileSchemaEntry {
    type: string[];
  }

  type CommonProfileSchemaEntry =
    | BlobProfileSchemaEntry
    | TextProfileSchemaEntry
    | NumberProfileSchemaEntry
    | BooleanProfileSchemaEntry
    | DateTimeProfileSchemaEntry
    | DateProfileSchemaEntry
    | TimeProfileSchemaEntry
    | SelectionProfileSchemaEntry;

  interface _BaseProfileEntry {
    id: number;
  }

  interface BlobProfileEntry extends _BaseProfileEntry {
    schemaEntry: BlobProfileSchemaEntry;
    value: Blob;
  }

  interface TextProfileEntry extends _BaseProfileEntry {
    schemaEntry: TextProfileSchemaEntry;
    value: string;
  }

  interface NumberProfileEntry extends _BaseProfileEntry {
    schemaEntry: NumberProfileSchemaEntry;
    value: number;
  }

  interface BooleanProfileEntry extends _BaseProfileEntry {
    schemaEntry: BooleanProfileSchemaEntry;
    value: boolean;
  }

  interface DateTimeProfileEntry extends _BaseProfileEntry {
    schemaEntry: DateTimeProfileSchemaEntry;
    value: string;
  }

  interface DateProfileEntry extends _BaseProfileEntry {
    schemaEntry: DateProfileSchemaEntry;
    value: string;
  }

  interface TimeProfileEntry extends _BaseProfileEntry {
    schemaEntry: TimeProfileSchemaEntry;
    value: string;
  }

  interface SelectionProfileEntry extends _BaseProfileEntry {
    schemaEntry: SelectionProfileSchemaEntry;
    value: string;
  }

  type StringProfileEntry =
    | TextProfileEntry
    | DateTimeProfileEntry
    | DateProfileEntry
    | TimeProfileEntry
    | SelectionProfileEntry;

  type BasicProfileEntry =
    | BlobProfileEntry
    | TextProfileEntry
    | NumberProfileEntry
    | BooleanProfileEntry
    | DateTimeProfileEntry
    | DateProfileEntry
    | TimeProfileEntry
    | SelectionProfileEntry;

  type ArrayProfileEntry<T extends BasicProfileEntry> = {
    id: T['id'];
    schemaEntry: T['schemaEntry'] & { isArray: true };
    value: T['value'][];
  };

  type CommonProfileEntry =
    | BasicProfileEntry
    | ArrayProfileEntry<BasicProfileEntry>;

  type StudentProfileSchema = StudentProfileSchemaEntry[];

  type StudentProfileSchemaEntry = CommonProfileSchemaEntry;

  type StudentProfile = StudentProfileEntry[];

  type StudentProfileEntry = CommonProfileEntry;

  type TeacherProfileSchema = TeacherProfileSchemaEntry[];

  type TeacherProfileSchemaEntry = CommonProfileSchemaEntry;

  type TeacherProfile = TeacherProfileEntry[];

  type TeacherProfileEntry = CommonProfileEntry;

  interface StudentInfo {
    id: number;
    creationDateTime: string;
    studentNumber: string;
    name: string;
    sex: Sex;
    birth: string;
    age: number;
    disorderType: string;
    idno: string;
    user: AccountInfo | null;
    parents: ParentInfo[];
  }

  interface ParentInfo {
    id: number;
    name: string;
    idno: string;
    phone: string;
  }

  interface TeacherInfo {
    id: number;
    creationDateTime: string;
    staffNumber: string;
    name: string;
    sex: Sex;
    birth: string;
    age: number;
    idno: string;
    phone: string;
    department: string;
    position: string;
    user: AccountInfo | null;
  }

  type TeacherWithConflictLessonsInfo = TeacherInfo & {
    conflictLessons: Course.LessonInfo[];
  };

  type StudentWithConflictLessonsInfo = StudentInfo & {
    conflictLessons: Course.LessonInfo[];
  };
}
