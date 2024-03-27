import { getRandomColor } from '@/utils/common';
import { parseStartAndEndDateTime } from '@/utils/time';
import dayjs from 'dayjs';
import { DOMAttributes } from 'react';
import styles from './TimeTableCell.less';

export interface TimeTableCellProps {
  lessonInfo: Course.LessonInfo;
  onClick: DOMAttributes<HTMLDivElement>['onClick'];
}

const TimeTableCell: React.FC<TimeTableCellProps> = ({
  lessonInfo,
  onClick,
}) => {
  const courseTime = parseStartAndEndDateTime(
    lessonInfo.startDateTime,
    lessonInfo.endDateTime,
  );
  console.log(
    (courseTime.endHour * 60 +
      courseTime.endMinute -
      courseTime.startHour * 60 -
      courseTime.startMinute) *
      2,
    (courseTime.startHour * 60 + courseTime.startMinute) * 2 - 720,
  );
  const height =
    (courseTime.endHour * 60 +
      courseTime.endMinute -
      courseTime.startHour * 60 -
      courseTime.startMinute) *
    2;
  const top = (courseTime.startHour * 60 + courseTime.startMinute) * 2 - 720;
  const backgroundColor = getRandomColor(lessonInfo.courseName);

  const startTimeString = dayjs(lessonInfo.startDateTime).format('HH:mm');
  const endTImeString = dayjs(lessonInfo.endDateTime).format('HH:mm');
  return (
    <div
      id={lessonInfo.id.toString()}
      key={lessonInfo.id}
      onClick={onClick}
      className={styles['main']}
      style={{
        background: backgroundColor,
        height,
        top,
      }}
    >
      <div style={{ fontSize: '90%' }}>
        {lessonInfo.courseName}
        {/*{lessonInfo.teachers.map((tea) => tea.name + ' ')}*/}
      </div>
      <div style={{ fontSize: '90%' }}>{lessonInfo.classroom.name}</div>
      <div style={{ fontSize: '90%' }}>
        {lessonInfo.teachers.map((v) => v.name + ' ')}
      </div>
      <div className="flex flex-row">
        <div>{startTimeString}-</div>
        <div>{endTImeString}</div>
      </div>
    </div>
  );
};

export default TimeTableCell;
