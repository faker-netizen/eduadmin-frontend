import { defaultStudentInfo } from '@/@types/accountDefaults';
// import {defaultCourseGroupInfo, defaultStudentMonthlyBill} from '@/@types/courseDefaults';
import accountApi from '@/apis/account';
import courseApi, {
  CourseModelDetailCreationRequest,
  defaultCourseModelCreationRequest,
  defaultCourseModelDetailCreationRequest,
} from '@/apis/course';
import { getRandomColor, openNotification } from '@/utils/common';
import {
  Button,
  Divider,
  Drawer,
  Input,
  Popconfirm,
  Select,
  Switch,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';
import label from '@/apis/label';
import { toCn } from '@/utils/intl';
import { defaultCourseGroupInfo } from '@/@types/courseDefaults';

const INPUTST = {};
type CategoryDict = {
  ACCOMPANIED_GROUP: '有陪_集体';
  ACCOMPANIED_INDIVIDUAL: '有陪_单训';
  UNACCOMPANIED_GROUP: '无陪_集体';
  UNACCOMPANIED_INDIVIDUAL: '无陪_单训';
  CLINIC: '门诊';
  TEMPORARY: '临时加课';
  GROUP: '集体';
  ALL?: '不限';
};
const categoryDict: CategoryDict = {
  ACCOMPANIED_GROUP: '有陪_集体',
  ACCOMPANIED_INDIVIDUAL: '有陪_单训',
  UNACCOMPANIED_GROUP: '无陪_集体',
  UNACCOMPANIED_INDIVIDUAL: '无陪_单训',
  CLINIC: '门诊',
  TEMPORARY: '临时加课',
  ALL: '不限',
  GROUP: '集体',
};

const CourseModelManagePage: React.FC = () => {
  const [studentInfos, setStudentInfos] = useState<Account.StudentInfo[]>([]);
  const [courseModelInfos, setCourseModelInfos] = useState<
    Course.CourseModelInfo[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'edit' | 'create'>('create');
  const [inputLabel, setInputLabel] = useState('');
  const [currentLabels, setCurrentLabels] = useState<string[]>([]);
  const [stuSelections, setStuSelections] = useState<number[]>([]);
  const [modelSelection, setModelSelection] = useState<number[]>([]);
  const [allLabels, setAllLabels] = useState<Label.LabelInfo[]>([]);
  const [oneStudentCourseGroupsOpen, setOneStudentCourseGroupsOpen] =
    useState(false);
  const [currentCategoryCreated, setCurrentCategoryCreated] = useState(
    defaultCourseModelDetailCreationRequest,
  );
  const [createCourseModelData, setCreateCourseModelData] = useState(
    defaultCourseModelCreationRequest,
  );
  const [courseModelDrawerOpen, setCourseModelDrawerOpen] = useState(false);
  const [oneStudentInfo, setOneStudentInfo] = useState(defaultStudentInfo);
  const [oneStudentCourseGroupInfo, setOneStudentCourseGroupInfo] = useState([
    defaultCourseGroupInfo,
  ]);
  // const [oneStudentBill, setOneStudentBill] = useState<Course.StudentMonthlyBill>(defaultStudentMonthlyBill)
  const [filterName, setFilterName] = useState('');

  /**
   * 获取当前学生的courseGroup
   * @param id
   */
  const getCurrentStudentCourseGroup = (id: number) => {
    setOneStudentCourseGroupsOpen(true);
    accountApi.getStudentCourseGroups(id).then(setOneStudentCourseGroupInfo);
  };

  const getALlLabels = () => {
    label.getAllLabels().then((response) => {
      setAllLabels(response);
    });
  };
  // const getOneStuBill = (id: number) => {
  //   accountApi.getStudentBill(id).then((response) => {
  //     console.log(response)
  //     setOneStudentBill(response)
  //   })
  //
  // }
  const tableColumns: TableColumnsType<Account.StudentInfo> = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      align: 'center',
      filters: [{ text: filterName, value: filterName }],
      onFilter: (_, record) => record.name.search(filterName) !== -1,
    },

    {
      title: '学号',
      dataIndex: 'studentNumber',
      align: 'center',
      sorter: (a, b) => {
        return Number(a.idno) - Number(b.idno);
      },
    },
    {
      title: '障碍类型',
      dataIndex: 'disorderType',
      align: 'center',
      filters: [
        {
          text: '听障',
          value: '听障',
        },
        {
          text: '智力',
          value: '智力',
        },
      ],
      onFilter: (value, record) => record.disorderType === value,
    },
    {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setOneStudentInfo(record);
            getCurrentStudentCourseGroup(record.id);
            // getOneStuBill(record.id)
          }}
        >
          查看模式
        </Button>
      ),
    },
  ];

  /**
   * 学生表格选择项
   */
  const stuSelectionConfig: TableProps<Account.StudentInfo>['rowSelection'] = {
    selectedRowKeys: stuSelections,
    onChange: (selectedRowKeys) => {
      setStuSelections(selectedRowKeys as number[]);
    },
  };

  /**
   * 学生模式绑定
   */
  const courseModelStudentBinding = () => {
    if (modelSelection.length === 1 && stuSelections.length > 0) {
      stuSelections.forEach((value) => {
        courseApi.createCourseGroup({
          studentId: value,
          courseModelId: modelSelection[0],
          courseIds: [],
        });
      });
      openNotification('课程模式绑定', '课程模式绑定成功', 'success');
    }
  };

  const getAllStudents = () => {
    setLoading(true);
    accountApi.getAllStudents().then((res) => {
      setStudentInfos(res);
      setLoading(false);
    });
  };

  /**
   * 检查表单完整性
   * @returns
   */
  const checkForm = () => {
    const right = [0, 0, 0, 0];
    if (createCourseModelData.name !== '') {
      right[0] = 1;
    }
    if (createCourseModelData.monthlyPrice > 0) right[1] = 1;
    if (createCourseModelData.unitPrice > 0) right[2] = 1;
    if (createCourseModelData.details.length > 0) right[3] = 1;
    return right.every((value) => value === 1);
  };

  /**
   * 获取所有课程模式
   */
  const getAllCourseModels = () => {
    courseApi.getAllCourseModels().then(setCourseModelInfos);
  };

  /**
   * 创建一个课程模式
   */
  const createCourseModel = () => {
    if (checkForm()) {
      courseApi.createCourseModel({ ...createCourseModelData }).then((res) => {
        if (res.id) {
          openNotification(
            '创建新的课程模式',
            '创建成功',
            'success',
            'topLeft',
          );
          setCreateCourseModelData(defaultCourseModelCreationRequest);
          setCurrentCategoryCreated(defaultCourseModelDetailCreationRequest);
          setCurrentLabels([]);
          setInputLabel('');
          setCourseModelDrawerOpen(false);
          getAllCourseModels();
        }
      });
    } else {
      openNotification('创建新的课程模式', '表单不完整', 'error', 'topLeft');
    }
  };

  const editCourseModel = () => {};

  /**
   * 删除单个标签
   * @param e
   */
  const delOneTag = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    const newArr = currentLabels.filter((_, i) => i !== index);
    setCurrentLabels(newArr);
  };

  /**
   * 标签组渲染
   * @param e
   * @returns
   */
  const RenderLabels = (e: { labels: string[]; allowDel: boolean }) => {
    return (
      <div>
        {e.labels.map((value, index) => {
          return (
            <Tag
              closable={e.allowDel}
              color={getRandomColor(value)}
              style={{ color: 'black' }}
              key={inputLabel + index.toString()}
              onClose={(e) => {
                delOneTag(e, index);
              }}
            >
              {value}
            </Tag>
          );
        })}
      </div>
    );
  };

  /**
   * 渲染已创建模式子组
   * @param e
   * @returns
   */
  const RenderDetails = (
    e: CourseModelDetailCreationRequest & { index: number },
  ) => (
    <div
      key={e.index}
      style={{
        border: '1px solid lightgray',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 5,
        marginBottom: 10,
        padding: 20,
      }}
    >
      <div>{toCn(e.category)}</div>
      <div>标签组:</div>
      <div>
        <RenderLabels allowDel={false} labels={e.labels} />
      </div>
      <div>单节课时间:{e.duration > 0 ? e.duration : '不限'}</div>
      <div>每周课时(/次):{e.amount > 0 ? e.amount : '不限'}</div>
      <Button
        onClick={() => {
          const currentDetails: CourseModelDetailCreationRequest[] = [
            ...createCourseModelData.details,
          ];
          const newDetails = currentDetails.filter((v, i, a) => {
            return i !== e.index;
          });
          setCreateCourseModelData({
            ...createCourseModelData,
            details: newDetails,
          });
        }}
      >
        删除
      </Button>
    </div>
  );

  /**
   * 查看模式详情
   * @param info
   */
  const modelsTableMoreInfo = (info: Course.CourseModelInfo) => {
    setMode('edit');
    setCourseModelDrawerOpen(true);
    setCreateCourseModelData(info);
  };

  /**
   * 删除一个模式
   * @param id
   */
  const delOneCourseModel = (id: number) => {
    courseApi.deleteCourseModel(id).then(() => {
      getAllCourseModels();
    });
  };

  const ColumnCourseMode: TableColumnsType<Course.CourseModelInfo> = [
    {
      title: '模式名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '模式描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '价格',
      dataIndex: 'monthlyPrice',
      key: 'monthlyPrice',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            {record.billingMethod === 'BY_MONTH'
              ? `${record.monthlyPrice}/月`
              : `${record.unitPrice}/节课`}
          </div>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'details',
      key: 'details',
      align: 'center',
      render: (_, record) => (
        <>
          <Button
            style={{ marginRight: 10 }}
            type="primary"
            onClick={() => {
              modelsTableMoreInfo(record);
            }}
          >
            详情
          </Button>
          <Popconfirm
            title="删除模式"
            okText="确定"
            onConfirm={() => {
              delOneCourseModel(record.id);
            }}
            cancelText="取消"
          >
            <Button type="primary" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  /**
   * 添加单个标签事件
   */
  const addOneLabel = () => {
    const newArr: string[] = [...currentLabels, inputLabel];
    setCurrentLabels(newArr);
    setCurrentCategoryCreated({ ...currentCategoryCreated, labels: newArr });
    setInputLabel('');
  };

  /**
   * 添加一个模式子组
   */
  const addOneDetail = () => {
    const newDetails: CourseModelDetailCreationRequest[] = [
      ...createCourseModelData.details,
      currentCategoryCreated,
    ];
    setCreateCourseModelData({ ...createCourseModelData, details: newDetails });
  };

  /* 初始化表格数据 */
  useEffect(() => {
    getAllStudents();
    getAllCourseModels();
    getALlLabels();
  }, []);

  return (
    <div
      style={{
        padding: 30,
      }}
    >
      <div>课程模式</div>
      <div>
        <Button
          onClick={() => {
            setCourseModelDrawerOpen(true);
            setMode('create');
          }}
          size="large"
          type="primary"
        >
          创建课程模式
        </Button>
      </div>

      {/*创建课程模式抽屉*/}
      <Drawer
        contentWrapperStyle={{ width: 900 }}
        extra={
          <div
            style={{
              height: 90,
              width: 300,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginRight: 30,
              alignItems: 'center',
            }}
          >
            <Button
              style={{ height: '70%', borderRadius: 5 }}
              type="primary"
              onClick={() => {
                if (mode === 'create') {
                  createCourseModel();
                } else {
                  editCourseModel();
                }
              }}
            >
              {mode === 'create' ? '添加' : '提交修改'}
            </Button>
            <Button
              onClick={() => {
                setCourseModelDrawerOpen(false);
              }}
              style={{
                height: '70%',
                width: 100,
                borderRadius: 5,
              }}
            >
              关闭
            </Button>
          </div>
        }
        open={courseModelDrawerOpen}
        onClose={() => {
          setCourseModelDrawerOpen(false);
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '5%',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 10,
              alignItems: 'center',
            }}
          >
            <Divider>模式基本信息</Divider>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
            }}
          >
            <div>模式名称</div>
            <Input
              size="large"
              disabled={mode === 'edit'}
              style={{ ...INPUTST, width: '50%', marginLeft: 10 }}
              value={createCourseModelData.name}
              onChange={(e) => {
                setCreateCourseModelData({
                  ...createCourseModelData,
                  name: e.target.value,
                });
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              marginTop: 10,
              alignItems: 'center',
            }}
          >
            <div>模式描述</div>
            <Input
              size="large"
              disabled={mode === 'edit'}
              style={{ ...INPUTST, width: '50%', marginLeft: 10 }}
              value={createCourseModelData.description}
              onChange={(e) => {
                setCreateCourseModelData({
                  ...createCourseModelData,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
            }}
          >
            <div>月计费价格</div>
            <Input
              size="large"
              disabled={mode === 'edit'}
              type="number"
              style={{ ...INPUTST, width: '50%', marginLeft: 10 }}
              value={createCourseModelData.monthlyPrice}
              onChange={(e) => {
                setCreateCourseModelData({
                  ...createCourseModelData,
                  monthlyPrice: Number(e.target.value),
                });
              }}
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
              alignItems: 'center',
            }}
          >
            <div>单元计算价格</div>
            <Input
              size="large"
              disabled={mode === 'edit'}
              type="number"
              style={{ ...INPUTST, width: '50%', marginLeft: 10 }}
              value={createCourseModelData.unitPrice}
              onChange={(e) => {
                setCreateCourseModelData({
                  ...createCourseModelData,
                  unitPrice: Number(e.target.value),
                });
              }}
            />
          </div>

          <Divider>套餐设置</Divider>
          <div style={{ paddingLeft: '10%' }}>
            <div>类型:</div>
            <div>
              <Select
                disabled={mode === 'edit'}
                value={currentCategoryCreated?.category}
                onChange={(e) => {
                  setCurrentCategoryCreated({
                    ...currentCategoryCreated,
                    category: e,
                  });
                }}
                size="large"
                style={{ width: 300 }}
                options={[
                  { value: 'ALL', label: '不限' },
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
                    value: 'TEMPORARY',
                    label: '临时加课',
                  },
                ]}
              />
            </div>
            {/*<div>标签</div>*/}
            {/*<div*/}
            {/*    style={{*/}
            {/*      width: '90%',*/}
            {/*      display: 'flex',*/}
            {/*      flexDirection: 'row',*/}
            {/*      marginBottom: 10,*/}
            {/*    }}*/}
            {/*>*/}
            {/*  <Input*/}
            {/*      disabled={mode === 'edit'}*/}
            {/*      style={{width: '40%', marginRight: 20}}*/}
            {/*      value={inputLabel}*/}
            {/*      onChange={(e) => {*/}
            {/*        setInputLabel(e.target.value);*/}
            {/*      }}*/}
            {/*  />*/}
            {/*  <Select*/}
            {/*      style={{width: '40%', marginRight: 20}}*/}
            {/*      options={allLabels.map((label) => ({label: label.name, value: label.name}))}*/}
            {/*      onChange={(v) => {*/}
            {/*        setInputLabel(v)*/}
            {/*      }}*/}
            {/*  />*/}
            {/*  <Button*/}
            {/*      type="primary"*/}
            {/*      style={{backgroundColor: '#49cc90', border: 'none'}}*/}
            {/*      onClick={() => {*/}
            {/*        addOneLabel();*/}
            {/*      }}*/}
            {/*      disabled={mode === 'edit'}*/}
            {/*  >*/}
            {/*    添加标签*/}
            {/*  </Button>*/}
            {/*</div>*/}
            {/*<div>当前标签组</div>*/}
            {/*<div*/}
            {/*    style={{minHeight: 50, border: '1px dotted lightgray', padding: 5}}*/}
            {/*>*/}
            {/*  <RenderLabels allowDel={true} labels={currentLabels}/>*/}
            {/*</div>*/}
            <div className={'mt-4'}>单节课程时间(/分钟)</div>
            <div>
              <Select
                disabled={mode === 'edit'}
                style={{ width: 300 }}
                options={[
                  { label: '不限制', value: -1 },
                  { label: '5分钟', value: 5 },
                  { label: '30分钟', value: 30 },
                  { label: '40分钟', value: 40 },
                  { label: '60分钟', value: 60 },
                ]}
                value={currentCategoryCreated.duration}
                onChange={(e) => {
                  setCurrentCategoryCreated({
                    ...currentCategoryCreated,
                    duration: Number(e),
                  });
                }}
              />
              {/*<Input*/}
              {/*    disabled={mode === 'edit'}*/}
              {/*    style={{width: 300}}*/}
              {/*    type="number"*/}
              {/*    min={1}*/}
              {/*    value={currentCategoryCreated.duration}*/}
              {/*    onChange={(e) => {*/}
              {/*      setCurrentCategoryCreated({*/}
              {/*        ...currentCategoryCreated,*/}
              {/*        duration: Number(e.target.value),*/}
              {/*      });*/}
              {/*    }}*/}
              {/*/>*/}
            </div>
            <div className={'mt-4'}>课程数量</div>
            <div className={'flex flex-row items-center'}>
              <Input
                disabled={
                  mode === 'edit' || currentCategoryCreated.amount === -1
                }
                style={{ width: 300 }}
                type="number"
                min={1}
                value={
                  currentCategoryCreated.amount > 0
                    ? currentCategoryCreated.amount
                    : ''
                }
                onChange={(e) => {
                  setCurrentCategoryCreated({
                    ...currentCategoryCreated,
                    amount: Number(e.target.value),
                  });
                }}
              />
              <Switch
                checked={currentCategoryCreated.amount === -1}
                onChange={(e) => {
                  setCurrentCategoryCreated({
                    ...currentCategoryCreated,
                    amount: e ? -1 : 1,
                  });
                }}
              />
              <div>不限制</div>
            </div>
            <Button
              size={'large'}
              className={'mt-4'}
              disabled={mode === 'edit'}
              type="primary"
              onClick={() => {
                addOneDetail();
              }}
            >
              添加到模式
            </Button>
            <div style={{ marginTop: 40, marginBottom: 20 }}>已创建子组</div>
            <div
              style={{ width: '50%', display: 'flex', flexDirection: 'column' }}
            >
              {createCourseModelData.details.map((value, index) => (
                <RenderDetails
                  key={index}
                  category={value.category}
                  labels={value.labels}
                  duration={value.duration}
                  amount={value.amount}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </Drawer>

      {/*创建模式课时抽屉*/}
      <Drawer
        open={oneStudentCourseGroupsOpen}
        contentWrapperStyle={{ width: 900 }}
        onClose={() => {
          setOneStudentCourseGroupsOpen(false);
        }}
      >
        <div>该学生已绑定的课程模式数量:{oneStudentCourseGroupInfo.length}</div>
        {oneStudentCourseGroupInfo.length > 0 ? (
          <div>
            <div>学生姓名:{oneStudentCourseGroupInfo[0].student.name}</div>
            <div>
              {oneStudentCourseGroupInfo.map((oneGroup, index) => (
                <div key={index} style={{ marginTop: '40px' }}>
                  <div className="font-bold text-center">
                    模式名称:{oneGroup.courseModel.name}
                  </div>
                  <div className="font-bold text-center mt-3">
                    模式状态:{oneGroup.status==="CANCELLED"?"已退":"进行中"}

                  </div>
                  {oneGroup.courseModel.details.map((value, subIndex) => (
                    <RenderDetails
                      key={subIndex}
                      category={value.category}
                      labels={value.labels}
                      duration={value.duration}
                      amount={value.amount}
                      index={index * 100 + subIndex}
                    />
                  ))}
                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      courseApi.deleteCourseGroup(oneGroup.id).then((r) => {
                        if (r === '') {
                          getCurrentStudentCourseGroup(oneStudentInfo.id);
                        }
                      });
                    }}
                  >
                    {' '}
                    删除该模式
                  </Button>
                  <Button
                      className={'ml-2'}
                    type="primary"
                    danger
                    onClick={() => {
                      courseApi
                        .changeCourseGroupStatus(oneGroup.id, {
                          status: 'CANCELLED',
                        })
                        .then((response) => {
                          getCurrentStudentCourseGroup(oneStudentInfo.id);
                          console.log(response);
                          openNotification(
                            '退订套餐',
                            '退订课程模式成功',
                            'success',
                            'topRight',
                          );
                        });

                      // courseApi.deleteCourseGroup(oneGroup.id).then((r) => {
                      //     if (r === '') {
                      //         getCurrentStudentCourseGroup(oneStudentInfo.id);
                      //     }
                      // });
                    }}
                  >
                    {' '}
                    退模式
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>该学生尚未绑定课程模式</div>
        )}
        {/*<Divider>学生课程情况统计</Divider>*/}
        {/*<div className={'info-label'}>*/}
        {/*  <div>时间:</div>*/}
        {/*  <div>{oneStudentBill.year + " " + toCn(oneStudentBill.month)}</div>*/}
        {/*</div>*/}
        {/*<div className={'info-label'}>*/}
        {/*  <div>缺课情况:</div>*/}
        {/*  <div>{oneStudentBill.courseGroupMonthlyBills.length <= 0 ? '未缺课' :*/}
        {/*      <div>{oneStudentBill.courseGroupMonthlyBills[0].courseModelName}</div>*/}
        {/*  }</div>*/}
        {/*</div>*/}
      </Drawer>

      <Table
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys) => {
            setModelSelection(selectedRowKeys as number[]);
          },
        }}
        columns={ColumnCourseMode}
        dataSource={courseModelInfos.map((value) => ({
          ...value,
          key: value.id,
        }))}
      />
      <div>学生排课</div>
      <div>
        <Button
          type="primary"
          size="large"
          // style={{ height: '60px' }}
          onClick={() => {
            courseModelStudentBinding();
          }}
        >
          学生-模式绑定
        </Button>
      </div>
      <div
        style={{
          marginTop: 30,
          backgroundColor: 'white',
          padding: 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
          }}
        >
          <div>按姓名搜索:</div>
          <Input
            value={filterName}
            style={{ width: '40%', maxWidth: 160 }}
            onChange={(e) => {
              setFilterName(e.target.value);
            }}
          />
        </div>
        <Table
          loading={loading}
          rowSelection={stuSelectionConfig}
          columns={tableColumns}
          dataSource={studentInfos
            .filter((student) => {
              return student.name.includes(filterName);
            })
            .map((value) => ({
              ...value,
              key: value.id,
            }))}
        />
      </div>
    </div>
  );
};

export default CourseModelManagePage;
