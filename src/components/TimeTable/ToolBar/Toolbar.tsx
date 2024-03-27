import { DownloadOutlined } from '@ant-design/icons';
import { Button, ButtonProps, DatePicker, DatePickerProps } from 'antd';
import styles from './ToolBar.less';

export interface ToolBarProps {
  onDatePickerChange?: DatePickerProps['onChange'];
  onDownloadTimeTable?: ButtonProps['onClick'];
}

const ToolBar: React.FC<ToolBarProps> = ({
  onDatePickerChange,
  onDownloadTimeTable,
}) => {
  return (
    <div className={styles['main']}>
      <div className="flex items-center">
        <div className="right-1"> 选择日期:</div>
        <DatePicker onChange={onDatePickerChange} picker="week" />
      </div>
      <Button
        style={{
          marginLeft: 3,
          marginRight: 3,
        }}
        onClick={onDownloadTimeTable}
        type="primary"
        icon={<DownloadOutlined />}
      >
        下载当前课表
      </Button>
    </div>
  );
};

export default ToolBar;
