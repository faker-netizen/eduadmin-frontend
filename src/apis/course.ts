import { generateEndDateByDaysAndTimesAndCount } from '@/utils/time';
import { request } from '@umijs/max';
import dayjs from 'dayjs';

export interface ClassroomCreationRequest {
  name: string;
}

export const defaultClassroomCreationRequest: ClassroomCreationRequest = {
  name: '',
};

export interface ClassCreationRequest {
  name: string;
  labels: string[];
  maxMember: number;
  startDate: string;
  endDate: string;
  description: string;
  adviserId: number;
  teacherIds: number[];
  studentIds: number[];
}

export const defaultClassCreationRequest: ClassCreationRequest = {
  name: '',
  labels: [],
  maxMember: 0,
  startDate: '1900-01-01',
  endDate: '1900-01-01',
  description: '',
  adviserId: 0,
  teacherIds: [],
  studentIds: [],
};

export interface CourseCreationRequest {
  name: string;
  category: Course.CourseCategory;
  labels: string[];
  classroom: string;
  startDate: string;
  endDate: string;
  description: string;
  maxMember: number;
  times: Course.CourseTime[];
  teacherIds: number[];
  clazzId?: number;
}

export const defaultCourseCreationRequest: CourseCreationRequest = {
  name: '',
  category: 'ACCOMPANIED_GROUP',
  labels: [],
  classroom: '',
  startDate: '1900-01-01',
  endDate: '1900-01-01',
  description: '',
  maxMember: 1,
  times: [],
  teacherIds: [],
};

export interface CourseModelCreationRequest {
  name: string;
  description: string;
  monthlyPrice: number;
  unitPrice: number;
  billingMethod?: Course.BillingMethod;
  details: CourseModelDetailCreationRequest[];
}

export const defaultCourseModelCreationRequest: CourseModelCreationRequest = {
  name: '',
  description: '',
  monthlyPrice: 0,
  unitPrice: 0,
  billingMethod: 'BY_MONTH',
  details: [],
};

export interface CourseModelDetailCreationRequest {
  category: Course.CourseCategory | 'ALL';
  labels: string[];
  duration: number;
  amount: number;
}

export const defaultCourseModelDetailCreationRequest: CourseModelDetailCreationRequest =
  {
    category: 'ALL',
    labels: [],
    duration: -1,
    amount: -1,
  };

export interface CourseGroupCreationRequest {
  studentId: number;
  courseModelId: number;
  courseIds: number[];
  startDateTime?: string;
  endDateTime?: string;
}

export const defaultCourseGroupCreationRequest: CourseGroupCreationRequest = {
  studentId: 0,
  courseModelId: 0,
  courseIds: [],
};

export interface LessonCreationRequest {
  courseId: number;
  startDateTime: string;
  endDateTime: string;
  status?: Course.LessonStatus;
  classroom?: string;
  teacherIds?: number[];
  studentIds?: number[];
  relatedLessonId?: number;
}

export const defaultLessonCreationRequest: LessonCreationRequest = {
  courseId: 0,
  startDateTime: '1900-01-01T00:00:00.000Z',
  endDateTime: '1900-01-01T00:00:00.000Z',
};

export interface CourseGroupStatusChangeRequest {
  status: 'NORMAL' | 'CANCELLED';
}

export const defaultCourseGroupStatusChangeRequest: CourseGroupStatusChangeRequest =
  {
    status: 'NORMAL',
  };

export interface ClassroomUpdateRequest {
  name?: string;
}

export const defaultClassroomUpdateRequest: ClassroomUpdateRequest = {};

export interface ClassUpdateRequest {
  name?: string;
  maxMember?: number;
  startDate?: string;
  endDate?: string;
  labels?: string[];
  description?: string;
  adviserId?: number;
  teacherIds?: number[];
  studentIds?: number[];
}

export const defaultClassUpdateRequest: ClassUpdateRequest = {};

export interface CourseUpdateRequest {
  name?: string;
  classroom?: string;
  startDate?: string;
  endDate?: string;
  labels?: string[];
  description?: string;
  teacherIds?: number[];
}

export const defaultCourseUpdateRequest: CourseUpdateRequest = {};

