/* 翻译文件 */
const englishToChineseMap = {
  /* 性别 */
  MALE: '男',
  FEMALE: '女',
  /* 星期 */
  MONDAY: '周一',
  TUESDAY: '周二',
  WEDNESDAY: '周三',
  THURSDAY: '周四',
  FRIDAY: '周五',
  SATURDAY: '周六',
  SUNDAY: '周日',
  /* 课程类别 */
  GROUP: '集体',
  ACCOMPANIED_GROUP: '有陪集体',
  UNACCOMPANIED_GROUP: '无陪集体',
  INDIVIDUAL: '单训',
  ACCOMPANIED_INDIVIDUAL: '有陪单训',
  UNACCOMPANIED_INDIVIDUAL: '无陪单训',
  CLINIC: '门诊',
  TEMPORARY: '临时加课',
  OTHER: '其他',
  ALL: '不限',
  /* 课时状态 */
  NOT_STARTED: '未开始',
  FINISHED: '已结束',
  CANCELLED: '被调课',
  RESCHEDULED_PENDING: '调课未上',
  RESCHEDULED_COMPLETED: '调课已上',
  INVALID: '无效',
  PENDING_MAKEUP: '待补回',
  COMPLETED_MAKEUP: '已补回',
  /* 课程组状态 */
  INCOMPLETE: '有缺漏',
  NOT_START: '未开始',
  ACTIVE: '正在进行',
  UNDETERMINED: '未确定',
  /*月份*/
  JANUARY: '一月',
  FEBRUARY: '二月',
  MARCH: '三月',
  APRIL: '四月',
  MAY: '五月',
  JUNE: '六月',
  JULY: '七月',
  AUGUST: '八月',
  SEPTEMBER: '九月',
  OCTOBER: '十月',
  NOVEMBER: '十一月',
  DECEMBER: '十二月',
  /*角色*/
  admin: '管理员',
  teacher: '教师',
  student: '学生',
  super_admin: '超级管理员',
  financial: '财务',
};

/**
 * 将英文转换为中文
 */
export const toCn = (
    str:
        | Sex
        | DayOfWeek
        | Month
        | Course.CourseCategory
        | Course.LessonStatus
        | Account.Role
        | "ALL"
        | Course.CourseGroupStatus,
): string => {
  return englishToChineseMap[str];
};
