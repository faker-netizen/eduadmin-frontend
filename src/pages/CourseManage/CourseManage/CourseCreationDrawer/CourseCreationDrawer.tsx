import courseApi, {
  CourseCreationRequest,
  defaultCourseCreationRequest,
} from '@/apis/course';
import { openNotification } from '@/utils/common';
import { toCnTimeString } from '@/utils/time';
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  DrawerProps,
  Input,
  Modal,
  Select,
  SelectProps,
  Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import TeacherSelectionModal from './TeacherSelectionModal';
import TimeSelectionModal from './TimeSelectionModal';
import accountApi from '@/apis/account';
import { defaultStudentInfo } from '@/@types/accountDefaults';
import { toCn } from '@/utils/intl';
import { defaultCourseInfo } from '@/@types/courseDefaults';
import { history } from '@@/core/history';
import dayjs from 'dayjs';
import { useModel } from '@umijs/max';

const classCategoryOptions: SelectProps['options'] = [
  {
    value: 'GROUP',
    label: '集体',
  },
  {
    value: 'INDIVIDUAL',
    label: '单训',
  },
  {
    value: 'ACCOMPANIED_GROUP',
    label: '有陪_集体',
  },
  { value: 'ACCOMPANIED_INDIVIDUAL', label: '有陪_单训' },
  {
    value: 'UNACCOMPANIED_GROUP',
    label: '无陪_集体',
  },
  {
    value: 'UNACCOMPANIED_INDIVIDUAL',
    label: '无陪_单训',
  },
  {
    value: 'CLINIC',
    label: '门诊',
  },
  {
    value: 'CLINIC, TEMPORARY',
    label: '临时加课',
  },
  {
    value: 'OTHER',
    label: '其他',
  },
];

export interface CourseCreationDrawerProps {
  open?: DrawerProps['open'];
  onClose?: DrawerProps['onClose'];
  classInfos: Course.ClassInfo[];
  classroomInfos: Course.ClassroomInfo[];
  defaultRequest?: CourseCreationRequest;
  ifForStu?: Account.StudentInfo;
  forEdit?: Course.CourseInfo;
  myClose: (...params: any[]) => any;
  // updateAvailTeachersCallback: () => void;
}

