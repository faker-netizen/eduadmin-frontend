import { Course, Day, TimeSpan, TimeString } from '../..';
import { CourseGridContext } from '../../CourseGrid';
import { ContentProvider, parseTimeString } from '../Content';
import CourseCell from './CourseCell';
import GridFrame from './GridFrame';
import { useContext } from 'react';
import { Layer, Stage } from 'react-konva';

export const calculateYPosAndHeight = (
  topTime: TimeString,
  span: TimeSpan,
  minuteHeight: number,
) => {
  const [topHour, topMinute] = parseTimeString(topTime);
  const [startHour, startMinute] = parseTimeString(span[0]);
  const [endHour, endMinute] = parseTimeString(span[1]);

  const yPos =
    minuteHeight * ((startHour - topHour) * 60 + (startMinute - topMinute));

  const height =
    minuteHeight * ((endHour - startHour) * 60 + (endMinute - startMinute));

  return { yPos, height };
};

export interface MainProps {
  fontFamily?: string;
  fontSize?: number;
  cellGap?: number;
  cellRadius?: number;
  addIconScale?: number;
  addIconColor?: string;
  addIconWidth?: number;
  onAddCourse?: (day: Day, span: TimeSpan) => void;
  onClickCourse?: (course: Course) => void;
}

const Main: React.FC<MainProps> = ({
  fontFamily,
  fontSize,
  cellGap = 3,
  cellRadius = 4,
  addIconScale,
  addIconColor,
  addIconWidth,
  onAddCourse,
  onClickCourse,
}) => {
  const { cellWidth, days } = useContext(CourseGridContext);
  const {
    height,
    borderColor,
    borderWidth,
    filledTimeScale,
    minuteHeight,
    courseList,
  } = useContext(ContentProvider);

  const topTime = filledTimeScale[0].span[0];

  return (
    <Stage width={cellWidth * days.length} height={height}>
      <Layer>
        {/* Grid frame */}
        <GridFrame
          filledTimeScale={filledTimeScale}
          days={days}
          courseList={courseList}
          topTime={topTime}
          minuteHeight={minuteHeight}
          borderColor={borderColor}
          borderWidth={borderWidth}
          cellWidth={cellWidth}
          cellGap={cellGap}
          cellRadius={cellRadius}
          addIconScale={addIconScale}
          addIconColor={addIconColor}
          addIconWidth={addIconWidth}
          onAddCourse={onAddCourse}
        />

        {/* Course */}
        {courseList.map((course) => {
          const { yPos, height } = calculateYPosAndHeight(
            topTime,
            course.span,
            minuteHeight,
          );

          return (
            <CourseCell
              key={course.id}
              x={cellWidth * days.indexOf(course.day) + cellGap}
              y={yPos + cellGap}
              width={cellWidth - 2 * cellGap < 0 ? 0 : cellWidth - 2 * cellGap}
              height={height - 2 * cellGap < 0 ? 0 : height - 2 * cellGap}
              fontFamily={fontFamily}
              fontSize={fontSize}
              radius={cellRadius}
              course={course}
              onClick={onClickCourse}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default Main;
