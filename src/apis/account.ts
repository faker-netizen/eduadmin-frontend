import { Roles } from '@/constants/auth';
import { isStringLiteralCommonProfileSchemaEntryType } from '@/constants/common';
import { request } from '@umijs/max';
import dayjs from 'dayjs';
import fileApi from './file';

export interface AccountCreationRequest {
  username: string;
  password: string;
  roles: string[];
  routes?: string[];
}

export const defaultAccountCreationRequest: AccountCreationRequest = {
  username: '',
  password: '',
  roles: [Roles.ADMIN],
  routes: [],
};

export interface ParentCreationRequest {
  name: string;
  idno: string;
  phone: string;
}

export const defaultParentCreationRequest: ParentCreationRequest = {
  name: '',
  idno: '',
  phone: '',
};

export interface StudentCreationRequest {
  studentNumber: string;
  userId: number;
  parents: ParentCreationRequest[];
  name: string;
  sex: Sex;
  birth: string;
  disorderType: string;
  idno: string;
}

export const defaultStudentCreationRequest: StudentCreationRequest = {
  studentNumber: '',
  userId: 0,
  parents: [defaultParentCreationRequest, defaultParentCreationRequest],
  name: '',
  sex: 'MALE',
  birth: '1900-01-01',
  disorderType: '',
  idno: '',
};

export interface TeacherCreationRequest {
  staffNumber: string;
  userId: number;
  name: string;
  sex: Sex;
  birth: string;
  idno: string;
  phone: string;
  department: string;
  position: string;
}

export const defaultTeacherCreationRequest: TeacherCreationRequest = {
  staffNumber: '',
  userId: 0,
  name: '',
  sex: 'MALE',
  birth: '1900-01-01',
  idno: '',
  phone: '',
  department: '',
  position: '',
};

export interface TeacherProfileEntryChangeRequest {
  schemaEntryId: number;
  value:
    | File
    | string
    | number
    | boolean
    | Array<File | string | number | boolean>
    | null;
}

export const defaultTeacherProfileEntryChangeRequest: TeacherProfileEntryChangeRequest =
  {
    schemaEntryId: 0,
    value: '',
  };

export type TeacherProfileChangeRequest = TeacherProfileEntryChangeRequest[];

export const defaultTeacherProfileChangeRequest: TeacherProfileChangeRequest = [
  defaultTeacherProfileEntryChangeRequest,
];

export interface StudentProfileEntryChangeRequest {
  schemaEntryId: number;
  value:
    | File
    | string
    | number
    | boolean
    | Array<File | string | number | boolean>
    | null;
}

export const defaultStudentProfileEntryChangeRequest: StudentProfileEntryChangeRequest =
  {
    schemaEntryId: 0,
    value: '',
  };

export type StudentProfileChangeRequest = StudentProfileEntryChangeRequest[];

export const defaultStudentProfileChangeRequest: StudentProfileChangeRequest = [
  defaultStudentProfileEntryChangeRequest,
];

export interface AccountRolesUpdateRequest {
  roles: string[];
}

export const defaultAccountRolesUpdateRequest: AccountRolesUpdateRequest = {
  roles: [],
};

export interface AccountPasswordUpdateRequest {
  newPassword: string;
}

export const defaultAccountPasswordUpdateRequest: AccountPasswordUpdateRequest =
  {
    newPassword: '',
  };

export interface AccountUpdateRequest {
  email?: string;
  phone?: string;
}

export const defaultAccountUpdateRequest: AccountUpdateRequest = {};

export interface TeacherUpdateRequest {
  name?: string;
  sex?: Sex;
  birth?: string;
  idno?: string;
  phone?: string;
  department?: string;
  position?: string;
  userId?: number;
}

export const defaultTeacherUpdateRequest: TeacherUpdateRequest = {};

export interface StudentUpdateRequest {
  name?: string;
  sex?: Sex;
  birth?: string;
  disorderType?: string;
  idno?: string;
  userId?: number;
}

