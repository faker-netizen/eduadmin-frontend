import CourseGrid from './CourseGrid';

export default CourseGrid;
export type { CourseGridProps } from './CourseGrid';

type ZeroToThreeDigit = '0' | '1' | '2' | '3';
type ZeroToFiveDigit = '0' | '1' | '2' | '3' | '4' | '5';
type NonZeroDigit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Digit = '0' | NonZeroDigit;
type Hour = Digit | `0${Digit}` | `1${Digit}` | `2${ZeroToThreeDigit}`;
type Minute = `${ZeroToFiveDigit}${Digit}`;
export type TimeString = `${Hour}:${Minute}`;
export type TimeSpan = [TimeString, TimeString];

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export interface Course {
  id: string | number;
  name: string;
  day: Day;
  span: [TimeString, TimeString];
  color?: string;
  classroom?: { name: string; id: number };
  teacher?: string;
}
