import courseApi, {
  CourseCreationRequest,
  defaultCourseCreationRequest,
} from '@/apis/course';
import accountApi from '@/apis/account';
import {
  DayOfWeekToLowercase,
  getHeaderDates,
  getWeekDateStrings,
  parseStartAndEndDateTime,
  timeSpanTOTimeNumber,
} from '@/utils/time';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import CourseGrid, { Day, TimeSpan, TimeString } from '@/components/CourseGrid';
import CourseCreationDrawer from '@/pages/CourseManage/CourseManage/CourseCreationDrawer';
import { defaultStudentInfo } from '@/@types/accountDefaults';
import { useModel } from '@umijs/max';
import { defaultTimescalePreset } from '@/@types/presetDefaults';
import CourseInfoDrawer from '@/components/CourseInfoDrawer/courseInfoDrawer';
import { DrawerProps } from 'antd';

interface TableCourseStudentProps {
  type: 'student';
  infos: Account.StudentInfo;
  scale: Preset.TimescalePresetInfo;
}

interface TableCourseTeacherProps {
  type: 'teacher';
  infos: Account.TeacherInfo;
  scale: Preset.TimescalePresetInfo;
}

interface TableCourseClassProps {
  type: 'class';
  infos: Course.ClassInfo;
  scale: Preset.TimescalePresetInfo;
}

interface TableCourseClassroomProps {
  type: 'classroom';
  infos: Course.ClassroomInfo;
  scale: Preset.TimescalePresetInfo;
}

type TableCourseProps =
  | TableCourseStudentProps
  | TableCourseTeacherProps
  | TableCourseClassProps
  | TableCourseClassroomProps;

type InfoCourse = {
  id: number;
  name: string;
  day: Day;
  span: [TimeString, TimeString];
  color?: string;
  location?: string;
  teacher?: string;
};

interface CourseInfoDrawerProps {
  open: DrawerProps['open'];
  onClose: DrawerProps['onClose'];
  data: InfoCourse;
}

const timeScale: TimeSpan[] = [
  ['8:00', '8:50'],
  ['9:00', '9:50'],
  ['10:10', '11:00'],
  ['11:10', '12:00'],
  ['13:30', '14:20'],
  ['14:30', '15:20'],
  ['15:40', '16:30'],
  ['16:40', '17:30'],
];

interface Course {
  id: string | number;
  name: string;
  day: Day;
  span: [TimeString, TimeString];
  color?: string;
  location?: string;
  teacher?: string;
}

