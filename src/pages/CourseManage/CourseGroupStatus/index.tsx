import { defaultCourseGroupInfo } from '@/@types/courseDefaults';
import courseApi from '@/apis/course';
import { getRandomColor, openNotification } from '@/utils/common';
import { toCn } from '@/utils/intl';
import { toCnTimeStringWithoutDayOfWeek } from '@/utils/time';
import { SearchOutlined } from '@ant-design/icons';
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
import { useEffect, useRef, useState } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { useModel } from '@umijs/max';
import { ProFormInstance } from '@ant-design/pro-form';
import { defaultStudentInfo } from '@/@types/accountDefaults';

const TimeRender = (e: { times: Course.CourseTime[] }) => {
  return (
    <div>
      {e.times.map((value) => {
        return (
          <div key={value.dayOfWeek}>
            {`${toCn(value.dayOfWeek)}-${value.startHour}:${
              value.startMinute < 10
                ? '0' + value.startMinute
                : value.startMinute
            }-${value.endHour}:${
              value.endMinute < 10 ? '0' + value.endMinute : value.endMinute
            }  `}
          </div>
        );
      })}
    </div>
  );
};

const RenderLabels = (e: { labels: string[] }) => (
    <div>
      {e.labels.map((value, index) => (
          <Tag color={getRandomColor(value)} key={index}>
            {value}
          </Tag>
      ))}
    </div>
);

