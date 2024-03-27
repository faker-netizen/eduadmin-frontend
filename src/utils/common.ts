import { notification } from 'antd';
import accountApi from '@/apis/account';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
type PlacementType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type permissionObj = {
  permissionName: string;
  description: string;
  type: string;
  value: string;
};
/**
 * 根据字符串哈希获取随机颜色
 * @params str
 * @returns
 */
export const SexSelectionOptions = [
  {
    label: '男',
    value: 'MALE',
  },
  {
    label: '女',
    value: 'FEMALE',
  },
];
export const SexFilterOptions = [
  {
    text: '男',
    value: 'MALE',
  },
  {
    text: '女',
    value: 'FEMALE',
  },
];

export const roleSelection = [
  {
    label: '超级管理员',
    value: 'super_admin',
  },
  {
    label: '管理员',
    value: 'admin',
  },
  {
    label: '财务',
    value: 'financial',
  },
  {
    label: '教师',
    value: 'teacher',
  },
  {
    label: '学生',
    value: 'student',
  },
];
export const roleFilters = roleSelection.map((role) => {
  return { text: role.label, value: role.value };
});
export const SchemaTypeOptions = [
  {
    label: '文本输入框',
    value: 'text',
  },

  {
    label: '图片文件',
    value: 'pic',
  },
  {
    label: '数字',
    value: 'number',
  },
  {
    label: '任意文件',
    value: 'file',
  },
  {
    label: '是/否判断',
    value: 'boolean',
  },
  {
    label: '时间',
    value: 'time',
  },
  {
    label: '日期',
    value: 'date',
  },
  {
    label: '日期+时间',
    value: 'datetime',
  },
];

export const XiaoKeSelectionForAdmin = [
  { label: '未开始', value: 'NOT_STARTED' },
  { label: '已结束', value: 'FINISHED' },
  { label: '被调课', value: 'CANCELLED' },
  { label: '调课未上', value: 'RESCHEDULED_PENDING' },
  {
    label: '调课已上',
    value: 'RESCHEDULED_COMPLETED',
  },
  { label: '无效', value: 'INVALID' },
  { label: '待补回', value: 'PENDING_MAKEUP' },
  { label: '已补回', value: 'COMPLETED_MAKEUP' },
];
export const CateGorySelection = [
  {
    value: 'GROUP',
    label: '集体',
  },
  {
    value: 'INDIVIDUAL',
    label: '单训',
  },
  {
    value: 'ACCOMPANIED_GROUP',
    label: '有陪_集体',
  },
  { value: 'ACCOMPANIED_INDIVIDUAL', label: '有陪_单训' },
  {
    value: 'UNACCOMPANIED_GROUP',
    label: '无陪_集体',
  },
  {
    value: 'UNACCOMPANIED_INDIVIDUAL',
    label: '无陪_单训',
  },
  {
    value: 'CLINIC',
    label: '门诊',
  },
  {
    value: 'CLINIC, TEMPORARY',
    label: '临时加课',
  },
  {
    value: 'OTHER',
    label: '其他',
  },
];