const TableCourse = (props: TableCourseProps) => {
  const { type, infos } = props;
  const [lessons, setLessons] = useState<Course.LessonInfo[]>();
  const [dateString, setDateString] = useState(dayjs().format('YYYY-MM-DD'));
  const [renderLessons, setRenderLessons] = useState<Course[]>([]);
  const [courseCreationDrawerOpen, setCourseCreationDrawerOpen] =
    useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [defaultCourse, setDefaultCourse] = useState<CourseCreationRequest>(
    defaultCourseCreationRequest,
  );
  const [classroomInfos, setClassroomInfos] = useState<Course.ClassroomInfo[]>(
    [],
  );
  const { cache } = useModel('cacheModel');
  const [openForHistoryChange, setOpenForHistoryChange] = useState(false);
  const [classInfos, setClassInfos] = useState<Course.ClassInfo[]>([]);
  const [currentTimeScale, setCurrentTimeScale] =
    useState<Preset.TimescalePresetInfo>({
      ...defaultTimescalePreset,
      value: timeScale,
    });
  const { account } = useModel('accountModel');
  const [headerDates,setHeaderDates]=useState<string[]>(['3/27', '3/28', '3/29', '3/30', '3/31', '4/1', '4/2'])
  const [openForInfoDrawer, setOpenForInfoDrawer] = useState(false);
  const [currentInfoDrawerData, setCurrentInfoDrawerData] =
    useState<InfoCourse>({
      color: '',
      day: 'Monday',
      id: 0,
      location: '',
      name: '',
      span: ['9:00', '9:10'],
      teacher: '',
    });
  useEffect(() => {
    if (props.scale.value) {
      setCurrentTimeScale(props.scale);
    }
  }, [props.scale]);
  const renderTimeTable = (lessons: Course.LessonInfo[]) => {
    // 获取一周中每天的课程信息
    setLessons(lessons);
    setRenderLessons(
      lessons.map((lesson) => {
        const times = parseStartAndEndDateTime(
          lesson.startDateTime,
          lesson.endDateTime,
        );

        const singleCourseInfo: Course = {
          teacher: lesson.teachers.map((tea) => tea.name).join(','),
          location: lesson.classroom.name,
          day: DayOfWeekToLowercase(times.dayOfWeek),
          id: lesson.id,
          name: lesson.courseName,
          span: [
            (times.startHour + ':' + times.endMinute) as TimeString,
            (times.endHour + ':' + times.endMinute) as TimeString,
          ],
        };
        return singleCourseInfo;
      }),
    );
  };

  const getStuCourse = (stuId: number) => {
    accountApi.getStudentLessons(stuId);
  };

  const getClassCourse = async (clazzId: number) => {
    const weekDateStrings = getWeekDateStrings(dateString);
    const lessons = await courseApi.getClassLessons(
      clazzId,
      weekDateStrings[0],
      weekDateStrings[6],
    );
    renderTimeTable(lessons);
  };
  const getTeaCourse = async (teaId: number) => {
    const weekDateStrings = getWeekDateStrings(dateString);
    const lessons = await accountApi.getTeacherLessons(
      teaId,
      weekDateStrings[0],
      weekDateStrings[6],
    );
    renderTimeTable(lessons);
  };
  const getClassroomCourse=async (classroomId:number)=>{
    const weekDateStrings = getWeekDateStrings(dateString);
    const lessons = await courseApi.getClassroomLessons(
        classroomId,
        weekDateStrings[0],
        weekDateStrings[6],
    );
    renderTimeTable(lessons);

  }
  const getDefault = (props: TableCourseProps): CourseCreationRequest => {
    if (props.type === 'teacher') {
      return {
        ...defaultCourseCreationRequest,
        teacherIds: [props.infos.id],
      };
    }
    if (props.type === 'class') {
      return {
        ...defaultCourseCreationRequest,
        clazzId: props.infos.id,
      };
    }
    if (props.type === 'student') {
      return {
        ...defaultCourseCreationRequest,
        category: 'CLINIC',
      };
    }
    if (props.type==="classroom"){
      return {
        ...defaultCourseCreationRequest,
        classroom:props.infos.name
      }
    }
    return defaultCourseCreationRequest;
  };
  useEffect(() => {
    if (!infos.id) {
      return;
    }
    setDefaultCourse(getDefault(props));
    if (type === 'teacher') {
      getTeaCourse(infos.id);
    }
    if (type === 'student') {
      getStuCourse(infos.id);
    }
    if (type==='classroom'){
      getClassroomCourse(infos.id)
    }
    if (type==='class'){
      getClassCourse(infos.id)
    }
    courseApi.getAllClasses().then(setClassInfos);
    courseApi.getAllClassrooms().then(setClassroomInfos);
    setHeaderDates(getHeaderDates())
  }, [infos.id]);

  const addCourse = (day: Day, span: TimeSpan) => {
    setDefaultCourse({
      ...defaultCourse,
      times: [timeSpanTOTimeNumber(day, span)],
    });

    setCourseCreationDrawerOpen(true);
  };

  // @ts-ignore
  return (
    <div
      className="flex flex-row justify-center"
      style={{ backgroundColor: 'white' }}
    >
      <div style={{ width: 1100 }}>
        <CourseGrid innerRef={tableRef} asideWidth={50} cellWidth={150}>
          <CourseGrid.Header
            height={50}
            dates={headerDates}
          />
          <CourseGrid.Content
            height={1500}
            timeScale={currentTimeScale.value as TimeSpan[]}
            courseList={renderLessons}
          >
            <CourseGrid.Content.Aside />
            <CourseGrid.Content.Main
              onAddCourse={(day, span) => {
                if (
                  account.roles[0] === 'admin' ||
                  account.roles[0] === 'super_admin'
                ) {
                  addCourse(day, span);
                  if (type === 'student') {
                    cache.courseCreation.clinicTargetStu =
                      props.infos as Account.StudentInfo;
                  }
                }
              }}
              onClickCourse={(course) => {
                // @ts-ignore
                setCurrentInfoDrawerData(course);
                setOpenForInfoDrawer(true);
                console.log(account);
              }}
            />
          </CourseGrid.Content>
        </CourseGrid>
      </div>
      <CourseInfoDrawer
        data={currentInfoDrawerData}
        onClose={() => {
          setOpenForInfoDrawer(false);
        }}
        open={openForInfoDrawer}
      />
      <CourseCreationDrawer
        open={courseCreationDrawerOpen}
        onClose={() => {
          setCourseCreationDrawerOpen(false);
        }}
        classInfos={classInfos}
        classroomInfos={classroomInfos}
        myClose={() => {
          setCourseCreationDrawerOpen(false);
        }}
        defaultRequest={defaultCourse}
        ifForStu={
          type === 'student'
            ? (infos as Account.StudentInfo)
            : defaultStudentInfo
        }
      />
    </div>
  );
};

export default TableCourse;
