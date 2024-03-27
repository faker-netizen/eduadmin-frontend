import { CourseGridContext } from '../../CourseGrid';
import { ContentProvider, parseTimeString } from '../Content';
import { useContext } from 'react';

export interface AsideProps {
  fontFamily?: string;
  fontSize?: number;
  serialNumberColor?: string;
  fontColor?: string;
}

const Aside: React.FC<AsideProps> = ({
  fontFamily = 'sans-serif',
  fontSize = 14,
  serialNumberColor = '#202020',
  fontColor = '#606060',
}) => {
  const { asideWidth: width } = useContext(CourseGridContext);
  const { height, borderColor, borderWidth, filledTimeScale, minuteHeight } =
    useContext(ContentProvider);

  return (
    <div
      className="flex flex-col"
      style={{
        width,
        height,
      }}
    >
      {filledTimeScale.map(({ span: [startTime, endTime], type }, index) => {
        const [startHour, startMinute] = parseTimeString(startTime);
        const [endHour, endMinute] = parseTimeString(endTime);
        const height =
          minuteHeight *
          ((endHour - startHour) * 60 + (endMinute - startMinute));

        return (
          <div key={`${startTime}-${endTime}`} style={{ height }}>
            <div
              className="my-0"
              style={{ height: borderWidth, backgroundColor: borderColor }}
            />
            <div
              className="flex h-full flex-col justify-center items-center"
              style={{
                backgroundColor: type === 'gap' ? borderColor : 'transparent',
                fontFamily,
              }}
            >
              {type === 'course' && (
                <>
                  <div
                    className="font-bold"
                    style={{ fontSize, color: serialNumberColor }}
                  >
                    {filledTimeScale
                      .filter(({ type }) => type === 'course')
                      .indexOf(filledTimeScale[index]) + 1}
                  </div>
                  <div
                    style={{
                      fontSize: Math.round(fontSize * 0.8),
                      color: fontColor,
                    }}
                  >
                    {startTime}
                  </div>
                  <div
                    style={{
                      fontSize: Math.round(fontSize * 0.8),
                      color: fontColor,
                    }}
                  >
                    {endTime}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Aside;
