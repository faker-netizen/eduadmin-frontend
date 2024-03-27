import { defaultLessonInfo } from '@/@types/courseDefaults';
import accountApi from '@/apis/account';
import courseApi, { defaultLessonUpdateRequest } from '@/apis/course';
import { toCn } from '@/utils/intl';
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
import { useEffect, useRef, useState } from 'react';
import { openNotification, XiaoKeSelectionForAdmin } from '@/utils/common';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';

const XiaoKePage: React.FC = () => {
  const [teacherInfos, setTeacherInfos] = useState<Account.TeacherInfo[]>([]);
  const [currentTeacherID, setCurrentTeacherID] = useState(0);
  const [lessonsInfo, setLessonInfos] = useState<Course.LessonInfo[]>([]);
  const [drawerOpenForXiaoKe, setDrawerOpenForXiaoKe] = useState(false);
  const [currentLessonInfo, setCurrentLessonInfo] = useState(defaultLessonInfo);
  const tableRef = useRef<ActionType>();
  const [xiaoKeLessonRequest, setXiaoKeLessonRequest] = useState(
    defaultLessonUpdateRequest,
  );
  const [filterNameForTeacherTable, setFilterNameForTeacherTable] =
    useState('');

  const getCurrentLesson = (id: number) => {
    setCurrentTeacherID(id);
    accountApi.getTeacherLessons(id).then(setLessonInfos);
  };

  const tableColumns: ProColumns<Account.TeacherInfo>[] = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      filters: [
        { text: filterNameForTeacherTable, value: filterNameForTeacherTable },
      ],
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
      renderText: (value) => <div>{toCn(value)}</div>,
    },
    {
      title: '教职工号',
      dataIndex: 'staffNumber',
      key: 'staffNumber',
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
    },
    {
      title: '操作',
      key: 'ope',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            getCurrentLesson(record.id);
          }}
        >
          查看课时
        </Button>
      ),
    },
  ];

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

  const xiaoke = () => {
    console.log(xiaoKeLessonRequest);
    courseApi
      .updateLesson(currentLessonInfo.id, xiaoKeLessonRequest)
      .then((res) => {
        if (res) {
          setDrawerOpenForXiaoKe(false);
          setCurrentLessonInfo(defaultLessonInfo);
          setXiaoKeLessonRequest(defaultLessonUpdateRequest);
          getCurrentLesson(currentTeacherID);
          openNotification('消课', '消课成功', 'success');
        }
      });
  };

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

  /* 初始化表格数据 */
  useEffect(() => {
    accountApi.getAllTeachers().then(setTeacherInfos);
  }, []);
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  }, [teacherInfos]);

  return (
    <div style={{ padding: 20 }}>
      <ProTable
        actionRef={tableRef}
        request={async (params) => {
          console.log(params);
          return {
            data: teacherInfos
              .filter((v) => {
                return v.name.includes(params.name ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })),
            success: true,
            total: teacherInfos
              .filter((v) => {
                return v.name.includes(params.name ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })).length,
          };
        }}
        columns={tableColumns}
        dataSource={teacherInfos
          .filter((v) => {
            return v.name.search(filterNameForTeacherTable) >= 0;
          })
          .map((value) => ({ ...value, key: value.id }))}
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
          options={XiaoKeSelectionForAdmin}
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
        <div>
          <Button type="primary" onClick={xiaoke}>
            提交
          </Button>
        </div>
      </Drawer>

      <Table
        columns={lessonColumns}
        dataSource={lessonsInfo.map((value) => ({ ...value, key: value.id }))}
      />
    </div>
  );
};

export default XiaoKePage;
