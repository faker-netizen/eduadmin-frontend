import accountApi from '@/apis/account';
import courseApi from '@/apis/course';
import {Button, Select} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import ClassCreationModal from './ClassCreationModal';
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-table";
import TableCourse from "@/components/tableCourse";
import {defaultClassInfo} from "@/@types/courseDefaults";
import {defaultTimescalePreset} from "@/@types/presetDefaults";
import {TimeSpan} from "@/components/CourseGrid";
import presetApi from "@/apis/preset";

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

const CourseManagePage: React.FC = () => {
  /* 课表 */
  const [timeTableClazz, setTimeTableClazz] = useState<Course.ClassInfo>(defaultClassInfo);
  /* 信息列表 */
  const [teacherInfos, setTeacherInfos] = useState<Account.TeacherInfo[]>([]);
  const [studentInfos, setStudentInfos] = useState<Account.StudentInfo[]>([]);
  const [classroomInfos, setClassroomInfos] = useState<Course.ClassroomInfo[]>(
      [],
  );
  /* Table */

  const [classInfos, setClassInfos] = useState<Course.ClassInfo[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  /* Modal & Drawer */
  const [courseCreationDrawerOpen, setCourseCreationDrawerOpen] =
      useState(false);
  const [classCreationModalOpen, setClassCreationModalOpen] = useState(false);
  const [currentScale, setCurrentScale] = useState<Preset.TimescalePresetInfo>({
    ...defaultTimescalePreset,
    value: timeScale
  })
  const [timeScales, setTimeScales] = useState<Preset.TimescalePresetInfo[]>([])

  const tableRef = useRef<ActionType>();
  const tableColumns: ProColumns<Course.ClassInfo>[] = [
    {
      title: '班级名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '班主任',
      dataIndex: 'adviser',
      key: 'adviser',
      align: 'center',
      renderText: (_, record) => (record.adviser.name)
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '操作',
      search: false,
      key: 'operation',
      align: 'center',
      render: (_, record) => (
          <div className="flex flex-row justify-around">
            {/*<Button type="primary">详情</Button>*/}
            <Button
                type="primary"
                onClick={() => {
                  setTimeTableClazz(record);
                }}
            >
              课表
            </Button>
            <Button danger>删除</Button>
          </div>
      ),
    },
  ];
  const getALlTimeScale = () => {
    presetApi.getAllTimescalePresets().then((response) => {
      setTimeScales(response)
      setCurrentScale(response[0])
    })
  }
  /* 初始化页面信息 */
  useEffect(() => {
    getALlTimeScale()
    accountApi.getAllStudents().then(setStudentInfos);
    accountApi.getAllTeachers().then(setTeacherInfos);
    courseApi
        .getAllClasses()
        .then(setClassInfos)
        .then(() => {
          setTableLoading(false);
        });
    courseApi.getAllClassrooms().then(setClassroomInfos);
  }, []);
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current?.reload()
    }
  }, [classInfos])

  return (
      <>
        <div className="p-8">
          <Button
              type="primary"
              size="large"
              onClick={() => {
                setClassCreationModalOpen(true);
              }}
          >
            新建班级
          </Button>
          <ProTable
              actionRef={tableRef}
              request={async (params) => {
                console.log(params);
                return {
                  data: classInfos
                      .filter((v) => {
                        return v.name.includes(params.name ?? '');
                      })
                      .map((value) => ({
                        ...value,
                        key: value.id,
                      })),
                  success: true,
                  total: classInfos
                      .filter((v) => {
                        return v.name.includes(params.name ?? '');
                      })
                      .map((value) => ({
                        ...value,
                        key: value.id,
                      })).length,
                };
              }}
              loading={tableLoading}

              columns={tableColumns}
          />

          {/*课表*/}

          <div className={'info-label'}>
            <div>选择时间轴</div>
            <Select
                value={currentScale.id}
                style={{width: 300}}
                options={timeScales.map((v) => {
                  return {label: v.name, value: v.id}
                })}
                onChange={(e) => {
                  const currentTime = timeScales.filter((v) => (v.id === e))[0]
                  setCurrentScale(currentTime)
                }}
            />
          </div>
          <TableCourse type={'class'} scale={currentScale} infos={timeTableClazz}/>
        </div>

        {/* 班级创建面板 */}
        <ClassCreationModal
            open={classCreationModalOpen}
            onSubmit={() => {
              setClassCreationModalOpen(false);
              setClassInfos([]);
              setTableLoading(true);
              courseApi
                  .getAllClasses()
                  .then(setClassInfos)
                  .then(() => {
                    setTableLoading(false);
                  }); // 重新渲染班级信息
            }}
            onCancel={() => {
              setClassCreationModalOpen(false);
            }}
            teacherInfos={teacherInfos}
            studentInfos={studentInfos}
        />


      </>
  );
};

export default CourseManagePage;
