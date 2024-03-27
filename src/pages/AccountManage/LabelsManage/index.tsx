import React, { useEffect, useState } from 'react';
import labelApi, {
  defaultLabelCreationRequest,
  LabelCreationRequest,
} from '@/apis/label';
import {
  Button,
  Drawer,
  Input,
  Popconfirm,
  Table,
  TableColumnsType,
} from 'antd';
import { defaultLabelInfo } from '@/@types/labelDefaults';
import { defaultFilter, Filter, openNotification } from '@/utils/common';

const LabelsManage: React.FC = () => {
  const [allLabels, setAllLabels] = useState<Label.LabelInfo[]>([]);
  const [tableLoadingForLabels, setTableLoadingForLabels] = useState(false);
  const [drawerOpenForLabelCreating, setDrawerOpenForLabelCreating] =
    useState(false);
  const [addLabelInfo, setAddLabelInfo] = useState<LabelCreationRequest>(
    defaultLabelCreationRequest,
  );
  const [currentLabel, setCurrentLabel] =
    useState<Label.LabelInfo>(defaultLabelInfo);
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const getAllLabels = () => {
    setTableLoadingForLabels(true);
    labelApi.getAllLabels().then((response) => {
      if (response) {
        console.log(response);
        setAllLabels(response);
        setTableLoadingForLabels(false);
      }
    });
  };
  const openModalForCreateLabel = () => {
    setDrawerOpenForLabelCreating(true);
  };
  const checkLabelValidation = (): boolean => {
    if (addLabelInfo.name === '') {
      openNotification('新建表单', '标签名称未填', 'error', 'topLeft');
    }
    if (addLabelInfo.category === '') {
      openNotification('新建表单', '标签分类未填', 'error', 'topLeft');
    }
    return addLabelInfo.name !== '' && addLabelInfo.category !== '';
  };
  const addOneLabel = () => {
    if (checkLabelValidation()) {
      labelApi.createLabel(addLabelInfo).then(() => {
        setDrawerOpenForLabelCreating(false);
        setAddLabelInfo(defaultLabelInfo);
        openNotification('新建标签', '新建一个标签成功', 'success');
        getAllLabels();
      });
    }
  };
  const delOneLabel = (label: Label.LabelInfo) => {
    labelApi.deleteLabel(label.id).then(() => {
      getAllLabels();
    });
  };

  useEffect(() => {
    getAllLabels();
  }, []);

  const tableColumnForLabels: TableColumnsType<Label.LabelInfo> = [
    {
      title: '所属类别',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'category',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'category',
      align: 'center',
    },
    {
      title: '操作',
      key: 'ope',
      align: 'center',
      render: (_, label) => {
        return (
          <div>
            <Button type={'primary'} style={{ marginRight: 15 }}>
              修改
            </Button>
            <Popconfirm title="删除标签" onConfirm={() => delOneLabel(label)}>
              <Button danger>删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-8">
      <div
        className="w-full flex flex-row items-center justify-around"
        style={{ width: '100%', backgroundColor: 'white', padding: '1rem 0' }}
      >
        <div className={'flex flex-row items-center'}>
          <div className="search-com mr-5">
            <div className={'search-com-text'}>按类别搜索:</div>
            <div>
              <Input
                value={filter.category}
                onChange={(e) =>
                  setFilter({ ...filter, category: e.target.value })
                }
              />
            </div>
          </div>
          <div className="search-com">
            <div className={'search-com-text'}>按名称搜索:</div>
            <div>
              <Input
                value={filter.name}
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
              />
            </div>
          </div>
        </div>
        <Button
          size="large"
          type={'primary'}
          onClick={() => {
            openModalForCreateLabel();
          }}
        >
          添加标签
        </Button>
      </div>
      <Table
        dataSource={allLabels
          .filter((label) => label.name.includes(filter.name))
          .filter((label) => label.category.includes(filter.category))
          .map((label) => ({
            ...label,
            key: label.id,
          }))}
        columns={tableColumnForLabels}
        loading={tableLoadingForLabels}
      />
      <Drawer
        contentWrapperStyle={{ width: 500 }}
        open={drawerOpenForLabelCreating}
        onClose={() => {
          setDrawerOpenForLabelCreating(false);
          setAddLabelInfo(defaultLabelCreationRequest);
        }}
        title={'新建标签'}
      >
        <div className={'mr-5'}>
          <div className={'add-label'}>
            <div className={'add-label-text'}>标签分类:</div>
            <Input
              value={addLabelInfo.name}
              onChange={(e) => {
                setAddLabelInfo({ ...addLabelInfo, name: e.target.value });
              }}
            />
          </div>
          <div className={'add-label'}>
            <div className={'add-label-text'}>标签名称:</div>
            <Input
              value={addLabelInfo.category}
              onChange={(e) => {
                setAddLabelInfo({ ...addLabelInfo, category: e.target.value });
              }}
            />
          </div>
          <div className={'add-label'}>
            <div className={'add-label-text'}>标签描述(非必填):</div>
            <Input
              value={addLabelInfo.description}
              onChange={(e) => {
                setAddLabelInfo({
                  ...addLabelInfo,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <div
            className={'w-full flex flex-row items-center justify-around mt-7'}
          >
            <Button
              type={'primary'}
              style={{ width: '45%' }}
              onClick={() => {
                addOneLabel();
              }}
            >
              创建
            </Button>
            <Button
              style={{ width: '45%' }}
              onClick={() => {
                setDrawerOpenForLabelCreating(false);
                setAddLabelInfo(defaultLabelCreationRequest);
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default LabelsManage;
