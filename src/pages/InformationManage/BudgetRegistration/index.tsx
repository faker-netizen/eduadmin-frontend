import { Button, Input, Radio, Select } from 'antd';
import styles from './index.less';

const BudgetRegistrationPage: React.FC = () => {
  return (
    <div className={styles['content']}>
      <div className={styles['title']}>成交登记</div>
      <div className={styles['a']}>
        <div>
          {' '}
          学生姓名:
          <Input />
        </div>
        <div>
          {' '}
          校区:
          <Input />
        </div>
        <div>
          {' '}
          年龄
          <Input />
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
          身份证号:
          <Input />
        </div>
        <div>
          入园日期:
          <Input />
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          授课老师:
          <Input />
        </div>
        <div>
          <div style={{ width: '100%' }}> 课程模式：</div>
          <Select style={{ width: '100%' }}>
            <Select.Option value="zhili">1</Select.Option>
            <Select.Option value="lone">2</Select.Option>
            <Select.Option value="hearing">3</Select.Option>
            <Select.Option value="body">4</Select.Option>
          </Select>
        </div>

        <div>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            是否购买保险:
            <Radio.Group
              optionType="button"
              style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
            >
              <Radio value="male" style={{ width: '40%', textAlign: 'center' }}>
                是
              </Radio>
              <Radio
                value="female"
                style={{ width: '40%', textAlign: 'center' }}
              >
                否
              </Radio>
            </Radio.Group>
          </div>
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          康复教育费用:
          <Input />
        </div>

        <div>
          费用所属月份:
          <Input />
        </div>

        <div>
          团体意外险:
          <Input />
        </div>
      </div>

      <div className={styles['a']}>
        <div>
          床上用品:
          <Input />
        </div>
      </div>
      <div className={styles['a']}>
        <Button type="primary">提交</Button>
      </div>
    </div>
  );
};

export default BudgetRegistrationPage;