export const defaultStudentUpdateRequest: StudentUpdateRequest = {};

export interface AvailableTeacherFetchingRequest {
  dayOfWeek: DayOfWeek;
  hourFrom: number;
  minuteFrom: number;
  hourTo: number;
  minuteTo: number;
  dateFrom: string;
  dateTo: string;
  tolerance?: number;
}

export const defaultAvailableTeacherFetchingRequest: AvailableTeacherFetchingRequest =
  {
    dayOfWeek: 'MONDAY',
    hourFrom: 0,
    minuteFrom: 0,
    hourTo: 0,
    minuteTo: 0,
    dateFrom: '1900-01-01',
    dateTo: '1900-01-01',
    tolerance: 0,
  };

export interface AvailableStudentFetchingRequest {
  dayOfWeek: DayOfWeek;
  hourFrom: number;
  minuteFrom: number;
  hourTo: number;
  minuteTo: number;
  dateFrom: string;
  dateTo: string;
  tolerance?: number;
}

export const defaultAvailableStudentFetchingRequest: AvailableStudentFetchingRequest =
  {
    dayOfWeek: 'MONDAY',
    hourFrom: 0,
    minuteFrom: 0,
    hourTo: 0,
    minuteTo: 0,
    dateFrom: '1900-01-01',
    dateTo: '1900-01-01',
    tolerance: 0,
  };

interface CommonProfileSchemaEntryRaw {
  id: number;
  name: string;
  type: string;
  required: boolean;
  sortOrder: number;
  description: string;
}

type StudentProfileSchemaEntryRaw = CommonProfileSchemaEntryRaw;

type TeacherProfileSchemaEntryRaw = CommonProfileSchemaEntryRaw;

type StudentProfileSchemaRaw = StudentProfileSchemaEntryRaw[];

type TeacherProfileSchemaRaw = TeacherProfileSchemaEntryRaw[];

interface CommonProfileEntryRaw {
  id: number;
  schemaEntry: CommonProfileSchemaEntryRaw;
  value: string;
}

type StudentProfileEntryRaw = CommonProfileEntryRaw;

type TeacherProfileEntryRaw = CommonProfileEntryRaw;

type StudentProfileRaw = StudentProfileEntryRaw[];

type TeacherProfileRaw = TeacherProfileEntryRaw[];

/**
 * 将字符串解析为CommonProfileSchemaEntryType
 *
 * 如果type是literal string形式的CommonProfileSchemaEntryType，则直接返回；
 * 如果type是JSON形式的CommonProfileSchemaEntryType，且解析后的结果是string数组，则返回解析后的结果；
 * 否则抛出异常
 * @throws {TypeError} type不属于literal string形式的CommonProfileSchemaEntryType，且JSON解析后的结果不是string数组
 * @param type
 */
const parseProfileSchemaEntryType = (
  type: string,
): { type: Account.CommonProfileSchemaEntry['type']; isArray: boolean } => {
  const isArray = type.startsWith('[]');
  const typeWithoutArray = isArray ? type.slice(2) : type;

  // 如果 type 是 literal string 形式的 CommonProfileSchemaEntryType，则直接返回
  if (isStringLiteralCommonProfileSchemaEntryType(typeWithoutArray)) {
    return {
      type: typeWithoutArray,
      isArray,
    };
  }

  let result: any;
  try {
    result = JSON.parse(typeWithoutArray);
  } catch (e) {
    throw new TypeError(
      `Invalid profile schema entry type: ${typeWithoutArray}`,
    );
  }

  // 校验result是否是string数组
  if (
    !Array.isArray(result) ||
    !result.every((item) => typeof item === 'string')
  ) {
    throw new TypeError(
      `Invalid profile schema entry type: ${typeWithoutArray}`,
    );
  }

  return {
    type: result,
    isArray,
  };
};

