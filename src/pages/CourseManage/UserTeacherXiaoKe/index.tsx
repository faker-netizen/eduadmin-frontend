import { defaultLessonInfo } from '@/@types/courseDefaults';
import accountApi from '@/apis/account';
import courseApi, { defaultLessonUpdateRequest } from '@/apis/course';
import { toCn } from '@/utils/intl';
import { useModel } from '@umijs/max';
import {
  Button,
  Drawer,
  Input,
  Select,
  Table,
  TableColumnsType,
  TableProps,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { openNotification, XiaokeSelectionForTea } from '@/utils/common';

const UserTeacherXiaoKePage: React.FC = () => {
  const [lessonInfos, setLessonInfos] = useState<Course.LessonInfo[]>([]);
  const [drawerOpenForXiaoKe, setDrawerOpenForXiaoKe] = useState(false);
  const [currentLessonInfo, setCurrentLessonInfo] = useState(defaultLessonInfo);
  const [xiaoKeLessonRequest, setXiaoKeLessonRequest] = useState(
    defaultLessonUpdateRequest,
  );
  const { account } = useModel('accountModel');
  const teacherId = account.boundEntity?.id ?? 0;

  const xiaoke = () => {
    console.log(xiaoKeLessonRequest);
    courseApi
      .updateLesson(currentLessonInfo.id, xiaoKeLessonRequest)
      .then((res) => {
        if (res) {
          setDrawerOpenForXiaoKe(false);
          setCurrentLessonInfo(defaultLessonInfo);
          setXiaoKeLessonRequest(defaultLessonUpdateRequest);
          accountApi.getTeacherLessons(teacherId).then(setLessonInfos);
          openNotification('消课', '消课成功', 'success');
        }
      });
  };

  const lessonColumns: TableColumnsType<Course.LessonInfo> = [
    {
      title: '课时名称',
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'center',
    },
    {
      title: '课程子号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startDateTime',
      key: 'startDateTime',
      align: 'center',
      render: (value) => <div>{dayjs(value).format('YYYY-MM-DD HH:mm')}</div>,
    },
    {
      title: '结束时间',
      dataIndex: 'endDateTime',
      key: 'endDateTime',
      align: 'center',
      render: (value) => <div>{dayjs(value).format('YYYY-MM-DD HH:mm')}</div>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <div>{toCn(value)}</div>,
    },
    {
      title: '操作',
      key: 'ope',
      render: (_, record) => (
        <Button
          onClick={() => {
            setCurrentLessonInfo(record);
            setDrawerOpenForXiaoKe(true);
          }}
        >
          消课
        </Button>
      ),
    },
  ];

  const xiaoKeTeacherS: TableProps<Account.TeacherInfo>['rowSelection'] = {
    selectedRowKeys: xiaoKeLessonRequest.teacherIds,
    onChange: (newSelectedRowKeys) => {
      setXiaoKeLessonRequest({
        ...xiaoKeLessonRequest,
        teacherIds: newSelectedRowKeys as number[],
      });
    },
  };

  const xiaoKeStudentS: TableProps<Account.StudentInfo>['rowSelection'] = {
    selectedRowKeys: xiaoKeLessonRequest.studentIds,
    onChange: (newSelectedRowKeys) => {
      setXiaoKeLessonRequest({
        ...xiaoKeLessonRequest,
        studentIds: newSelectedRowKeys as number[],
      });
    },
  };

  useEffect(() => {
    accountApi.getTeacherLessons(teacherId).then(setLessonInfos);
  }, [teacherId]);

  return (
    <div>
      <Table
        columns={lessonColumns}
        dataSource={lessonInfos.map((value) => ({ ...value, key: value.id }))}
      />
      <Drawer
        open={drawerOpenForXiaoKe}
        onClose={() => setDrawerOpenForXiaoKe(false)}
      >
        <div>{currentLessonInfo.courseName}</div>
        <div>{currentLessonInfo.classroom.name}</div>
        <div>开始时间:{currentLessonInfo.startDateTime}</div>
        <div>结束时间:{currentLessonInfo.endDateTime}</div>
        <div>选择消课状态:</div>
        <Select
          style={{ minWidth: 150 }}
          value={xiaoKeLessonRequest.status}
          options={XiaokeSelectionForTea}
          onChange={(e) => {
            setXiaoKeLessonRequest({ ...xiaoKeLessonRequest, status: e });
          }}
        />

        <div>
          备注:
          <Input
            value={xiaoKeLessonRequest.note}
            onChange={(e) => {
              setXiaoKeLessonRequest({
                ...xiaoKeLessonRequest,
                note: e.target.value,
              });
            }}
          />
        </div>

        <div>参课教师</div>
        <Table
          columns={[
            {
              title: '教师姓名',
              dataIndex: 'name',
              key: 'id',
              align: 'center',
            },
          ]}
          dataSource={currentLessonInfo.teachers.map((value) => ({
            ...value,
            key: value.id,
          }))}
          rowSelection={xiaoKeTeacherS}
        />

        <Table
          columns={[
            {
              title: '学生姓名',
              dataIndex: 'name',
              key: 'id',
              align: 'center',
            },
          ]}
          dataSource={currentLessonInfo.students.map((value) => ({
            ...value,
            key: value.id,
          }))}
          rowSelection={xiaoKeStudentS}
        />

        <Button
          type="primary"
          onClick={() => {
            xiaoke();
          }}
        >
          提交
        </Button>
      </Drawer>
    </div>
  );
};

export default UserTeacherXiaoKePage;
