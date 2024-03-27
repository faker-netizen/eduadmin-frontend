import accountApi from '@/apis/account';
import { toCn } from '@/utils/intl';
import { Button, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import {
  openNotification,
  SexFilterOptions,
  uniqueFuncForStu,
} from '@/utils/common';
import { TimeSpan } from '@/components/CourseGrid';
import TableCourse from '@/components/tableCourse';
import { defaultTeacherInfo } from '@/@types/accountDefaults';
import { useModel } from '@umijs/max';
import presetApi from '@/apis/preset';
import { defaultTimescalePreset } from '@/@types/presetDefaults';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';

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
const TeacherCoursePage: React.FC = () => {
  const [timeTableTeacher, setTimeTableTeacher] =
    useState<Account.TeacherInfo>(defaultTeacherInfo);
  const [teacherInfos, setTeacherInfos] = useState<Account.TeacherInfo[]>([]);
  const [filterName, setFilterName] = useState<string>('');
  const [tableLoadingForTeacher, setTableLoadingForTeacher] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [currentScale, setCurrentScale] = useState<Preset.TimescalePresetInfo>({
    ...defaultTimescalePreset,
    value: timeScale,
  });
  const tableRefForStu = useRef<ActionType>();
  const [studentInfos, setStudentInfos] = useState<Account.StudentInfo[]>([]);
  const tableRefForTea = useRef<ActionType>();
  const [timeScales, setTimeScales] = useState<Preset.TimescalePresetInfo[]>(
    [],
  );
  const { cache } = useModel('cacheModel');
  const tableColumnsForStu: ProColumns<Account.StudentInfo>[] = [
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
            {/*    onClick={() => {*/}
            {/*      getOneStudent(record);*/}
            {/*    }}*/}
            {/*    type="primary"*/}
            {/*>*/}
            {/*  查看详情*/}
            {/*</Button>*/}
            <Button
              className={'mr-2'}
              onClick={() => {
                // getOneStudentAttendance(record);
              }}
            >
              查看出勤记录
            </Button>
            <Button
              onClick={() => {
                // getOneStudentProfile(record);
              }}
              type={'primary'}
            >
              查看账单
            </Button>
          </div>
        );
      },
    },
  ];
  const tableColumns: ProColumns<Account.TeacherInfo>[] = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      filters: [{ text: filterName, value: filterName }],
      onFilter: (_, record) => record.name.search(filterName) !== -1,
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
        <div>
          <Button
            type="primary"
            onClick={() => {
              setTimeTableTeacher(record);
            }}
          >
            查看课表
          </Button>
          <Button
              type="primary"
              onClick={() => {
               getStudentsOfATea(record)
              }}
           >查看所属学生</Button>
        </div>
      ),
    },
  ];
  const getStudentsOfATea = (tea: Account.TeacherInfo) => {
    let arr: Account.StudentInfo[][] = [];
    accountApi.getTeacherCourses(tea.id).then((response) => {
      arr = response.map((c) => c.students);
    });
    const unReducedStus = arr.flat();
    const reducedStud = uniqueFuncForStu(unReducedStus);
    console.log(reducedStud);
    setStudentInfos(reducedStud);
  };
  const getAllTeachers = () => {
    setTableLoadingForTeacher(true);
    accountApi.getAllTeachers().then((response) => {
      if (response) {
        setTeacherInfos(response);
        setTableLoadingForTeacher(false);
        if (tableRefForTea.current) {
          tableRefForTea.current.reload();
        }
      } else {
        openNotification('信息加载', '教师信息加载失败', 'error');
        setTableLoadingForTeacher(false);
      }
    });
  };
  const getALlTimeScale = () => {
    presetApi.getAllTimescalePresets().then((response) => {
      setTimeScales(response);
      setCurrentScale(response[0]);
    });
  };
  /* 初始化表格信息 */
  useEffect(() => {
    getAllTeachers();
    getALlTimeScale();
  }, []);

  return (
    <div className="p-8">
      <ProTable
        actionRef={tableRefForTea}
        request={async (params) => {
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
        loading={tableLoadingForTeacher}
      />

      <div className={'info-label'}>
        <div>选择时间轴</div>
        <Select
          value={currentScale.id}
          style={{ width: 300 }}
          options={timeScales.map((v) => {
            return { label: v.name, value: v.id };
          })}
          onChange={(e) => {
            const currentTime = timeScales.filter((v) => v.id === e)[0];
            setCurrentScale(currentTime);
          }}
        />
      </div>
      <TableCourse
        type={'teacher'}
        scale={currentScale}
        infos={timeTableTeacher}
      />
      <ProTable
        actionRef={tableRefForStu}
        request={async (params) => {
          console.log(params);
          return {
            data: studentInfos
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
            total: studentInfos
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
        columns={tableColumnsForStu}
      />
    </div>
  );
};
export default TeacherCoursePage;
