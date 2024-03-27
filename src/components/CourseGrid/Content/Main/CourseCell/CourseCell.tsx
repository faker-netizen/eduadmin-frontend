import { Course } from '../../..';
// @ts-ignore
import chroma from 'chroma-js';
import Konva from 'konva';
import { useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

const colors = [
  '#e7f3ff',
  '#fdebdd',
  '#defbf7',
  '#eeedff',
  '#fcebcf',
  '#ffeff0',
  '#eaf2ff',
  '#ffedf9',
  '#e3f8f3',
];

const hash = (str: string) => {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = str.charCodeAt(i) + ((result << 5) - result);
  }
  return result;
};

const colorOf = (str: string) => {
  const index = Math.abs(hash(str)) % colors.length;
  return colors[index];
};

export interface CourseCellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: number;
  lineHeight?: number;
  fontFamily?: string;
  fontSize?: number;
  radius?: number;
  course: Course;
  onClick?: (course: Course) => void;
}

const CourseCell: React.FC<CourseCellProps> = ({
  x,
  y,
  width,
  height,
  padding = 5,
  lineHeight = 1.2,
  fontFamily = 'sans-serif',
  fontSize = 12,
  radius = 4,
  course,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const backgroundColor = course.color ?? colorOf(course.name);
  const hoveredBorderColor = chroma(backgroundColor).darken().saturate().hex();
  const fontColor = chroma(backgroundColor).darken(1.5).saturate(2).hex();
  // console.log(course);

  return (
    <Group
      onMouseEnter={() => {
        setHovered(true);
        (document.querySelector('body') as HTMLBodyElement).style.cursor =
          'pointer';
      }}
      onMouseLeave={() => {
        setHovered(false);
        (document.querySelector('body') as HTMLBodyElement).style.cursor =
          'default';
      }}
      onClick={() => {
        onClick?.(course);
      }}
    >
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={backgroundColor}
        cornerRadius={radius}
        stroke={hovered ? hoveredBorderColor : 'transparent'}
      />
      {/* Name */}
      <Text
        width={width - 2 * padding}
        x={x + padding}
        y={y + padding}
        lineHeight={lineHeight}
        text={course.classroom?.name}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontStyle="bold"
        fill={fontColor}
      />
      {/* Time */}
      <Text
        width={width - 2 * padding}
        x={x + padding}
        y={
          y +
          padding +
          new Konva.Text({
            lineHeight,
            text: course.name,
            fontFamily,
            fontSize,
            width: width - 2 * padding,
          }).height() +
          padding
        }
        lineHeight={1.2}
        text={`${course.span[0]} - ${course.span[1]}`}
        fontFamily={fontFamily}
        fontSize={Math.round(fontSize * 0.8)}
        fill={fontColor}
      />
      {/* Teacher and location */}
      {(course.classroom?.name || course.teacher) && (
        <Text
          width={width - 2 * padding}
          x={x + padding}
          y={
            y +
            padding +
            new Konva.Text({
              lineHeight,
              text: course.name,
              fontFamily,
              fontSize,
              width: width - 2 * padding,
            }).height() +
            padding +
            new Konva.Text({
              lineHeight,
              text: `${course.span[0]} - ${course.span[1]}`,
              fontFamily,
              fontSize: Math.round(fontSize * 0.8),
              width: width - 2 * padding,
            }).height() +
            padding
          }
          lineHeight={1.2}
          text={`${course.classroom?.name ? '@' + course.classroom?.name : ''}${
            course.classroom?.name && course.teacher ? ' | ' : ''
          }${course.teacher ? course.teacher : ''}`}
          fontFamily={fontFamily}
          fontSize={Math.round(fontSize * 0.8)}
          fill={fontColor}
        />
      )}
    </Group>
  );
};

export default CourseCell;
