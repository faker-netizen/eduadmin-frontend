import { defaultStudentInfo } from '@/@types/accountDefaults';
import { defaultCourseGroupInfo } from '@/@types/courseDefaults';
import accountApi from '@/apis/account';
import courseApi from '@/apis/course';
import { getRandomColor, openNotification } from '@/utils/common';
import { toCn } from '@/utils/intl';
import { toCnTimeString, toCnTimeStringWithoutDayOfWeek } from '@/utils/time';
import {
  Button,
  Drawer,
  Input,
  Modal,
  Popconfirm,
  Switch,
  Table,
  TableColumnsType,
  Tag,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import TableCourse from '@/components/tableCourse';
import { defaultTimescalePreset } from '@/@types/presetDefaults';
import { TimeSpan } from '@/components/CourseGrid';
import presetApi from '@/apis/preset';

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
const RenderLabels = (e: { labels: string[] }) => (
  <div>
    {e.labels.map((value, index) => {
      return (
        <Tag color={getRandomColor(value)} key={index}>
          {value}
        </Tag>
      );
    })}
  </div>
);

const TimeRender = (e: { times: Course.CourseTime[] }) => (
  <div>
    {e.times.map((value, index) => (
      <div key={index}>{`${toCnTimeString(value)}  `}</div>
    ))}
  </div>
);

const StudentCourseBindingPage: React.FC = () => {
  const [timeTableStudent, setTimeTableStudent] =
    useState<Account.StudentInfo>(defaultStudentInfo);
  const [studentInfos, setStudentInfos] = useState<Account.StudentInfo[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [oneStudentInfo, setOneStudentInfo] = useState(defaultStudentInfo);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [oneStudentCourseGroupInfos, setOneStudentCourseGroupInfos] = useState<
    Course.CourseGroupInfo[]
  >([]);
  const [drawerChildOpen, setDrawerChildOpen] = useState(false);
  const [modalOpenForCourses, setModalOpenForCourses] = useState(false);
  const [availableCourseInfos, setAvailableCourseInfos] = useState<
    Course.CourseInfo[]
  >([]);
  const [filterName, setFilterName] = useState('');
  const [oneCourseGroupData, setOneCourseGroupData] = useState(
    defaultCourseGroupInfo,
  );
  const [courseFilterTeacherName, setCourseFilterTeacherName] = useState('');
  const [courseFilterLabel, setCourseFilterLabel] = useState('');
  const [showNotFullCoursesOnly, setShowNotFullCoursesOnly] = useState(true);
  const tableRef = useRef<ActionType>();
  const [currentScale, setCurrentScale] = useState<Preset.TimescalePresetInfo>({
    ...defaultTimescalePreset,
    value: timeScale,
  });
  const [timeScales, setTimeScales] = useState<Preset.TimescalePresetInfo[]>(
    [],
  );

  const getOneStudentCourseGroups = (record: Account.StudentInfo) => {
    setDrawerOpen(true);
    setOneStudentInfo(record);
    accountApi
      .getStudentCourseGroups(record.id)
      .then(setOneStudentCourseGroupInfos);
  };
  const getALlTimeScale = () => {
    presetApi.getAllTimescalePresets().then((response) => {
      setTimeScales(response);
      setCurrentScale(response[0]);
    });
  };

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  }, [studentInfos]);

  const studentColumns: ProColumns<Account.StudentInfo>[] = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      align: 'center',
      filters: [{ text: filterName, value: filterName }],
      onFilter: (_, record) => record.name.search(filterName) !== -1,
    },

    {
      title: '学号',
      dataIndex: 'studentNumber',
      align: 'center',
    },
    {
      title: '障碍类型',
      dataIndex: 'disorderType',
      align: 'center',
      filters: [
        {
          text: '孤独症',
          value: '孤独症',
        },
        {
          text: '听力障碍',
          value: '听力障碍',
        },
        {
          text: '语言障碍',
          value: '语言障碍',
        },

        {
          text: '智力',
          value: '智力',
        },
      ],
      onFilter: (value, record) => record.disorderType === value,
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      render: (_, record) => (
        <>
          {/*<Button*/}
          {/*    type="primary"*/}
          {/*    onClick={() => {*/}
          {/*      getOneStudentCourseGroups(record);*/}
          {/*    }}*/}
          {/*>*/}
          {/*  绑定课时*/}
          {/*</Button>*/}
          <Button
            onClick={() => {
              setTimeTableStudent(record);
            }}
          >
            查看课表
          </Button>
        </>
      ),
    },
  ];

  const getAllStudent = () => {
    setStudentLoading(true);
    accountApi.getAllStudents().then((response) => {
      if (response) {
        setStudentInfos(response);
        setStudentLoading(false);
      }
    });
  };

  /* 初始化表格数据 */
  useEffect(() => {
    getAllStudent();

    getALlTimeScale();
  }, []);

  /**
   * 单个courseGroup详情
   * @param courseGroup
   */
  const oneCourseGroupMoreInfo = (courseGroup: Course.CourseGroupInfo) => {
    setDrawerChildOpen(true);
    setOneCourseGroupData(courseGroup);
  };

  // 单个学生courseGroup
  const childTableColumns: TableColumnsType<Course.CourseGroupInfo> = [
    {
      title: '模式名称',
      dataIndex: ['courseModel', 'name'],
      key: 'name',
      align: 'center',
    },
    {
      title: '模式描述',
      dataIndex: ['courseModel', 'description'],
      key: 'description',
      align: 'center',
    },
    {
      title: '模式子组个数',
      dataIndex: ['courseModel', 'details'],
      key: 'details',
      render: (_, record) => <div>{record.courseModel.details.length}</div>,
      align: 'center',
    },
    {
      title: '价格(元/月)',
      dataIndex: ['courseModel', 'monthlyPrice'],
      key: 'monthlyPrice',
      align: 'center',
    },
    {
      title: '排课完成状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <div>{toCn(value)}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            oneCourseGroupMoreInfo(record);
          }}
        >
          展开模式子组
        </Button>
      ),
    },
  ];

  // 单个courseGroup的details表格
  const courseGroupDetailColumns: TableColumnsType<Course.CourseModelDetailInfo> =
    [
      {
        title: '类别',
        dataIndex: 'category',
        key: 'category',
        align: 'center',
        render: (value) => <div>{toCn(value)}</div>,
      },
      {
        title: '课程数量',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        render: (value) => <div>{value === -1 ? '不限' : value}</div>,
      },
      {
        title: '单节课时长(/分钟)',
        dataIndex: 'duration',
        key: 'duration',
        align: 'center',
        render: (value) => <div>{value === -1 ? '不限' : value}</div>,
      },
      {
        title: '标签',
        dataIndex: 'labels',
        key: 'labels',
        align: 'center',
        render: (value) => <RenderLabels labels={value} />,
      },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        render: () => (
          <Button
            type="primary"
            onClick={() => {
              setModalOpenForCourses(true);
              courseApi.getAllCourses().then(setAvailableCourseInfos); // 重新渲染可选课程列表
            }}
          >
            绑定课时
          </Button>
        ),
      },
    ];

  // 为学生绑定课程事件
  const bindCourseToStudent = (record: Course.CourseInfo) => {
    const currentCourseIds = oneCourseGroupData.courses.map((value) => {
      return value.id;
    });
    const newCourseIds = [...currentCourseIds, record.id];

    courseApi
      .updateCourseGroupCourses(oneCourseGroupData.id, {
        courseIds: newCourseIds,
      })
      .then(() => {
        openNotification('学生课程绑定', '为学生添加一个课程成功', 'success');
        courseApi.getAllCourses().then(setAvailableCourseInfos); // 重新渲染可选课程列表
      });
  };

  // 课程列表
  const ColumnForCourseS: ProColumns<Course.CourseInfo>[] = [
    // {
    //   title: '课程名称',
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: 'center',
    // },
    {
      title: '模式类别',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      filters: [
        {
          value: 'ACCOMPANIED_GROUP',
          text: '有陪_集体',
        },
        { value: 'ACCOMPANIED_INDIVIDUAL', text: '有陪_单训' },
        {
          value: 'UNACCOMPANIED_GROUP',
          text: '无陪_集体',
        },
        {
          value: 'UNACCOMPANIED_INDIVIDUAL',
          text: '无陪_单训',
        },
        {
          value: 'CLINIC',
          text: '门诊',
        },
        {
          value: 'CLINIC, TEMPORARY',
          text: '临时加课',
        },
      ],
      onFilter: (value, record) => record.category === value,
      render: (value, record) => <div>{toCn(record.category)}</div>,
    },
    {
      title: '标签',
      dataIndex: 'labels',
      key: 'labels',
      align: 'center',
      filters: [
        {
          text: courseFilterLabel,
          value: courseFilterLabel,
        },
      ],
      onFilter: (_, record) =>
        record.labels.some((label) => label.includes(courseFilterLabel)),
      render: (_, record) => (
        <div>
          {record.labels.map((value, index) => {
            return (
              <Tag
                key={index}
                color={getRandomColor(value)}
                style={{ color: 'black' }}
              >
                {value}
              </Tag>
            );
          })}
        </div>
      ),
    },

    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '起止日期',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center',
      render: (_, record) => (
        <div>{toCnTimeStringWithoutDayOfWeek(record.times[0])}</div>
      ),
    },
    {
      title: '任课教师',
      dataIndex: 'teachers',
      filters: [
        { text: courseFilterTeacherName, value: courseFilterTeacherName },
      ],
      onFilter: (value, record) =>
        record.teachers.some((teacherInfo) =>
          teacherInfo.name.includes(value as string),
        ),
      key: 'teachers',
      align: 'center',
      render: (value, record) => (
        <div>
          {record.teachers.map((teacher, index) => {
            return (
              <Tag
                key={index}
                style={{ color: 'black' }}
                color={getRandomColor(teacher.name)}
              >
                {teacher.name}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: '容量',
      dataIndex: 'maxMember',
      key: 'maxMember',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            {record.students.length} / {record.maxMember}人
          </div>
        );
      },
    },
    {
      title: '上课时间',
      dataIndex: 'times',
      key: 'times',
      align: 'center',
      render: (_, record) => <TimeRender times={record.times} />,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            bindCourseToStudent(record);
          }}
        >
          添加绑定
        </Button>
      ),
    },
  ];

  const delBindCourse = (r: Course.CourseInfo) => {
    const currentCourseIds = oneCourseGroupData.courses.map((v) => v.id);
    const newCourseIds = currentCourseIds.filter((v) => v !== r.id);
    courseApi
      .updateCourseGroupCourses(oneCourseGroupData.id, {
        courseIds: newCourseIds,
      })
      .then(() => {
        openNotification('学生课程绑定', '为学生删除一个课程成功', 'success');
        courseApi
          .getCourseGroup(oneCourseGroupData.id)
          .then(setOneCourseGroupData);
        accountApi
          .getStudentCourseGroups(oneStudentInfo.id)
          .then(setOneStudentCourseGroupInfos);
      });
  };

  const courseSChosenColumns: TableColumnsType<Course.CourseInfo> = [
    // {
    //   title: '课程名称',
    //   dataIndex: 'name',
    //   key: 'name',
    //   align: 'center',
    // },
    {
      title: '模式类别',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      render: (value) => <div>{toCn(value)}</div>,
    },
    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      render: (_, record) => <div>{record.description}</div>,
    },
    {
      title: '起止日期',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center',
      render: (_, record) => (
        <div>{toCnTimeStringWithoutDayOfWeek(record.times[0])}</div>
      ),
    },
    {
      title: '任课教师',
      dataIndex: 'teachers',
      key: 'teachers',
      align: 'center',
      render: (_, record) => (
        <div>
          {record.teachers.map((teacher, index) => (
            <Tag key={index} color={getRandomColor(teacher.name)}>
              {teacher.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '上课时间',
      dataIndex: 'times',
      key: 'times',
      align: 'center',
      render: (_, record) => <TimeRender times={record.times} />,
    },
    {
      title: '操作',
      key: 'ope',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="确定删除?"
          okText="确定"
          cancelText="取消"
          onConfirm={() => {
            delBindCourse(record);
          }}
        >
          <Button type="primary">删除</Button>
        </Popconfirm>
      ),
    },
  ];

  // 模态框关闭事件
  const courseModalClose = () => {
    setModalOpenForCourses(false);
    courseApi.getCourseGroup(oneCourseGroupData.id).then((res) => {
      setOneCourseGroupData(res);
    });
    accountApi
      .getStudentCourseGroups(oneStudentInfo.id)
      .then(setOneStudentCourseGroupInfos);
  };

  return (
    <div
      style={{
        padding: 30,
      }}
    >
      <ProTable
        actionRef={tableRef}
        request={async (params) => {
          console.log(params);
          return {
            data: studentInfos
              .filter((v) => {
                return v.name.includes(params.name ?? '');
              })
              .filter((v) => {
                return v.studentNumber.includes(params.studentNumber ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })),
            success: true,
            total: studentInfos
              .filter((v) => {
                return v.name.includes(params.name ?? '');
              })
              .filter((v) => {
                return v.studentNumber.includes(params.studentNumber ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })).length,
          };
        }}
        loading={studentLoading}
        columns={studentColumns}
      />

      {/* 课程表 */}

      {timeTableStudent.id !== 0 && (
        <TableCourse
          type={'student'}
          infos={timeTableStudent}
          scale={currentScale}
        />
      )}
      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
        contentWrapperStyle={{ width: 900 }}
        push={{ distance: 0 }}
      >
        <Table
          columns={childTableColumns}
          dataSource={oneStudentCourseGroupInfos.map((value) => ({
            ...value,
            key: value.id,
          }))}
        />
        <Drawer
          contentWrapperStyle={{ height: 600 }}
          placement="bottom"
          open={drawerChildOpen}
          onClose={() => {
            setDrawerChildOpen(false);
          }}
        >
          {oneCourseGroupData.student.name}
          <div>{oneCourseGroupData.courseModel.description}</div>
          <div>模式子组详情</div>
          <Table
            columns={courseGroupDetailColumns}
            dataSource={oneCourseGroupData.courseModel.details.map(
              (value, index) => ({ ...value, key: index }),
            )}
          />
          <div>已绑定课程</div>
          <Table
            columns={courseSChosenColumns}
            dataSource={oneCourseGroupData.courses.map((value) => ({
              ...value,
              key: value.id,
            }))}
          />
          <Modal
            okText="关闭"
            cancelText="关闭"
            width={1200}
            open={modalOpenForCourses}
            onCancel={() => {
              courseModalClose();
            }}
            onOk={() => {
              courseModalClose();
            }}
          >
            <div className="flex items-center">
              <Switch
                checked={showNotFullCoursesOnly}
                onChange={(e) => {
                  setShowNotFullCoursesOnly(e);
                }}
              />
              只显示容量有剩余的课程
            </div>
            <div className="flex flex-row mb-4 mt-4 h-6 items-center">
              <div style={{ minWidth: 100 }}>模糊搜索:</div>

              <Input
                style={{ margin: '0 4px' }}
                value={courseFilterTeacherName}
                onChange={(e) => {
                  setCourseFilterTeacherName(e.target.value);
                }}
                prefix={<SearchOutlined />}
              />
            </div>
            <ProTable
              columns={ColumnForCourseS}
              dataSource={availableCourseInfos
                .filter((v) => {
                  console.log(showNotFullCoursesOnly);
                  if (showNotFullCoursesOnly)
                    return v.maxMember > v.students.length;
                  else return true;
                })
                .filter((v) => {
                  if (courseFilterTeacherName === '') {
                    return true;
                  } else {
                    console.log(
                      v.labels.some((label) => {
                        return label.includes(courseFilterTeacherName);
                      }),
                    );
                    return (
                      v.teachers.some((i) => {
                        return i.name.includes(courseFilterTeacherName);
                      }) ||
                      v.labels.some((label) => {
                        return label.includes(courseFilterTeacherName);
                      }) ||
                      v.name.includes(courseFilterTeacherName) ||
                      toCn(v.times[0].dayOfWeek).includes(
                        courseFilterTeacherName,
                      )
                    );
                  }
                })
                .map((value) => ({
                  ...value,
                  key: value.id,
                }))}
            />
          </Modal>
        </Drawer>
      </Drawer>
    </div>
  );
};

export default StudentCourseBindingPage;
