import fileApi from '@/apis/file';
import {openNotification} from '@/utils/common';
import {
    Button, Divider,
    Input,
    Popconfirm,
    Popover,
    Table,
    TableColumnsType,
    Upload,
} from 'antd';
import dayjs from 'dayjs';
import type {UploadRequestOption} from 'rc-upload/lib/interface';
import {useEffect, useState} from 'react';
import {defaultTeacherProfileSchemaEntry} from "@/@types/accountDefaults";

const FileManagePage: React.FC = () => {
    const [fileInfos, setFileInfos] = useState<File.FileInfo[]>([]);
    const [upLoadFilePath, setupLoadFilePath] = useState('');
    const [loading, setLoading] = useState(false);

    const renderAllFiles = async () => {
        setLoading(true);

        const response = await fileApi.listFiles('/');

        if (response) {
            setFileInfos(response);
            setLoading(false);
        }

        if (response.length === 0) {
            setFileInfos([]);
            setLoading(false);
            openNotification('文件列表', '文件列表为空', 'info');
        }
    };

    const downLoadFile = async (record: File.FileInfo) => {
        openNotification('下载文件', '下载请求中', 'info', 'topRight');

        const response = await fileApi.downloadFile(
            `${record.path}/${record.name}`,
        );

        if (response) {
            const blob = new Blob([response]);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', record.name);
            document.body.append(link);
            link.click();
            document.body.removeChild(link);
            openNotification(
                '下载文件',
                '下载成功,' + record.name,
                'success',
                'topRight',
            );
        }
    };

    const deleteFile = async (record: File.FileInfo) => {
        await fileApi.deleteFile(`${record.path}/${record.name}`);
        renderAllFiles();
    };

    const uploadFile = async (options: UploadRequestOption) => {
        if (upLoadFilePath !== '') {
            await fileApi.uploadFile(upLoadFilePath, options.file as File);
          openNotification('文件上传', '文件上传成功', 'success', 'topRight');
            renderAllFiles();
        } else {
            openNotification('文件上传', '文件分类不可为空', 'warning', 'topRight');
        }
    };

  const uploadFileTemplate = async (options: UploadRequestOption) => {
    if (upLoadFilePath !== '') {
      await fileApi.uploadFile(upLoadFilePath, options.file as File,{category:'TEMPLATE'});
      openNotification('文件上传', '文件上传成功', 'success', 'topRight');
      renderAllFiles();
    } else {
      openNotification('文件上传', '文件分类不可为空', 'warning', 'topRight');
    }
  };
    const getAllPaths = async () => {
        const response =await fileApi.getAllArchiveSchemas()
        console.log(response)
    }

    const FileTableColumns: TableColumnsType<File.FileInfo> = [
        {
            title: '文件名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            ellipsis: {
                showTitle: false,
            },
            render: (value) => {
                return (
                    <Popover
                        content={value}
                        title="文件名称"
                        mouseLeaveDelay={0.2}
                        overlayStyle={{maxWidth: '30%', wordBreak: 'break-all'}}
                        placement="topLeft"
                    >
                        {value}
                    </Popover>
                );
            },
        },
        {
            title: '分类',
            dataIndex: 'path',
            key: 'path',
            align: 'center',
        },
      {
        title: '是否是模版文件',
        dataIndex: 'template',
        key: 'path',
        align: 'center',
        render:(_,record)=>{
          return(
              <div>
                {record.category=="TEMPLATE"?'是':'否'}
              </div>
          )
        }
      },
        {
            title: '上传时间',
            dataIndex: 'uploadDateTime',
            key: 'uploadDateTime',
            align: 'center',
            render: (value) => (
                <div className="flex flex-row justify-center">
                    <div>{dayjs(value).format('YYYY-MM-DD')} </div>
                    <div style={{color: 'gray'}}>{dayjs(value).format('HH:mm')} </div>
                </div>
            ),
        },
        {
            title: '上传者',
            dataIndex: ['uploader', 'username'],
            key: 'uploader',
            align: 'center',
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            render: (_, record) => (
                <>
                    <Button
                        type="primary"
                        style={{marginRight: 20}}
                        onClick={() => {
                            downLoadFile(record);
                        }}
                    >
                        下载
                    </Button>

                    <Popconfirm
                        title="确定删除?"
                        onConfirm={() => {
                            deleteFile(record);
                        }}
                        okText="确定"
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

    useEffect(() => {
        renderAllFiles();
        getAllPaths()
    }, []);

    return (
        <div style={{height: '1200px', padding: '30px'}}>
            <div style={{width: '60%'}}>
                <div>
                    设置分类：
                    <Input
                        value={upLoadFilePath}
                        onChange={(e) => {
                            setupLoadFilePath(e.target.value);
                        }}
                    />
                </div>
              <div className={'flex flex-row'}>
                <div style={{marginTop: '10px'}}>
                  <Upload showUploadList={false} customRequest={uploadFile}>
                    <Button type="primary" size="large">
                      上传普通文件
                    </Button>
                  </Upload>
                </div>
                <div style={{marginTop: '10px',marginLeft:'10px'}}>
                  <Upload showUploadList={false} customRequest={uploadFileTemplate}>
                    <Button type="primary" size="large">
                      上传模版文件
                    </Button>
                  </Upload>
                </div>
              </div>

            </div>

            <Table
                columns={FileTableColumns}
                loading={loading}
                dataSource={fileInfos.map((value) => ({...value, key: value.id}))}
            />
            <Divider>分类条目管理</Divider>
            <div></div>

        </div>
    );
};

export default FileManagePage;
