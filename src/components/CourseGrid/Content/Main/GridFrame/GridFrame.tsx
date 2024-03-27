import { Course, Day, TimeSpan, TimeString } from '../../..';
import { parseTimeString } from '../../Content';
import { calculateYPosAndHeight } from '../Main';
import HoveredCell from './HoveredCell';
import { Fragment, useState } from 'react';
import { Line, Rect } from 'react-konva';

const compareTimeString = (a: TimeString, b: TimeString) => {
  const [aHour, aMinute] = parseTimeString(a);
  const [bHour, bMinute] = parseTimeString(b);
  return aHour === bHour ? aMinute - bMinute : aHour - bHour;
};

export interface GridFrameProps {
  filledTimeScale: Array<{
    span: TimeSpan;
    type: 'gap' | 'course';
  }>;
  days: Day[];
  courseList: Course[];
  topTime: TimeString;
  minuteHeight: number;
  cellWidth: number;
  borderColor?: string;
  borderWidth?: number;
  cellGap?: number;
  cellRadius?: number;
  addIconScale?: number;
  addIconColor?: string;
  addIconWidth?: number;
  onAddCourse?: (day: Day, span: TimeSpan) => void;
}

const GridFrame: React.FC<GridFrameProps> = ({
  filledTimeScale,
  days,
  courseList,
  topTime,
  minuteHeight,
  cellWidth,
  borderColor,
  borderWidth,
  cellGap = 3,
  cellRadius,
  addIconScale,
  addIconColor,
  addIconWidth,
  onAddCourse,
}) => {
  const disabledTimeScale = courseList.reduce(
    (acc, { day, span }) => [
      ...acc,
      {
        day,
        span,
      },
    ],
    [] as Array<{
      day: Day;
      span: TimeSpan;
    }>,
  );

  const [hoveredCell, setHoveredCell] = useState<{
    day: Day;
    span: [TimeString, TimeString];
  } | null>(null);

  return (
    <>
      {filledTimeScale.map(({ span, type }, timeIndex, filledTimeScale) => {
        const { yPos, height } = calculateYPosAndHeight(
          topTime,
          span,
          minuteHeight,
        );

        return (
          <Fragment key={`${span[0]}-${span[1]}`}>
            {/* Add top border to each line */}
            <Line
              points={[0, yPos, cellWidth * days.length, yPos]}
              stroke={borderColor}
              strokeWidth={borderWidth}
            />

            {/* Grid line */}
            {days.map((day, dayIndex) => (
              <Fragment key={day}>
                {/* Add left border to each cell */}
                <Line
                  points={[
                    cellWidth * dayIndex,
                    yPos,
                    cellWidth * dayIndex,
                    yPos + height,
                  ]}
                  stroke={borderColor}
                  strokeWidth={borderWidth}
                />
                {/* Grid cell */}
                <Rect
                  x={cellWidth * dayIndex}
                  y={yPos}
                  width={cellWidth}
                  height={height}
                  fill={type === 'gap' ? borderColor : 'transparent'}
                />
                {/* Hovered cell */}
                {type === 'course' &&
                  disabledTimeScale.every(
                    ({ day: disabledDay, span: disabledSpan }) =>
                      !(
                        day === disabledDay &&
                        !(
                          (compareTimeString(span[0], disabledSpan[0]) < 0 &&
                            compareTimeString(span[1], disabledSpan[0]) <= 0) ||
                          (compareTimeString(span[0], disabledSpan[1]) >= 0 &&
                            compareTimeString(span[1], disabledSpan[1]) > 0)
                        )
                      ),
                  ) && (
                    <HoveredCell
                      day={day}
                      span={span}
                      x={cellWidth * dayIndex + cellGap}
                      y={yPos + cellGap}
                      width={cellWidth - 2 * cellGap}
                      height={height - 2 * cellGap}
                      radius={cellRadius}
                      hoveredColor={borderColor}
                      addIconScale={addIconScale}
                      addIconColor={addIconColor}
                      addIconWidth={addIconWidth}
                      onMouseEnter={(day, span) => {
                        setHoveredCell({ day, span });
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null);
                      }}
                      onClick={(day, span) => {
                        onAddCourse?.(day, span);
                      }}
                      hovered={
                        hoveredCell === null
                          ? false
                          : hoveredCell.day === day &&
                            hoveredCell.span[0] === span[0] &&
                            hoveredCell.span[1] === span[1]
                      }
                    />
                  )}
                {/* Add right border to only the last cell */}
                {dayIndex === days.length - 1 && (
                  <Line
                    points={[
                      cellWidth * (dayIndex + 1),
                      yPos,
                      cellWidth * (dayIndex + 1),
                      yPos + height,
                    ]}
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                  />
                )}
              </Fragment>
            ))}

            {/* Add bottom border to only the last line */}
            {timeIndex === filledTimeScale.length - 1 && (
              <Line
                points={[
                  0,
                  yPos + height,
                  cellWidth * days.length,
                  yPos + height,
                ]}
                stroke={borderColor}
                strokeWidth={borderWidth}
              />
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default GridFrame;