export const XiaokeSelectionForTea = [
  { label: '已结束', value: 'FINISHED' },
  // { label: '取消', value: 'CANCELLED' },
  // { label: '调课未上', value: 'RESCHEDULED_PENDING' },
  { label: '调课已上', value: 'RESCHEDULED_COMPLETED' },
  // { label: '无效', value: 'INVALID' },
  // { label: '待补回', value: 'PENDING_MAKEUP' },
  { label: '已补回', value: 'COMPLETED_MAKEUP' },
];
export const LevelSelectionOptions = [
  {
    label: '初级',
    value: 'PRIMARY',
  },
  {
    label: '中级',
    value: 'INTERMEDIATE',
  },
  {
    label: '高级',
    value: 'SENIOR',
  },
  {
    label: '特殊',
    value: 'SPECIAL',
  },
];
export const permissionData: permissionObj[] = [
  {
    permissionName: '账号列表管理',
    description: '访问账号列表界面和学生教师列表',
    type: '账号管理',
    value: '/accountManage/accountList',
  },
  {
    permissionName: '学生列表管理',
    description: '访问学生列表界面',
    type: '账号管理',
    value: '/accountManage/studentList',
  },
  {
    permissionName: '教师列表管理',
    description: '访问教师列表界面',
    type: '账号管理',
    value: '/accountManage/teacherList',
  },
  {
    permissionName: '权限分配',
    description: '访问权限分配界面',
    type: '账号管理',
    value: '/accountManage/permission',
  },
  {
    permissionName: '角色信息模版管理',
    description: '访问角色信息模版界面',
    type: '账号管理',
    value: '/accountManage/formFormat',
  },
  {
    permissionName: '标签管理',
    description: '访问标签管理界面',
    type: '账号管理',
    value: '/accountManage/labels',
  },
  {
    permissionName: '教室管理',
    description: '访问教室管理界面',
    type: '账号管理',
    value: '/accountManage/classroom',
  },

  {
    permissionName: '已创建课程列表',
    description: '访问课程列表界面',
    type: '课程管理',
    value: '/courseManage/courseList',
  },
  {
    permissionName: '课程模式管理',
    description: '访问课程管理界面',
    type: '课程管理',
    value: '/courseManage/courseModel',
  },
  {
    permissionName: '教师课表管理',
    description: '访问教师课表界面',
    type: '课程管理',
    value: '/courseManage/teacherCourse',
  },
  {
    permissionName: '学生课程管理',
    description: '访问学生课程界面',
    type: '课程管理',
    value: '/courseManage/studentCourseBinding',
  },
  {
    permissionName: '课程绑定总览',
    description: '访问学生排课界面',
    type: '课程管理',
    value: '/courseManage/courseGroupStatus',
  },
  {
    permissionName: '班级管理',
    description: '访问班级管理界面',
    type: '课程管理',
    value: '/courseManage/courseManage',
  },
  {
    permissionName: '消课管理',
    description: '访问消课管理界面',
    type: '课程管理',
    value: '/courseManage/xiaoke',
  },
  {
    permissionName: '调课管理',
    description: '访问调课管理界面',
    type: '课程管理',
    value: '/courseManage/lessonChange',
  },
  {
    permissionName: '教师个人消课',
    description: '访问教师个人消课界面',
    type: '课程模块',
    value: '/courseManage/userTeacherXiaoke',
  },
  {
    permissionName: '统计分析',
    description: '访问统计分析界面',
    type: '财务管理',
    value: '/informationManage/summary',
  },
  {
    permissionName: '付款方式',
    description: '访问付款方式界面',
    type: '财务管理',
    value: '/informationManage/PayImage',
  },
  {
    permissionName: '档案管理',
    description: '访问档案管理界面',
    type: '文件管理',
    value: '/fileManage',
  },
];

type routeObj = {
  label: string;
  key: string;
};
export const filterRouteForTop = (
  routes: string[],
  currentRouters: routeObj[],
): routeObj[] => {
  const totalRoute = [
    'courseManage',
    'accountManage',
    'informationManage',
    'fileManage',
  ];

  const res = totalRoute.filter((V) => {
    return routes.some((v) => v.includes(V));
  });

  const finalRoutesWithoutLabel = res.map(
    (V) => routes.filter((v) => v.includes(V))[0],
  );
  const final = finalRoutesWithoutLabel.map((V) => {
    const oneData = permissionData.filter((r) => r.value === V)[0];
    return { label: oneData.type, key: oneData.value };
  });

  return final;
};
export const filterRouteForLeft = (
  routes: string[],
  currentRouters: routeObj[],
) => {
  const top = filterRouteForTop(routes, currentRouters);

  return currentRouters.filter((current: routeObj) => {
    // console.log(current.key, routes.includes(current.key));
    return routes.includes(current.key);
  });
};
export const getAvailRoutes = (role: string) => {
  switch (role) {
    case 'super_admin':
      return permissionData.map((p) => p.value) as string[];
    case 'admin':
      return permissionData
        .filter((p, index) => {
          return index !== 0 && index !== 3;
        })
        .map((p) => p.value);
    case 'teacher':
      return [
        '/courseManage/userTeacherXiaoke',
        '/courseManage/userTeacher',
        '/accountManage/userAccount',
      ];
    case 'student':
      return [
        '/courseManage/stuSelfCourses',
        '/accountManage/stuSelfAccount',
        '/informationManage/stuPay',
      ];
    case 'financial':
      return ['/informationManage/summary', '/informationManage/PayImage'];
  }
};

export const getRandomColor = (str: string) => {
  const getHashValueOf = (s: string) => {
    if (s.length === 0) return 0;

    let hash = 0;
    let character: number;
    for (let i = 0; i < s.length; i++) {
      character = s.charCodeAt(i);
      hash = (hash << 5) - hash + character;
      hash |= 0; // Convert to 32bit integer
    }

    return hash;
  };

  const color = [
    '#5f9bef',
    '#a5f5c8',
    '#9d90f1',
    '#7fd2ee',
    '#f3e59b',
    '#9dbcf6',
    '#b8d5fe',
  ];
  return color[Math.abs(getHashValueOf(str)) % 7];
};
export type Filter = {
  name: string;
  disorderType: string;
  idno: string;
  department: string;
  category: string;
};

