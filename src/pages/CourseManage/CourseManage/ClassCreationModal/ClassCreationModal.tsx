import courseApi, {defaultClassCreationRequest} from '@/apis/course';
import {openNotification} from '@/utils/common';
import {Input, Modal, Select} from 'antd';
import {ModalProps} from 'antd/es';
import React, {useState} from 'react';

export interface ClassCreationModalProps {
  open?: ModalProps['open'];
  onSubmit?: ModalProps['onOk'];
  onCancel?: ModalProps['onCancel'];
  teacherInfos: Account.TeacherInfo[];
  studentInfos: Account.StudentInfo[];
}

const CourseCreationModal: React.FC<ClassCreationModalProps> = ({
                                                                  open,
                                                                  onSubmit,
                                                                  onCancel,
                                                                  teacherInfos,
                                                                  studentInfos,
                                                                }) => {
  const [request, setRequest] = useState(defaultClassCreationRequest);

  const objValidate = (obj: any) => {
    for (const key in obj) {
      if (!Array.isArray(obj[key]) && !obj[key]) {
        return false;
      }
    }
    return true;
  };

  const createNewClass = async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (request.name && request.adviserId) {
      const response = await courseApi.createClass(request);
      if (response) {
        onSubmit?.(e);
        openNotification('创建班级', '班级创建成功', "success");
      }
    } else {
      openNotification('提交失败', '提交数据不完整');
    }
  };

  return (
      <Modal
          title="新增班级"
          open={open}
          onOk={(e) => {
            createNewClass(e);
          }}
          onCancel={onCancel}
          okText="添加"
          cancelText="关闭"
      >
        <div
            className="flex flex-col justify-around"
            style={{
              width: '80%',
              marginLeft: '10%',
              minHeight: '150px',
            }}
        >
          <div style={{marginBottom: '10px'}}>
            <div>班级名称</div>
            <Input
                value={request.name}
                onChange={(e) => {
                  setRequest({...request, name: e.target.value});
                }}
            />
          </div>
          {/*<div style={{marginBottom: '10px'}}>*/}
          {/*  <div>标签</div>*/}
          {/*  <Select*/}
          {/*      style={{height: '30px', width: 300}}*/}
          {/*      value={request.labels}*/}
          {/*      onChange={(e) => {*/}
          {/*        setRequest({...request, labels: e});*/}
          {/*      }}*/}
          {/*  />*/}
          {/*</div>*/}
          <div style={{marginBottom: '10px'}}>
            <div>班主任</div>
            <Select
                style={{width: '100%'}}
                options={teacherInfos.map((teacherInfo) => ({
                  label: teacherInfo.name,
                  value: teacherInfo.id,
                }))}
                onChange={(e) => {
                  setRequest({...request, adviserId: Number(e)});
                }}
            />
          </div>
          <div style={{marginBottom: '10px'}}>
            <div>最大人数</div>
            <Input
                type="number"
                value={request.maxMember}
                onChange={(e) => {
                  setRequest({...request, maxMember: Number(e.target.value)});
                }}
            />
          </div>
          {/*<div style={{ marginBottom: '10px' }}>*/}
          {/*  <div>起始时间</div>*/}
          {/*  <Input*/}
          {/*    value={request.startDate}*/}
          {/*    onChange={(e) => {*/}
          {/*      setRequest({ ...request, startDate: e.target.value });*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}
          {/*<div style={{ marginBottom: '10px' }}>*/}
          {/*  <div>结束时间</div>*/}
          {/*  <Input*/}
          {/*    value={request.endDate}*/}
          {/*    onChange={(e) => {*/}
          {/*      setRequest({ ...request, endDate: e.target.value });*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</div>*/}

          {/*<div style={{marginBottom: '10px'}}>*/}
          {/*  <div>教师</div>*/}
          {/*  <Select*/}
          {/*      mode="multiple"*/}
          {/*      style={{width: '100%'}}*/}
          {/*      onChange={(v) => {*/}
          {/*        setRequest({...request, teacherIds: v});*/}
          {/*      }}*/}
          {/*  >*/}
          {/*    {teacherInfos.map((teacherInfo) => (*/}
          {/*        <Select.Option key={teacherInfo.id} value={teacherInfo.id}>*/}
          {/*          {teacherInfo.name}*/}
          {/*        </Select.Option>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*</div>*/}
          {/*<div style={{marginBottom: '10px'}}>*/}
          {/*  <div>学生</div>*/}
          {/*  <Select*/}
          {/*      mode="multiple"*/}
          {/*      allowClear*/}
          {/*      style={{width: '100%'}}*/}
          {/*      onChange={(v) => {*/}
          {/*        setRequest({...request, studentIds: v});*/}
          {/*      }}*/}
          {/*  >*/}
          {/*    {studentInfos.map((studentInfo) => (*/}
          {/*        <Select.Option key={studentInfo.id} value={studentInfo.id}>*/}
          {/*          {studentInfo.name}*/}
          {/*        </Select.Option>*/}
          {/*    ))}*/}
          {/*  </Select>*/}
          {/*</div>*/}
          <div>
            <div>相关描述</div>
            <Input
                value={request.description}
                onChange={(e) => {
                  setRequest({...request, description: e.target.value});
                }}
            />
          </div>
        </div>
      </Modal>
  );
};

export default CourseCreationModal;
