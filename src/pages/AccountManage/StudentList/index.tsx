import accountApi, {
  StudentProfileChangeRequest,
  StudentProfileEntryChangeRequest,
} from '@/apis/account';
import { Button, Divider, Drawer, Input, Progress, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  defaultStudentInfo,
  defaultStudentProfile,
  defaultStudentProfileSchema,
} from '@/@types/accountDefaults';
import {
  attendanceAnalyse,
  defaultFilter,
  Filter,
  openNotification,
  SexFilterOptions,
  SexSelectionOptions,
} from '@/utils/common';
import { toCn } from '@/utils/intl';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import ExcelJS from 'exceljs';
import { getTodayDate } from '@/utils/time';
import { useQuery } from '@tanstack/react-query';

const StudentListPage: React.FC = () => {
  const [studentInfos, setStudentInfos] = useState<Account.StudentInfo[]>([]);
  const [oneStudent, setOneStudent] =
    useState<Account.StudentInfo>(defaultStudentInfo);
  const [drawerOpenForOneStudent, setDrawerOpenForOneStudent] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [modeForPrimaryInfo, setModeForPrimaryInfo] = useState<'edit' | 'read'>(
    'read',
  );
  const [editPrimaryInfo, setEditPrimaryInfo] =
    useState<Account.StudentInfo>(defaultStudentInfo);
  const [studentSchema, setStudentSchema] =
    useState<Account.StudentProfileSchema>(defaultStudentProfileSchema);
  const [drawerOpenForStuProfile, setDrawerOpenForStuProfile] = useState(false);
  const [oneStudentProfile, setOneStudentProfile] =
    useState<Account.StudentProfile>(defaultStudentProfile);
  const [modeForStuProfile, setModeForStuProfile] = useState<'edit' | 'read'>(
    'read',
  );
  const [editStuProfile, setEditStuProfile] = useState<Account.StudentProfile>(
    [],
  );
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [downloadPercent, setDownloadPercent] = useState<number>(0);
  const tableRef = useRef<ActionType>();
  const [drawerOpenForStuAttendance, setDrawerOpenForStuAttendance] =
    useState(false);
  const [stuAttendanceRecord, setStuAttendanceRecord] = useState<
    Course.AttendanceRecord[]
  >([]);

  const { isLoading, data: students } = useQuery(
    ['stu'],
    accountApi.getAllStudents,
  );

  const renderAllStudents = () => {
    setTableLoading(true);
    accountApi.getAllStudents().then((response) => {
      if (response) {
        setStudentInfos(response);
        setTableLoading(false);
        response.forEach(() => {
          // accountApi.updateStudent(v.id,{name:v.user.username})
        });
        if (tableRef.current) {
          tableRef.current.reload();
        }
      } else {
        openNotification('数据加载失败', '网络请求失败', 'error');
        setTableLoading(false);
      }
    });
  };

  const getOneStudent = (student: Account.StudentInfo) => {
    accountApi.getStudent(student.id).then((response) => {
      setOneStudent(response);
      setEditPrimaryInfo(response);
    });
    setDrawerOpenForOneStudent(true);
  };
  const getStudentSchema = () => {
    accountApi.getStudentProfileSchema().then((response) => {
      setStudentSchema(response);
    });
  };
  const setSchemaValue = (studentProfile: Account.StudentProfile) => {
    const oneStuP: Account.StudentProfile = studentSchema.map((v, index) => {
      let n: Account.StudentProfileEntry = {
        schemaEntry: v,
        // value: Array.isArray(v.type) ? v.type[0] : defaultProfileValue[v.type as profileType],
        value: '',
        id: -index,
      } as any;
      studentProfile.forEach((s) => {
        if (s.schemaEntry.id === v.id) {
          // @ts-ignore`
          n = { ...s, value: s.value, id: s.id };
        }
      });
      return n;
    });
    // accountApi.changeStudentProfile(oneStudent.id, oneStuP.map((v) => {
    //   return {schemaEntryId: v.schemaEntry.id, value: v.value}
    // }))

    setOneStudentProfile(oneStuP);
    setEditStuProfile(oneStuP);
  };
  const getOneStudentProfile = (student: Account.StudentInfo) => {
    setOneStudent(student);
    accountApi.getStudentProfile(student.id).then((response) => {
      setOneStudentProfile(response);
      setSchemaValue(response);
      setDrawerOpenForStuProfile(true);
    });
  };
  const updateProfileEntry = (entryId: number, value: string) => {
    const currentReq = [...editStuProfile];
    const newReq: Account.StudentProfile = currentReq.map((v) => {
      if (v.id === entryId) {
        v.value = value;
        return v;
      }
      return v;
    });
    console.log('23213', newReq);
    setEditStuProfile(newReq);
  };
  const subEditPrimaryInfo = () => {
    console.log(editPrimaryInfo);
    accountApi
      .updateStudent(oneStudent.id, editPrimaryInfo)
      .then((response) => {
        if (response.id) {
          getOneStudent(oneStudent);
          renderAllStudents();
          setModeForPrimaryInfo('read');
          openNotification('学生信息修改', '学生信息修改成功', 'success');
        } else {
          openNotification('学生信息修改', '修改失败', 'error');
        }
      });
  };
  const editOrCancelButton = () => {
    if (modeForPrimaryInfo === 'read') {
      setModeForPrimaryInfo('edit');
    } else {
      setModeForPrimaryInfo('read');
    }
    setEditPrimaryInfo(oneStudent);
  };

  const editOrCancelButtonForStuProfile = () => {
    if (modeForStuProfile === 'read') {
      setModeForStuProfile('edit');
      console.log(editStuProfile);
    } else {
      setModeForStuProfile('read');
      setEditStuProfile(oneStudentProfile);
    }
  };
  const subEditStuProfile = () => {
    console.log(editStuProfile);

    const req: StudentProfileChangeRequest = editStuProfile
      .filter((v) => {
        return v.id > 0 || v.value !== '';
      })
      .map((v) => {
        return {
          schemaEntryId: v.schemaEntry.id,
          value: v.value,
        } as StudentProfileEntryChangeRequest;
      });
    console.log(req);

    accountApi.changeStudentProfile(oneStudent.id, req).then(() => {
      getOneStudentProfile(oneStudent);
      setModeForStuProfile('read');
      openNotification('学生档案信息修改', '学生档案信息修改成功', 'success');
      renderAllStudents();
    });
  };

  const getAllStuDownLoadData = () => {
    studentInfos.forEach(() => {});
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

    const stuData = await accountApi.getAllStudents();
    openNotification('导出学生数据', '开始获取学生档案信息', 'info');

    // console.log(stuData, stuSProfile)
    let sum: any[] = [
      [
        '姓名',
        '年龄',
        '性别',
        '出生日期',
        '学号',
        '身份证号',
        '障碍类型',
        '监护人姓名',
        '监护人联系方式',
        '监护人身份证号',
      ],
    ];
    studentSchema.forEach((schema) => {
      sum[0].push(schema.name);
    });
    for (const stu of stuData) {
      const index = stuData.indexOf(stu);
      const thisStuProfile = await accountApi.getStudentProfile(stu.id);
      const oneStuP: any[] = studentSchema.map((v, index) => {
        let n: Account.StudentProfileEntry | any = {
          schemaEntry: v,
          // value: Array.isArray(v.type) ? v.type[0] : defaultProfileValue[v.type as profileType],
          value: '',
          id: -index,
        } as any;
        thisStuProfile.forEach((s) => {
          if (
            s.schemaEntry.id === v.id &&
            s.schemaEntry.type !== 'pic' &&
            s.schemaEntry.type !== 'file'
          ) {
            n = {
              ...s,
              value:
                s.schemaEntry.type !== ('pic' as any) &&
                s.schemaEntry.type !== ('file' as any)
                  ? s.value
                  : '',
              id: s.id,
            };
          }
        });
        return n.value;
      });

      let res: any = [
        stu.name || '空',
        stu.age,
        toCn(stu.sex),
        stu.birth,
        stu.studentNumber,
        stu.idno,
        stu.disorderType,
        stu.parents[0] ? stu.parents[0].name : '空',
        stu.parents[0] ? stu.parents[0].phone : '空',
        stu.parents[0] ? stu.parents[0].idno : '空',
        ...oneStuP,
      ];
      if (index % 3 === 0) {
        setDownloadPercent(Math.ceil((index * 100) / stuData.length));
      }
      sum.push(res);
    }

    const downloadSchema = studentSchema.map((schemaEntry) => {
      return { name: schemaEntry.name, key: schemaEntry.name, width: 100 };
    });

    const columnArr: userTableCol[] = [
      { name: '姓名', key: 'username', width: 100 },
      { name: '年龄', key: 'age', width: 70 },
      { name: '性别', key: 'sex', width: 70 },
      { name: '出生日期', key: 'birth', width: 100 },
      { name: '学号', key: 'studentNumber', width: 200 },
      { name: '身份证号', key: 'indo', width: 300 },
      { name: '障碍类型', key: 'disorderType', width: 100 },
      { name: '监护人姓名', key: 'parentName', width: 100 },
      { name: '监护人联系方式', key: 'parentPhone', width: 150 },
      { name: '监护人身份证号', key: 'parentIdno', width: 300 },
      ...downloadSchema,
    ];

    let sheetName = '学生总表' + getTodayDate() + '.xlsx';
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    });
    console.log(sum);
    type userTableCol = { name: string; key: string; width: number };
    const headerName = '学生信息';
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
      openNotification('导出学生数据', '表格制作完成,自动下载', 'success');
      setDownloadPercent(0);
      writeFile(sheetName, buffer);
    });
  };

  const getOneStudentAttendance = (stu: Account.StudentInfo) => {
    accountApi.getStudentAttendance(stu.id).then((response) => {
      console.log(response);
      setStuAttendanceRecord(response);
    });
    setDrawerOpenForStuAttendance(true);
  };

  const tableColumns: ProColumns<Account.StudentInfo>[] = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      filters: SexFilterOptions,
      onFilter: (value: any, record) => record.sex.indexOf(value) === 0,
      align: 'center',
      render: (_, record) => {
        return <div>{toCn(record.sex)}</div>;
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '编号',
      dataIndex: 'studentNumber',
      align: 'center',
    },
    {
      title: '障碍类型',
      search: false,
      dataIndex: 'disorderType',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      render: (_, record) => {
        return (
          <div>
            {/*<Button*/}
            {/*  onClick={() => {*/}
            {/*    getOneStudent(record);*/}
            {/*  }}*/}
            {/*  type="primary"*/}
            {/*>*/}
            {/*  查看详情*/}
            {/*</Button>*/}
            <Button
              className={'mr-2'}
              onClick={() => {
                getOneStudentAttendance(record);
              }}
            >
              查看出勤记录
            </Button>
            <Button
              onClick={() => {
                getOneStudent(record);
              }}
              type={'primary'}
            >
              查看详情
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    // renderAllStudents();
    getStudentSchema();
  }, []);

  return (
    <div
      style={{
        padding: 30,
      }}
    >
      <div>学生信息管理</div>
      <div className={'flex flex-row'}>
        <Button
          type={'primary'}
          onClick={() => {
            downLoad();
          }}
        >
          导出数据
        </Button>
        <Progress
          style={{ display: downloadPercent === 0 ? 'none' : 'inline' }}
          percent={downloadPercent}
        />
      </div>
      <div
        style={{
          display: downloadPercent === 0 ? 'none' : 'inline',
          color: 'red',
          marginTop: '1rem',
          fontSize: '1.2rem',
        }}
      >
        导出过程中请停留在该页面!
      </div>
      <div
        style={{
          marginTop: 30,
        }}
      >
        <ProTable
          actionRef={tableRef}
          request={async (params) => {
            if (!students) return [];
            console.log(params);
            return {
              data: students
                .filter((v) => {
                  return v.name.includes(params.name ?? '');
                })
                .filter((v) => {
                  return v.age.toString().includes(params.age ?? '');
                })
                .filter((v) => {
                  return v.studentNumber.includes(params.studentNumber ?? '');
                })
                .map((value) => ({
                  ...value,
                  key: value.id,
                })),
              success: true,
              total: students
                .filter((v) => {
                  return v.name.includes(params.name ?? '');
                })
                .filter((v) => {
                  return v.age.toString().includes(params.age ?? '');
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
          columns={tableColumns}
          loading={isLoading}
        />
      </div>

      <Drawer
        open={drawerOpenForOneStudent}
        onClose={() => {
          setDrawerOpenForOneStudent(false);
        }}
        contentWrapperStyle={{ width: 900 }}
        title={'学生基本信息'}
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
                    ? oneStudent.name
                    : editPrimaryInfo.name
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
            <div className="edit-label">
              <div className="edit-label-text">性别:</div>
              <Select
                style={{ width: 176 }}
                options={SexSelectionOptions}
                onChange={(e) =>
                  setEditPrimaryInfo({ ...editPrimaryInfo, sex: e as Sex })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? toCn(oneStudent.sex)
                    : toCn(editPrimaryInfo.sex)
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
          </div>
          <div className="flex flex-row w-full justify-around mt-7">
            <div className="edit-label">
              <div className="edit-label-text">学号:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    idno: e.target.value,
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.idno
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
                    ? oneStudent.age + '--由出生日期推算'
                    : editPrimaryInfo.age + '根据出生日期推算,不可直接修改'
                }
                disabled
              />
            </div>
          </div>
          <div className="flex flex-row w-full justify-around mt-7">
            <div className="edit-label">
              <div className="edit-label-text">障碍类型:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    disorderType: e.target.value,
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.disorderType
                    : editPrimaryInfo.disorderType
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
                    ? oneStudent.birth
                    : editPrimaryInfo.birth
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
          </div>
          <Divider plain>监护人1</Divider>
          <div className="flex flex-row w-full justify-around mt-7">
            <div className="edit-label">
              <div className="edit-label-text">姓名:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    parents: [
                      {
                        ...editPrimaryInfo.parents[0],
                        name: e.target.value,
                      },
                      { ...editPrimaryInfo.parents[1] },
                      { ...editPrimaryInfo.parents[2] },
                    ],
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.parents[0]?.name ?? ''
                    : editPrimaryInfo.parents[0]?.name ?? ''
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
            <div className="edit-label">
              <div className="edit-label-text">电话:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    parents: [
                      {
                        ...editPrimaryInfo.parents[0],
                        phone: e.target.value,
                      },
                      { ...editPrimaryInfo.parents[1] },
                      { ...editPrimaryInfo.parents[2] },
                    ],
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.parents[0]?.phone ?? ''
                    : editPrimaryInfo.parents[0]?.phone ?? ''
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
          </div>
          <Divider plain>监护人2</Divider>
          <div className="flex flex-row w-full justify-around mt-7">
            <div className="edit-label">
              <div className="edit-label-text">姓名:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    parents: [
                      { ...editPrimaryInfo.parents[0] },
                      {
                        ...editPrimaryInfo.parents[1],
                        name: e.target.value,
                      },
                      { ...editPrimaryInfo.parents[2] },
                    ],
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.parents[1]?.name ?? ''
                    : editPrimaryInfo.parents[1]?.name ?? ''
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
            <div className="edit-label">
              <div className="edit-label-text">电话:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    parents: [
                      { ...editPrimaryInfo.parents[0] },
                      {
                        ...editPrimaryInfo.parents[1],
                        phone: e.target.value,
                      },
                      { ...editPrimaryInfo.parents[2] },
                    ],
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.parents[1]?.phone ?? ''
                    : editPrimaryInfo.parents[1]?.phone ?? ''
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
          </div>
          <Divider plain>监护人3</Divider>
          <div className="flex flex-row w-full justify-around mt-7">
            <div className="edit-label">
              <div className="edit-label-text">姓名:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    parents: [
                      { ...editPrimaryInfo.parents[0] },
                      { ...editPrimaryInfo.parents[1] },
                      {
                        ...editPrimaryInfo.parents[2],
                        name: e.target.value,
                      },
                    ],
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.parents[2]?.name ?? ''
                    : editPrimaryInfo.parents[2]?.name ?? ''
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
            <div className="edit-label">
              <div className="edit-label-text">电话:</div>

              <Input
                onChange={(e) =>
                  setEditPrimaryInfo({
                    ...editPrimaryInfo,
                    parents: [
                      { ...editPrimaryInfo.parents[0] },
                      { ...editPrimaryInfo.parents[1] },
                      {
                        ...editPrimaryInfo.parents[2],
                        phone: e.target.value,
                      },
                    ],
                  })
                }
                value={
                  modeForPrimaryInfo === 'read'
                    ? oneStudent.parents[2]?.phone ?? ''
                    : editPrimaryInfo.parents[2]?.phone ?? ''
                }
                disabled={modeForPrimaryInfo === 'read'}
              />
            </div>
          </div>
          <div className="w-full flex justify-around mt-10">
            <Button
              style={{ width: '40%' }}
              type={modeForPrimaryInfo === 'read' ? 'primary' : 'default'}
              onClick={() => {
                editOrCancelButton();
              }}
            >
              {modeForPrimaryInfo === 'read' ? '修改' : '取消'}
            </Button>
            <Button
              style={{ width: '40%' }}
              type={modeForPrimaryInfo === 'read' ? 'default' : 'primary'}
              onClick={() => {
                subEditPrimaryInfo();
              }}
              disabled={modeForPrimaryInfo === 'read'}
            >
              提交
            </Button>
          </div>
        </div>
      </Drawer>
      <Drawer
        open={drawerOpenForStuAttendance}
        contentWrapperStyle={{ width: 900 }}
        onClose={() => {
          setDrawerOpenForStuAttendance(false);
        }}
      >
        {/*<div className={'flex flex-row items-center '} style={{fontSize: '1.5rem'}}>*/}
        {/*  <div className={'mr-5'}>选择查询范围:</div>*/}
        {/*  <RangePicker*/}
        {/*      onChange={(days, dateStrings) => {*/}
        {/*        console.log(dateStrings);*/}
        {/*        setSearchTime({*/}
        {/*          startDate: dateStrings[0],*/}
        {/*          endDate: dateStrings[1],*/}
        {/*        });*/}
        {/*        getTeaLessons(oneTeacher.id, dateStrings[0], dateStrings[1]);*/}
        {/*      }}*/}
        {/*  />*/}
        {/*</div>*/}
        <Divider>课时统计</Divider>
        {/*<Table loading={loadingForLesson} columns={lessonColumns}*/}
        {/*       dataSource={oneTeaLesson.map((v) => ({...v, key: v.id}))}/>*/}
        <div className={'info-label'}>
          <div className={'edit-label-text'} onClick={() => {}}>
            该时段<span style={{ fontWeight: 'bold' }}>总共课时数</span>:
          </div>
          <div>
            {attendanceAnalyse(stuAttendanceRecord).attendedNum +
              attendanceAnalyse(stuAttendanceRecord).attendedNum}
          </div>
        </div>
        <div className={'info-label'}>
          <div className={'edit-label-text'} onClick={() => {}}>
            该时段<span style={{ fontWeight: 'bold' }}>已出勤次数</span>:
          </div>
          <div>{attendanceAnalyse(stuAttendanceRecord).attendedNum}</div>
        </div>
        <div className={'info-label'}>
          <div className={'edit-label-text'} onClick={() => {}}>
            该时段<span style={{ fontWeight: 'bold' }}>未出勤次数</span>:
          </div>
          <div>{attendanceAnalyse(stuAttendanceRecord).attendedNum}</div>
        </div>
      </Drawer>
    </div>
  );
};

export default StudentListPage;
