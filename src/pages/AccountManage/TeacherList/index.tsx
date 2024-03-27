import React, {useEffect, useRef, useState} from 'react';
import teacherApi from '@/apis/account';
import accountApi, {TeacherProfileChangeRequest} from '@/apis/account';
import {Button, DatePicker, Divider, Drawer, Input, Progress, Select, Table, TableColumnsType,} from 'antd';
import {toCn} from '@/utils/intl';
import {defaultTeacherInfo, defaultTeacherProfile, defaultTeacherProfileSchema,} from '@/@types/accountDefaults';
import {
  defaultFilter,
  Filter,
  LevelSelectionOptions,
  openNotification,
  SexFilterOptions,
  SexSelectionOptions,
} from '@/utils/common';
import {RenderItemByType} from '@/utils/simpleComponents';
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-table';
import {getCurrentDateTime, getTodayDate} from '@/utils/time';
import dayjs from 'dayjs';
import ExcelJS from "exceljs";

const {RangePicker} = DatePicker;

interface OneTeaLessonCalcu {
  lessonTotal: number,
  lessonCANCELLED: number,
  lessonINVALID: number,
  lessonPENDING_MAKEUP: number,
  lessonCOMPLETED_MAKEUP: number,
  lessonNOT_STARTED: number,
  lessonFINISHED: number,
  lessonRESCHEDULED_PENDING: number,
  lessonRESCHEDULED_COMPLETED: number
}

