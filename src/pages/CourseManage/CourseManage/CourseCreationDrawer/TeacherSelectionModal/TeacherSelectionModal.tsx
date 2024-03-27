import {
  Input,
  Modal,
  ModalProps,
  Table,
  TableColumnsType,
  TableProps,
} from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { useState } from 'react';
import { toCn } from '@/utils/intl';

export interface TeacherSelectionModalProps {
  open?: ModalProps['open'];
  onOk?: ModalProps['onOk'];
  onCancel?: ModalProps['onCancel'];
  onTableRowSelectionChange?: TableRowSelection<Account.TeacherInfo>['onChange'];
  teacherInfos: Account.TeacherInfo[];
  selectedTeacherIds: number[];
}

const TeacherSelectionModal: React.FC<TeacherSelectionModalProps> = ({
  open,
  onOk,
  onCancel,
  onTableRowSelectionChange,
  teacherInfos,
  selectedTeacherIds = [],
}) => {
  const [filterTeacherName, setFilterTeacherName] = useState('');

  const tableColumns: TableColumnsType<Account.TeacherInfo> = [
    {
      title: '教师姓名',
      dataIndex: 'name',
      key: 'name',
      filters: [{ text: filterTeacherName, value: filterTeacherName }],
      onFilter: (value, record) => record.name.search(value.toString()) !== -1,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
      render: (value) => <div>{value === 'MALE' ? '男' : '女'}</div>,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      align: 'center',
    },
  ];

  const tableRowSelection: TableProps<Account.TeacherInfo>['rowSelection'] = {
    selectedRowKeys: selectedTeacherIds,
    onChange: (selectedRowKeys, selectedRows, info) => {
      onTableRowSelectionChange?.(selectedRowKeys, selectedRows, info);
    },
  };

  return (
    <Modal
      title="可选教师选择"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="添加"
      cancelText="关闭"
    >
      <div>
        <div>按姓名搜索:</div>
        <Input
          style={{ minWidth: '160px' }}
          value={filterTeacherName}
          onChange={(e) => {
            setFilterTeacherName(e.target.value);
          }}
        />
      </div>
      <Table
        rowSelection={tableRowSelection}
        columns={tableColumns}
        dataSource={teacherInfos
          .filter(
            (v) =>
              v.name.includes(filterTeacherName) ||
              v.department.includes(filterTeacherName) ||
              toCn(v.sex).includes(filterTeacherName),
          )
          .map((teacherInfo) => ({
            ...teacherInfo,
            key: teacherInfo.id,
          }))}
      />
    </Modal>
  );
};

export default TeacherSelectionModal;
