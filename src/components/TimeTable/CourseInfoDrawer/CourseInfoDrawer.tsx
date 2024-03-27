import {Drawer, DrawerProps} from 'antd';
import dayjs from "dayjs";

export interface CourseInfoDrawerProps {
    open?: DrawerProps['open'];
    onClose?: DrawerProps['onClose'];
    lessonInfo: Course.LessonInfo;
}

const CourseInfoDrawer: React.FC<CourseInfoDrawerProps> = ({
                                                               open,
                                                               onClose,
                                                               lessonInfo,
                                                           }) => {
    return (
        <Drawer open={open} onClose={onClose}
                contentWrapperStyle={{width: 600}}
        >
            <div className="text-2xl">
                <div className={'info-label'}>课程名称:{lessonInfo.courseName}</div>
                <div className={'info-label'}>教室:{lessonInfo.classroom.name}</div>
                <div className={'info-label'}>开始时间:{dayjs(lessonInfo.startDateTime).format("YYYY-MM-DD hh:mm:ss")}</div>
                <div className={'info-label'}>结束时间:{dayjs(lessonInfo.endDateTime).format("YYYY-MM-DD hh:mm:ss")}</div>
                <div className={'info-label'}>
                    授课教师:
                    {lessonInfo.teachers.map((v) => v.name + ', ')}
                </div>
                <div className={'info-label'}>参课学生人数:{lessonInfo.students.length}</div>
                <div className={'info-label'}>
                    参课学生:
                    {lessonInfo.students.map((v) => {
                        return v.name + ', ';
                    })}
                </div>
            </div>
        </Drawer>
    );
};

export default CourseInfoDrawer;
