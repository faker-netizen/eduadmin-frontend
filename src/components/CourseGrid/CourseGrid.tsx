import {Day, DAYS} from '.';
import Content, {ContentProps} from './Content';
import Header, {HeaderProps} from './Header';
import React, {createContext, useMemo} from 'react';

export const CourseGridContext = createContext({
  asideWidth: 0,
  cellWidth: 0,
  days: [] as Day[],
});

export interface CourseGridProps {
  children: readonly [
    React.ReactElement<HeaderProps>,
    React.ReactElement<ContentProps>,
  ];
  asideWidth: number;
  cellWidth: number;
  days?: Day[];
  innerRef?: React.Ref<HTMLDivElement>;
}

const CourseGrid: React.FC<CourseGridProps> & {
  Header: typeof Header;
  Content: typeof Content;
} = ({
       asideWidth,
       cellWidth,
       days = DAYS as unknown as Day[],
       children,
       innerRef,
     }) => {
  const contextValue = useMemo(
      () => ({
        asideWidth,
        cellWidth,
        days,
      }),
      [asideWidth, cellWidth, days],
  );


  return (
      <div ref={innerRef} className="relative h-full w-full">
        <CourseGridContext.Provider value={contextValue}>
          {[...(children as unknown as React.ReactNode[])]}
        </CourseGridContext.Provider>
      </div>
  );
};

CourseGrid.Header = Header;
CourseGrid.Content = Content;

export default CourseGrid;
