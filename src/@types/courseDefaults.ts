import { defaultStudentInfo, defaultTeacherInfo } from './accountDefaults';

export const defaultClassroomInfo: Course.ClassroomInfo = {
  id: 0,
  name: '',
};

export const defaultClassInfo: Course.ClassInfo = {
  id: 0,
  name: '',
  labels: [],
  maxMember: 0,
  startDate: '',
  endDate: '',
  description: '',
  adviser: defaultTeacherInfo,
  teacherIds: [],
  studentIds: [],
};

export const defaultCourseInfo: Course.CourseInfo = {
  id: 0,
  name: '',
  category: 'ACCOMPANIED_GROUP',
  labels: [],
  description: '',
  maxMember: 0,
  restMember: 0,
  duration: -1,
  times: [],
  teachers: [],
  students: [],
};

export const defaultCourseTime: Course.CourseTime = {
  dayOfWeek: 'MONDAY',
  startHour: 0,
  startMinute: 0,
  endHour: 0,
  endMinute: 0,
};

export const defaultLessonInfo: Course.LessonInfo = {
  id: 0,
  courseId: 0,
  courseName: '',
  startDateTime: '',
  endDateTime: '',
  status: 'NOT_STARTED',
  note: '',
  classroom: defaultClassroomInfo,
  teachers: [],
  students: [],
  extraStudents: [],
  relatedLessonId: null,
  isLateConfirmed: false,
  attendanceConfirmingTeacher: null,
};

export const defaultAttendanceRecord: Course.AttendanceRecord = {
  lesson: defaultLessonInfo,
  attended: false,
};

export const defaultCourseModelInfo: Course.CourseModelInfo = {
  id: 0,
  name: '',
  description: '',
  monthlyPrice: 0,
  unitPrice: 0,
  billingMethod: 'BY_MONTH',
  details: [],
};

export const defaultCourseModelDetailInfo: Course.CourseModelDetailInfo = {
  category: 'ALL',
  labels: [],
  duration: -1,
  amount: -1,
};

export const defaultCourseGroupInfo: Course.CourseGroupInfo = {
  id: 0,
  student: defaultStudentInfo,
  courseModel: defaultCourseModelInfo,
  courses: [],
  status: 'INCOMPLETE',
};
