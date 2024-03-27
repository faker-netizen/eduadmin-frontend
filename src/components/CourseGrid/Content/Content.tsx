import { Course, TimeSpan, TimeString } from '..';
import Aside, { AsideProps } from './Aside';
import Main, { MainProps } from './Main';
import React, { createContext, useMemo } from 'react';

export const parseTimeString = (timeString: TimeString): [number, number] => {
  const [hour, minute] = timeString.split(':', 2);
  return [Number.parseInt(hour, 10), Number.parseInt(minute, 10)];
};

const fillTimeScaleGap = (
  timeScale: TimeSpan[],
): Array<{
  span: TimeSpan;
  type: 'gap' | 'course';
}> =>
  timeScale.reduce(
    (acc, [startTime, endTime], index) => {
      if (index === 0) {
        return [
          ...acc,
          {
            span: [startTime, endTime] as TimeSpan,
            type: 'course' as const,
          },
        ];
      }

      const prevEndTime = acc[acc.length - 1].span[1];
      const [prevEndHour, prevEndMinute] = parseTimeString(prevEndTime);
      const [startHour, startMinute] = parseTimeString(startTime);

      if (prevEndHour === startHour && prevEndMinute === startMinute) {
        return [
          ...acc,
          {
            span: [prevEndTime, endTime] as TimeSpan,
            type: 'course' as const,
          },
        ];
      }

      return [
        ...acc,
        {
          span: [prevEndTime, startTime] as TimeSpan,
          type: 'gap' as const,
        },
        {
          span: [startTime, endTime] as TimeSpan,
          type: 'course' as const,
        },
      ];
    },
    [] as Array<{
      span: TimeSpan;
      type: 'gap' | 'course';
    }>,
  );

const calculateMinuteHeight = (
  startTime: TimeString,
  endTime: TimeString,
  canvasHeight: number,
) => {
  const [startHour, startMinute] = parseTimeString(startTime);
  const [endHour, endMinute] = parseTimeString(endTime);
  const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
  return canvasHeight / totalMinutes;
};

export const ContentProvider = createContext({
  height: 0,
  borderColor: '#000',
  borderWidth: 0,
  filledTimeScale: [] as Array<{
    span: TimeSpan;
    type: 'gap' | 'course';
  }>,
  minuteHeight: 0,
  courseList: [] as Course[],
});

export interface ContentProps {
  children: readonly [
    React.ReactElement<AsideProps>,
    React.ReactElement<MainProps>,
  ];
  height: number;
  borderColor?: string;
  borderWidth?: number;
  timeScale: TimeSpan[];
  courseList: Course[];
}

const Content: React.FC<ContentProps> & {
  Aside: typeof Aside;
  Main: typeof Main;
} = ({
  height,
  borderColor = '#f0f0f0',
  borderWidth = 1,
  timeScale,
  courseList,
  children,
}) => {
  const contextValue = useMemo(
    () => ({
      height,
      borderColor,
      borderWidth,
      filledTimeScale: fillTimeScaleGap(timeScale),
      minuteHeight: calculateMinuteHeight(
        timeScale[0][0],
        timeScale[timeScale.length - 1][1],
        height,
      ),
      courseList,
    }),
    [height, borderColor, borderWidth, timeScale, courseList],
  );

  return (
    <div className="flex flex-row">
      <ContentProvider.Provider value={contextValue}>
        {[...(children as unknown as React.ReactNode[])]}
      </ContentProvider.Provider>
    </div>
  );
};

Content.Aside = Aside;
Content.Main = Main;

export default Content;
