import { Button, Drawer, DrawerProps } from 'antd';
import { Day, TimeString } from '@/components/CourseGrid';
import { history } from '@@/core/history';
import { useModel } from '@@/exports';

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

// classInfos: Course.ClassInfo[];
// classroomInfos: Course.ClassroomInfo[];
// defaultRequest?: CourseCreationRequest;
// ifForStu?: Account.StudentInfo;
// forEdit?: Course.CourseInfo;
// myClose: (...params: any[]) => any;
// updateAvailTeachersCallback: () => void;

const CourseInfoDrawer = (props: CourseInfoDrawerProps) => {
  const { open, onClose, data } = props;
  const { cache } = useModel('cacheModel');
  const { account } = useModel('accountModel');
  return (
    <Drawer
      title="新建课程"
      contentWrapperStyle={{ width: 400 }}
      open={open}
      onClose={onClose}
    >
      <div className={'w-2/3 flex flex-col '} style={{ fontSize: '1.5rem' }}>
        {/*id: string | number;*/}
        {/*name: string;*/}
        {/*day: Day;*/}
        {/*span: [TimeString, TimeString];*/}
        {/*color?: string;*/}
        {/*location?: string;*/}
        {/*teacher?: string;*/}
        {/*};*/}
        <div className={'mt-3'}>
          上课时间:{data.span[0]}-{data.span[1]}
        </div>
        <div className={'mt-3'}>上课地点:{data.location}</div>
        {data.teacher ? (
          <div className={'mt-3'}>上课教师:{data.teacher}</div>
        ) : (
          ''
        )}
        {account.primaryRole === 'super_admin' ||
        account.primaryRole === 'admin' ? (
          <Button
            type={'primary'}
            onClick={() => {
              history.push('/courseManage/courseList');
              cache.updateCourseIdFromTable = data.id;
            }}
          >
            修改此时段课程
          </Button>
        ) : (
          ''
        )}
      </div>
    </Drawer>
  );
};

export default CourseInfoDrawer;
