import accountApi, {AvailableTeacherFetchingRequest} from '@/apis/account';
import {Modal, ModalProps} from 'antd';
import _ from 'lodash';
import TimeSelectionModalRow from './TimeSelectionModalRow';
import React, {useEffect, useState} from 'react';
import {DAY_OF_WEEK} from '@/constants/common';
import {openNotification} from '@/utils/common';

/**
 * 根据多个课程时间获取可用教师
 * 容忍度需要单独给出
 * 无需在请求中指定容忍度（若指定了也会被忽略）
 * @param requests 多个课程时间
 * @param tolerance 容忍度，即最大冲突课程数，超过该值的教师将被过滤掉。默认为0
 * @returns
 */
const getAvailableTeachersOfMultipleTimes = async (
    requests: Omit<AvailableTeacherFetchingRequest, 'tolerance'>[],
    tolerance: number = 0,
) => {
  const promises = requests.map((request) =>
      accountApi.getAvailableTeachers(request),
  );
  const responses = await Promise.all(promises);
  const teachers = responses.flat();

  return (
      // 合并相同id的教师冲突课程
      _.uniqBy(teachers, 'id')
          .map((teacher) => {
            const conflictLessons = teachers
                .filter((t) => t.id === teacher.id)
                .flatMap((t) => t.conflictLessons);
            return {...teacher, conflictLessons};
          })
          // 过滤掉冲突课程数超过容忍度的教师
          .filter((teacher) => teacher.conflictLessons.length <= tolerance)
  );
};

type WeekCourseTimes = {
  [key in DayOfWeek]: Course.CourseTime;
};
const defaultWeekCourseTimes: WeekCourseTimes = {
  MONDAY: {
    dayOfWeek: 'MONDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
  TUESDAY: {
    dayOfWeek: 'TUESDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
  WEDNESDAY: {
    dayOfWeek: 'WEDNESDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
  THURSDAY: {
    dayOfWeek: 'THURSDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
  FRIDAY: {
    dayOfWeek: 'FRIDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
  SATURDAY: {
    dayOfWeek: 'SATURDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
  SUNDAY: {
    dayOfWeek: 'SUNDAY',
    startHour: 7,
    startMinute: 0,
    endHour: 7,
    endMinute: 40,
  },
};

export interface TimeSelectionModalProps {
  open?: ModalProps['open'];
  onOk?: (courseTimes: Course.CourseTime[]) => void;
  onCancel?: ModalProps['onCancel'];
  updateAvailTea: (availableTeachers: Account.TeacherInfo[]) => void;
  dateFrom: string;
  defaultTime?: Course.CourseTime[];
  dateTo: string;
  tolerance?: number;
  // updateAvailTeachersCallbackRef: Ref<() => void>;
}

export const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({
                                                                        open,
                                                                        onOk,
                                                                        updateAvailTea,
                                                                        onCancel,
                                                                        dateFrom,
                                                                        defaultTime,
                                                                        dateTo,
                                                                        tolerance = 0,
                                                                        // updateAvailTeachersCallbackRef,
                                                                      }) => {
  const [availableTeachers, setAvailableTeachers] = useState<
      Account.TeacherInfo[]
  >([]);
  const [selectedDayOfWeeks, setSelectedDayOfWeeks] = useState<DayOfWeek[]>([]);
  const [weekCourseTimes, setWeekCourseTimes] = useState(
      defaultWeekCourseTimes,
  );

  /**
   * 检索可选教师
   */ useEffect(() => {
    if (defaultTime && defaultTime.length > 0) {
      console.log(defaultTime);
      setSelectedDayOfWeeks([defaultTime[0].dayOfWeek]);
      let courseTimes = defaultWeekCourseTimes;
      courseTimes[defaultTime[0].dayOfWeek] = defaultTime[0];
      setWeekCourseTimes(courseTimes);
    }
  }, [defaultTime]);
  const retrieveAvailableTeachers = async () => {
    openNotification('可选教师检索', '正在检索可选教师', 'info');

    const requests = selectedDayOfWeeks.map((dayOfWeek) => ({
      dateFrom,
      dateTo,
      dayOfWeek,
      hourFrom: weekCourseTimes[dayOfWeek].startHour,
      minuteFrom: weekCourseTimes[dayOfWeek].startMinute,
      hourTo: weekCourseTimes[dayOfWeek].endHour,
      minuteTo: weekCourseTimes[dayOfWeek].endMinute,
    }));


    const response = await getAvailableTeachersOfMultipleTimes(
        requests,
        tolerance,
    );

    setAvailableTeachers(response);
    updateAvailTea(response);
    openNotification('可选教师检索', '检索成功,具备可选教师', 'success');
  };

  return (
      <Modal
          title="时间选择"
          open={open}
          onOk={async () => {
            await retrieveAvailableTeachers();
            onOk?.(
                Object.entries(weekCourseTimes)
                    .filter(([dayOfWeek]) =>
                        selectedDayOfWeeks.includes(dayOfWeek as DayOfWeek),
                    )
                    .map(([, courseTime]) => courseTime),
            );
          }}
          onCancel={onCancel}
          okText="添加"
          cancelText="关闭"
          width="1100"
      >
        {DAY_OF_WEEK.map((dayOfWeek) => (
            <TimeSelectionModalRow
                key={dayOfWeek}
                dayOfWeek={dayOfWeek}
                checked={selectedDayOfWeeks.includes(dayOfWeek)}
                disabled={
                    selectedDayOfWeeks.length === 1 &&
                    !selectedDayOfWeeks.includes(dayOfWeek)
                }
                time={weekCourseTimes[dayOfWeek]}
                onTimeChange={(courseTime) => {
                  setWeekCourseTimes({...weekCourseTimes, [dayOfWeek]: courseTime});
                }}
                onCheckboxChecked={(dayOfWeek) => {
                  setSelectedDayOfWeeks([...selectedDayOfWeeks, dayOfWeek]);
                }}
                onCheckboxUnchecked={(dayOfWeek) => {
                  setSelectedDayOfWeeks(
                      selectedDayOfWeeks.filter((d) => d !== dayOfWeek),
                  );
                }}
            />
        ))}
      </Modal>
  );
};

export default TimeSelectionModal;
