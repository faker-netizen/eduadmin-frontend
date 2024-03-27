import accountApi, {
  AccountCreationRequest,
  defaultAccountCreationRequest,
  defaultStudentCreationRequest,
  defaultTeacherCreationRequest,
  StudentCreationRequest,
  TeacherCreationRequest,
} from '../../../apis/account';
import {
  defaultFilter,
  Filter,
  getAvailRoutes,
  openNotification,
  roleSelection,
  SexSelectionOptions,
} from '@/utils/common';
import { Button, Divider, Input, Modal, Popconfirm, Select, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ExcelJS from 'exceljs';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import { toCn } from '@/utils/intl';

type AccountWithBoundInfo = Account.AccountInfo &
  (
    | Account.AccountBoundInfo
    | {
        boundTo: '尚未查询';
        boundId: undefined;
      }
  );

const RoleTag: React.FC<{
  name:
    | Account.AccountBoundInfo['boundTo']
    | { boundTo: 'FINICAL'; boundId: number };
}> = ({ name }) => {
  const dom = {
    text: '尚未查询',
    color: 'default',
  };
  switch (name) {
    case 'TEACHER':
      dom.text = '教师';
      dom.color = 'success';
      break;
    case 'STUDENT':
      dom.text = '学生';
      dom.color = 'processing';
      break;
    case 'FINICAL':
      dom.text = '财务';
      dom.color = 'default';
      break;
    case 'NONE':
      dom.text = '未绑定';
      dom.color = 'error';
      break;
  }
  return <Tag color={dom.color}>{dom.text}</Tag>;
};

const AccountListPage: React.FC = () => {
  /* 表格*/
  const [loading, setLoading] = useState(false);
  const [accountWithBoundInfos, setAccountWithBoundInfos] = useState<
    Account.AccountInfo[]
  >([]);
  const tableRef = useRef<ActionType>();
  /*  添加账号*/
  const [addRoleType, setRoleType] = useState<Account.Role>('teacher');
  const [addAccountData, setAddAccountData] = useState<AccountCreationRequest>(
    defaultAccountCreationRequest,
  );
  const [addModalVisible, setAddModalVisible] = useState(false);
  /*  选择*/
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [reload, setReload] = useState(false);
  const [reloadData, setReloadData] = useState<AccountWithBoundInfo[]>([]);
  /*  创建身份*/
  const [createOneStuData, setCreateOneStuData] =
    useState<StudentCreationRequest>(defaultStudentCreationRequest);
  const [createOneTeaData, setCreateOneTeaData] =
    useState<TeacherCreationRequest>(defaultTeacherCreationRequest);
  /*  修改账号*/
  const [editPassword, setEditPassword] = useState({ id: 0, newPassword: '' });
  const [passOpen, setPassOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>(defaultFilter);

  const releaseBind = async (accountInfo: Account.AccountInfo) => {
    if (accountInfo.boundTo === 'STUDENT' && accountInfo.boundId) {
      await accountApi.deleteStudent(accountInfo.boundId);
      openNotification('解除身份', '解除身份成功', 'success');
    }
    if (accountInfo.boundTo === 'TEACHER' && accountInfo.boundId) {
      await accountApi.deleteTeacher(accountInfo.boundId);
      openNotification('解除身份', '解除身份成功', 'success');
    }
  };

  const renderAllAccounts = async () => {
    setLoading(true);
    const allAccountInfos = await accountApi.getAllAccounts();
    setAccountWithBoundInfos(allAccountInfos);
    setLoading(false);
  };
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  }, [accountWithBoundInfos]);

  const writeFile = (fileName: string, content: ExcelJS.Buffer) => {
    const link = document.createElement('a');
    const blob = new Blob([content], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
  };
  /*  请求teahcer stu*/
  const downLoad = () => {
    let workbook = new ExcelJS.Workbook();
    let sum: any[] = [];
    accountApi.getAllAccounts().then((res) => {
      res.forEach((acc) => {
        sum.push([acc.username, toCn(acc.roles[0])]);
      });
      console.log(sum);
      let sheetName = '账户总表.xlsx';
      let sheet = workbook.addWorksheet(sheetName, {
        views: [{ showGridLines: false }],
      });
      type userTableCol = { name: string; key: string; width: number };
      let columnArr: userTableCol[] = [
        { name: '姓名', key: 'username', width: 100 },
        { name: '身份', key: 'roles', width: 100 },
      ];
      const headerName = '系统账号信息';
      sheet.addTable({
        name: headerName,
        ref: 'A1', // 主要数据从A5单元格开始
        headerRow: false,
        totalsRow: false,
        style: {
          theme: 'TableStyleMedium2',
          showRowStripes: false,
        },
        columns: columnArr,
        rows: sum,
      });
      workbook.xlsx.writeBuffer().then((buffer) => {
        writeFile(sheetName, buffer);
      });
    });
    // .getAllStudents()
    // .then((response) => {
    //   response.forEach((stu) => {
    //     sum.push([stu.name, '学生', stu.sex]);
    //   });
    // })
    // .then(() => {
    //   accountApi.getAllTeachers().then((response) => {
    //     response.forEach((tea) => {
    //       sum.push([tea.name, '学生', tea.sex]);
    //     });
    //   });
    // });
  };

  const column: ProColumns<Account.AccountInfo>[] = [
    {
      title: '工号/学号',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    // {
    //   title: '联系电话',
    //   dataIndex: 'phone',
    //   key: 'phone',
    // },
    {
      title: '绑定身份',
      key: 'boundTo',
      dataIndex: 'boundTo',
      render: (_, record) => <RoleTag name={record.boundTo} />,
      filters: [
        {
          text: '学生',
          value: 'STUDENT',
        },
        {
          text: '教师',
          value: 'TEACHER',
        },
        {
          text: '尚未绑定',
          value: 'NONE',
        },
        {
          text: '尚未查询',
          value: '尚未查询',
        },
      ],
      onFilter: (value, record) =>
        record.boundTo.indexOf(value as string) === 0,
    },
    // {
    //   title: '邮箱',
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    {
      title: '操作',
      key: 'option',
      search: false,
      render: (_, record) => (
        <>
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  style={{*/}
          {/*    marginRight: 10,*/}
          {/*    backgroundColor: '#49cc90',*/}
          {/*    border: 'none',*/}
          {/*  }}*/}
          {/*  disabled={record.boundTo === 'TEACHER' || record.boundTo !== 'NONE'}*/}
          {/*  onClick={() => {*/}
          {/*    setCreateOneTeaData({*/}
          {/*      ...createOneTeaData,*/}
          {/*      userId: record.id,*/}
          {/*    });*/}
          {/*    createOneTea(record.id);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  设定为教师*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  disabled={record.boundTo === 'STUDENT' || record.boundTo !== 'NONE'}*/}
          {/*  style={{ marginRight: 10, backgroundColor: '#1b90ff' }}*/}
          {/*  onClick={() => {*/}
          {/*    setCreateOneStuData({*/}
          {/*      ...createOneStuData,*/}
          {/*      userId: record.id,*/}
          {/*    });*/}
          {/*    createOneStu(record.id);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  设定为学生*/}
          {/*</Button>*/}

          <Button
            type={'primary'}
            style={{
              marginRight: 10,

              border: 'none',
            }}
            onClick={() => {
              setEditPassword({ ...editPassword, id: record.id });
              setPassOpen(true);
            }}
          >
            修改密码
          </Button>
          <Button
            style={{
              marginRight: 10,
              backgroundColor: '#ff4d4f',
              border: 'none',
            }}
            disabled={
              !(record.boundTo === 'STUDENT' || record.boundTo === 'TEACHER')
            }
            type="primary"
            onClick={() => {
              releaseBind(record);
            }}
          >
            解除绑定
          </Button>
          <Popconfirm
            title={'确定删除吗?'}
            onConfirm={() => {
              accountApi.deleteAccount(record.id).then(() => {
                renderAllAccounts();
              });
            }}
          >
            <Button danger>删除账号</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    renderAllAccounts();
  }, []);

  const clearForm = () => {
    setAddAccountData(defaultAccountCreationRequest);
    setCreateOneStuData(defaultStudentCreationRequest);
    setCreateOneTeaData(defaultTeacherCreationRequest);
  };

  useEffect(() => {
    setTimeout(() => {
      if (reload) {
        setAccountWithBoundInfos(reloadData);
        setLoading(false);
        setReload(false);
      }
    }, 1000);
  }, [reload]);

  const addAccountModalClose = () => {
    setAddModalVisible(false);
    clearForm();
  };

  /*新建账号*/
  const subNewAccount = () => {
    if (
      addAccountData.roles.length === 1 &&
      addAccountData.password !== '' &&
      addAccountData.username !== ''
    ) {
      const availableRoutes: string[] = getAvailRoutes(
        addAccountData.roles[0],
      ) as string[];
      console.log(availableRoutes);
      accountApi
        .createAccount({
          ...addAccountData,
          routes: availableRoutes,
        })
        .then((res) => {
          if (res) {
            if (addAccountData.roles[0] === 'student') {
              accountApi
                .createStudent({
                  ...createOneStuData,
                  userId: res.id,
                  name: addAccountData.username,
                })
                .then((res) => {
                  clearForm();
                  setAddModalVisible(false);
                  openNotification('提交成功', '新增一个账号');

                  renderAllAccounts();
                });
            }
            if (addAccountData.roles[0] === 'teacher') {
              accountApi
                .createTeacher({
                  ...createOneTeaData,
                  userId: res.id,
                  name: addAccountData.username,
                })
                .then(() => {
                  clearForm();
                  setAddModalVisible(false);
                  openNotification('提交成功', '新增一个账号');
                  renderAllAccounts();
                });
            }
            if (addAccountData.roles[0] === 'admin') {
              clearForm();
              setAddModalVisible(false);
              openNotification('提交成功', '新增一个账号');
              renderAllAccounts();
            }
          }
        });
    } else {
      openNotification('提交失败', '请将表单信息填写完整');
    }
  };

  const createOneStu = async (userId: number) => {
    await accountApi.createStudent({ ...createOneStuData, userId: userId });
  };
  const createOneTea = async (userId: number) => {
    await accountApi.createTeacher({ ...createOneTeaData, userId: userId });
  };

  return (
    <div style={{ padding: 40 }}>
      <div>
        <div className="flex flex-row justify-around"></div>
      </div>

      {/*      新增账号*/}
      <Modal
        title="新增账号"
        open={addModalVisible}
        onOk={subNewAccount}
        onCancel={addAccountModalClose}
        okText="添加"
        cancelText="关闭"
      >
        <div
          style={{
            width: '80%',
            marginLeft: '10%',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <div style={{ marginBottom: '10px' }}>
            <div> 姓名:</div>
            <Input
              required={true}
              value={addAccountData.username}
              onChange={(e) => {
                setAddAccountData({
                  ...addAccountData,
                  ...{
                    username: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div>密码:</div>
            <Input
              required={true}
              value={addAccountData.password}
              onChange={(e) => {
                setAddAccountData({
                  ...addAccountData,
                  ...{
                    password: e.target.value,
                  },
                });
              }}
            />
          </div>
          <div style={{ width: '100%', marginBottom: '10px' }}>
            <div> 身份:</div>
            <Select
              style={{ width: '100%' }}
              value={addAccountData.roles[0]}
              onChange={(value) => {
                setAddAccountData({
                  ...addAccountData,
                  ...{
                    roles: [value],
                  },
                });
              }}
              options={roleSelection}
            />
          </div>
          {/* 添加学生*/}
          {addAccountData.roles[0] === 'student' ? (
            <div className="flex flex-col w-full items-center">
              <Divider>学生基本信息</Divider>
              <div className={'w-full mb-4'}>
                <div> 学号:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.studentNumber}
                  onChange={(e) => {
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        studentNumber: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>障碍类型:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.disorderType}
                  onChange={(e) => {
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        disorderType: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>出生日期:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.birth}
                  onChange={(e) => {
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        birth: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>性别:</div>
                <Select
                  style={{ width: '100%' }}
                  value={createOneStuData.sex}
                  options={SexSelectionOptions}
                  onChange={(e) => {
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        sex: e,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>身份证号:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.idno}
                  onChange={(e) => {
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        idno: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>监护人姓名:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.parents[0].name}
                  onChange={(e) => {
                    let currentParens = createOneStuData.parents[0];
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        parents: [
                          {
                            ...createOneStuData.parents[0],
                            name: e.target.value,
                          },
                        ],
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>监护人身份证号:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.parents[0].idno}
                  onChange={(e) => {
                    let currentParens = createOneStuData.parents[0];
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        parents: [
                          {
                            ...createOneStuData.parents[0],
                            idno: e.target.value,
                          },
                        ],
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>监护人联系方式:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneStuData.parents[0].phone}
                  onChange={(e) => {
                    let currentParens = createOneStuData.parents[0];
                    setCreateOneStuData({
                      ...createOneStuData,
                      ...{
                        parents: [
                          {
                            ...createOneStuData.parents[0],
                            phone: e.target.value,
                          },
                        ],
                      },
                    });
                  }}
                />
              </div>
            </div>
          ) : addAccountData.roles[0] === 'teacher' ? (
            /*   添加教师*/
            <div className="flex flex-col w-full items-center">
              <Divider>教师基本信息</Divider>
              <div className={'w-full mb-4'}>
                <div> 教职工号:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneTeaData.staffNumber}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      staffNumber: e.target.value,
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>部门:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneTeaData.department}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      department: e.target.value,
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>出生日期:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneTeaData.birth}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      ...{
                        birth: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>性别:</div>
                <Select
                  style={{ width: '100%' }}
                  value={createOneTeaData.sex}
                  options={SexSelectionOptions}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      ...{
                        sex: e,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>身份证号:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneTeaData.idno}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      ...{
                        idno: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>联系方式 :</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneTeaData.phone}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      phone: e.target.value,
                    });
                  }}
                />
              </div>
              <div className={'w-full mb-4'}>
                <div>职位:</div>
                <Input
                  style={{ width: '100%' }}
                  value={createOneTeaData.position}
                  onChange={(e) => {
                    setCreateOneTeaData({
                      ...createOneTeaData,
                      position: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </Modal>

      <Modal
        title={'密码修改'}
        open={passOpen}
        onOk={() => {
          if (editPassword.newPassword !== '') {
            accountApi
              .updateAccountPassword(editPassword.id, {
                newPassword: editPassword.newPassword,
              })
              .then((res) => {
                if (res === '') {
                  openNotification('修改密码', '密码修改成功', 'success');
                  setPassOpen(false);
                }
              })
              .catch((err) => {
                openNotification('修改密码', '密码修改失败', 'error');
              });
          }
        }}
        onCancel={() => {
          setPassOpen(false);
        }}
        okText={'确定'}
        cancelText={'关闭'}
      >
        <div
          style={{
            width: '80%',
            marginLeft: '10%',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <Input
            placeholder={'请输入新密码'}
            onChange={(e) => {
              setEditPassword({ ...editPassword, newPassword: e.target.value });
            }}
            style={{ width: '300px', height: 60 }}
          />
        </div>
      </Modal>
      {/*表格*/}
      <div
        className="flex flex-row h-20 items-center mb-4 w-full justify-start"
        style={{ backgroundColor: 'white', padding: '0 10px' }}
      >
        <Button
          style={{ justifySelf: 'end' }}
          type="primary"
          size="large"
          onClick={() => {
            setAddModalVisible(true);
          }}
        >
          添加账号
        </Button>
        <Button
          style={{ justifySelf: 'end' }}
          type="primary"
          size="large"
          onClick={() => {
            downLoad();
          }}
        >
          导出数据
        </Button>
      </div>
      <ProTable
        columns={column}
        loading={loading}
        actionRef={tableRef}
        rowSelection={rowSelection}
        request={async (params) => {
          console.log(params);
          return {
            data: accountWithBoundInfos
              .filter((v) => {
                return v.username.includes(params.username ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })),
            success: true,
            total: accountWithBoundInfos
              .filter((v) => {
                return v.username.includes(params.username ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.id,
              })).length,
          };
        }}
      />
    </div>
  );
};

export default AccountListPage;
