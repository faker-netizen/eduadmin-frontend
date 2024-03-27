import { defaultTeacherInfo } from '@/@types/accountDefaults';
import accountApi from '@/apis/account';
import { useModel } from '@umijs/max';
import { Button, Input, Select } from 'antd';
import { useEffect, useState } from 'react';

const UserAccountPage: React.FC = () => {
  const [mode, setMode] = useState<'read' | 'edit'>('read');
  const [editTeacherInfo, setEditTeacherInfo] = useState(defaultTeacherInfo);
  const [selfInfo, setSelfInfo] = useState(defaultTeacherInfo);

  const { account } = useModel('accountModel');
  const entityId = account.boundEntity?.id ?? 0;

  const getMyTeacherInfo = () => {
    accountApi.getTeacher(entityId).then((res) => {
      setSelfInfo(res);
      setEditTeacherInfo(res);
    });
  };

  const editSub = () => {
    accountApi.updateTeacher(entityId, editTeacherInfo).then((res) => {
      if (res) {
        setSelfInfo(res);
        setEditTeacherInfo(res);
        setMode('read');
      }
    });
  };

  useEffect(() => {
    getMyTeacherInfo();
  }, []);

  return (
    <div
      style={{
        padding: '10px 30px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <div style={{ marginRight: 4 }}>姓名:</div>
        <div>
          <Input
            value={mode === 'read' ? selfInfo.name : editTeacherInfo.name}
            onChange={(e) => {
              setEditTeacherInfo({ ...editTeacherInfo, name: e.target.value });
            }}
            disabled={mode === 'read'}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <div style={{ marginRight: 4 }}>部门:</div>
        <div>
          <Input
            value={
              mode === 'read' ? selfInfo.department : editTeacherInfo.department
            }
            disabled={true}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <div style={{ marginRight: 4 }}>性别:</div>
        <div>
          <Select
            value={mode === 'read' ? selfInfo.sex : editTeacherInfo.sex}
            options={[
              { value: 'MALE', label: '男' },
              { value: 'FEMALE', label: '女' },
            ]}
            onChange={(e) => {
              setEditTeacherInfo({ ...editTeacherInfo, sex: e });
            }}
            disabled={mode === 'read'}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
        <div style={{ marginRight: 4 }}>出生日期:</div>
        <div>
          <Input
            value={mode === 'read' ? selfInfo.birth : editTeacherInfo.birth}
            onChange={(e) => {
              setEditTeacherInfo({ ...editTeacherInfo, birth: e.target.value });
            }}
            disabled={mode === 'read'}
          />
        </div>
        <div style={{ color: 'gray' }}>注:格式为形如 1999-01-01</div>
      </div>
      <div>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onClick={() => {
            if (mode === 'edit') {
              setMode('read');
            } else {
              setMode('edit');
            }
          }}
        >
          {mode === 'read' ? '修改' : '取消'}
        </Button>
        <Button
          type="primary"
          disabled={mode === 'read'}
          onClick={() => {
            editSub();
          }}
        >
          提交
        </Button>
      </div>
    </div>
  );
};

export default UserAccountPage;
