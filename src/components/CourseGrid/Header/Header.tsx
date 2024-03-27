import { Day } from '..';
import { CourseGridContext } from '../CourseGrid';
import { useContext } from 'react';

const defaultDayMap: Record<Day, string> = {
  Monday: '周一',
  Tuesday: '周二',
  Wednesday: '周三',
  Thursday: '周四',
  Friday: '周五',
  Saturday: '周六',
  Sunday: '周日',
};

export interface HeaderProps {
  height: number;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  dayMap?: Record<Day, string>;
  dates?: string[];
}

const Header: React.FC<HeaderProps> = ({
  height,
  fontFamily = 'sans-serif',
  fontSize = 14,
  fontColor = '#606060',
  dayMap = defaultDayMap,
  dates,
}) => {
  const { asideWidth, cellWidth, days } = useContext(CourseGridContext);

  return (
    <div
      className="center mb-2 flex items-center justify-center"
      style={{ height }}
    >
      <div style={{ width: asideWidth }} />
      {days.map((day, dayIndex) => (
        <div
          key={day}
          className="flex flex-col justify-center items-center"
          style={{
            fontFamily,
            color: fontColor,
            width: cellWidth,
          }}
        >
          <div style={{ fontSize }}>{dayMap[day]}</div>
          {dates && (
            <div style={{ fontSize: Math.round(fontSize * 0.8) }}>
              {dates[dayIndex]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Header;
