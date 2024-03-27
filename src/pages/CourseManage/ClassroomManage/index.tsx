import courseApi, { defaultClassroomUpdateRequest } from '@/apis/course';
import { openNotification } from '@/utils/common';
import { Button, Drawer, Input, Select, Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react';
import { defaultClassroomInfo } from '@/@types/courseDefaults';
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
const ClassroomManagePage: React.FC = () => {
  const [classroomInfos, setClassroomInfos] = useState<Course.ClassroomInfo[]>(
    [],
  );
  const [open, setOpen] = useState(false);
  const [aClassroom, setAClassroom] = useState('');
  const [timeTableClassroom, setTimeTableClassroom] =
    useState<Course.ClassroomInfo>(defaultClassroomInfo);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [classroomUpdateRequestWithId, setClassroomUpdateRequestWithId] =
    useState({ ...defaultClassroomUpdateRequest, id: 0 });
    const [currentScale, setCurrentScale] = useState<Preset.TimescalePresetInfo>({
        ...defaultTimescalePreset,
        value: timeScale,
    });
    const [timeScales, setTimeScales] = useState<Preset.TimescalePresetInfo[]>(
        [],
    );
  const tableColumns: TableColumnsType<Course.ClassroomInfo> = [
    {
      title: '教室名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (value, record) => (
        <>
          <Button
            onClick={() => {
              setTimeTableClassroom(record);
            }}
          >
            查看课表
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
              setClassroomUpdateRequestWithId(value);
              setMode('edit');
            }}
          >
            修改名称
          </Button>
          <Button
            danger
            style={{ marginLeft: 15 }}
            onClick={() => {
              courseApi.deleteClassroom(record.id);
            }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];
    const getALlTimeScale = () => {
        presetApi.getAllTimescalePresets().then((response) => {
            setTimeScales(response);
            setCurrentScale(response[0]);
        });
    };
  /* 初始化表格内容 */
  useEffect(() => {
    courseApi.getAllClassrooms().then(setClassroomInfos);
      getALlTimeScale();
  }, []);

  useEffect(() => {
    if (!open) {
      setClassroomUpdateRequestWithId({ id: 0, name: '' });
      setAClassroom('');
    }
  }, [open]);

  const addClassroom = () => {
    if (aClassroom === '') {
      openNotification('表单不完整', '教室名称不能为空', 'warning', 'topLeft');
    }

    if (aClassroom.length > 0) {
      courseApi.createClassroom({ name: aClassroom }).then((res) => {
        console.log(res);
        if (res.id) {
          setOpen(false);
          openNotification('新建教室', '已添加一个教室', 'success', 'topRight');
        }

        courseApi.getAllClassrooms().then(setClassroomInfos); // 重新渲染表格内容
      });
    }
  };

  const editClassroom = async () => {
    if (classroomUpdateRequestWithId) {
      const response = await courseApi.updateClassroom(
        classroomUpdateRequestWithId.id,
        classroomUpdateRequestWithId,
      );

      if (response.id) {
        openNotification('修改教室', '已成功修改教室', 'success', 'topRight');
        setOpen(false);
      }

      courseApi.getAllClassrooms().then(setClassroomInfos); // 重新渲染表格内容
    }
  };

  return (
    <div className="flex flex-col p-8">
      <div className="w-full">
        <Button
          size="large"
          type="primary"
          onClick={() => {
            setOpen(true);
            setMode('create');
          }}
        >
          新建教室
        </Button>
      </div>

      <Drawer
        title="新建教室"
        placement="right"
        contentWrapperStyle={{
          width: 800,
        }}
        onClose={() => {
          setOpen(false);
        }}
        extra={
          <div
            className="flex flex-row justify-around items-center"
            style={{
              height: 90,
              width: 300,
              marginRight: 30,
            }}
          >
            <Button
              size="large"
              type="primary"
              onClick={() => {
                if (mode === 'create') {
                  addClassroom();
                } else {
                  editClassroom();
                }
              }}
            >
              {mode === 'create' ? '添加' : '提交修改'}
            </Button>
            <Button
              size="large"
              onClick={() => {
                setOpen(false);
              }}
              style={{
                height: '70%',
                width: 100,
                borderRadius: 5,
              }}
            >
              关闭
            </Button>
          </div>
        }
        headerStyle={{
          height: '220px',
        }}
        open={open}
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: 30 }}>教室名称</div>
        <div>
          <Input
            style={{ width: 400, height: 70 }}
            value={
              mode === 'create' ? aClassroom : classroomUpdateRequestWithId.name
            }
            onChange={(e) => {
              if (mode === 'create') {
                setAClassroom(e.target.value);
              } else {
                setClassroomUpdateRequestWithId({
                  ...classroomUpdateRequestWithId,
                  name: e.target.value,
                });
              }
            }}
          />
        </div>
      </Drawer>

      <Table
        style={{ marginTop: 40 }}
        columns={tableColumns}
        dataSource={classroomInfos.map((value) => ({
          ...value,
          key: value.id,
        }))}
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
            type={'classroom'}
            scale={currentScale}
            infos={timeTableClassroom}
        />
    </div>
  );
};

export default ClassroomManagePage;
