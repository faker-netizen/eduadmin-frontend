import dayjs from 'dayjs';
import _ from 'lodash';
import { toCn } from './intl';
import { Day, TimeSpan } from '@/components/CourseGrid';

export const MonthArray: Month[] = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export const MonthSelectOptions = [
  {label: '一月', value: 'JANUARY'},
  {label: '二月', value: 'FEBRUARY'},
  {label: '三月', value: 'MARCH'},
  {label: '四月', value: 'APRIL'},
  {label: '五月', value: 'MAY'},
  {label: '六月', value: 'JUNE'},
  {label: '七月', value: 'JULY'},
  {label: '八月', value: 'AUGUST'},
  {label: '九月', value: 'SEPTEMBER'},
  {label: '十月', value: 'OCTOBER'},
  {label: '十一月', value: 'NOVEMBER'},
  {label: '十二月', value: 'DECEMBER'},
];

/**
 * 根据开始时间、DayOfWeek 数组及 Lesson 数量生成结束时间
 * @param startDate 开始时间
 * @param days DayOfWeek 数组
 * @param count Lesson 数量
 * @returns 结束时间
 */
export const generateEndDateByDaysAndTimesAndCount = (
    startDate: dayjs.Dayjs,
    days: DayOfWeek[],
    count: number,
): dayjs.Dayjs => {
  let endDate = startDate;

  let i = count;
  while (i > 0) {
    const day = endDate.locale('en').format('dddd');

    if (days.some((d) => _.capitalize(d.toLowerCase()) === day)) {
      i--;
    }

    endDate = endDate.add(1, 'day');
  }

  return endDate.subtract(1, 'day');
};

/**
 * 将日期转换为DayOfWeek
 */
export const getDayOfWeek = (date: dayjs.ConfigType) =>
    dayjs(date).format('dddd').toUpperCase() as DayOfWeek;

/**
 * 将分钟转换为中文形式的时间字符串
 * @param totalMinutes
 * @returns
 * @example
 * minutesToCnString(60) // => 01:00
 * minutesToCnString(90) // => 01:30
 */
export const minutesToCnString = (totalMinutes: number) => {
  const dayjsTime = dayjs().startOf('day').add(totalMinutes, 'minute');
  return dayjsTime.format('HH:mm');
};

/**
 * 将CourseTime转换为中文形式的时间字符串（不包含星期）
 * @param courseTime
 * @returns
 */
export const toCnTimeStringWithoutDayOfWeek = (courseTime: Course.CourseTime) =>
    `${dayjs()
        .startOf('day')
        .add(courseTime.startHour, 'hour')
        .add(courseTime.startMinute, 'minute')
        .format('HH:mm')}~${dayjs()
        .startOf('day')
        .add(courseTime.endHour, 'hour')
        .add(courseTime.endMinute, 'minute')
        .format('HH:mm')}`;

/**
 * 将CourseTime转换为中文形式的时间字符串
 * @param courseTime
 * @returns
 */
export const toCnTimeString = (courseTime: Course.CourseTime) =>
    `${
        'dayOfWeek' in courseTime ? `${toCn(courseTime.dayOfWeek)} ` : ''
    }${toCnTimeStringWithoutDayOfWeek(courseTime)}`;


export const getHeaderDates=()=>{
  const currentDate = new Date();
  const year = currentDate.getFullYear() + '-';
  const month = currentDate.getMonth() + 1 + '-';
  const day = currentDate.getDate() + '';
  const week = getWeekDateStrings(year + month + day);
  console.log(week)
  console.log(week.map((day)=>{
    return day.split('').slice(5,10).join('')
  }))
  return week.map((day)=>{
    return day.split('').slice(5,10).join('')
  }) as string[]
}
/**
 * 根据日期获取本周周一~周日的年-月-日
 */
export const getWeekDateStrings = (data: string) => {
  const weekList = [];
  const date = new Date(data);
  // 判断本日期是否为周日，获取本周一日期
  if (date.getDay() === 0) {
    date.setDate(date.getDate() - 6);
  } else {
    date.setDate(date.getDate() - date.getDay() + 1);
  }
  let myDate: string | number = date.getDate();
  let myMonth: string | number = date.getMonth() + 1;
  if (date.getDate() < 10) {
    myDate = '0' + myDate;
  }
  if (date.getMonth() + 1 < 10) {
    myMonth = '0' + myMonth;
  }
  weekList.push(`${date.getFullYear()}-${myMonth}-${myDate}`);
  // 获取周二以后日期
  for (let i = 0; i < 6; i++) {
    date.setDate(date.getDate() + 1);
    myDate = date.getDate();

    myMonth = date.getMonth() + 1;
    if (date.getDate() < 10) {
      myDate = '0' + myDate;
    }
    if (date.getMonth() + 1 < 10) {
      myMonth = '0' + myMonth;
    }
    weekList.push(`${date.getFullYear()}-${myMonth}-${myDate}`);
  }
  return weekList;
};

/**
 * 获取当前周周一~周日的年-月-日
 */
export const getCurrentWeekDateStrings = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear() + '-';
  const month = currentDate.getMonth() + 1 + '-';
  const day = currentDate.getDate() + '';
  const week = getWeekDateStrings(year + month + day);
  return week;
};

/**
 * 将字符串形式的startDateTime和endDateTime转换为Course.CourseTime
 * @param startDateTimeString
 * @param endDateTimeString
 * @returns
 */
export const parseStartAndEndDateTime = (
    startDateTimeString: string,
    endDateTimeString: string,
): Course.CourseTime => {
  const startDate = new Date(startDateTimeString);
  const endDate = new Date(endDateTimeString);

  return {
    startHour: startDate.getHours(),
    startMinute: startDate.getMinutes(),
    endHour: endDate.getHours(),
    endMinute: endDate.getMinutes(),
    dayOfWeek: getDayOfWeek(startDateTimeString),
  };
};

export const getCurrentDateTime = () => {
  const currentDate = new Date();
  const year = parseInt(currentDate.getFullYear() + '');
  const month = MonthArray[currentDate.getMonth()];
  const day = currentDate.getDate();
  return {
    year,
    month,
    day,
  };
};

export const IsoTimeHandle = (time: string) => {
  let newStr = '';
  if (time !== '') {
    const arr = time.split('');
    for (const element of arr) {
      if (element !== '.') {
        newStr += element;
      } else break;
    }
  }

  return newStr;
};

export const DayOfWeekToLowercase = (week: DayOfWeek) => {
  console.log(week);
  switch (week) {
    case 'MONDAY':
      return 'Monday';
    case 'WEDNESDAY':
      return 'Wednesday';
    case 'TUESDAY':
      return 'Tuesday';
    case 'THURSDAY':
      return 'Thursday';
    case 'FRIDAY':
      return 'Friday';
    case 'SATURDAY':
      return 'Saturday';
    case 'SUNDAY':
      return 'Sunday';
  }
};

export const timeSpanTOTimeNumber = (
    day: Day,
    span: TimeSpan,
): Course.CourseTime => {
  const [startHour, startMinute] = span[0].split(':', 2).map((s) => Number(s));
  const [endHour, endMinute] = span[1].split(':', 2).map((s) => Number(s));

  return {
    dayOfWeek: day.toUpperCase() as DayOfWeek,
    startHour,
    startMinute,
    endMinute,
    endHour,
  };
};


export const getTodayDate = (): string => {
  const today = new Date()
  return today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate()
}