/**
 * 解析 CommonProfileEntry
 *
 * 如果 schemaEntry.type 是 "pic" 或 "file"，则将 value 解析为 Blob；
 * 如果 schemaEntry.type 是 "number"，则将 value 解析为 number；
 * 如果 schemaEntry.type 是 "boolean"，则将 value 解析为 boolean；
 * 否则，将 value 解析为 string
 *
 * **注意:** 该接口会在解析 profileEntry 前先尝试解析 schemaEntry，若 schemaEntry 解析失败，则会抛出异常。
 * 此外，解析 profileEntry 时，会对 value 根据 schemaEntry.type 进行校验，若校验失败，则会抛出异常。
 * @throws {TypeError} schemaEntry 解析失败或 value 校验失败
 * @param entry
 */
const parseProfileEntry = async (
  entry: CommonProfileEntryRaw,
): Promise<Account.CommonProfileEntry> => {
  // 解析 schemaEntry
  const { schemaEntry: schemaEntryRaw } = entry;
  const schemaEntry: Account.CommonProfileSchemaEntry = {
    ...schemaEntryRaw,
    ...parseProfileSchemaEntryType(schemaEntryRaw.type),
  };

  /**
   * 根据 schemaEntry.type 解析 value
   * @param type
   * @param value
   */
  const parseValue = async (
    type: Account.CommonProfileSchemaEntry['type'],
    value: string,
  ) => {
    switch (type) {
      case 'pic':
      case 'file':
        // 如果 type 是 "pic" 或 "file"，则认为 value 是文件路径，并尝试下载文件
        // 校验 value 是否是合法的文件路径
        if (!/\./.test(value)) {
          throw new TypeError(
            `Invalid profile entry value: ${value} (expected file pathname)`,
          );
        }
        return await fileApi.downloadFile(value);
      case 'number':
        // 如果 type 是 "number"，则将 value 解析为 number
        // 如果 value 无法正常解析成 number，则抛出异常
        if (Number.isNaN(Number.parseFloat(value))) {
          throw new TypeError(
            `Invalid profile entry value: ${value} (expected number)`,
          );
        }
        return Number.parseFloat(value);
      case 'boolean':
        // 如果 type 是 "boolean"，则将 value 解析为 boolean
        // 如果 value 无法正常解析成 boolean，则抛出异常
        if (value !== 'true' && value !== 'false') {
          throw new TypeError(
            `Invalid profile entry value: ${value} (expected boolean)`,
          );
        }
        return value === 'true';
      default:
        // 如果 type 是 "text"、"datetime"、"date"、"time" 或 string 数组，则直接返回
        // 对于 datetime、date、time，校验 value 是否是合法的日期字符串
        switch (type) {
          case 'datetime':
            if (
              !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value) &&
              dayjs(value).isValid()
            ) {
              throw new TypeError(
                `Invalid profile entry value: ${value} (expected datetime)`,
              );
            }
            break;
          case 'date':
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value) && dayjs(value).isValid()) {
              throw new TypeError(
                `Invalid profile entry value: ${value} (expected date)`,
              );
            }
            break;
          case 'time':
            if (!/^\d{2}:\d{2}:\d{2}$/.test(value) && dayjs(value).isValid()) {
              throw new TypeError(
                `Invalid profile entry value: ${value} (expected time)`,
              );
            }
        }
        // 对于 type 是 string 数组，校验 value 是否是合法的选项
        if (Array.isArray(type)) {
          if (!type.includes(value)) {
            throw new TypeError(
              `Invalid profile entry value: ${value} (expected one of ${type.join(
                ', ',
              )})`,
            );
          }
        }
        return value;
    }
  };

  return {
    id: entry.id,
    schemaEntry,
    value: schemaEntry.isArray
      ? await (JSON.parse(entry.value) as string[])
          .map((value) => parseValue(schemaEntry.type, value))
          .reduce(
            (acc, promise) =>
              acc.then((results) =>
                promise.then((result) => [...results, result]),
              ),
            Promise.resolve([] as Array<Blob | string | number | boolean>),
          )
      : await parseValue(schemaEntry.type, entry.value),
  } as Account.CommonProfileEntry;
};

