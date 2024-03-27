import React, {useEffect, useState} from 'react';
import {Button, Divider, Drawer, Input, Select} from 'antd';
import {
  defaultStudentProfileSchema,
  defaultStudentProfileSchemaEntry,
  defaultTeacherProfileSchema,
  defaultTeacherProfileSchemaEntry,
} from '@/@types/accountDefaults';
import account from '@/apis/account';
import {RenderItemByType} from '@/utils/simpleComponents';
import {openNotification, SchemaTypeOptions} from '@/utils/common';

const FormFormat: React.FC = () => {
  const [stuSchema, setStuSchema] = useState<Account.StudentProfileSchema>(
      defaultStudentProfileSchema,
  );
  const [teaSchema, setTeaSchema] = useState<Account.TeacherProfileSchema>(
      defaultTeacherProfileSchema,
  );
  const [drawerOpenForStuEditSch, setDrawerOpenForStuEditSch] = useState(false);
  const [drawerOpenForTeaEditSch, setDrawerOpenForTeaEditSch] = useState(false);
  const [drawerOpenForTeaCreationSch, setDrawerOpenForTeaCreationSch] =
      useState(false);
  const [drawerOpenForStuCreationSch, setDrawerOpenForStuCreationSch] =
      useState(false);
  const [stuCreationSch, setStuCreationSch] =
      useState<Account.StudentProfileSchemaEntry>(
          defaultStudentProfileSchemaEntry,
      );
  const [teaCreationSch, setTeaCreationSch] =
      useState<Account.TeacherProfileSchemaEntry>(
          defaultTeacherProfileSchemaEntry,
      );
  const [currentStuSchemaEntry, setCurrentStuSchemaEntry] =
      useState<Account.StudentProfileSchemaEntry>(
          defaultStudentProfileSchemaEntry,
      );
  const [currentTeaSchemaEntry, setCurrentTeaSchemaEntry] =
      useState<Account.TeacherProfileSchemaEntry>(
          defaultTeacherProfileSchemaEntry,
      );
  const getSchema = () => {
    account.getStudentProfileSchema().then((r) => {
      if (r) {
        setStuSchema(r);
      }
    });
    account.getTeacherProfileSchema().then((r) => {
      if (r) {
        setTeaSchema(r);
      }
    });
  };

  const changeOneStuSchemaOpen = (
      oneSchemaEntry: Account.StudentProfileSchemaEntry,
  ) => {
    setCurrentStuSchemaEntry(oneSchemaEntry);
    setDrawerOpenForStuEditSch(true);
  };
  const addOneStuSchema = () => {
    const currentStuSchemas: Account.StudentProfileSchema = [
      ...stuSchema,
      {...stuCreationSch, id: -1},
    ];
    account.changeStudentProfileSchema(currentStuSchemas).then((response) => {
      openNotification('新建学生档案模版字段', '新建字段成功', 'success');
      getSchema();
      setStuCreationSch(defaultStudentProfileSchemaEntry);
      setDrawerOpenForStuCreationSch(false);
    });
  };
  const addOneTeaSchema = () => {
    const currentStuSchemas: Account.StudentProfileSchema = [
      ...teaSchema,
      {...teaCreationSch, id: -1},
    ];
    account.changeTeacherProfileSchema(currentStuSchemas).then((response) => {
      openNotification('新建教师档案模版字段', '新建字段成功', 'success');
      getSchema();
      setTeaCreationSch(defaultTeacherProfileSchemaEntry);
      setDrawerOpenForTeaCreationSch(false);
    });
  };
  const changeOneStuSchema = () => {
    console.log(currentStuSchemaEntry);
    const currentStuSchemas = stuSchema.map((entry) => {
      if (entry.id === currentStuSchemaEntry.id) {
        return currentStuSchemaEntry;
      } else {
        return entry;
      }
    });
    console.log(currentStuSchemas);
    account.changeStudentProfileSchema(currentStuSchemas).then(() => {
      openNotification('修改学生档案字段', '修改学生档案字段成功', 'success');
      setDrawerOpenForStuEditSch(false);
      getSchema();
    });
  };
  const delOneStuSchema = (value: Account.StudentProfileSchemaEntry) => {
    const currentStuSchemas = stuSchema.filter((entry) => {
      return entry.id !== value.id;
    });
    console.log(currentStuSchemas);
    account.changeStudentProfileSchema(currentStuSchemas).then(() => {
      openNotification('删除学生档案字段', '删除学生档案字段成功', 'success');
      // setDrawerOpenForStuEditSch(false)
      getSchema();
    });
  };
  const changeOneTeaSchema = () => {
    console.log(currentTeaSchemaEntry);
    const currentTeaSchemas = teaSchema.map((entry) => {
      if (entry.id === currentTeaSchemaEntry.id) {
        return currentTeaSchemaEntry;
      } else {
        return entry;
      }
    });
    account.changeTeacherProfileSchema(currentTeaSchemas).then(() => {
      openNotification('修改教师档案字段', '修改教师档案字段成功', 'success');
      setDrawerOpenForTeaEditSch(false);
      getSchema();
    });
  };

  const delOneTeaSchema = (value: Account.TeacherProfileSchemaEntry) => {
    const currentTeaSchemas = teaSchema.filter((entry) => {
      return entry.id !== value.id;
    });
    account.changeTeacherProfileSchema(currentTeaSchemas).then(() => {
      openNotification('删除教师档案字段', '删除教师档案字段成功', 'success');
      // setDrawerOpenForStuEditSch(false)
      getSchema();
    });
  };
  const changeOneTeaSchemaOpen = (
      oneSchemaEntry: Account.TeacherProfileSchemaEntry,
  ) => {
    setCurrentTeaSchemaEntry(oneSchemaEntry);
    setDrawerOpenForTeaEditSch(true);
  };
  useEffect(() => {
    getSchema();
  }, []);
  return (
      <div
          className="w-full flex-col items-center"
          style={{justifyContent: 'space-between', height: '100%'}}
      >
        <div
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '10px',
              margin: '30px',
            }}
        >
          <Divider className="text-2xl">当前学生信息模版</Divider>
          <div className="w-full flex flex-col items-center">
            {stuSchema.map((value, index, array) => {
              return (
                  <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '70%',
                      }}
                      className="mt-2"
                  >
                    <div style={{minWidth: 200}}>{value.name}:</div>
                    <RenderItemByType
                        entry={value}
                        myChange={() => {
                        }}
                        forModel={true}
                    />
                    <Button
                        onClick={() => {
                          changeOneStuSchemaOpen(value);
                        }}
                    >
                      编辑属性
                    </Button>
                    <Button
                        onClick={() => {
                          delOneStuSchema(value);
                        }}
                    >
                      删除
                    </Button>
                  </div>
              );
            })}
            <div
                className={'w-full flex flex-row justify-around mt-4 mb-4'}
                style={{width: '100%'}}
            >
              <Button
                  type={'primary'}
                  style={{width: '40%', marginTop: 15}}
                  size="large"
                  onClick={() => {
                    setDrawerOpenForStuCreationSch(true);
                    //   addOneStuSchema()
                  }}
              >
                新建
              </Button>
            </div>
          </div>
        </div>
        <Drawer
            open={drawerOpenForStuCreationSch}
            onClose={() => {
              setDrawerOpenForStuCreationSch(false);
            }}
            contentWrapperStyle={{
              width: 500,
            }}
            title={'新建表单项'}
        >
          <div className={'w-full flex flex-col'}>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段名称:</div>
              <Input
                  value={stuCreationSch.name}
                  onChange={(e) => {
                    setStuCreationSch({...stuCreationSch, name: e.target.value});
                  }}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段类型:</div>
              <Select
                  value={stuCreationSch.type}
                  onChange={(e) => {
                    setStuCreationSch({...stuCreationSch, type: e});
                  }}
                  options={SchemaTypeOptions}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>描述:</div>
              <Input
                  value={stuCreationSch.description}
                  onChange={(e) => {
                    setStuCreationSch({
                      ...stuCreationSch,
                      description: e.target.value,
                    });
                  }}
              />
            </div>
          </div>
          <div className={'w-full flex justify-around mt-10'}>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  addOneStuSchema();
                }}
                type={'primary'}
            >
              确认
            </Button>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  setDrawerOpenForStuCreationSch(false);
                  setStuCreationSch(defaultStudentProfileSchemaEntry);
                }}
            >
              取消
            </Button>
          </div>
        </Drawer>
        <Drawer
            open={drawerOpenForStuEditSch}
            onClose={() => {
              setDrawerOpenForStuEditSch(false);
            }}
            contentWrapperStyle={{
              width: 500,
            }}
            title={'编辑表单项属性'}
        >
          <div className={'w-full flex flex-col'}>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段名称:</div>
              <Input
                  value={currentStuSchemaEntry.name}
                  onChange={(e) => {
                    setCurrentStuSchemaEntry({
                      ...currentStuSchemaEntry,
                      name: e.target.value,
                    });
                  }}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段类型:</div>
              <Select
                  value={currentStuSchemaEntry.type}
                  onChange={(e) => {
                    setCurrentStuSchemaEntry({...currentStuSchemaEntry, type: e});
                  }}
                  options={SchemaTypeOptions}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>描述:</div>
              <Input
                  value={currentStuSchemaEntry.description}
                  onChange={(e) => {
                    setCurrentStuSchemaEntry({
                      ...currentStuSchemaEntry,
                      description: e.target.value,
                    });
                  }}
              />
            </div>
          </div>
          <div className={'w-full flex justify-around mt-10'}>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  changeOneStuSchema();
                }}
                type={'primary'}
            >
              确认
            </Button>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  setDrawerOpenForStuEditSch(false);
                }}
            >
              取消
            </Button>
          </div>
        </Drawer>

        <div
            style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '10px',
              margin: '30px',
            }}
        >
          <Divider className="text-2xl">当前教师信息模版</Divider>
          <div className="w-full flex flex-col items-center">
            {teaSchema.map((value, index, array) => {
              return (
                  <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '70%',
                      }}
                      className="mt-2"
                      key={value.id}
                  >
                    <div style={{minWidth: 200}}>{value.name}:</div>
                    <RenderItemByType
                        entry={value}
                        myChange={() => {
                        }}
                        forModel={true}
                    />
                    <Button
                        onClick={() => {
                          changeOneTeaSchemaOpen(value);
                        }}
                    >
                      编辑属性
                    </Button>
                    <Button
                        onClick={() => {
                          delOneTeaSchema(value);
                        }}
                        danger
                    >
                      删除
                    </Button>
                  </div>
              );
            })}
            <div
                className={'w-full flex flex-row justify-around mt-4 mb-4'}
                style={{width: '100%'}}
            >
              <Button
                  type={'primary'}
                  style={{width: '40%', marginTop: 15}}
                  size="large"
                  onClick={() => {
                    //addOneTeaSchema()
                    setDrawerOpenForTeaCreationSch(true);
                  }}
              >
                新建
              </Button>
            </div>
          </div>
        </div>
        <Drawer
            open={drawerOpenForTeaEditSch}
            onClose={() => {
              setDrawerOpenForTeaEditSch(false);
            }}
            contentWrapperStyle={{
              width: 500,
            }}
        >
          <div className={'w-full flex flex-col'}>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段名称:</div>
              <Input
                  value={currentTeaSchemaEntry.name}
                  onChange={(e) => {
                    setCurrentTeaSchemaEntry({
                      ...currentTeaSchemaEntry,
                      name: e.target.value,
                    });
                  }}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段类型:</div>
              <Select
                  value={currentTeaSchemaEntry.type}
                  onChange={(e) => {
                    setCurrentTeaSchemaEntry({...currentTeaSchemaEntry, type: e});
                  }}
                  options={SchemaTypeOptions}
              />
            </div>
          </div>
          <div className={'w-full flex justify-around mt-10'}>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  changeOneTeaSchema();
                }}
                type={'primary'}
            >
              确认
            </Button>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  setDrawerOpenForTeaEditSch(false);
                }}
            >
              取消
            </Button>
          </div>
        </Drawer>
        <Drawer
            open={drawerOpenForTeaCreationSch}
            onClose={() => {
              setDrawerOpenForTeaCreationSch(false);
            }}
            contentWrapperStyle={{
              width: 500,
            }}
            title={'新建表单项'}
        >
          <div className={'w-full flex flex-col'}>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段名称:</div>
              <Input
                  value={teaCreationSch.name}
                  onChange={(e) => {
                    setTeaCreationSch({...teaCreationSch, name: e.target.value});
                  }}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>字段类型:</div>
              <Select
                  value={teaCreationSch.type}
                  onChange={(e) => {
                    setTeaCreationSch({...teaCreationSch, type: e});
                  }}
                  options={SchemaTypeOptions}
              />
            </div>
            <div className={'edit-label'}>
              <div className={'edit-label-text'}>描述:</div>
              <Input
                  value={teaCreationSch.description}
                  onChange={(e) => {
                    setTeaCreationSch({
                      ...teaCreationSch,
                      description: e.target.value,
                    });
                  }}
              />
            </div>
          </div>
          <div className={'w-full flex justify-around mt-10'}>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  addOneTeaSchema()
                }}
                type={'primary'}
            >
              确认
            </Button>
            <Button
                style={{width: '40%'}}
                onClick={() => {
                  setDrawerOpenForTeaCreationSch(false);
                  setTeaCreationSch(defaultTeacherProfileSchemaEntry);
                }}
            >
              取消
            </Button>
          </div>
        </Drawer>
      </div>
  );
};
export default FormFormat;
