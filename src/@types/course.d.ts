declare namespace Course {
  type ClassroomInfo = {
    id: number;
    name: string;
  };

  type ClassInfo = {
    id: number;
    name: string;
    labels: string[];
    maxMember: number;
    startDate: string;
    endDate: string;
    description: string;
    adviser: Account.TeacherInfo;
    teacherIds: number[];
    studentIds: number[];
  };

  type CourseCategory =
    | 'GROUP'
    | 'ACCOMPANIED_GROUP'
    | 'ACCOMPANIED_INDIVIDUAL'
    | 'INDIVIDUAL'
    | 'UNACCOMPANIED_GROUP'
    | 'UNACCOMPANIED_INDIVIDUAL'
    | 'CLINIC'
    | 'TEMPORARY'
    | 'OTHER';

  type CourseStatus = 'SCHEDULED' | 'UNSCHEDULED';

  /**
   * @param duration - 0 if times is empty, -1 if times have different durations, otherwise the duration of the first time
   */
  interface CourseInfo {
    id: number;
    name: string;
    category: CourseCategory;
    labels: string[];
    description: string;
    duration: number;
    maxMember: number;
    restMember: number;
    times: CourseTime[];
    teachers: Account.TeacherInfo[];
    students: Account.StudentInfo[];
  }

  type CourseTimeType = 'WEEKLY' | 'MONTHLY';

  interface CourseTime {
    dayOfWeek: DayOfWeek;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  }

  /**
   * NOT_STARTED: 未上课
   *
   * FINISHED: 已上完
   *
   * CANCELED: 被调课
   *
   * RESCHEDULED_PENDING: 调课未上
   *
   * RESCHEDULED_COMPLETED: 调课已上
   *
   * INVALID: 无效
   *
   * PENDING_MAKEUP: 待补回
   *
   * COMPLETED_MAKEUP: 已补回
   */
  type LessonStatus =
    | 'NOT_STARTED'
    | 'FINISHED'
    | 'CANCELLED'
    | 'RESCHEDULED_PENDING'
    | 'RESCHEDULED_COMPLETED'
    | 'INVALID'
    | 'PENDING_MAKEUP'
    | 'COMPLETED_MAKEUP';

  interface LessonInfo {
    id: number;
    courseId: number;
    courseName: string;
    startDateTime: string;
    endDateTime: string;
    status: LessonStatus;
    note: string;
    classroom: ClassroomInfo;
    teachers: Account.TeacherInfo[];
    students: Account.StudentInfo[];
    extraStudents: Account.StudentInfo[];
    relatedLessonId: number | null;
    isLateConfirmed: boolean;
    attendanceConfirmingTeacher: TeacherInfo | null;
  }

  interface AttendanceRecord {
    lesson: LessonInfo;
    attended: boolean;
  }

  type BillingMethod = 'BY_MONTH' | 'BY_LESSON';

  interface CourseModelInfo {
    id: number;
    name: string;
    description: string;
    monthlyPrice: number;
    unitPrice: number;
    billingMethod: BillingMethod;
    details: CourseModelDetailInfo[];
  }

  interface CourseModelDetailInfo {
    category: CourseCategory | 'ALL';
    labels: string[];
    duration: number;
    amount: number;
  }

  /**
   * 'CANCELLED' if `cancelledAt` is not null (**highest priority**)
   *
   * 'INCOMPLETE' if courses not meet the requirements of the model
   *
   * 'NOT_STARTED' if all lessons of all courses are not started yet (judge by local date)
   *
   * 'ACTIVE' if any lesson of any course is ongoing (judge by local date)
   *
   * 'FINISHED' if all lessons of all courses are finished (judge by local date)
   *
   * 'UNDETERMINED' if the status cannot be inferred (often because the course group is bound to an unlimited model and no course is added)
   */
  type CourseGroupStatus =
    | 'INCOMPLETE'
    | 'NOT_START'
    | 'ACTIVE'
    | 'FINISHED'
    | 'UNDETERMINED'
    | 'CANCELLED';

  /**
   * @param status - 'INCOMPLETE' if courses not satisfied the model, otherwise 'NOT_START', 'ACTIVE', 'FINISHED' or 'UNDETERMINED'
   *
   *                 Note that if the amount of a model detail is -1,
   *                 courses of that category and labels always satisfy the model.
   *
   *                 If the category of a model detail is 'ALL',
   *                 any course satisfies the labels will satisfy the model until the number of courses meets the amount.
   *
   *                 Hence, if the amount of a model detail is -1, the category is 'ALL', the labels is empty, the duration is -1,
   *                 and it is the first model detail, then any course satisfies the model.
   */
  interface CourseGroupInfo {
    id: number;
    student: Account.StudentInfo;
    courseModel: CourseModelInfo;
    courses: CourseInfo[];
    status: CourseGroupStatus;
  }

  interface CourseGroupMonthlyBill {
    courseModelId: number;
    courseModelName: string;
    total: number;
  }
}