const CourseGroupStatusPage: React.FC = () => {
  const [courseGroupInfos, setCourseGroupInfos] = useState<Course.CourseGroupInfo[]>([]);
  const [drawerChildOpen, setDrawerChildOpen] = useState(false);
  const [oneCourseGroupData, setOneCourseGroupData] = useState(
      defaultCourseGroupInfo,
  );
  const [modalOpenForCourses, setModalOpenForCourses] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course.CourseInfo[]>(
      [],
  );
  const [courseFilterTeacherName, setCourseFilterTeacherName] = useState('');
  const [filterTime, setFilterTime] = useState<string|number>(0);

  const [showNotFullCoursesOnly, setShowNotFullCoursesOnly] = useState(true)
  const tableRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>()
  const [loading, setLoading] = useState(false)
  const {cache} = useModel('cacheModel')
  const getAllCourseGroups = () => {
    setLoading(true)
    courseApi.getAllCourseGroups().then((response) => {
      if (response) {

        setCourseGroupInfos(response);
        setLoading(false)
      }
    });
  };
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.reload();
      if (formRef.current && cache.courseCreation.clinicTargetStu.name) {
        console.log(2)
        formRef.current?.setFieldsValue({
          student: {
            name: cache.courseCreation.clinicTargetStu.name
          }
        })
        formRef.current?.submit()
        cache.courseCreation.clinicTargetStu = defaultStudentInfo
      }
    }
  }, [courseGroupInfos])

  // 单个courseGroup详情
  const oneCourseGroupMoreInfo = (courseGroup: Course.CourseGroupInfo) => {
    setDrawerChildOpen(true);
    setOneCourseGroupData(courseGroup);
  };

  const getAllCourses = () => {
    courseApi.getAllCourses().then(setAvailableCourses);
  };

  const bindStudentCourse = () => {
    setModalOpenForCourses(true);
    getAllCourses();
  };

  // 为学生绑定课程事件
  const bindCurseToStudent = (record: Course.CourseInfo) => {
    const currentCourseIds = oneCourseGroupData.courses.map(
        (value) => value.id,
    );
    const newCourseIds = [...currentCourseIds, record.id];

    courseApi
        .updateCourseGroupCourses(oneCourseGroupData.id, {
          courseIds: newCourseIds,
        })
        .then(() => {
          openNotification('学生课程绑定', '为学生添加一个课程成功', 'success');
          getAllCourses();
        })
        .catch(() => {
          openNotification('学生课程绑定', '添加失败,检查是否匹配', 'error');
        });
  };

  const ColumnForCourseGroups: ProColumns<Course.CourseGroupInfo>[] = [
    {
      title: '学号',
      dataIndex: ['student', 'studentNumber'],
      key: 'id',
      align: 'center',
      sorter: (a, b) => a.student.id - b.student.id,
    },
    {
      title: '学生姓名',
      dataIndex: ['student', 'name'],
      align: 'center',
    },
    {
      title: '障碍类型',
      dataIndex: ['student', 'disorderType'],
      align: 'center',
    },
    {
      title: '模式名称',
      dataIndex: ['courseModel', 'name'],
      align: 'center',
    },
    {
      title: '模式子组个数',
      dataIndex: ['courseModel', 'details'],
      key: 'details',

      align: 'center',
      render: (_, record) => <div>{record.courseModel.details.length}</div>,
    },
    {
      title: '价格(元/月)',
      dataIndex: ['courseModel', 'monthlyPrice'],
      key: 'monthlyPrice',
      search: false,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      align: 'center',
      filters: [
        {
          text: '尚未开始',
          value: 'NOT_START',
        },
        {
          text: '有缺漏',
          value: 'INCOMPLETE',
        },

        {
          text: '尚未定义',
          value: 'UNDETERMINED',
        },
        {
          text: '已完成',
          value: 'FINISHED',
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => <div>{toCn(record.status)}</div>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      search: false,
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
  const courseSColumns: TableColumnsType<Course.CourseInfo> = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '模式类别',
      dataIndex: 'category',
      key: 'category',
      filters: [
        {
          value: 'ACCOMPANIED_GROUP',
          text: '有陪_集体',
        },
        {value: 'ACCOMPANIED_INDIVIDUAL', text: '有陪_单训'},
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
      align: 'center',
      render: (value) => <div>{toCn(value)}</div>,
    },
    // {
    //   title: '标签',
    //   dataIndex: 'labels',
    //   key: 'labels',
    //   align: 'center',
    //   filters: [
    //     {
    //       text: courseFilterLabel,
    //       value: courseFilterLabel,
    //     },
    //   ],
    //   onFilter: (_, record) =>
    //       record.labels.some((label) => label.includes(courseFilterLabel)),
    //   render: (_, record) => (
    //       <div>
    //         {record.labels.map((value, index) => (
    //             <Tag
    //                 key={index}
    //                 color={getRandomColor(value)}
    //                 style={{color: 'black'}}
    //             >
    //               {value}
    //             </Tag>
    //         ))}
    //       </div>
    //   ),
    // },

    {
      title: '课程描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    // {
    //   title: '起止日期',
    //   dataIndex: 'startDate',
    //   key: 'startDate',
    //   align: 'center',
    //   render: (_, record) => (
    //     <div>{toCnTimeStringWithoutDayOfWeek(record.times[0])}</div>
    //   ),
    // },
    {
      title: '任课教师',
      dataIndex: 'teachers',
      filters: [
        {text: courseFilterTeacherName, value: courseFilterTeacherName},
      ],
      onFilter: (value, record) =>
          record.teachers.some((teacherInfo) =>
              teacherInfo.name.includes(value as string),
          ),
      key: 'teachers',
      align: 'center',
      render: (_, record) => (
          <div>
            {record.teachers.map((teacher, index) => (
                <Tag
                    key={index}
                    style={{color: 'black'}}
                    color={getRandomColor(teacher.name)}
                >
                  {teacher.name}
                </Tag>
            ))}
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
            <div>{record.students.length}{" "}/{" "}{record.maxMember}人</div>
        )
      }
    },
    {
      title: '上课时间',
      dataIndex: 'times',
      key: 'times',
      align: 'center',
      render: (_, record) => <TimeRender times={record.times}/>,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      render: (_, record) => (
          <Button
              type="primary"
              onClick={() => {
                bindCurseToStudent(record);
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
          courseApi.getCourseGroup(oneCourseGroupData.id).then((res) => {
            setOneCourseGroupData(res);
          });
        });
  };

  const columnForCourseSChosen: TableColumnsType<Course.CourseInfo> = [
    // {
    //     title: '课程名称',
    //     dataIndex: 'name',
    //     key: 'name',
    //     align: 'center',
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
      render: (_, record) => (
          <div>{toCnTimeStringWithoutDayOfWeek(record.times[0])}</div>
      ),
    },
    // {
    //   title: '起止日期',
    //   dataIndex: 'startDate',
    //   key: 'startDate',
    //   align: 'center',
    //   render: (_, record) => (
    //     <div>{toCnTimeStringWithoutDayOfWeek(record.times[0])}</div>
    //   ),
    // },
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
      render: (_, record) => <TimeRender times={record.times}/>,
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

  // 单个courseGroup的details表格
  const ColumnForCourseGroupDetails: TableColumnsType<Course.CourseModelDetailInfo> =
      [
        {
          title: '类别',
          dataIndex: 'category',
          key: 'category',
          align: 'center',
          render: (value) => <div>{toCn(value)}</div>,
        },
        {
          title: '每周课节数',
          dataIndex: 'amount',
          key: 'amount',
          align: 'center',
          render: (value) => <div>{value === -1 ? '不限' : value}</div>,
        },
        {
          title: '课程时长',
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
          render: (value) => <RenderLabels labels={value}/>,
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          render: () => (
              <Button
                  type="primary"
                  onClick={() => {
                    bindStudentCourse();
                  }}
              >
                绑定课时
              </Button>
          ),
        },
      ];

  /**
   * 模态框关闭事件
   */
  const courseModalClose = () => {
    setModalOpenForCourses(false);
    courseApi.getCourseGroup(oneCourseGroupData.id).then((res) => {
      setOneCourseGroupData(res);
    });
  };

  useEffect(() => {
    getAllCourseGroups();
  }, []);

  return (
      <div>
        <ProTable
            actionRef={tableRef}
            loading={loading}
            formRef={formRef}
            request={async (params) => {
              console.log(params);
              return {
                data: courseGroupInfos
                    .filter((v) => {

                      return v.student.name.includes(params.student?.name ?? '');
                    })
                    .filter((v) => {
                      return v.courseModel.name.includes(params.courseModel?.name ?? '');
                    })
                    .filter((v) => {
                      if (cache.courseCreation.clinicTargetStu.id) {
                        return v.student.name.includes(cache.courseCreation.clinicTargetStu.name)
                      } else {
                        return true
                      }
                    })
                    .map((value) => ({
                      ...value,
                      key: value.id,
                    })),
                success: true,
                total: courseGroupInfos
                    .filter((v) => {
                      return v.student.name.includes(params.student?.name ?? '');
                    })
                    .filter((v) => {
                      return v.courseModel.name.includes(params.courseModel?.name ?? '');
                    })
                    .map((value) => ({
                      ...value,
                      key: value.id,
                    })).length,
              };
            }}
            columns={ColumnForCourseGroups}

        />
        <Drawer
            contentWrapperStyle={{height: 600}}
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
              columns={ColumnForCourseGroupDetails}
              dataSource={oneCourseGroupData.courseModel.details.map(
                  (value, index) => ({
                    ...value,
                    key: index,
                  }),
              )}
          />
          <div>已绑定课程</div>
          <Table
              columns={columnForCourseSChosen}
              dataSource={oneCourseGroupData.courses.map((v) => ({
                ...v,
                key: v.id,
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
            <div className='flex items-center'>
              <Switch checked={showNotFullCoursesOnly} onChange={(e) => {
                setShowNotFullCoursesOnly(e)
              }}/>
              只显示容量有剩余的课程
            </div>
            <div className='flex flex-row mb-4 mt-4 h-6 items-center'>

              <div style={{minWidth: 100}}>模糊搜索:</div>

              <Input
                  style={{margin: "0 4px"}}
                  value={courseFilterTeacherName}
                  onChange={(e) => {
                    setCourseFilterTeacherName(e.target.value);
                  }}
                  prefix={<SearchOutlined/>}
              />
            </div>
            <div className='flex flex-row mb-4 mt-4 h-6 items-center'>

              <div style={{minWidth: 100}}>时长筛选(分钟):</div>

              <Input
                  style={{margin: "0 4px",width:'100px'}}
                  value={filterTime}
                  onChange={(e) => {
                    if (e.target.value) {
                      setFilterTime(parseInt(e.target.value));
                    }else {
                      setFilterTime("")
                    }
                  }}
                  prefix={<SearchOutlined/>}
              />
              <Button onClick={()=>{setFilterTime(30)}}>30</Button>
              <Button onClick={()=>{setFilterTime(40)}}>40</Button>
              <Button onClick={()=>{setFilterTime(60)}}>60</Button>
            </div>

            <Table
                columns={courseSColumns}
                dataSource={availableCourses.filter((v) => {
                  if (filterTime!=="" && filterTime>0.){
                    return (v.times[0].endHour-v.times[0].startHour)*60+(v.times[0].endMinute-v.times[0].startMinute)===filterTime
                  }
                  else {
                    return true
                  }

                }).filter((v) => {
                  if (showNotFullCoursesOnly) return v.maxMember > v.students.length
                  else return true
                }).filter((v) => {

                  if (courseFilterTeacherName === "") {
                    return true
                  } else {

                    return (v.teachers.some((i) => {
                          return i.name.includes(courseFilterTeacherName)
                        }) || v.labels.some((label) => {
                          return label.includes(courseFilterTeacherName)
                        })
                        || v.name.includes(courseFilterTeacherName)
                        || toCn(v.times[0].dayOfWeek).includes(courseFilterTeacherName)
                    )
                  }

                }).map((value) => ({
                  ...value,
                  key: value.id,
                }))}
            />
          </Modal>
        </Drawer>
      </div>
  );
};

export default CourseGroupStatusPage;
