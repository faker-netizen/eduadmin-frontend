import { defaultStudentInfo } from '@/@types/accountDefaults';
import { defaultCourseInfo } from '@/@types/courseDefaults';

export type CacheInfo = {
  courseCreation: {
    classroom: string;
    maxNumber: number;
    category: Course.CourseCategory;
    clinicTargetStu: Account.StudentInfo;
    startDate: string;
    endDate: string;
  };
  createdCourse: Course.CourseInfo;
  updateCourseIdFromTable: number;
};
export const defaultCacheInfo: CacheInfo = {
  courseCreation: {
    classroom: '',
    maxNumber: 10,
    category: 'GROUP',
    clinicTargetStu: defaultStudentInfo,
    startDate: '2023-01-01',
    endDate: '2024-02-01',
  },
  createdCourse: defaultCourseInfo,
  updateCourseIdFromTable: 0,
};

const useCache = () => ({ cache: defaultCacheInfo });

export default useCache;
