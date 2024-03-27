import {defaultLessonInfo} from '@/@types/courseDefaults';
import accountApi from '@/apis/account';
import courseApi, {defaultLessonUpdateRequest, LessonUpdateRequest} from '@/apis/course';
import {defaultFilter, Filter, openNotification, SexFilterOptions,} from '@/utils/common';
import {toCn} from '@/utils/intl';
import {Button, DatePicker, Drawer, Input, Table, TableColumnsType, TableProps,} from 'antd';
import dayjs from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-table";

const LessonChangePage: React.FC = () => {
  const [tableLoadingForTeachers, setTableLoadingForTeachers] = useState(false);
  const [teacherInfos, setTeacherInfos] = useState<Account.TeacherInfo[]>([]);
  const [currentTeacherId, setCurrentTeacherId] = useState(0);
  const [lessonInfos, setLessonInfos] = useState<Course.LessonInfo[]>([]);
  const [drawerOpenForTiaoKe, setDrawerOpenForTiaoKe] = useState(false);
  const [currentLessonInfoWithId, setCurrentLessonInfoWithId] = useState<Course.LessonInfo>({
    ...defaultLessonInfo,
    id: 0,
  });
  const [otherTIds, setOtherTIds] = useState<React.Key[]>();
  const [filterNameForTiaoKe, setFilterNameForTiaoKe] = useState('');
  const [tiaokeLessonRequest, setTiaokeLessonRequest] = useState<LessonUpdateRequest>(
      defaultLessonUpdateRequest,
  );
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const tableRef = useRef<ActionType>();

  const getCurrentLesson = (id: number) => {
    setCurrentTeacherId(id);
    accountApi.getTeacherLessons(id).then(setLessonInfos);
  };

  const tableColumns: ProColumns<Account.TeacherInfo>[] = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      filters: SexFilterOptions,
      onFilter: (value: any, record) => record.sex.indexOf(value) === 0,
      align: 'center',
      render: (_, record) => {
        return <div>{toCn(record.sex)}</div>;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
    },
    {
      title: '操作',
      key: 'ope',
      align: 'center',
      render: (_, record) => (
          <Button
              type="primary"
              onClick={() => {
                getCurrentLesson(record.id);
              }}
          >
            查看课时
          </Button>
      ),
    },
  ];

  const lessonColumns: TableColumnsType<Course.LessonInfo> = [
    {
      title: '课时名称',
      dataIndex: 'courseName',
      key: 'courseName',
      align: 'center',
    },
    {
      title: '课程子号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startDateTime',
      key: 'startDateTime',
      align: 'center',
      render: (value: string) => (
          <div>{dayjs(value).format('YYYY-MM-DD HH:mm')}</div>
      ),
    },
    {
      title: '结束时间',
      dataIndex: 'endDateTime',
      key: 'endDateTime',
      align: 'center',
      render: (value: string) => (
          <div>{dayjs(value).format('YYYY-MM-DD HH:mm')}</div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value: Course.LessonStatus) => <div>{toCn(value)}</div>,
    },
    {
      title: '操作',
      key: 'ope',
      render: (_, record) => (
          <Button
              onClick={() => {
                setCurrentLessonInfoWithId(record);
                setTiaokeLessonRequest({...tiaokeLessonRequest, studentIds: record.students.map((stu) => (stu.id))})
                setTiaokeLessonRequest({...tiaokeLessonRequest, teacherIds: record.teachers.map((tea) => (tea.id))})
                setDrawerOpenForTiaoKe(true);
              }}
          >
            调课
          </Button>
      ),
    },
  ];

  const tiaoke = () => {
    courseApi
        .updateLesson(currentLessonInfoWithId.id, {status: "CANCELLED"})
        .then((res) => {
          if (res) {
            courseApi.createLesson({
              ...currentLessonInfoWithId,
              startDateTime: tiaokeLessonRequest.startDateTime as string,
              endDateTime: tiaokeLessonRequest.endDateTime as string,
              teacherIds: tiaokeLessonRequest.teacherIds,
              studentIds: tiaokeLessonRequest.studentIds,
              status: 'RESCHEDULED_PENDING',
              relatedLessonId: currentLessonInfoWithId.id,
              courseId: currentLessonInfoWithId.courseId,
              classroom: currentLessonInfoWithId.classroom.name,

            }).then((res) => {
              setDrawerOpenForTiaoKe(false);
              setCurrentLessonInfoWithId(defaultLessonInfo);
              setTiaokeLessonRequest(defaultLessonUpdateRequest);
              setOtherTIds([]);
              getCurrentLesson(currentTeacherId);
              courseApi
                  .updateLesson(currentLessonInfoWithId.id, {relatedLessonId: res.id})
              openNotification('调课', '调课成功', 'success', 'topRight');
            })

          }
        });
  };

  const tiaokeTeacherS: TableProps<Account.TeacherInfo>['rowSelection'] = {
    selectedRowKeys: tiaokeLessonRequest.teacherIds,
    onChange: (newSelectedRowKeys) => {
      setTiaokeLessonRequest({
        ...tiaokeLessonRequest,
        teacherIds: newSelectedRowKeys as number[],
      });
    },
  };

  const tiaokeStudentS: TableProps<Account.StudentInfo>['rowSelection'] = {
    selectedRowKeys: tiaokeLessonRequest.studentIds,
    onChange: (newSelectedRowKeys) => {
      setTiaokeLessonRequest({
        ...tiaokeLessonRequest,
        studentIds: newSelectedRowKeys as number[],
      });
    },
  };
  const getAllTea = () => {
    setTableLoadingForTeachers(true);
    accountApi.getAllTeachers().then((r) => {
      if (r) {
        setTeacherInfos(r);
        setTableLoadingForTeachers(false);
        if (tableRef.current) {
          tableRef.current.reload();
        }
      }
    });
  };
  /* 初始化表格数据 */
  useEffect(() => {
    getAllTea();
  }, []);

  return (
      <div className={'p-8'}>
        <div>教师信息管理</div>

       
        <ProTable
            actionRef={tableRef}
            request={async (params) => {
              console.log(params);
              return {
                data: teacherInfos
                    .filter((v) => {
                      return v.name.includes(params.name ?? '');
                    })
                    .map((value) => ({
                      ...value,
                      key: value.id,
                    })),
                success: true,
                total: teacherInfos
                    .filter((v) => {
                      return v.name.includes(params.name ?? '');
                    })
                    .map((value) => ({
                      ...value,
                      key: value.id,
                    })).length,
              };
            }}
            loading={tableLoadingForTeachers}
            columns={tableColumns}
        />
        <Drawer
            open={drawerOpenForTiaoKe}
            onClose={() => setDrawerOpenForTiaoKe(false)}
            contentWrapperStyle={{width: 500}}
        >
          <div>{currentLessonInfoWithId.courseName}</div>
          <div>教室:{currentLessonInfoWithId.classroom.name}</div>
          <div>
            开始时间:
            {dayjs(currentLessonInfoWithId.startDateTime).format(
                'YYYY-MM-DD HH:mm',
            )}
          </div>
          <div>
            修改为:
            <DatePicker
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD HH:mm"
                onChange={(_, dateString: string) => {
                  setTiaokeLessonRequest({
                    ...tiaokeLessonRequest,
                    startDateTime: dayjs(dateString).toISOString(),
                  });
                }}
            />
          </div>
          <div>
            结束时间:
            {dayjs(currentLessonInfoWithId.endDateTime).format(
                'YYYY-MM-DD HH:mm',
            )}
          </div>
          <div>
            修改为:
            <DatePicker
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD HH:mm"
                onChange={(_, dateString: string) => {
                  setTiaokeLessonRequest({
                    ...tiaokeLessonRequest,
                    endDateTime: dayjs(dateString).toISOString(),
                  });
                }}
            />
          </div>

          <div>
            备注:
            <Input
                value={tiaokeLessonRequest.note}
                onChange={(e) => {
                  setTiaokeLessonRequest({
                    ...tiaokeLessonRequest,
                    note: e.target.value,
                  });
                }}
            />
          </div>

          <div>参课教师</div>
          <Table
              columns={[
                {
                  title: '教师姓名',
                  dataIndex: 'name',
                  key: 'id',
                  align: 'center',
                },
              ]}
              dataSource={currentLessonInfoWithId.teachers.map((value) => ({
                ...value,
                key: value.id,
              }))}
              rowSelection={tiaokeTeacherS}
          />
          <div>选择其他教师</div>


          <Table
              columns={[
                {
                  title: '教师姓名',
                  filters: [
                    {text: filterNameForTiaoKe, value: filterNameForTiaoKe},
                  ],
                  onFilter: (value, record: Account.TeacherInfo) =>
                      record.name.search(value as string) !== -1,
                  dataIndex: 'name',
                  key: 'id',
                  align: 'center',
                },
              ]}
              dataSource={teacherInfos.map((value) => ({
                ...value,
                key: value.id,
              }))}
              rowSelection={{
                selectedRowKeys: otherTIds,
                onChange: (selectedRowKeys) => {
                  setOtherTIds(selectedRowKeys);
                  setTiaokeLessonRequest({
                    ...tiaokeLessonRequest,
                    teacherIds:
                        tiaokeLessonRequest.teacherIds?.concat(
                            selectedRowKeys as number[],
                        ) ?? (selectedRowKeys as number[]),
                  });
                },
              }}
          />

          <div>参课学生</div>
          <Table
              columns={[
                {
                  title: '学生姓名',
                  dataIndex: 'name',
                  key: 'id',
                  align: 'center',
                },
              ]}
              dataSource={currentLessonInfoWithId.students.map((value) => ({
                ...value,
                key: value.id,
              }))}
              rowSelection={tiaokeStudentS}
          />

          <div>
            <Button
                type="primary"
                onClick={() => {
                  tiaoke();
                }}
            >
              提交
            </Button>
          </div>
        </Drawer>

        <Table
            columns={lessonColumns}
            dataSource={lessonInfos.map((value) => ({...value, key: value.id}))}
        />
      </div>
  );
};

export default LessonChangePage;
