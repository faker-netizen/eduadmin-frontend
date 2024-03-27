import { defaultLessonInfo } from '@/@types/courseDefaults';
import accountApi from '@/apis/account';
import courseApi from '@/apis/course';
import { getDayOfWeek, getWeekDateStrings } from '@/utils/time';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import { useCallback, useEffect, useRef, useState } from 'react';
import CourseInfoDrawer from './CourseInfoDrawer';
import TimeTableCell from './TimeTableCell';
import TimeTableMain, { TimeTableMainProps } from './TimeTableMain';
import ToolBar, { ToolBarProps } from './ToolBar';

const defaultContentNodes: TimeTableMainProps['contentNodes'] = {
  MONDAY: [],
  TUESDAY: [],
  WEDNESDAY: [],
  THURSDAY: [],
  FRIDAY: [],
  SATURDAY: [],
  SUNDAY: [],
};

type WeekLessonInfos = { [key in DayOfWeek]: Course.LessonInfo[] };
const defaultWeekLessonInfos = {
  MONDAY: [],
  TUESDAY: [],
  WEDNESDAY: [],
  THURSDAY: [],
  FRIDAY: [],
  SATURDAY: [],
  SUNDAY: [],
};

export interface TimeTableProps {
  onCellClick?: (lessonInfo: Course.LessonInfo) => void;
  type: 'class' | 'teacher' | 'student';
  entityId: number | null;
}

const TimeTable: React.FC<TimeTableProps> = ({
  onCellClick,
  type,
  entityId,
}) => {
  const timeTableMainRef = useRef<HTMLDivElement>(null);
  const [dateString, setDateString] = useState(dayjs().format('YYYY-MM-DD'));
  const [courseInfoDrawerOpen, setCourseInfoDrawerOpen] = useState(false);
  const [selectedLessonInfo, setSelectedLessonInfo] =
    useState(defaultLessonInfo);
  const [contentNodes, setContentNodes] = useState(defaultContentNodes);

  /**
   * 根据一周的lessons渲染课程表
   * @param lessons 一周的lessons
   */
  const renderTimeTable = (lessons: Course.LessonInfo[]) => {
    // 获取一周中每天的课程信息
    const weekLessonInfos: WeekLessonInfos = lessons.reduce((acc, cur) => {
      const dayOfWeek = getDayOfWeek(cur.startDateTime);
      return {
        ...acc,
        [dayOfWeek]: [...acc[dayOfWeek], cur],
      };
    }, defaultWeekLessonInfos);
    // 将课程信息转换为课程卡片
    setContentNodes(
      Object.entries(weekLessonInfos).reduce(
        (acc, [dayOfWeek, lessonsInfo]) => ({
          ...acc,
          [dayOfWeek]: lessonsInfo.map((lessonInfo) => (
            <TimeTableCell
              key={lessonInfo.id}
              lessonInfo={lessonInfo}
              onClick={() => {
                onCellClick?.(lessonInfo);
                setSelectedLessonInfo(lessonInfo);
                setCourseInfoDrawerOpen(true);
              }}
            />
          )),
        }),
        defaultContentNodes,
      ),
    );
  };

  /**
   * 根据班级id渲染**日期所在周**的班级课程表
   * @param clazzId 班级id
   * @param dateString 字符串形式的日期（yyyy-MM-dd）
   */
  const renderClassTimeTable = async (clazzId: number, dateString: string) => {
    const weekDateStrings = getWeekDateStrings(dateString);
    const lessons = await courseApi.getClassLessons(
      clazzId,
      weekDateStrings[0],
      weekDateStrings[6],
    );
    renderTimeTable(lessons);
  };

  /**
   * 根据教师id和日期渲染**日期所在周**的课教师程表
   * @param teacherId 教师id
   * @param dateString 字符串形式的日期（yyyy-MM-dd）
   */
  const renderTeacherTimeTable = async (
    teacherId: number,
    dateString: string,
  ) => {
    const weekDateStrings = getWeekDateStrings(dateString);
    const lessons = await accountApi.getTeacherLessons(
      teacherId,
      weekDateStrings[0],
      weekDateStrings[6],
    );
    renderTimeTable(lessons);
  };

  /**
   * 根据学生id和日期渲染**日期所在周**的学生课程表
   * @param studentId 学生id
   * @param dateString 字符串形式的日期（yyyy-MM-dd）
   */
  const renderStudentTimeTable = async (
    studentId: number,
    dateString: string,
  ) => {
    const weekDateStrings = getWeekDateStrings(dateString);
    const lessons = await accountApi.getStudentLessons(
      studentId,
      weekDateStrings[0],
      weekDateStrings[6],
    );
    renderTimeTable(lessons);
  };

  useEffect(() => {
    // 如id为null，则清空课程表
    if (!entityId) {
      setContentNodes(defaultContentNodes);
      return;
    }

    if (type === 'class') {
      renderClassTimeTable(
        entityId,
        dateString ?? dayjs().format('YYYY-MM-DD'),
      );
    } else if (type === 'teacher') {
      renderTeacherTimeTable(
        entityId,
        dateString ?? dayjs().format('YYYY-MM-DD'),
      );
    } else {
      renderStudentTimeTable(
        entityId,
        dateString ?? dayjs().format('YYYY-MM-DD'),
      );
    }
  }, [type, entityId, dateString]);

  /**
   * 下载课程表
   */
  const onDownloadTimeTable: ToolBarProps['onDownloadTimeTable'] =
    useCallback(async () => {
      const dataImage = new Image();
      const canvas = await html2canvas(
        timeTableMainRef.current as HTMLDivElement,
      );
      dataImage.src = canvas.toDataURL('image/png');

      const aElement = document.createElement('a');
      aElement.href = dataImage.src;
      aElement.download = '11';
      aElement.click();
    }, [timeTableMainRef]);

  return (
    <>
      <ToolBar
        onDatePickerChange={(date) => {
          if (date) {
            setDateString(date.format('YYYY-MM-DD'));
          }
        }}
        onDownloadTimeTable={onDownloadTimeTable}
      />
      <TimeTableMain innerRef={timeTableMainRef} contentNodes={contentNodes} />

      <CourseInfoDrawer
        open={courseInfoDrawerOpen}
        onClose={() => setCourseInfoDrawerOpen(false)}
        lessonInfo={selectedLessonInfo}
      />
    </>
  );
};

export default TimeTable;