export const defaultFilter: Filter = {
  name: '',
  disorderType: '',
  idno: '',
  department: '',
  category: '',
};

/**
 * 打开通知框
 * @param message
 * @param info
 * @param type
 * @param position
 */
export const openNotification = (
  message: string,
  info: string,
  type?: NotificationType,
  position?: PlacementType,
) => {
  notification[type ? type : 'info']({
    message: message,
    description: info,
    placement: position ? position : 'topRight',
    onClick: () => {},
  });
};

/**
 * 获取文件的Base64
 * @param file      {File}      文件
 * @param callback  {Function}  回调函数，参数为获取到的base64
 */
// export function fileToBlob(file: File, callback: Function) {
//   const fileReader = new FileReader();
//
//   fileReader.readAsDataURL(file);
//   fileReader.onload = function () {
//     callback(this.result);
//   };
// }

/**
 * base64 转换成 blob
 * @param dataUrl
 * @returns
 */
export const base64ToBlob = (dataUrl: string) => {
  const arr = dataUrl.split(',');
  // @ts-ignore
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

const satisfyDetail = (
  detail: Course.CourseModelDetailInfo,
  condition: {
    category: Course.CourseCategory | 'ALL';
    duration: number;
  },
) =>
  (detail.category === condition.category || detail.category === 'ALL') &&
  (detail.duration === condition.duration || detail.duration === -1);

export const filterCourseGroup = (
  courseGroups: Course.CourseGroupInfo[],
  condition: {
    category: Course.CourseCategory | 'ALL';
    duration: number;
  },
) => {
  return courseGroups.filter((courseGroup) => {
    const details = courseGroup.courseModel.details.filter((detail) =>
      satisfyDetail(detail, condition),
    );
    if (details.length === 0) return false;

    const amountMap = new Map<Course.CourseModelDetailInfo, number>();
    details.forEach((detail) => {
      amountMap.set(detail, detail.amount);
    });
    for (const course of courseGroup.courses) {
      const detail = details.find((detail) =>
        satisfyDetail(detail, {
          category: course.category,
          duration: course.duration,
        }),
      );
      if (!detail) continue;
      if (detail.amount === -1) continue;
      amountMap.set(detail, amountMap.get(detail)! - 1);
    }
    return [...amountMap.values()].some(
      (amount) => amount > 0 || amount === -1,
    );
  });
};

export const timeScaleParse = (time: string) => {
  const arr = time.split(':');
  return [parseInt(arr[0]), parseInt(arr[1])];
};

export const defaultTimeScaleValue: Array<[string, string]> = [
  ['8:45', '9:10'],
  ['9:15', '9:50'],
  ['9:50', '10:20'],
  ['10:25', '10:55'],
  ['11:0', '11:30'],
  ['11:40', '12:40'],
  ['12:50', '13:20'],
  ['13:25', '13:55'],
  ['14:0', '14:30'],
  ['14:35', '15:5'],
  ['15:10', '15:40'],
  ['15:45', '16:15'],
  ['16:20', '16:50'],
  ['17:0', '18:0'],
  ['18:0', '19:0'],
];

export function getNameFromPath(): string[] {
  const htt = window.location.protocol; // 获取协议
  const host = window.location.host.split(':')[1]; // 获取地址和端口号
  switch (host) {
    case '82':
      return [
        '苏州市姑苏区苏悦特殊儿童训练中心管理系统',
        '苏悦特殊儿童训练中心',
      ];
    case '83':
      return ['苏州市吴中区特殊儿童康复中心管理系统', '吴中区特殊儿童康复中心'];
    case '84':
      return [
        '苏州市相城区相悦特殊儿童早期干预中心管理系统',
        '相悦特殊儿童早期干预中心',
      ];
    case '8000':
      return ['测试端', '测试端'];
  }
  return ['1', '2'];
}

export const attendanceAnalyse = (record: Course.AttendanceRecord[]) => {
  return {
    attendedNum: record.filter((lesson) => lesson.attended).length,
    absence: record.filter((lesson) => !lesson.attended).length,
  };
};

export function uniqueFuncForStu(arr:Account.StudentInfo[]){
  const res = new Map();
  return arr.filter((item) => !res.has(item.id) && res.set(item.id, 1));
}

export const getAllStudentsAndProcess =  async () => {
  const students = await accountApi.getAllStudents();
  return students.map((student) => student.id);
};

