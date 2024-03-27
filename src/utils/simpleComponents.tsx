import {Button, Input, Radio, Upload} from 'antd';
import React, {useState} from 'react';
import {UploadRequestOption} from 'rc-upload/lib/interface';
import {openNotification} from '@/utils/common';

interface childProps {
  entry: Account.StudentProfileSchemaEntry;
  disabled?: boolean;
  myChange: (...params: any[]) => any;
  forModel?: boolean;
  value?: any;
}

export const RenderItemByType: React.FC<childProps> = (props) => {
  const {entry, disabled, myChange, forModel, value} = props;

  const [myValue, setMyValue] = useState<any>();

  const uploadPicTemplate = async (options: UploadRequestOption) => {
    myChange(options.file)
    openNotification('文件上传', '文件上传成功', 'success', 'topRight');
  };
  const uploadFileTemplate = async (options: UploadRequestOption) => {
    myChange(options.file)
    openNotification('文件上传', '文件上传成功', 'success', 'topRight');
  };


  switch (entry.type) {
    case 'boolean':
      return (
          <div style={{width: 200}}>

            <Radio.Group
                value={value}
                defaultValue={1}
                onChange={(e) => {
                  if (!forModel) {
                    myChange(!!e.target.value);
                  }
                }}
                disabled={disabled}
            >
              <Radio.Button value={1}>是</Radio.Button>
              <Radio.Button value={0}>否</Radio.Button>
            </Radio.Group>
          </div>
      );
    case 'date':
      return (
          <div style={{width: 200}}>
            <Input
                value={value}
                onChange={(e) => {
                  myChange(e.target.value);
                }}
                disabled={disabled}
            />
          </div>
      );
    case 'datetime':
      return (
          <div style={{width: 200}}>
            <Input
                onChange={(e) => {
                  myChange(e.target.value);
                }}
                disabled={disabled}
            />
          </div>
      );
    case 'file':
      return (
          <div style={{width: 200, display: "flex", flexDirection: "row"}}>
            <Upload maxCount={1}
                    customRequest={uploadFileTemplate}>
              <Button disabled={disabled} type={'primary'}>
                {props.value ? '重新上传' : '上传文件'}
              </Button>

            </Upload>
            {props.value && <Button style={{marginLeft: 10}} onClick={() => {
              console.log(props.value)
              const blob = new Blob([props.value]);
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', props.value.name);
              document.body.append(link);
              link.click();
              document.body.removeChild(link);
              openNotification(
                  '下载文件',
                  '下载成功,',
                  'success',
                  'topRight',
              );
            }}>下载附件</Button>}
          </div>
      );
    case 'pic':
      return (
          <div style={{width: 200, display: "flex", flexDirection: "row"}}>
            <Upload
                accept={'.jpg,.jpeg,.png'}
                maxCount={1}
                customRequest={uploadPicTemplate}
            >
              <Button disabled={disabled} type={'primary'}>
                {props.value ? '重新上传' : '上传文件'}
              </Button>

            </Upload>
            {props.value && <Button style={{marginLeft: 10}} onClick={() => {
              console.log(props.value)
              const blob = new Blob([props.value]);
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', props.value.name);
              document.body.append(link);
              link.click();
              document.body.removeChild(link);
              openNotification(
                  '下载文件',
                  '下载成功,',
                  'success',
                  'topRight',
              );
            }}>下载附件</Button>}
          </div>
      );
    case 'number':
      return (
          <div style={{width: 200}}>
            <Input
                onChange={(e) => {
                  myChange(e.target.value);
                }}
                disabled={disabled}
                type="number"
            />
          </div>
      );

    case 'text':
      return (
          <div style={{width: 200}}>
            <Input
                onChange={(e) => {
                  myChange(e.target.value);
                }}
                value={value}
                disabled={disabled}
            />
          </div>
      );
    case 'time':
      return (
          <div style={{width: 200}}>
            <Input
                onChange={(e) => {
                  myChange(e.target.value);
                }}
                disabled={disabled}
            />
          </div>
      );
  }
  return (
      <div style={{width: 200}}>
        <Input
            onChange={(e) => {
              myChange(e.target.value);
            }}
            disabled={disabled}
        />
      </div>
  );
};
