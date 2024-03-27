import { Day, TimeSpan } from '../../../..';
import { Group, Line, Rect } from 'react-konva';

export interface HoveredCellProps {
  day: Day;
  span: TimeSpan;
  hovered: boolean;
  hoveredColor?: string;
  addIconScale?: number;
  addIconColor?: string;
  addIconWidth?: number;
  onMouseEnter?: (day: Day, span: TimeSpan) => void;
  onMouseLeave?: () => void;
  onClick?: (day: Day, span: TimeSpan) => void;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
}

const HoveredCell: React.FC<HoveredCellProps> = ({
  day,
  span,
  hovered,
  hoveredColor = '#f0f0f0',
  addIconScale = 0.2,
  addIconColor = '#c3c3c3',
  addIconWidth = 2,
  onMouseEnter,
  onMouseLeave,
  onClick,
  x,
  y,
  width,
  height,
  radius = 4,
}) => {
  return (
    <Group
      onMouseEnter={() => {
        (document.querySelector('body') as HTMLBodyElement).style.cursor =
          'pointer';
        onMouseEnter?.(day, span);
      }}
      onMouseLeave={() => {
        (document.querySelector('body') as HTMLBodyElement).style.cursor =
          'default';
        onMouseLeave?.();
      }}
      onClick={() => {
        onClick?.(day, span);
      }}>
      {/* Background */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={hovered ? hoveredColor : 'transparent'}
        cornerRadius={radius}
      />

      {/* Add icon */}
      <Line
        points={[
          x + width / 2,
          y + height / 2 - (width / 2) * addIconScale,
          x + width / 2,
          y + height / 2 + (width / 2) * addIconScale,
        ]}
        stroke={hovered ? addIconColor : 'transparent'}
        strokeWidth={addIconWidth}
      />
      <Line
        points={[
          x + width / 2 - (width / 2) * addIconScale,
          y + height / 2,
          x + width / 2 + (width / 2) * addIconScale,
          y + height / 2,
        ]}
        stroke={hovered ? addIconColor : 'transparent'}
        strokeWidth={addIconWidth}
      />
    </Group>
  );
};

export default HoveredCell;