const CourseCreationDrawer: React.FC<CourseCreationDrawerProps> = ({
  open,
  onClose,
  classInfos,
  classroomInfos,
  defaultRequest = defaultCourseCreationRequest,
  ifForStu = defaultStudentInfo,
  forEdit = defaultCourseInfo,
  myClose,
}) => {
  const [request, setRequest] = useState(defaultCourseCreationRequest);
  /* 教师选择面板相关 */
  const [teacherSelectionModalOpen, setTeacherSelectionModalOpen] =
    useState(false);
  const [availableTeacherInfos, setAvailableTeacherInfos] = useState<
    Account.TeacherInfo[]
  >([]);
  const [selectedTeacherInfos, setSelectedTeacherInfos] = useState<
    Account.TeacherInfo[]
  >([]);
  const [openForHistoryChange, setOpenForHistoryChange] = useState(false);

  const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
  /* 时间面板相关 */
  const [timeSelectionModalOpen, setTimeSelectionModalOpen] = useState(false);

  const [checkedForCounts, setCheckedForCounts] = useState(false);
  const [counts, setCounts] = useState(0);
  const [type, setType] = useState<'create' | 'edit'>('create');
  const { cache } = useModel('cacheModel');

  const test = () => {
    console.log(defaultRequest, request);
  };
  /**
   * 添加课程
   */ useEffect(() => {
    console.log(defaultRequest);
    if (forEdit.id) {
      setType('edit');
      setRequest({
        ...request,
        startDate: forEdit.startDate,
        endDate: forEdit.endDate,
        description: forEdit.description,
        teacherIds: forEdit.teachers.map((tea) => tea.id),
        category: forEdit.category,
        maxMember: forEdit.maxMember,
        times: forEdit.times,
      });
    }
    if (ifForStu.id) {
      setRequest({
        ...defaultRequest,
        name: ifForStu.id ? ifForStu.name + '的门诊课' : toCn(request.category),
        maxMember: 1,
      });
    }

    if (defaultRequest.teacherIds.length > 0) {
      accountApi.getTeacher(defaultRequest.teacherIds[0]).then((response) => {
        setSelectedTeacherIds(defaultRequest.teacherIds);
        setSelectedTeacherInfos([response]);
      });
    }
    if (defaultRequest.clazzId) {
      setRequest({ ...request, clazzId: defaultRequest.clazzId });
    }
    setRequest({
      ...defaultRequest,
      startDate: cache.courseCreation.startDate,
      endDate: cache.courseCreation.endDate,
      classroom: cache.courseCreation.classroom,
    });
  }, [defaultRequest]);
  const onSubmitButtonClick = async () => {
    if (type === 'edit') {
      const res = await courseApi.updateCourse(forEdit.id, { ...request });
      if (res.id) {
        myClose();

        cache.createdCourse = defaultCourseInfo;
        openNotification('修改课程成功', '已成功修改一个课程', 'success');

      }
    } else {
      if (
        !['UNACCOMPANIED_INDIVIDUAL', 'UNACCOMPANIED_GROUP'].includes(
          request.category,
        )
      ) {
        delete request.clazzId;

        if (checkedForCounts) {
          courseApi
            .createCourseWithLessonCount(request, counts)
            .then((response) => {
              if (response.id) {
                myClose();
                cache.createdCourse = response;
                openNotification(
                  '创建课程成功',
                  '已成功添加一个课程',
                  'success',
                );
                // setOpenForHistoryChange(true);
              }
            });
        } else {
          const response = await courseApi.createCourse(request);
          if (response.id) {
            myClose();
            cache.createdCourse = response;
            openNotification('创建课程成功', '已成功添加一个课程', 'success');
            // setOpenForHistoryChange(true);
          }
        }
      }
    }
  };

  return (
    <>
      {/* 抽屉主体 */}
      <Drawer
        title={type==='create'?"新建课程":'修改课程'}
        contentWrapperStyle={{ width: 900 }}
        open={open}
        onClose={onClose}
      >
        <div style={{ borderRadius: 30 }}>
          {/* 课程班级选择 */}
          <Divider style={{ marginTop: 30 }} plain>
            {' '}
            课程基本信息
          </Divider>
          <div className="flex flex-row items-center mt-10">
            <div className="drawer-label">课程名称:</div>
            <Input
              value={request.name}
              onChange={(e) => {
                setRequest({ ...request, name: e.target.value });
              }}
              style={{ width: 400, marginLeft: 20, height: 30 }}
            />
          </div>
          <div className="flex flex-row justify-around i mt-10">
            <div className="drawer-label">课程分类：</div>

            <Select
              value={request.category}
              onChange={(e) => {
                setRequest({ ...request, category: e });
                if (e === 'CLINIC') {
                  setRequest({ ...request, maxMember: 1 });
                }
              }}
              style={{ width: 300 }}
              options={
                defaultRequest.category === 'CLINIC'
                  ? [
                      {
                        label: '门诊',
                        value: 'CLINIC',
                      },
                    ]
                  : classCategoryOptions
              }
            />
            <div className="drawer-label" style={{ marginLeft: 10 }}>
              最大人数：
            </div>
            <Input
              style={{ height: '30px', width: 300 }}
              value={request.maxMember}
              onChange={(e) => {
                if (e.target.value === '' || request.category === 'CLINIC') {
                  setRequest({ ...request, maxMember: 1 });
                } else {
                  setRequest({
                    ...request,
                    maxMember: parseInt(e.target.value),
                  });
                }
              }}
            />
          </div>

          <div className="flex flex-row justify-around mt-7">
            <div className="drawer-label">选择班级：</div>
            <div>
              <Select
                style={{ width: 300 }}
                options={classInfos.map((classInfo) => ({
                  label: classInfo.name,
                  value: classInfo.id,
                }))}
                value={request.clazzId}
                onChange={(e) => {
                  setRequest({ ...request, clazzId: e });
                }}
              />
            </div>
            <div className="drawer-label" style={{ marginLeft: 10 }}>
              选择教室：
            </div>
            <div>
              <Select
                size="large"
                style={{ width: 300 }}
                value={request.classroom}
                onChange={(e) => {
                  cache.courseCreation.classroom = e;
                  setRequest({ ...request, classroom: e });
                }}
                options={classroomInfos.map((classroomInfo) => ({
                  label: classroomInfo.name,
                  value: classroomInfo.name,
                }))}
              />
            </div>
          </div>

          {/* 时间选择 */}
          <Divider style={{ marginTop: 40 }} plain>
            时间选择
          </Divider>
          <div className="flex flex-col flex-start mt-7">
            <div className="drawer-label">
              选择起始/终止日期：
              <DatePicker.RangePicker
                format="YYYY-MM-DD"
                value={[dayjs(request.startDate), dayjs(request.endDate)]}
                onChange={(_, e) => {
                  cache.courseCreation.startDate = e[0];
                  cache.courseCreation.endDate = e[1];
                  setRequest({ ...request, startDate: e[0], endDate: e[1] });
                }}

              />
            </div>
            <div className={'flex flex-row items-center mt-1'}>
              <div>设定创建课时数(/节):</div>
              <Input
                disabled={!checkedForCounts}
                style={{ width: 300 }}
                onChange={(e) => {
                  setCounts(parseInt(e.target.value));
                }}
              />

              <Switch
                checked={checkedForCounts}
                onChange={(e) => {
                  setCheckedForCounts(e);
                }}
              />
              <div style={{ display: checkedForCounts ? 'none' : 'inline' }}>
                不设定自动生成节数
              </div>
            </div>

            <div className="w-full flex flex-row mt-4">
              <Button
                style={{ width: '20%', marginRight: 10 }}
                type="primary"
                onClick={() => {
                  setTimeSelectionModalOpen(true);
                }}
                disabled={
                  !(request.startDate.length > 0 && request.endDate.length > 0)
                }
              >
                选择时间
              </Button>
              <Input
                className="w-1/2"
                disabled
                value={
                  request.times.length > 0
                    ? toCnTimeString(request.times[0])
                    : '未选择'
                }
              />
            </div>
          </div>
          {/* 人员选择 */}
          <Divider style={{ marginTop: 40 }} plain>
            人员选择
          </Divider>
          <div className="flex flex-row justify-around">
            <div className="flex flex-row justify-start w-full">
              <Select
                className="h-12 w-3/4 mr-5"
                mode="multiple"
                placeholder="请选择教师"
                value={selectedTeacherInfos.map((teacherInfo) => ({
                  label: teacherInfo.name,
                  key: teacherInfo.id,
                }))}
                onChange={(value) => {
                  setRequest({
                    ...request,
                    teacherIds: value.map((i) => i.key),
                  });
                  setSelectedTeacherIds(value.map((i) => i.key));
                  setSelectedTeacherInfos(
                    selectedTeacherInfos.filter((teacherInfo) =>
                      value.find((i) => i.key === teacherInfo.id),
                    ),
                  );
                }}
              />
              <div className="mb-4 w-1/5">
                <Button
                  className="w-full"
                  type="primary"
                  onClick={() => {
                    setTeacherSelectionModalOpen(true);
                  }}
                  disabled={availableTeacherInfos.length === 0}
                >
                  选择可选授课教师
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-around mb-4">
            <div className="flex flex-col items-start w-full">
              <div className="drawer-label"> 课程描述:</div>
              <Input.TextArea
                className="w-full h-80 mb-4"
                value={request.description}
                onChange={(e) => {
                  setRequest({ ...request, description: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-around w-full">
            <Button
              className="w-full"
              size="large"
              type="primary"
              onClick={onSubmitButtonClick}
            >
              {forEdit.id ? '提交修改' : '添加'}
            </Button>
          </div>
        </div>
      </Drawer>

      {/* 时间选择面板 */}
      <TimeSelectionModal
        open={timeSelectionModalOpen}
        onOk={(courseTimes) => {
          setRequest({ ...request, times: courseTimes });

          setTimeSelectionModalOpen(false);
        }}
        updateAvailTea={(availableTeachers) => {
          setAvailableTeacherInfos(availableTeachers);
        }}
        onCancel={() => {
          setTimeSelectionModalOpen(false);
        }}
        defaultTime={defaultRequest.times}
        dateFrom={request.startDate}
        dateTo={request.endDate}
      />

      {/* 教师选择面板 */}
      <TeacherSelectionModal
        open={teacherSelectionModalOpen}
        onOk={() => {
          setTeacherSelectionModalOpen(false);
        }}
        onCancel={() => {
          setTeacherSelectionModalOpen(false);
        }}
        onTableRowSelectionChange={(selectedRowKeys, selectedRows) => {
          setSelectedTeacherIds(selectedRowKeys as number[]);
          setSelectedTeacherInfos(selectedRows);
          setRequest({ ...request, teacherIds: selectedRowKeys as number[] });
        }}
        teacherInfos={availableTeacherInfos}
        selectedTeacherIds={selectedTeacherIds}
      />
      <Modal
        title={'跳转提示'}
        onOk={() => {
          history.push('/course/courseGroupStatus');
          setOpenForHistoryChange(false);
        }}
        onCancel={() => {
          setOpenForHistoryChange(false);
        }}
        okText={'前往'}
        cancelText={'取消'}
        open={openForHistoryChange}
      >
        <div>是否前往课程绑定模块添加学生?</div>
      </Modal>
    </>
  );
};

export default CourseCreationDrawer;
