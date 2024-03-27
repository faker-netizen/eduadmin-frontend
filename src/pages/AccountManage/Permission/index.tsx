import React, { useEffect, useRef, useState } from 'react';
import accountApi from '@/apis/account';
import { Button, Space, Table, TableColumnsType, TableProps } from 'antd';
import { toCn } from '@/utils/intl';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-table';
import {
  openNotification,
  permissionData,
  permissionObj,
  roleFilters,
} from '@/utils/common';

type myAcc = {
  username: string;
  roles: string[];
  userId: number;
  roleId: number;
  roleName: string;
};
const Permission = () => {
  const [allAccounts, setAllAccounts] = useState<myAcc[]>([]);
  const [loadingForAcc, setLoadingForAcc] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccouts] = useState<number[]>([]);
  const tableRef = useRef<ActionType>();
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  }, [allAccounts]);
  const getAllAcc = () => {
    setLoadingForAcc(true);
    accountApi.getAllAccounts().then((accs) => {
      accountApi.getAllTeachers().then((teachers) => {
        accountApi.getAllStudents().then((students) => {
          setAllAccounts(
            accs
              .filter((acc) => {
                if (
                  acc.roles[0] === 'admin' ||
                  acc.roles[0] === 'financial' ||
                  acc.roles[0] === 'super_admin'
                ) {
                  console.log(acc);
                }
                return (
                  acc.roles[0] === 'admin' ||
                  acc.roles[0] === 'financial' ||
                  acc.roles[0] === 'super_admin'
                );
              })
              .map((acc) => {
                console.log(acc);
                return {
                  username: acc.username,
                  roles: acc.roles,
                  userId: acc.id,
                  roleName: acc.username,
                  roleId: acc.id,
                };
              }),
          );

          setLoadingForAcc(false);
        });
      });
    });
  };
  const bindPermission = () => {
    console.log(selectedPermissions, selectedAccounts);
    if (selectedPermissions.length && selectedAccounts.length) {
      selectedAccounts.forEach((acc) => {
        accountApi.changeAccountRoutes(acc, selectedPermissions);
      });
      const info = '为' + selectedAccounts.length + '人分配权限成功';
      openNotification('权限分配', info, 'success');
    } else {
      openNotification('权限分配', '选择失败,请检查已选择项');
    }
  };
  const rowSelectionForPermission: TableProps<permissionObj>['rowSelection'] = {
    selectedRowKeys: selectedPermissions,
    onChange: (a, b) => {
      setSelectedPermissions(b.map((permission) => permission.value));
    },
  };
  const rowSelectionForAcc: TableProps<myAcc>['rowSelection'] = {
    selectedRowKeys: selectedAccounts,
    onChange: (a, b) => {
      setSelectedAccouts(b.map((acc) => acc.userId));
    },
  };
  // const rowSelectionForAcc
  const tableColumnForPermission: TableColumnsType<permissionObj> = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      key: 'permissionName',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '类别',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
  ];
  const tableColumnForAcc: ProColumns<myAcc>[] = [
    {
      title: '学号/工号',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '身份',
      dataIndex: 'roles',
      key: '',
      filters: roleFilters,
      onFilter: (value, record) => {
        return record.roles[0] === value;
      },
      align: 'center',
      render: (_, account) => {
        return <div>{toCn(account.roles[0] as Account.Role)}</div>;
      },
    },
    // {
    //   title: '操作',
    //   key: 'ope',
    //   align: "center"
    // },
  ];

  useEffect(() => {
    getAllAcc();
  }, []);
  return (
    <div style={{ padding: 40 }}>
      <div> 权限列表</div>
      <Table
        columns={tableColumnForPermission}
        dataSource={permissionData.map((v) => ({ ...v, key: v.value }))}
        rowSelection={rowSelectionForPermission}
      />
      <Button
        style={{
          width: '100%',
          height: 50,
          marginBottom: 30,
          fontSize: '1.8rem',
        }}
        type={'primary'}
        onClick={() => {
          bindPermission();
        }}
      >
        绑定权限
      </Button>

      <ProTable
        rowSelection={rowSelectionForAcc}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          );
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a
                onClick={() => {
                  setSelectedAccouts(
                    allAccounts.map((acc) => {
                      return acc.userId;
                    }),
                  );
                }}
              >
                选择所有账号
              </a>
              <a
                onClick={() => {
                  setSelectedAccouts(
                    allAccounts
                      .filter((acc) => acc.roles[0] === 'admin')
                      .map((acc) => {
                        return acc.userId;
                      }),
                  );
                }}
              >
                选择所有管理员
              </a>
              <a
                onClick={() => {
                  setSelectedAccouts(
                    allAccounts
                      .filter((acc) => acc.roles[0] === 'student')
                      .map((acc) => {
                        return acc.userId;
                      }),
                  );
                }}
              >
                选择所有学生
              </a>
              <a
                onClick={() => {
                  setSelectedAccouts(
                    allAccounts
                      .filter((acc) => acc.roles[0] === 'teacher')
                      .map((acc) => {
                        return acc.userId;
                      }),
                  );
                }}
              >
                选择所有教师
              </a>
            </Space>
          );
        }}
        loading={loadingForAcc}
        actionRef={tableRef}
        request={async (params) => {
          console.log(params);
          return {
            data: allAccounts
              .filter((v) => {
                return v.username.includes(params.username ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.userId,
              })),
            success: true,
            total: allAccounts
              .filter((v) => {
                return v.username.includes(params.username ?? '');
              })
              .map((value) => ({
                ...value,
                key: value.userId,
              })).length,
          };
        }}
        columns={tableColumnForAcc}
      />
    </div>
  );
};
export default Permission;
