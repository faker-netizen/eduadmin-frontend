import _ from 'lodash';
import TimeTableCell from '../TimeTableCell';
import styles from './TimeTableMain.less';

export interface TimeTableMainProps {
  innerRef: React.RefObject<HTMLDivElement>;
  contentNodes: { [key in DayOfWeek]: (typeof TimeTableCell)[] };
}

const TimeTableMain: React.FC<TimeTableMainProps> = ({
  innerRef,
  contentNodes,
}) => {
  return (
    <div ref={innerRef} className={styles['main']}>
      <div className={styles['column']}>
        {/* 左上角表头 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#152646',
            fontWeight: 'bold',
            height: '120px',
            borderBottom: '1px solid lightgray',
          }}
        >
          时间
        </div>
        {/* 时间表头（左侧） */}
        {_.range(7, 20).map((num) => {
          const timeString = `${num}:00`;
          return (
            <div key={timeString} className={styles['firstT']}>
              {timeString}
            </div>
          );
        })}
      </div>

      {/* 课程表 */}
      {[
        ['MONDAY', '周一', '#bf47e7'],
        ['TUESDAY', '周二', '#475ce7'],
        ['WEDNESDAY', '周三', '#499c1c'],
        ['THURSDAY', '周四', '#e2060c'],
        ['FRIDAY', '周五', '#1a2b7d'],
        ['SATURDAY', '周六', '#c9132f'],
        ['SUNDAY', '周日', '#060f0f'],
      ].map(([day, dayName, color]) => (
        <div key={day} className={styles['column']}>
          <>
            <div
              className="flex justify-center items-center font-bold"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                height: '120px',
                borderBottom: '1px solid lightgray',
                color,
              }}
            >
              {dayName}
            </div>
            {contentNodes[day as DayOfWeek]}
          </>
        </div>
      ))}
    </div>
  );
};

export default TimeTableMain;
