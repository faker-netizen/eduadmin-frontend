import { toCn } from '@/utils/intl';
import { minutesToCnString } from '@/utils/time';
import { Checkbox, Slider } from 'antd';
import { SliderTooltipProps } from 'antd/lib/slider';

const marks = {
  [7 * 60]: '7:00',
  [8 * 60]: '8:00',
  [9 * 60]: '9:00',
  [10 * 60]: '10:00',
  [11 * 60]: '11:00',
  [12 * 60]: '12:00',
  [13 * 60]: '13:00',
  [14 * 60]: '14:00',
  [15 * 60]: '15:00',
  [16 * 60]: '16:00',
  [17 * 60]: '17:00',
  [18 * 60]: '18:00',
  [19 * 60]: '19:00',
};

const sliderTooltipFormatter: SliderTooltipProps['formatter'] = (minutes) => {
  const str = minutes !== undefined ? minutesToCnString(minutes) : '';
  return <div className="text-sm z-0">{str}</div>;
};

export interface TimeSelectionModalRowProps {
  dayOfWeek: DayOfWeek;
  checked?: boolean;
  disabled?: boolean;
  time: Course.CourseTime;
  onTimeChange?: (time: Course.CourseTime) => void;
  onCheckboxChecked?: (dayOfWeek: DayOfWeek) => void;
  onCheckboxUnchecked?: (dayOfWeek: DayOfWeek) => void;
}

const TimeSelectionModalRow: React.FC<TimeSelectionModalRowProps> = ({
                                                                       checked,
                                                                       disabled,
                                                                       dayOfWeek,
                                                                       time,
                                                                       onTimeChange,
                                                                       onCheckboxChecked,
                                                                       onCheckboxUnchecked,
                                                                     }) => {
  return (
      <div className="w-full flex flex-row mt-5">
        <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.checked) {
                onCheckboxChecked?.(dayOfWeek);
              } else {
                onCheckboxUnchecked?.(dayOfWeek);
              }
            }}
            style={{ marginRight: 10 }}
        >
          {toCn(dayOfWeek)}
        </Checkbox>
        <div style={{ width: '70%' }}>
          <Slider
              key={dayOfWeek}
              marks={marks}
              range={{ draggableTrack: true }}
              min={7 * 60}
              max={19 * 60}
              step={5}
              value={[
                time.startHour * 60 + time.startMinute,
                time.endHour * 60 + time.endMinute,
              ]}
              defaultValue={[0, 5]}
              tooltip={{ formatter: sliderTooltipFormatter }}
              onChange={([startValue, endValue]: [number, number]) => {
                const newTime = {
                  dayOfWeek,
                  startHour: Math.floor(startValue / 60),
                  startMinute: startValue % 60,
                  endHour: Math.floor(endValue / 60),
                  endMinute: endValue % 60,
                };
                onTimeChange?.(newTime);
              }}
              disabled={!checked}
          />
        </div>
      </div>
  );
};

export default TimeSelectionModalRow;
