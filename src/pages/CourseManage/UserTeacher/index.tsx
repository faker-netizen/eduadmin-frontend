import { useModel } from '@umijs/max';
import TableCourse from '@/components/tableCourse';
import React, { useEffect, useState } from 'react';
import { defaultTimescalePreset } from '@/@types/presetDefaults';
import { TimeSpan } from '@/components/CourseGrid';
import presetApi from '@/apis/preset';
import { Select } from 'antd';
import { defaultTeacherInfo } from '@/@types/accountDefaults';
import accountApi from '@/apis/account';

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
const UserTeacherPage: React.FC = () => {
  const [timeTableTeacher, setTimeTableTeacher] =
    useState<Account.TeacherInfo>(defaultTeacherInfo);
  const { account } = useModel('accountModel');
  const teacherId = account.boundEntity?.id ?? 0;
  const [currentScale, setCurrentScale] = useState<Preset.TimescalePresetInfo>({
    ...defaultTimescalePreset,
    value: timeScale,
  });
  const [timeScales, setTimeScales] = useState<Preset.TimescalePresetInfo[]>(
    [],
  );
  const getALlTimeScale = () => {
    presetApi.getAllTimescalePresets().then((response) => {
      setTimeScales(response);
      setCurrentScale(response[0]);
    });
  };
  useEffect(() => {
    getALlTimeScale();
    accountApi.getTeacher(teacherId).then((response) => {
      setTimeTableTeacher(response);
    });
  }, []);
  return (
    <div className="p-5">
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
    </div>
  );
};

export default UserTeacherPage;