export interface CourseTimeUpdateRequest {
  times: Course.CourseTime[];
}

export const defaultCourseTimeUpdateRequest: CourseTimeUpdateRequest = {
  times: [],
};

export interface CourseGroupUpdateRequest {
  startDateTime?: string;
  endDateTime?: string;
}

export const defaultCourseGroupUpdateRequest: CourseGroupUpdateRequest = {};

export interface CourseGroupCoursesUpdateRequest {
  courseIds: number[];
}

export const defaultCourseGroupCoursesUpdateRequest: CourseGroupCoursesUpdateRequest =
  {
    courseIds: [],
  };

export interface LessonUpdateRequest {
  startDateTime?: string;
  endDateTime?: string;
  status?: Course.LessonStatus;
  note?: string;
  classroom?: string;
  teacherIds?: number[];
  studentIds?: number[];
  extraStudentIds?: number[];
  relatedLessonId?: number;
  isLateConfirmed?: boolean;
  attendanceConfirmingTeacherId?: number;
}

export const defaultLessonUpdateRequest: LessonUpdateRequest = {};

const courseApi = {
  getAllClassrooms() {
    return request<Course.ClassroomInfo[]>('/api/classrooms', {
      method: 'GET',
    });
  },

  getAllClasses() {
    return request<Course.ClassInfo[]>('/api/classes', { method: 'GET' });
  },

  getAllCourses() {
    return request<Course.CourseInfo[]>('/api/courses', { method: 'GET' });
  },

  getAllCourseModels() {
    return request<Course.CourseModelInfo[]>('/api/course-models', {
      method: 'GET',
    });
  },

  getAllCourseGroups() {
    return request<Course.CourseGroupInfo[]>('/api/course-groups', {
      method: 'GET',
    });
  },

  getAllLessons() {
    return request<Course.LessonInfo[]>('/api/lessons', { method: 'GET' });
  },

  getClassCourses(id: number, startDate?: string, endDate?: string) {
    return request<Course.CourseInfo[]>(`/api/class/${id}/courses`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  getClassLessons(id: number, startDate?: string, endDate?: string) {
    return request<Course.LessonInfo[]>(`/api/class/${id}/lessons`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  getCourseLessons(id: number, startDate?: string, endDate?: string) {
    return request<Course.LessonInfo[]>(`/api/course/${id}/lessons`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  /**
   * 如Course所有type为MONTHLY的courseTime都在给定的month中已安排了对应的lesson，
   * 则该course的status为SCHEDULED，否则为UNSCHEDULED
   * （对于type为WEEKLY的courseTime，则始终为SCHEDULED）
   * @param id
   * @param month
   */
  getCourseStatus(id: number, month: Month) {
    return request<Course.CourseStatus>(`/api/course/${id}/status`, {
      method: 'GET',
      params: { month },
    });
  },

  getClassroom(id: number) {
    return request<Course.ClassroomInfo>(`/api/classroom/${id}`, {
      method: 'GET',
    });
  },

  async getClassroomLessons(id: number, startDate?: string, endDate?: string) {
    return await request<Course.LessonInfo[]>(`/api/classroom/${id}/lessons`, {
      method: 'GET',
      params: { startDate, endDate },
    });
  },

  getClass(id: number) {
    return request<Course.ClassInfo>(`/api/class/${id}`, { method: 'GET' });
  },

  getCourse(id: number) {
    return request<Course.CourseInfo>(`/api/course/${id}`, {
      method: 'GET',
    });
  },

  getCourseLabels() {
    return request<string[]>(`/api/course/labels`, { method: 'GET' });
  },

  getCourseModel(id: number) {
    return request<Course.CourseModelInfo>(`/api/course-model/${id}`, {
      method: 'GET',
    });
  },

  getCourseGroup(id: number) {
    return request<Course.CourseGroupInfo>(`/api/course-group/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Get the monthly bill of a course group (only for admin and the owner of the course group).
   *
   * If the course group is not active, 400 is returned.
   * @param id The id of the course group.
   */
  getCourseGroupBill(id: number) {
    return request<Course.CourseGroupMonthlyBill>(
      `/api/course-group/${id}/bill`,
      { method: 'GET' },
    );
  },

  getLesson(id: number) {
    return request<Course.LessonInfo>(`/api/lesson/${id}`, { method: 'GET' });
  },

  createClassroom(data: ClassroomCreationRequest) {
    return request<Course.ClassroomInfo>('/api/classroom', {
      method: 'POST',
      data,
    });
  },

  createClass(data: ClassCreationRequest) {
    return request<Course.ClassInfo>('/api/class', { method: 'POST', data });
  },

  createCourse(data: CourseCreationRequest) {
    return request<Course.CourseInfo>('/api/course', { method: 'POST', data });
  },

  /**
   * 根据指定 Lesson 数量自动创建 Course（endDate 无需提供，根据 count 与 courseTime 自动计算）
   * @param data CourseCreationRequest 中除了 endDate 之外的所有字段（如提供 endDate 则会被忽略）
   * @param count 课程数量
   * @returns
   */
  createCourseWithLessonCount(
    data: Omit<CourseCreationRequest, 'endDate'>,
    count: number,
  ) {
    // 根据 count 与 courseTime 生成 endDate
    const { startDate, times } = data;
    const endDate = generateEndDateByDaysAndTimesAndCount(
      dayjs(startDate),
      times.map((t) => t.dayOfWeek),
      count,
    );

    return request<Course.CourseInfo>('/api/course', {
      method: 'POST',
      data: { ...data, endDate: endDate.format('YYYY-MM-DD') },
    });
  },

  createCourseModel(data: CourseModelCreationRequest) {
    return request<Course.CourseModelInfo>('/api/course-model', {
      method: 'POST',
      data,
    });
  },

  createCourseGroup(data: CourseGroupCreationRequest) {
    return request<Course.CourseGroupInfo>('/api/course-group', {
      method: 'POST',
      data,
    });
  },

  createLesson(data: LessonCreationRequest) {
    return request<Course.LessonInfo>('/api/lesson', { method: 'POST', data });
  },

  async changeCourseGroupStatus(
    id: number,
    data: CourseGroupStatusChangeRequest,
  ) {
    return await request<''>(`/api/course-group/${id}/status`, {
      method: 'PUT',
      data,
    });
  },

  updateClassroom(id: number, data: ClassroomUpdateRequest) {
    return request<Course.ClassroomInfo>(`/api/classroom/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  updateClass(id: number, data: ClassUpdateRequest) {
    return request<Course.ClassInfo>(`/api/class/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  updateCourse(id: number, data: CourseUpdateRequest) {
    return request<Course.CourseInfo>(`/api/course/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  async updateCourseGroup(id: number, data: CourseGroupUpdateRequest) {
    return await request<Course.CourseGroupInfo>(`/api/course-group/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  updateCourseGroupCourses(id: number, data: CourseGroupCoursesUpdateRequest) {
    return request<Course.CourseGroupInfo>(`/api/course-group/${id}/courses`, {
      method: 'PUT',
      data,
    });
  },

  updateCourseTime(id: number, data: CourseTimeUpdateRequest) {
    return request<''>(`/api/course/${id}/times`, { method: 'PUT', data });
  },

  updateLesson(id: number, data: LessonUpdateRequest) {
    return request<Course.LessonInfo>(`/api/lesson/${id}`, {
      method: 'PATCH',
      data,
    });
  },

  deleteClassroom(id: number) {
    return request<''>(`/api/classroom/${id}`, { method: 'DELETE' });
  },

  deleteClass(id: number) {
    return request<''>(`/api/class/${id}`, { method: 'DELETE' });
  },

  deleteCourse(id: number) {
    return request<''>(`/api/course/${id}`, { method: 'DELETE' });
  },

  deleteCourseModel(id: number) {
    return request<''>(`/api/course-model/${id}`, { method: 'DELETE' });
  },

  deleteCourseGroup(id: number) {
    return request<''>(`/api/course-group/${id}`, { method: 'DELETE' });
  },

  deleteLesson(id: number) {
    return request<''>(`/api/lesson/${id}`, { method: 'DELETE' });
  },
};

export default courseApi;
