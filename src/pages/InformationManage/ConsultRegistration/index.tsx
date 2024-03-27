import { Button, Input, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styles from './index.less';

const ConsultRegistrationPage: React.FC = () => {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setDateString(dayjs().format('YYYY-MM-DD'));
  }, []);

  return (
    <div className={styles['content']}>
      <div className={styles['title']}>咨询登记</div>
      <div className={styles['a']}>
        <div>
          {' '}
          学生姓名:
          <Input />
        </div>
        <div>
          {' '}
          家长姓名:
          <Input />
        </div>
        <div>
          {' '}
          咨询日期:
          <Input value={dateString} disabled />
        </div>
      </div>
      <div className={styles['a']}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          学生性别:
          <Radio.Group
            optionType="button"
            style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
          >
            <Radio value="male" style={{ width: '40%', textAlign: 'center' }}>
              男
            </Radio>
            <Radio value="female" style={{ width: '40%', textAlign: 'center' }}>
              女
            </Radio>
          </Radio.Group>
        </div>
        <div>
          出生日期：
          <Input />
        </div>
        <div>
          年龄：
          <Input type="number" />
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          身份证号:
          <Input />
        </div>
        <div>
          <div style={{ width: '100%' }}> 障碍类别：</div>
          <Select style={{ width: '100%' }}>
            <Select.Option value="zhili">智力</Select.Option>
            <Select.Option value="lone">孤独症</Select.Option>
            <Select.Option value="hearing">听力语言</Select.Option>
            <Select.Option value="body">肢体</Select.Option>
          </Select>
        </div>

        <div>
          监护人电话:
          <Input />
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          家庭住址:
          <Input />
        </div>

        <div>
          户籍所在地:
          <Input />
        </div>

        <div>
          医保所在地:
          <Input />
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          个人医保编号:
          <Input />
        </div>

        <div>
          社区转介日期:
          <Input />
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          学生成长发育史:
          <Input.TextArea />
        </div>
      </div>
      <div className={styles['a']}>
        <Button type="primary">提交</Button>
      </div>
    </div>
  );
};

export default ConsultRegistrationPage;