const accountApi = {
  /**
   * 获取教师的 ProfileSchema
   *
   * 对于每一个 entry，如果 type 是 "pic"、"file"、"text"、"number"、"boolean"、"datetime"、"date"、"time" 之一，则直接返回；
   * 否则，将 type 当作 JSON 形式的字符串数组解析后返回，如 '["a", "b"]' 将被解析为数组为 ['a', 'b']。**如果解析失败，则抛出异常**
   * @throws {Error} 无法解析 entry.type
   */
  async getTeacherProfileSchema(): Promise<Account.TeacherProfileSchema> {
    const response = await request<TeacherProfileSchemaRaw>(
      '/api/teachers/profile-schema',
      { method: 'GET' },
    );

    return response.map((entry) => ({
      ...entry,
      ...parseProfileSchemaEntryType(entry.type),
    }));
  },

  /**
   * 获取学生的ProfileSchema
   *
   * 对于每一个 entry，如果 type 是 "pic"、"file"、"text"、"number"、"boolean"、"datetime"、"date"、"time" 之一，则直接返回；
   * 否则，将 type 当作 JSON 形式的字符串数组解析后返回，如 '["a", "b"]' 将被解析为数组为 ['a', 'b']。**如果解析失败，则抛出异常**
   * @throws {Error} 无法解析 entry.type
   */
  async getStudentProfileSchema(): Promise<Account.StudentProfileSchema> {
    const response = await request<StudentProfileSchemaRaw>(
      '/api/students/profile-schema',
      { method: 'GET' },
    );

    return response.map((entry) => ({
      ...entry,
      ...parseProfileSchemaEntryType(entry.type),
    }));
  },

  getAllAccounts() {
    return request<Account.AccountInfo[]>('/api/users', { method: 'GET' });
  },

  getAllTeachers() {
    return request<Account.TeacherInfo[]>('/api/teachers', { method: 'GET' });
  },

  getAllStudents() {
    return request<Account.StudentInfo[]>('/api/students', { method: 'GET' });
  },

  getAccount(id: number) {
    return request<Account.AccountInfo>(`/api/user/${id}`, { method: 'GET' });
  },

  getCurrentAccount() {
    return request<Account.AccountInfo>('/api/user/me', { method: 'GET' });
  },

  getAccountBoundInfo(id: number) {
    return request<Account.AccountBoundInfo>(`/api/user/${id}/bound`, {
      method: 'GET',
    });
  },

  getAccountFiles(id: number) {
    return request<File.FileInfo[]>(`/api/user/${id}/files`, { method: 'GET' });
  },

  getAccountSingularPermissions(id: number) {
    return request<string[]>(`/api/user/${id}/singular-permissions`, {
      method: 'GET',
    });
  },

  getTeacher(id: number) {
    return request<Account.TeacherInfo>(`/api/teacher/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 获取教师的 Profile
   *
   * 对于每一个 entry，如果 schemaEntry.type 是 "pic" 或 "file"，则将 entry.value 当作文件路径解析成 Blob 对象；
   * 如果 schemaEntry.type 是 "number"，则将 entry.value 当作数字解析；
   * 如果 schemaEntry.type 是 "boolean"，则将 entry.value 当作布尔值解析；
   * 如果 schemaEntry.type 是 "datetime"、"date"、"time"、"text" 或 string[]，则直接返回
   *
   * **注意:** 该接口会首先解析 schemaEntry，然后根据 schemaEntry 对每一个 entry 的 value 进行校验。
   * 解析 schema 失败或校验失败时，将抛出异常
   * @throws {TypeError} 无法解析 schema 或校验 entry.value 失败
   * @param id 教师ID
   */
  async getTeacherProfile(id: number): Promise<Account.TeacherProfile> {
    const profileRaw = await request<TeacherProfileRaw>(
      `/api/teacher/${id}/profile`,
      {
        method: 'GET',
      },
    );

    return await Promise.all(profileRaw.map(parseProfileEntry));
  },

  getTeacherClasses(id: number) {
    return request<Course.ClassInfo[]>(`/api/teacher/${id}/classes`, {
      method: 'GET',
    });
  },

  getTeacherCourses(id: number, startDate?: string, endDate?: string) {
    return request<Course.CourseInfo[]>(`/api/teacher/${id}/courses`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  getTeacherLessons(id: number, startDate?: string, endDate?: string) {
    return request<Course.LessonInfo[]>(`/api/teacher/${id}/lessons`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  getStudent(id: number) {
    return request<Account.StudentInfo>(`/api/student/${id}`, {
      method: 'GET',
    });
  },

  /**
   * 获取学生的 Profile
   *
   * 对于每一个 entry，如果 schemaEntry.type 是 "pic" 或 "file"，则将 entry.value 当作文件路径解析成 Blob 对象；
   * 如果 schemaEntry.type 是 "number"，则将 entry.value 当作数字解析；
   * 如果 schemaEntry.type 是 "boolean"，则将 entry.value 当作布尔值解析；
   * 如果 schemaEntry.type 是 "datetime"、"date"、"time"、"text" 或 string[]，则直接返回
   *
   * **注意:** 该接口会首先解析 schemaEntry，然后根据 schemaEntry 对每一个 entry 的 value 进行校验。
   * 解析 schema 失败或校验失败时，将抛出异常
   * @throws {TypeError} 无法解析 schema 或校验 entry.value 失败
   * @param id 学生 ID
   */
  async getStudentProfile(id: number): Promise<Account.StudentProfile> {
    const profileRaw = await request<StudentProfileRaw>(
      `/api/student/${id}/profile`,
      {
        method: 'GET',
      },
    );

    return await Promise.all(profileRaw.map(parseProfileEntry));
  },

  getStudentParent(studentId: number, parentId: number) {
    return request<Account.ParentInfo>(
      `/api/student/${studentId}/parent/${parentId}`,
      { method: 'GET' },
    );
  },

  getStudentParents(id: number) {
    return request<Account.ParentInfo[]>(`/api/student/${id}/parents`, {
      method: 'GET',
    });
  },

  getStudentClasses(id: number) {
    return request<Course.ClassInfo[]>(`/api/student/${id}/classes`, {
      method: 'GET',
    });
  },

  getStudentCourses(id: number, startDate?: string, endDate?: string) {
    return request<Course.CourseInfo[]>(`/api/student/${id}/courses`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  getStudentCourseGroups(id: number, startDate?: string, endDate?: string) {
    return request<Course.CourseGroupInfo[]>(
      `/api/student/${id}/course-groups`,
      {
        method: 'GET',
        params: { startDate, endDate },
      },
    );
  },

  getStudentLessons(id: number, startDate?: string, endDate?: string) {
    return request<Course.LessonInfo[]>(`/api/student/${id}/lessons`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  async getStudentAttendance(id: number, startDate?: string, endDate?: string) {
    return await request<Course.AttendanceRecord[]>(
      `/api/student/${id}/attendance`,
      {
        method: 'GET',
        params: { startDate, endDate },
      },
    );
  },

  async getStudentTransactions(id: number) {
    return await request<Payment.TransactionInfo[]>(
      `/api/student/${id}/transactions`,
      {
        method: 'GET',
      },
    );
  },

  async getStudentPayments(id: number) {
    return await request<Payment.PaymentInfo[]>(`/api/student/${id}/payments`, {
      method: 'GET',
    });
  },

  async getStudentRefunds(id: number) {
    return await request<Payment.RefundInfo[]>(`/api/student/${id}/refunds`, {
      method: 'GET',
    });
  },

  createAccount(data: AccountCreationRequest) {
    return request<Account.AccountInfo>('/api/user', { method: 'POST', data });
  },

  createTeacher(data: TeacherCreationRequest) {
    return request<Account.TeacherInfo>('/api/teacher', {
      method: 'POST',
      data,
    });
  },

  createStudent(data: StudentCreationRequest) {
    return request<Account.StudentInfo>('/api/student', {
      method: 'POST',
      data,
    });
  },

  changeAccountRoutes(id: number, routes: string[]) {
    return request<''>(`/api/user/${id}/routes`, {
      method: 'PUT',
      data: routes,
    });
  },

  changeAccountStatus(id: number, status: Account.AccountStatus) {
    return request<''>(`/api/user/${id}/status`, {
      method: 'PUT',
      data: status,
    });
  },

  changeAccountSingularPermissions(id: number, permissionNames: string[]) {
    return request<''>(`/api/user/${id}/singular-permissions`, {
      method: 'PUT',
      data: permissionNames,
    });
  },

  changeTeacherProfileSchema(data: Account.TeacherProfileSchema) {
    return request<''>('/api/teachers/profile-schema', {
      method: 'PUT',
      data: data.map((entry) => ({
        ...entry,
        type: `${entry.isArray ? '[]' : ''}${
          typeof entry.type === 'string'
            ? entry.type
            : JSON.stringify(entry.type)
        }`,
      })),
    });
  },

  changeStudentProfileSchema(data: Account.StudentProfileSchema) {
    return request<''>('/api/students/profile-schema', {
      method: 'PUT',
      data: data.map((entry) => ({
        ...entry,
        type: `${entry.isArray ? '[]' : ''}${
          typeof entry.type === 'string'
            ? entry.type
            : JSON.stringify(entry.type)
        }`,
      })),
    });
  },

  /**
   * 修改教师 Profile
   *
   * 对于对应 schemaEntry 的 type 是 "file" 或 "pic" 的 entry，value 应该是一个 **File** 对象（注意不是 Blob 对象）；
   * 对于对应 schemaEntry 的 type 是 "number" 的 entry，value 应该是一个 Number 对象；
   * 对于对应 schemaEntry 的 type 是 "boolean" 的 entry，value 应该是一个 Boolean 对象；
   * 对于对应 schemaEntry 的 type 是 "text"、"datetime"、"date"、"time"、string[] 的 entry，value 应该是一个 String 对象；
   * 如果不需要更新某一个 entry 的 value，将该 entry 的 value 设置为 null；
   *
   * **注意:** 如果某个 entry 的 value 是 null/undefined，但是在 profileRaw 中没有找到对应的 entry（即新增的entry），则抛出异常
   *
   * **注意:** 该接口**不会**根据 schemaEntry 对 value 进行类型校验，因此如果 value 的类型与 schemaEntry 的 type 不匹配，后果自负。
   * 建议在调用该接口前先使用 src/utils/validation 中的 validateProfileEntry 函数对每个 entry 逐一进行类型检查
   * @throws {Error} 某个 entry的value是null/undefined，且在 profileRaw 中没有找到对应的 entry
   * @param id 教师 ID
   * @param data 修改请求
   */
  async changeTeacherProfile(id: number, data: TeacherProfileChangeRequest) {
    // 获取原始的 profile，以供 value 为 null 的 entry 更新
    const profileRaw = await request<TeacherProfileRaw>(
      `/api/teacher/${id}/profile`,
      {
        method: 'GET',
      },
    );

    // 如果某个 entry 的 value 是 null/undefined，但是在 profileRaw 中没有找到对应的 entry（即新增的 entry），则抛出异常
    for (const entry of data) {
      if (entry.value === null) {
        if (!profileRaw.find((e) => e.schemaEntry.id === entry.schemaEntryId)) {
          throw new Error(
            `Entry with id ${entry.schemaEntryId} does not exist in profile`,
          );
        }
      }
    }

    // 更新 profile
    return await request<''>(`/api/teacher/${id}/profile`, {
      method: 'PUT',
      data: await Promise.all(
        data.map(async (entry) => {
          let value: any;
          if (Array.isArray(entry.value)) {
            if (
              entry.value.length > 0 &&
              entry.value.every((v) => v instanceof File)
            ) {
              // 如果是 File 数组，则依次上传文件，并将 value 设置为文件路径数组
              value = [];
              for (const [index, v] of entry.value.entries()) {
                await fileApi.uploadFile(
                  `/TeacherProfile/${entry.schemaEntryId}`,
                  v as File,
                  {
                    overwrite: 'DIFFERENT_EXTENSION',
                    filename: `${id}-${index}`,
                  },
                );
                value.push(
                  `/TeacherProfile/${entry.schemaEntryId}/${id}-${index}.${(
                    v as File
                  ).name
                    .split('.')
                    .pop()}`,
                );
              }
            } else {
              // 如果不是 File 数组，则将每个元素先转为字符串，再使用 JSON.stringify 转为字符串
              value = JSON.stringify(entry.value.map((v) => v.toString()));
            }
          } else if (entry.value instanceof File) {
            // 如果 entry 的 value 是 File 类型，则上传文件，并将 value 设置为文件路径
            await fileApi.uploadFile(
              `/TeacherProfile/${entry.schemaEntryId}`,
              entry.value,
              {
                overwrite: 'DIFFERENT_EXTENSION',
                filename: `${id}`,
              },
            );
            value = `/TeacherProfile/${
              entry.schemaEntryId
            }/${id}.${entry.value.name.split('.').pop()}`;
          } else if (entry.value !== null && entry.value !== undefined) {
            // 如果 entry 的 value 不是 File 类型，且非 null/undefined，则直接使用 value.toString()
            value = entry.value?.toString();
          } else {
            // 如果 entry 的 value 是 null/undefined，则从 profileRaw 中找到对应的 entry，并使用其 value
            value = profileRaw.find(
              (e) => e.schemaEntry.id === entry.schemaEntryId,
            )!.value;
          }

          return { ...entry, value };
        }),
      ),
    });
  },

  /**
   * 修改学生 Profile
   *
   * 对于对应 schemaEntry 的 type 是 "file" 或 "pic" 的 entry，value 应该是一个 **File** 对象（注意不是 Blob 对象）；
   * 对于对应 schemaEntry 的 type 是 "number" 的 entry，value 应该是一个 Number 对象；
   * 对于对应 schemaEntry 的 type 是 "boolean" 的 entry，value 应该是一个 Boolean 对象；
   * 对于对应 schemaEntry 的 type 是 "text"、"datetime"、"date"、"time"、string[] 的 entry，value 应该是一个 String 对象；
   * 如果不需要更新某一个 entry 的 value，将该 entry 的 value 设置为 null；
   *
   * **注意:** 如果某个 entry 的 value 是 null/undefined，但是在 profileRaw 中没有找到对应的 entry（即新增的entry），则抛出异常
   *
   * **注意:** 该接口**不会**根据 schemaEntry 对 value 进行类型校验，因此如果 value 的类型与 schemaEntry 的 type 不匹配，后果自负。
   * 建议在调用该接口前先使用 src/utils/validation 中的 validateProfileEntry 函数对每个 entry 逐一进行类型检查
   * @throws {Error} 某个 entry的value是null/undefined，且在 profileRaw 中没有找到对应的 entry
   * @param id 学生 ID
   * @param data 修改请求
   */
  async changeStudentProfile(id: number, data: StudentProfileChangeRequest) {
    // 获取原始的 profile，以供 value 为 null 的 entry 更新
    const profileRaw = await request<StudentProfileRaw>(
      `/api/student/${id}/profile`,
      {
        method: 'GET',
      },
    );

    // 如果某个 entry 的 value 是 null/undefined，但是在 profileRaw 中没有找到对应的 entry（即新增的 entry），则抛出异常
    for (const entry of data) {
      if (entry.value === null) {
        if (!profileRaw.find((e) => e.schemaEntry.id === entry.schemaEntryId)) {
          throw new Error(
            `Entry with id ${entry.schemaEntryId} does not exist in profile`,
          );
        }
      }
    }

    // 更新 profile
    return await request<''>(`/api/student/${id}/profile`, {
      method: 'PUT',
      data: await Promise.all(
        data.map(async (entry) => {
          let value: any;
          if (Array.isArray(entry.value)) {
            if (
              entry.value.length > 0 &&
              entry.value.every((v) => v instanceof File)
            ) {
              // 如果是 File 数组，则依次上传文件，并将 value 设置为文件路径数组
              value = [];
              for (const [index, v] of entry.value.entries()) {
                await fileApi.uploadFile(
                  `/StudentProfile/${entry.schemaEntryId}`,
                  v as File,
                  {
                    overwrite: 'DIFFERENT_EXTENSION',
                    filename: `${id}-${index}`,
                  },
                );
                value.push(
                  `/StudentProfile/${entry.schemaEntryId}/${id}-${index}.${(
                    v as File
                  ).name
                    .split('.')
                    .pop()}`,
                );
              }
            } else {
              // 如果不是 File 数组，则将每个元素先转为字符串，再使用 JSON.stringify 转为字符串
              value = JSON.stringify(entry.value.map((v) => v.toString()));
            }
          } else if (entry.value instanceof File) {
            // 如果 entry 的 value 是 File 类型，则上传文件，并将 value 设置为文件路径
            await fileApi.uploadFile(
              `/StudentProfile/${entry.schemaEntryId}`,
              entry.value,
              {
                overwrite: 'DIFFERENT_EXTENSION',
                filename: `${id}`,
              },
            );
            value = `/StudentProfile/${
              entry.schemaEntryId
            }/${id}.${entry.value.name.split('.').pop()}`;
          } else if (entry.value !== null && entry.value !== undefined) {
            // 如果 entry 的 value 不是 File 类型，且非 null/undefined，则直接使用 value.toString()
            value = entry.value.toString();
          } else {
            // 如果 entry 的 value 是 null/undefined，则从 profileRaw 中找到对应的 entry，并使用其 value
            value = profileRaw.find(
              (e) => e.schemaEntry.id === entry.schemaEntryId,
            )!.value;
          }

          return { ...entry, value };
        }),
      ),
    });
  },

  updateAccountRoles(id: number, data: AccountRolesUpdateRequest) {
    return request<''>(`/api/user/${id}/roles`, { method: 'PUT', data });
  },

  updateAccountPassword(id: number, data: AccountPasswordUpdateRequest) {
    return request<''>(`/api/user/${id}/password`, { method: 'PUT', data });
  },

  updateAccount(id: number, data: AccountUpdateRequest) {
    return request<Account.AccountInfo>(`/api/user/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  updateTeacher(id: number, data: TeacherUpdateRequest) {
    return request<Account.TeacherInfo>(`/api/teacher/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  updateStudent(id: number, data: StudentUpdateRequest) {
    return request<Account.StudentInfo>(`/api/student/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  deleteAccount(id: number) {
    return request<''>(`/api/user/${id}`, { method: 'DELETE' });
  },

  deleteTeacher(id: number) {
    return request<''>(`/api/teacher/${id}`, { method: 'DELETE' });
  },

  deleteStudent(id: number) {
    return request<''>(`/api/student/${id}`, { method: 'DELETE' });
  },

  deleteStudentParent(studentId: number, parentId: number) {
    return request<''>(`/api/student/${studentId}/parent/${parentId}`, {
      method: 'DELETE',
    });
  },

  getAvailableTeachers(params: AvailableTeacherFetchingRequest) {
    return request<Account.TeacherWithConflictLessonsInfo[]>(
      '/api/available-teachers',
      { method: 'GET', params },
    );
  },

  getAvailableStudents(params: AvailableStudentFetchingRequest) {
    return request<Account.StudentWithConflictLessonsInfo[]>(
      '/api/available-students',
      { method: 'GET', params },
    );
  },
};

export default accountApi;
