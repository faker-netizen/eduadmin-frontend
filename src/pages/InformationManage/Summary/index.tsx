import accountApi from '@/apis/account';
import {
  Button,
  Divider,
  Drawer,
  Input,
  Modal,
  Radio,
  Select,
  Table,
  TableColumnsType,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
// import { defaultStudentMonthlyBill } from '@/@types/courseDefaults';
import { toCn } from '@/utils/intl';
import { getCurrentDateTime, MonthSelectOptions } from '@/utils/time';
import { openNotification } from '@/utils/common';
import paymentApi, {
  defaultPaymentCreationRequest,
  defaultRefundCreationRequest,
  PaymentCreationRequest,
  RefundCreationRequest,
} from '@/apis/payment';
import dayjs from 'dayjs';
import { defaultStudentInfo } from '@/@types/accountDefaults';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';

const SummaryPage: React.FC = () => {
  const currentDateTime = getCurrentDateTime();
  const [studentInfos, setStudentInfos] = useState<Account.StudentInfo[]>([]);
  const [filterName, setFilterName] = useState('');
  const [loadingForStuTable, setLoadingForStuTable] = useState(false);
  const [modalOpenForPay, setModalOpenForPay] = useState(false);
  const [oneStudentBillDrawerOpen, setOneStudentBillDrawerOpen] =
    useState(false);
  // const [oneStudentMonthlyBill, setOneStudentMonthlyBill] =
  //   useState<Course.StudentMonthlyBill>(defaultStudentMonthlyBill);
  const [drawerOpenForPayStatus, setDrawerOpenForPayStatus] = useState(false);
  const [oneStuPaymentsInfo, setOneStuPaymentsInfo] = useState<
    Payment.PaymentInfo[]
  >([]);

  const [currentStudent, setCurrentStudent] =
    useState<Account.StudentInfo>(defaultStudentInfo);
  const [checkPayWay, setCheckPayWay] = useState<'WECHAT' | 'ALIPAY'>('WECHAT');
  const [searchPayTime, setSearchPayTime] = useState({
    year: currentDateTime.year,
    month: currentDateTime.month,
  });
  const [drawerOpenForCreatePayment, setDrawerOpenForCreatePayment] =
    useState(false);
  const tableRef = useRef<ActionType>();
  const [createPaymentReq, setCreatePaymentReq] =
    useState<PaymentCreationRequest>(defaultPaymentCreationRequest);
  const [oneStuRefundsInfo, setOneStuRefundsInfo] = useState<
    Payment.RefundInfo[]
  >([]);
  const [drawerOpenForCreateRefund, setDrawerOpenForCreateRefund] =
    useState(false);
  const [createRefunReq, setCreateRefunReq] = useState<RefundCreationRequest>(
    defaultRefundCreationRequest,
  );
  const oneStudentBill = (record: Account.StudentInfo) => {
    setOneStudentBillDrawerOpen(true);
    setCurrentStudent(record);
    accountApi.getStudentPayments(record.id).then((response) => {
      console.log(response);
      setOneStuPaymentsInfo(response);
    });
    accountApi.getStudentRefunds(record.id).then((response) => {
      setOneStuRefundsInfo(response);
    });
    // accountApi
    //   .getStudentBill(record.id, searchPayTime.year, searchPayTime.month)
    //   .then((response) => {
    //     setOneStudentMonthlyBill(response);
    //   });
  };
  const setBillTime = () => {
    openNotification(
      '账单查询时间设定',
      '已将查询时间设定为' +
        searchPayTime.year +
        '年' +
        toCn(searchPayTime.month),
      'success',
    );
  };
  const payStatus = (record: Account.StudentInfo) => {};

  const tableColumns: ProColumns<Account.StudentInfo>[] = [
    {
      title: '学生姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'studentNumber',
      align: 'center',
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
        <div>
          {/*<Button*/}
          {/*    type={'primary'}*/}
          {/*    onClick={() => {*/}
          {/*      setDrawerOpenForCreatePayment(true);*/}
          {/*      setCurrentStudent(record);*/}
          {/*    }}*/}
          {/*>*/}
          {/*  创建账单*/}
          {/*</Button>*/}
          <Button
            style={{ marginRight: 9 }}
            onClick={() => oneStudentBill(record)}
          >
            核对账单
          </Button>
        </div>
      ),
    },
  ];
  const tableColumnsForStuRefund: TableColumnsType<Payment.RefundInfo> = [
    {
      title: '退费订单编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '账单产生时间',
      dataIndex: 'creationDateTime',
      align: 'center',
      render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '退费金额',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: '操作',
      key: 'ope',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            <Button
              // disabled={record.verificationDateTime !== ''}
              // onClick={() => {
              //   checkPayed(record);
              // }}
              type={'primary'}
            >
              进行确认
              {/*{record.verificationDateTime === '' ? '进行确认' : '已确认'}*/}
            </Button>
          </div>
        );
      },
    },
  ];
  const tableColumnsForStuPayment: TableColumnsType<Payment.PaymentInfo> = [
    {
      title: '缴费订单编号',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '账单产生时间',
      dataIndex: 'creationDateTime',
      align: 'center',
      render: (v) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '账单金额',
      dataIndex: 'total',
      align: 'center',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      align: 'center',
    },
    {
      title: '支付时间',
      dataIndex: 'paidDateTime',
      align: 'center',
      render: (_, record) => {
        const value = record.confirmationDateTime
          ? dayjs(record.confirmationDateTime).format('YYYY-MM-DD HH:MM')
          : '尚未支付';
        return <div>{value}</div>;
      },
    },
    {
      title: '财务确认时间',
      dataIndex: 'paidDateTime',
      align: 'center',
      render: (_, record) => {
        const value = record.verificationDateTime
          ? dayjs(record.verificationDateTime).format('YYYY-MM-DD HH:MM')
          : '尚未确认';
        return <div>{value}</div>;
      },
    },
    {
      title: '操作',
      key: 'ope',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            <Button
              disabled={record.verificationDateTime !== ''}
              onClick={() => {
                checkPayed(record);
              }}
              type={'primary'}
            >
              {record.verificationDateTime === '' ? '进行确认' : '已确认'}
            </Button>
          </div>
        );
      },
    },
  ];
  const ColumnForOneStuBill: TableColumnsType<Course.CourseGroupMonthlyBill> = [
    {
      title: '总计',
      dataIndex: 'total',
      align: 'center',
    },
  ];

  const renderAllStudents = () => {
    setLoadingForStuTable(true);
    accountApi.getAllStudents().then((response) => {
      if (response) {
        setLoadingForStuTable(false);
        setStudentInfos(response);
      }
    });
    if (tableRef.current) {
      tableRef.current.reload();
    }
  };
  const checkPayed = (payment: Payment.PaymentInfo) => {
    const Time = new Date();
    console.log(Time.toISOString());

    paymentApi.verifyPayment(payment.id).then((res) => {
      openNotification('缴费确认', '已确认缴费信息');
      oneStudentBill(currentStudent);
    });
  };
  const createPayment = () => {
    console.log(createPaymentReq);
    paymentApi.createPayment(createPaymentReq).then((response) => {
      if (response) {
        openNotification('创建缴费项', '创建缴费项成功', 'success');
        setCreatePaymentReq(defaultPaymentCreationRequest);
        setDrawerOpenForCreatePayment(false);
      }
    });
  };
  const createRefund = () => {
    console.log(createRefunReq);
    paymentApi.createRefund(createRefunReq).then((response) => {
      if (response) {
        openNotification('创建退费项', '创建退费项成功', 'success');
        setCreateRefunReq(defaultRefundCreationRequest);
        setDrawerOpenForCreateRefund(false);
      }
    });
  };
  useEffect(() => {
    renderAllStudents();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <div className="flex flex-row w-full justify-around">
        <div className="edit-label">
          <div className="edit-label-text">选择年份:</div>
          <Input
            placeholder="如:2023"
            type={'number'}
            value={searchPayTime.year}
            style={{ height: '80%' }}
            onChange={(e) => {
              setSearchPayTime({
                ...searchPayTime,
                year: parseInt(e.target.value),
              });
            }}
          />
        </div>
        <div className="edit-label">
          <div className="edit-label-text">选择月份:</div>
          <Select
            style={{ width: 200 }}
            value={searchPayTime.month}
            options={MonthSelectOptions}
            onChange={(e) => {
              setSearchPayTime({ ...searchPayTime, month: e });
            }}
          />
        </div>
        <div>
          <Button
            size={'large'}
            onClick={() => {
              setBillTime();
            }}
          >
            设定
          </Button>
        </div>
        <div>
          <Button type={'primary'}>一键设定当月账单</Button>
        </div>
      </div>

      <ProTable
        actionRef={tableRef}
        request={async (params) => {
          console.log(params);
          return {
            data: studentInfos
              .filter((v) => {
                return v.name.includes(params.username ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })),
            success: true,
            total: studentInfos
              .filter((v) => {
                return v.name.includes(params.username ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })).length,
          };
        }}
        dataSource={studentInfos
          .filter((v, index) => {
            return v.name.search(filterName) >= 0;
          })
          .map((value) => ({ ...value, key: value.id }))}
        loading={loadingForStuTable}
        columns={tableColumns}
      />
      <Drawer
        open={oneStudentBillDrawerOpen}
        onClose={() => {
          setOneStudentBillDrawerOpen(false);
        }}
        contentWrapperStyle={{
          width: 900,
        }}
        push={{ distance: 0 }}
      >
        {/*<div className="flex flex-row">*/}
        {/*  <div className="info-label">*/}
        {/*    年份: &nbsp;{oneStudentMonthlyBill.year}*/}
        {/*  </div>*/}
        {/*  <div className="info-label">*/}
        {/*    月份: &nbsp;{toCn(oneStudentMonthlyBill.month)}*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="flex flex-row">*/}
        {/*  <div className="info-label">*/}
        {/*    当月产生账单金额: &nbsp;*/}
        {/*    {oneStudentMonthlyBill.total}*/}
        {/*  </div>*/}
        {/*  <div*/}
        {/*      className="info-label"*/}
        {/*      style={{*/}
        {/*        display:*/}
        {/*            oneStudentMonthlyBill.status === 'UNPAID' ? 'flex' : 'none',*/}
        {/*      }}*/}
        {/*  >*/}
        {/*    付款时间: &nbsp;*/}
        {/*    {dayjs(oneStudentMonthlyBill.paidDateTime).format(*/}
        {/*        'YYYY-MM-DD HH:MM:ss',*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="flex flex-row">*/}
        {/*  <div className="info-label">*/}
        {/*    详情: &nbsp;*/}

        {/*  </div>*/}

        {/*</div>*/}
        {/*<Table*/}
        {/*    columns={ColumnForOneStuBill}*/}
        {/*    dataSource={oneStudentMonthlyBill.courseGroupMonthlyBills.map(*/}
        {/*        (value, index) => ({*/}
        {/*          ...value,*/}
        {/*          key: index,*/}
        {/*        }),*/}
        {/*    )}*/}
        {/*/>*/}
        <Button
          type={'primary'}
          onClick={() => {
            setDrawerOpenForCreatePayment(true);
            setCreatePaymentReq({
              ...createPaymentReq,
              year: searchPayTime.year,
              month: searchPayTime.month,
              studentId: currentStudent.id,
            });
          }}
        >
          新建缴费项
        </Button>
        <Table
          columns={tableColumnsForStuPayment}
          dataSource={oneStuPaymentsInfo.map((value) => {
            return { ...value, key: value.id };
          })}
        />
        <Button
          type={'primary'}
          onClick={() => {
            setDrawerOpenForCreateRefund(true);
            setCreateRefunReq({
              ...createRefunReq,
              year: searchPayTime.year,
              month: searchPayTime.month,
              studentId: currentStudent.id,
            });
          }}
        >
          新建退费项
        </Button>
        <Table
          columns={tableColumnsForStuRefund}
          dataSource={oneStuRefundsInfo.map((value) => {
            return { ...value, key: value.id };
          })}
        />
      </Drawer>
      <Drawer
        open={drawerOpenForPayStatus}
        onClose={() => {
          setDrawerOpenForPayStatus(false);
        }}
        contentWrapperStyle={{
          width: 800,
        }}
      >
        <Table
          dataSource={oneStuPaymentsInfo?.map((value) => {
            return { ...value, key: value.id };
          })}
        />
      </Drawer>
      <Modal
        open={drawerOpenForCreateRefund}
        width={700}
        onOk={() => {
          createRefund();
        }}
        onCancel={() => {
          setDrawerOpenForCreateRefund(false);
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/*studentId: number;*/}
          {/*year: number;*/}
          {/*month: Month;*/}
          {/*total: number;*/}
          {/*paidDateTime: string;*/}
          {/*paymentMethod: Payment.PaymentMethod;*/}
          {/*paymentType: string;*/}
          {/*description: string;*/}
          <div className="edit-label mt-5">
            <div className={'edit-label-text'}>年份:</div>
            <Input disabled value={searchPayTime.year} />
          </div>
          <div className="edit-label mt-5">
            <div className={'edit-label-text'}>月份:</div>
            <Input disabled value={toCn(searchPayTime.month)} />
          </div>
          <div className="edit-label mt-5">
            <div className={'edit-label-text'}>设定金额:</div>
            <Input
              value={createRefunReq.total}
              onChange={(e) => {
                if (e.target.value !== '') {
                  setCreateRefunReq({
                    ...createRefunReq,
                    total: parseInt(e.target.value),
                  });
                } else {
                  setCreateRefunReq({
                    ...createRefunReq,
                    total: 0,
                  });
                }
              }}
            />
          </div>
          <div className="edit-label  mt-5">
            <div className={'edit-label-text'}> 退费类型:</div>
            <Input
              value={createRefunReq.type}
              onChange={(e) => {
                setCreateRefunReq({
                  ...createRefunReq,
                  type: e.target.value,
                });
              }}
            />
          </div>
          <div className="edit-label  mt-5">
            <div className={'edit-label-text'}> 备注:</div>
            <Input
              value={createRefunReq.description}
              onChange={(e) => {
                setCreateRefunReq({
                  ...createRefunReq,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={drawerOpenForCreatePayment}
        width={700}
        onOk={() => {
          createPayment();
        }}
        onCancel={() => {
          setDrawerOpenForCreatePayment(false);
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/*studentId: number;*/}
          {/*year: number;*/}
          {/*month: Month;*/}
          {/*total: number;*/}
          {/*paidDateTime: string;*/}
          {/*paymentMethod: Payment.PaymentMethod;*/}
          {/*paymentType: string;*/}
          {/*description: string;*/}
          <div className="edit-label mt-5">
            <div className={'edit-label-text'}>年份:</div>
            <Input disabled value={searchPayTime.year} />
          </div>
          <div className="edit-label mt-5">
            <div className={'edit-label-text'}>月份:</div>
            <Input disabled value={toCn(searchPayTime.month)} />
          </div>
          <div className="edit-label mt-5">
            <div className={'edit-label-text'}>设定金额:</div>
            <Input
              value={createPaymentReq.total}
              onChange={(e) => {
                if (e.target.value !== '') {
                  setCreatePaymentReq({
                    ...createPaymentReq,
                    total: parseInt(e.target.value),
                  });
                } else {
                  setCreatePaymentReq({
                    ...createPaymentReq,
                    total: 0,
                  });
                }
              }}
            />
          </div>
          <div className="edit-label  mt-5">
            <div className={'edit-label-text'}> 缴费类型:</div>
            <Input
              value={createPaymentReq.type}
              onChange={(e) => {
                setCreatePaymentReq({
                  ...createPaymentReq,
                  type: e.target.value,
                });
              }}
            />
          </div>
          <div className="edit-label  mt-5">
            <div className={'edit-label-text'}> 备注:</div>
            <Input
              value={createPaymentReq.description}
              onChange={(e) => {
                setCreatePaymentReq({
                  ...createPaymentReq,
                  description: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        open={modalOpenForPay}
        onOk={() => {
          // checkPayed();
        }}
        onCancel={() => {
          setModalOpenForPay(false);
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Divider>核对缴费方式</Divider>
          <Radio.Group
            optionType={'button'}
            value={checkPayWay}
            options={[
              { label: '微信支付', value: 'WECHAT' },
              { label: '支付宝支付', value: 'ALIPAY' },
            ]}
            onChange={(e) => {
              setCheckPayWay(e.target.value);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SummaryPage;