const defaultOneTeaLessonCalcu: OneTeaLessonCalcu = {
  lessonCOMPLETED_MAKEUP: 0,
  lessonFINISHED: 0,
  lessonINVALID: 0,
  lessonNOT_STARTED: 0,
  lessonPENDING_MAKEUP: 0,
  lessonRESCHEDULED_COMPLETED: 0,
  lessonRESCHEDULED_PENDING: 0,
  lessonTotal: 0,
  lessonCANCELLED: 0
}
const TeacherList: React.FC = () => {
  const [allTeachers, setAllTeachers] = useState<Account.TeacherInfo[]>([]);
  const [tableLoadingForTeachers, setTableLoadingForTeachers] = useState(false);
  const [oneTeacher, setOneTeacher] =
      useState<Account.TeacherInfo>(defaultTeacherInfo);
  const [drawerOpenForOneTeacher, setDrawerOpenForOneTeacher] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [modeForPrimaryInfo, setModeForPrimaryInfo] = useState<'edit' | 'read'>(
      'read',
  );
  const [editPrimaryInfo, setEditPrimaryInfo] =
      useState<Account.TeacherInfo>(defaultTeacherInfo);
  const [teacherSchema, setTeacherSchema] =
      useState<Account.TeacherProfileSchema>(defaultTeacherProfileSchema);
  const [drawerOpenForTeaProfile, setDrawerOpenForTeaProfile] = useState(false);
  const [oneTeacherProfile, setOneTeacherProfile] =
      useState<Account.TeacherProfile>(defaultTeacherProfile);
  const [modeForTeaProfile, setModeForTeaProfile] = useState<'edit' | 'read'>(
      'read',
  );
  const [editTeaProfile, setEditTeaProfile] = useState<Account.StudentProfile>(
      [],
  );
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const tableRef = useRef<ActionType>();
  const [drawerOpenForTeaGrade, setDrawerOpenForTeaGrade] = useState(false);
  const currentDateTime = getCurrentDateTime();
  const [loadingForLesson, setLoadingForLesson] = useState(false)
  const [searchTime, setSearchTime] = useState({
    startDate: '2023-01-01',
    endDate: '2023-01-31',
  });
  const [oneTeaLesson, setOneTeaLesson] = useState<Course.LessonInfo[]>([]);
  const [downloadPercent, setDownloadPercent] = useState<number>(0)

  const [oneTeaLessonCalcu, setOneTeaLessonCalcu] = useState<OneTeaLessonCalcu>(defaultOneTeaLessonCalcu)
  const getALlTea = () => {
    setTableLoadingForTeachers(true);
    teacherApi.getAllTeachers().then((response) => {
      setAllTeachers(response);
      setTableLoadingForTeachers(false);
      if (tableRef.current) {
        tableRef.current.reload();
      }
    });
  };
  const getOneTeacher = (teacher: Account.TeacherInfo) => {
    accountApi.getTeacher(teacher.id).then((response) => {
      setOneTeacher(response);
      setEditPrimaryInfo(response);
    });
    setDrawerOpenForOneTeacher(true);
  };

  const getTeacherSchema = () => {
    accountApi.getTeacherProfileSchema().then((response) => {
      setTeacherSchema(response);
    });
  };
  const setSchemaValue = (teacherProfile: Account.TeacherProfile) => {
    const oneTeaP: Account.TeacherProfile = teacherSchema.map((v, index) => {
      let n: Account.TeacherProfileEntry = {
        schemaEntry: v,
        value: '',
        id: -index,
      } as any;
      teacherProfile.forEach((s) => {
        if (s.schemaEntry.id === v.id) {
          console.log(s.schemaEntry.id, v.id);
          // @ts-ignore`
          n = {...s, value: s.value};
        }
      });
      return n;
    });
    setOneTeacherProfile(oneTeaP);
    setEditTeaProfile(oneTeaP);
  };
  const getOneTeacherProfile = (teacher: Account.TeacherInfo) => {
    setOneTeacher(teacher);
    accountApi.getTeacherProfile(teacher.id).then((response) => {
      setOneTeacherProfile(response);
      setSchemaValue(response);
    });
  };
  const updateProfileEntry = (entryId: number, value: string) => {
    const currentReq = [...editTeaProfile];
    const newReq: Account.TeacherProfile = currentReq.map((v) => {
      if (v.id === entryId) {
        v.value = value;
        return v;
      }
      return v;
    });
    setEditTeaProfile(newReq);
  };
  const subEditPrimaryInfo = () => {
    console.log(editPrimaryInfo);
    accountApi
        .updateTeacher(oneTeacher.id, editPrimaryInfo)
        .then((response) => {
          if (response.id) {
            getALlTea();
            getOneTeacher(oneTeacher);
            setModeForPrimaryInfo('read');
            openNotification('教师信息修改', '教师信息修改成功', 'success');
          } else {
            openNotification('教师信息修改', '修改失败', 'error');
          }
        });
  };

  const editOrCancelButton = () => {
    if (modeForPrimaryInfo === 'read') {
      setModeForPrimaryInfo('edit');
    } else {
      setModeForPrimaryInfo('read');
    }
    setEditPrimaryInfo(oneTeacher);
  };

  const editOrCancelButtonForStuProfile = () => {
    if (modeForTeaProfile === 'read') {
      setModeForTeaProfile('edit');
      console.log(editTeaProfile);
    } else {
      setModeForTeaProfile('read');
      setEditTeaProfile(oneTeacherProfile);
    }
  };
  // console.log(editStuProfile);
  //
  // const req: StudentProfileChangeRequest = editStuProfile.filter((v) => {
  //   return v.id > 0 || v.value !== ""
  // }).map((v) => {
  //   return {
  //     schemaEntryId: v.schemaEntry.id,
  //     value: v.value,
  //   } as StudentProfileEntryChangeRequest;
  // });
  // console.log(req)
  //
  // accountApi.changeStudentProfile(oneStudent.id, req).then(() => {
  //   getOneStudentProfile(oneStudent);
  //   setModeForStuProfile('read');
  //   openNotification('学生档案信息修改', '学生档案信息修改成功', 'success');
  //   renderAllStudents();
  // });
  const subEditTeaProfile = () => {
    console.log(editTeaProfile);
    // @ts-ignore
    const req: TeacherProfileChangeRequest = editTeaProfile.filter((v) => {
      return v.id > 0 || v.value !== ""
    }).map((v) => {
      return {schemaEntryId: v.schemaEntry.id, value: v.value};
    });
    accountApi.changeTeacherProfile(oneTeacher.id, req).then((response) => {
      console.log(response);
      getOneTeacherProfile(oneTeacher);
      setModeForTeaProfile('read');
      getALlTea();
      openNotification('教师档案信息修改', '教师档案信息修改成功', 'success');
    });
  };
  const getTeaLessons = (id: number, startTime: string, endTime: string) => {
    setLoadingForLesson(true)
    accountApi
        .getTeacherLessons(
            id,
            startTime,
            endTime,
        )
        .then((response: Course.LessonInfo[]) => {
          if (response.length > 0) {
            console.log(response)
            setOneTeaLesson(response);
            setOneTeaLessonCalcu({
              lessonTotal: response.length,
              lessonCOMPLETED_MAKEUP: response.filter((lesson) => (lesson.status === 'COMPLETED_MAKEUP')).length,
              lessonFINISHED: response.filter((lesson) => (lesson.status === 'FINISHED')).length,
              lessonINVALID: response.filter((lesson) => (lesson.status === 'INVALID')).length,
              lessonNOT_STARTED: response.filter((lesson) => (lesson.status === 'NOT_STARTED')).length,
              lessonPENDING_MAKEUP: response.filter((lesson) => (lesson.status === 'PENDING_MAKEUP')).length,
              lessonRESCHEDULED_COMPLETED: response.filter((lesson) => (lesson.status === 'RESCHEDULED_COMPLETED')).length,
              lessonRESCHEDULED_PENDING: response.filter((lesson) => (lesson.status === 'RESCHEDULED_PENDING')).length,
              lessonCANCELLED: response.filter((lesson) => (lesson.status === 'CANCELLED')).length
            })
          } else {
            setOneTeaLesson(response);
            setOneTeaLessonCalcu(defaultOneTeaLessonCalcu)
          }


          setLoadingForLesson(false)
        });
  };
  const teaGrade = (tea: Account.TeacherInfo) => {
    setDrawerOpenForTeaGrade(true);
    setOneTeacher(tea);
    getTeaLessons(tea.id, searchTime.startDate, searchTime.endDate)
  };

  const writeFile = (fileName: string, content: ExcelJS.Buffer) => {
    const link = document.createElement('a');
    const blob = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
  };
  /*  请求teahcer stu*/
  const downLoad = async () => {

    let workbook = new ExcelJS.Workbook();

    const teaData = await accountApi.getAllTeachers()
    openNotification('导出教师数据', '开始获取教师档案信息', 'info')

    // console.log(stuData, stuSProfile)
    let sum: any[] = [['姓名', '年龄', '性别', '出生日期', '教师工号', '身份证号', '部门', '联系方式', '模式']]
    teacherSchema.forEach((schema) => {
      sum[0].push(schema.name)
    })
    for (const tea of teaData) {
      const index = teaData.indexOf(tea);
      const thisTeaProfile = await accountApi.getTeacherProfile(tea.id)
      const oneStuP: any[] = teacherSchema.map((v, index) => {
        let n: Account.StudentProfileEntry = {
          schemaEntry: v,
          // value: Array.isArray(v.type) ? v.type[0] : defaultProfileValue[v.type as profileType],
          value: '',
          id: -index
        } as any;
        thisTeaProfile.forEach((s) => {
          if (s.schemaEntry.id === v.id) {
            // @ts-ignore`
            n = {...s, value: (s.schemaEntry.type !== 'pic' && s.schemaEntry.type !== 'file') ? s.value : '', id: s.id};
          }
        });
        return n.value;
      });

      let res: any = [tea.name || '空', tea.age, toCn(tea.sex), tea.birth, tea.staffNumber,
        tea.idno, tea.department, tea.phone, tea.position, ...oneStuP]
      if (index % 3 === 0) {
        setDownloadPercent(Math.ceil(index * 100 / teaData.length))
      }
      sum.push(res)
    }


    const downloadSchema = teacherSchema.map((schemaEntry) => {
      return {name: schemaEntry.name, key: schemaEntry.name, width: 100}
    })

    const columnArr: userTableCol[] = [
      {name: '姓名', key: 'username', width: 100},
      {name: '年龄', key: 'age', width: 70},
      {name: '性别', key: 'sex', width: 70},
      {name: '出生日期', key: 'birth', width: 70},
      {name: '教职工号', key: 'staffNumber', width: 200},
      {name: '身份证号', key: 'indo', width: 300},
      {name: '部门', key: 'department', width: 100},
      {name: '联系方式', key: 'phone', width: 150},
      {name: '模式', key: 'position', width: 300},
      ...downloadSchema
    ];


    let sheetName = '教师总表' + getTodayDate() + '.xlsx';
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{showGridLines: true}],
    });
    console.log(sum)
    type userTableCol = { name: string; key: string; width: number };
    const headerName = '教师信息';
    sheet.addTable({
      name: headerName,
      ref: 'A1', // 主要数据从A5单元格开始
      headerRow: false,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium2',
        showRowStripes: false,
      },
      columns: columnArr,
      rows: sum,
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      openNotification('导出教师数据', '表格制作完成,自动下载', 'success')
      setDownloadPercent(0)
      writeFile(sheetName, buffer);
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
      render: (_, record) => <Button onClick={() => {
      }}>详情</Button>,
    },
  ];
  const tableColumns: ProColumns<Account.TeacherInfo>[] = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      search: false,
      filters: SexFilterOptions,
      onFilter: (value: any, record) => record.sex.indexOf(value) === 0,
      align: 'center',
      render: (_, record) => {
        return <div>{toCn(record.sex)}</div>;
      },
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
      search: false,
      render: (_, record) => (
          <div>

            <Button
                type="primary"
                onClick={() => {
                  // setTimeTableTeacherId(record.id);
                  getOneTeacher(record);
                  getOneTeacherProfile(record);
                }}
            >
              查看详情
            </Button>
            {/*<Button*/}
            {/*    onClick={() => {*/}
            {/*      // setTimeTableTeacherId(record.id);*/}

            {/*    }}*/}
            {/*>*/}
            {/*  查看档案*/}
            {/*</Button>*/}
            <Button
                onClick={() => {
                  teaGrade(record);
                }}
            >
              查看绩效
            </Button>
          </div>
      ),
    },
  ];
  useEffect(() => {
    getALlTea();
    getTeacherSchema();
  }, []);
  return (
      <div
          style={{
            padding: 30,
          }}
      >
        <div>教师信息管理</div>
        <div className={'flex flex-row'}>
          <Button type={"primary"} onClick={() => {
            downLoad()
          }}>导出数据</Button>
          <Progress style={{display: downloadPercent === 0 ? 'none' : 'inline'}} percent={downloadPercent}/>
        </div>
        <div
            style={{
              display: downloadPercent === 0 ? 'none' : 'inline',
              color: 'red',
              marginTop: '1rem',
              fontSize: '1.2rem'
            }}>导出过程中请停留在该页面!
        </div>

        <ProTable
            actionRef={tableRef}
            request={async (params) => {
              console.log(params);
              return {
                data: allTeachers
                    .filter((v) => {
                      return v.name.includes(params.name ?? '');
                    })
                    .map((value) => ({
                      ...value,
                      key: value.id,
                    })),
                success: true,
                total: allTeachers
                    .filter((v) => {
                      return v.name.includes(params.name ?? '');
                    })
                    .map((value) => ({
                      ...value,
                      key: value.id,
                    })).length,
              };
            }}
            loading={tableLoadingForTeachers}
            columns={tableColumns}
        />
        <Drawer
            open={drawerOpenForOneTeacher}
            onClose={() => {
              {
                setDrawerOpenForOneTeacher(false);
              }
            }}
            contentWrapperStyle={{width: 900}}
            title={'教师基本信息'}
        >
          <div>
            <div className="flex flex-row w-full justify-around mt-7">
              <div className="edit-label">
                <div className="edit-label-text">姓名:</div>

                <Input
                    onChange={(e) =>
                        setEditPrimaryInfo({
                          ...editPrimaryInfo,
                          name: e.target.value,
                        })
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.name
                          : editPrimaryInfo.name
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
              <div className="edit-label">
                <div className="edit-label-text">性别:</div>
                <Select
                    style={{width: 176}}
                    options={SexSelectionOptions}
                    onChange={(e) =>
                        setEditPrimaryInfo({...editPrimaryInfo, sex: e as Sex})
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? toCn(oneTeacher.sex)
                          : toCn(editPrimaryInfo.sex)
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
            </div>
            <div className="flex flex-row w-full justify-around mt-7">
              <div className="edit-label">
                <div className="edit-label-text">编号:</div>

                <Input
                    onChange={(e) =>
                        setEditPrimaryInfo({
                          ...editPrimaryInfo,
                          idno: e.target.value,
                        })
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.idno
                          : editPrimaryInfo.idno
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
              <div className="edit-label">
                <div className="edit-label-text">年龄:</div>

                <Input
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.age + '--由出生日期推算'
                          : editPrimaryInfo.age + '根据出生日期推算,不可直接修改'
                    }
                    disabled
                />
              </div>
            </div>
            <div className="flex flex-row w-full justify-around mt-7">
              <div className="edit-label">
                <div className="edit-label-text">部门:</div>

                <Input
                    onChange={(e) =>
                        setEditPrimaryInfo({
                          ...editPrimaryInfo,
                          department: e.target.value,
                        })
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.department
                          : editPrimaryInfo.department
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
              <div className="edit-label">
                <div className="edit-label-text">出生日期:</div>

                <Input
                    onChange={(e) =>
                        setEditPrimaryInfo({
                          ...editPrimaryInfo,
                          birth: e.target.value,
                        })
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.birth
                          : editPrimaryInfo.birth
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
            </div>
            <div className="flex flex-row w-full justify-around mt-7">
              <div className="edit-label">
                <div className="edit-label-text">级别:</div>

                <Select
                    options={LevelSelectionOptions}
                    style={{width: 176}}
                    onChange={(e) =>
                        setEditPrimaryInfo({...editPrimaryInfo, position: e})
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.position
                          : editPrimaryInfo.position
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
              <div className="edit-label">
                <div className="edit-label-text">联系电话:</div>

                <Input
                    onChange={(e) =>
                        setEditPrimaryInfo({
                          ...editPrimaryInfo,
                          phone: e.target.value,
                        })
                    }
                    value={
                      modeForPrimaryInfo === 'read'
                          ? oneTeacher.phone
                          : editPrimaryInfo.phone
                    }
                    disabled={modeForPrimaryInfo === 'read'}
                />
              </div>
            </div>
            <div className="w-full flex justify-around mt-10">
              <Button
                  style={{width: '40%'}}
                  type={modeForPrimaryInfo === 'read' ? 'primary' : 'default'}
                  onClick={() => {
                    editOrCancelButton();
                  }}
              >
                {modeForPrimaryInfo === 'read' ? '修改' : '取消'}
              </Button>
              <Button
                  style={{width: '40%'}}
                  type={modeForPrimaryInfo === 'read' ? 'default' : 'primary'}
                  onClick={() => {
                    subEditPrimaryInfo();
                  }}
                  disabled={modeForPrimaryInfo === 'read'}
              >
                提交
              </Button>
            </div>

            <Divider>更多信息</Divider>
            <div className="w-3/4">
              {modeForTeaProfile === 'read'
                  ? oneTeacherProfile.map((profileEntry, index) => {
                    return (
                        <div
                            className="edit-label-ForTea mt-4"
                            key={profileEntry.id}
                        >
                          <div className="edit-label-text-ForTea">
                            {profileEntry.schemaEntry.name}
                          </div>
                          <RenderItemByType
                              myChange={(e: any) => {
                              }}
                              disabled={true}
                              value={profileEntry.value}
                              forModel={true}
                              entry={profileEntry.schemaEntry}
                          />
                        </div>
                    );
                  })
                  : editTeaProfile.map((profileEntry, index) => {
                    editTeaProfile.forEach((v) => {
                      if (v.id === profileEntry.id) {
                      }
                    });

                    return (
                        <div
                            className="edit-label-ForTea mt-4"
                            key={profileEntry.id}
                        >
                          <div className="edit-label-text-ForTea">
                            {profileEntry.schemaEntry.name}
                          </div>
                          <RenderItemByType
                              myChange={(e: any) => {
                                updateProfileEntry(profileEntry.id, e);
                              }}
                              disabled={false}
                              value={profileEntry.value}
                              entry={profileEntry.schemaEntry}
                          />
                        </div>
                    );
                  })}

              <div className="w-full flex justify-around mt-10">
                <Button
                    style={{width: '40%'}}
                    type={modeForTeaProfile === 'read' ? 'primary' : 'default'}
                    onClick={() => {
                      editOrCancelButtonForStuProfile();
                    }}
                >
                  {modeForTeaProfile === 'read' ? '修改' : '取消'}
                </Button>
                <Button
                    style={{width: '40%'}}
                    type={modeForTeaProfile === 'read' ? 'default' : 'primary'}
                    onClick={() => {
                      subEditTeaProfile();
                    }}
                    disabled={modeForTeaProfile === 'read'}
                >
                  提交
                </Button>
              </div>
            </div>

          </div>
        </Drawer>

        <Drawer
            open={drawerOpenForTeaGrade}
            contentWrapperStyle={{width: 900}}
            onClose={() => {
              setDrawerOpenForTeaGrade(false);
            }}
        >
          <div className={'flex flex-row items-center '} style={{fontSize: '1.5rem'}}>
            <div className={'mr-5'}>选择查询范围:</div>
            <RangePicker
                onChange={(days, dateStrings) => {
                  console.log(dateStrings);
                  setSearchTime({
                    startDate: dateStrings[0],
                    endDate: dateStrings[1],
                  });
                  getTeaLessons(oneTeacher.id, dateStrings[0], dateStrings[1]);
                }}
            />
          </div>
          <Divider>课时统计</Divider>
          <Table loading={loadingForLesson} columns={lessonColumns}
                 dataSource={oneTeaLesson.map((v) => ({...v, key: v.id}))}/>
          <div className={'info-label'}>
            <div className={'edit-label-text'} onClick={() => {
              console.log(oneTeaLessonCalcu)
            }}>该时段<span style={{fontWeight: "bold"}}>总共课时数</span>:
            </div>
            <div>{oneTeaLessonCalcu.lessonTotal}</div>
          </div>

          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>正常完成</span>课时数:</div>
            <div>{oneTeaLessonCalcu.lessonFINISHED}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>尚未完成(消课)</span>课时数:
            </div>
            <div>{oneTeaLessonCalcu.lessonNOT_STARTED}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>被调课时数</span>:</div>
            <div>{oneTeaLessonCalcu.lessonCANCELLED}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>调课已上</span>课时数:</div>
            <div>{oneTeaLessonCalcu.lessonRESCHEDULED_COMPLETED}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>调课未上</span>课时数:</div>
            <div>{oneTeaLessonCalcu.lessonRESCHEDULED_PENDING}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>无效</span>课时数:</div>
            <div>{oneTeaLessonCalcu.lessonINVALID}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>无效已补</span>回课时数:</div>
            <div>{oneTeaLessonCalcu.lessonCOMPLETED_MAKEUP}</div>
          </div>
          <div className={'info-label mt-3'}>
            <div className={'edit-label-text'}>该时段<span style={{fontWeight: "bold"}}>无效未补回</span>课时数:</div>
            <div>{oneTeaLessonCalcu.lessonPENDING_MAKEUP}</div>
          </div>
        </Drawer>
      </div>
  );
};
export default TeacherList;
