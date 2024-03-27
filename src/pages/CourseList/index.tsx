import courseApi from '@/apis/course';
import CourseCreationDrawer from '@/pages/CourseManage/CourseManage/CourseCreationDrawer';
import { toCn } from '@/utils/intl';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { defaultCourseInfo } from '@/@types/courseDefaults';

export default function CourseList() {
  const [courseCreationDrawerOpen, setCourseCreationDrawerOpen] =
    useState(false);
  const [classInfos, setClassInfos] = useState<Course.ClassInfo[]>([]);
  const [classroomInfos, setClassroomInfos] = useState<Course.ClassroomInfo[]>(
    [],
  );

  const [courseList, setCourseList] = useState<Course.CourseInfo[]>([]);
  const [loadingForCourseTable, setLoadingForCourseTable] = useState(false);
  const [defaultRequest, setDefaultRequest] =
    useState<Course.CourseInfo>(defaultCourseInfo);
  const tableRef = useRef<ActionType>();
  /* 初始化页面信息 */
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  }, [courseList]);
  const columnForCourseList: ProColumns<Course.CourseInfo>[] = [
    {
      title: '课程老师',
      dataIndex: 'teachers',
      key: 'teachers',
      align: 'center',

      render: (_, record, index) => {
        return record.teachers.map((tea) => tea.name + ' ');
      },
    },
    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '课程编号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '课程分类',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      renderText: (value) => <div>{toCn(value)}</div>,
    },

    {
      title: '操作',
      key: 'ope',
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <div>
            <Button
              className={'mr-2'}
              onClick={() => {
                console.log(record);
                setDefaultRequest(record);
                setCourseCreationDrawerOpen(true);
              }}
              type={'primary'}
            >
              查看详情
            </Button>
            <Button>删除</Button>
          </div>
        );
      },
    },
  ];

  const getAllCourses = () => {
    setLoadingForCourseTable(true);
    courseApi.getAllCourses().then((res) => {
      if (res) {
        setCourseList(res);
        setLoadingForCourseTable(false);
      }
    });
  };

  useEffect(() => {
    courseApi.getAllClasses().then(setClassInfos);
    getAllCourses();
    courseApi.getAllClassrooms().then(setClassroomInfos);
  }, []);

  return (
    <div className={'p-8'}>
      <div className="p-8">
        <Button
          size="large"
          onClick={() => {
            setCourseCreationDrawerOpen(true);
          }}
        >
          {' '}
          新建课程
        </Button>
      </div>

      <ProTable
        request={async (params) => {
          console.log(params);
          return {
            data: courseList
              .filter((v) => {
                return v.id.toString().includes(params.id ?? '');
              })
              .filter((v) => {
                return v.description.includes(params.description ?? '');
              })
              .filter((v) => {
                console.log(v, toCn(v.category), params.category);
                return toCn(v.category).includes(params.category ?? '');
              })
              .filter((v) => {
                return v.teachers.some((tea) =>
                  tea.name.includes(params.teachers ?? ''),
                );
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })),
            success: true,
            total: courseList
              .filter((v) => {
                return v.id.toString().includes(params.id ?? '');
              })
              .filter((v) => {
                return v.description.includes(params.description ?? '');
              })
              .filter((v) => {
                return toCn(v.category).includes(params.category ?? '');
              })
              .filter((v) => {
                return v.teachers.some((tea) =>
                  tea.name.includes(params.teachers ?? ''),
                );
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })).length,
          };
        }}
        columns={columnForCourseList}
        actionRef={tableRef}
        loading={loadingForCourseTable}
      />

      <CourseCreationDrawer
        open={courseCreationDrawerOpen}
        onClose={() => {
          setCourseCreationDrawerOpen(false);
          getAllCourses();
        }}
        classInfos={classInfos}
        classroomInfos={classroomInfos}
        myClose={() => {
          setCourseCreationDrawerOpen(false);
        }}
        forEdit={defaultRequest}
      />
    </div>
  );
}
