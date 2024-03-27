import React, {useEffect, useState} from "react";
import accountApi from "@/apis/account";
import {Divider, Input, Button, Select} from "antd";
import {useModel} from "@@/plugin-model";
import {openNotification} from "@/utils/common";
import {defaultAccountInfo, defaultStudentInfo, defaultStudentProfileSchema} from "@/@types/accountDefaults";
const {TextArea}=Input
const StudentSelf: React.FC = () => {
    const [stuSchema, setStuSchema] = useState<Account.StudentProfileSchema>(defaultStudentProfileSchema)
    const [myStudentInfo, setMyStudentInfo] = useState<Account.StudentInfo>(defaultStudentInfo)
    const [myAccountInfo, setMyAccountInfo] = useState<Account.AccountInfo>(defaultAccountInfo)
    const [changePassword, setChangePassword] = useState('')
    const [editStuInfo, setEditStuInfo] = useState<Account.StudentInfo>(defaultStudentInfo)
    const [modeForStu, setModeForStu] = useState<"edit" | "read">('read')
    const [modeForAcc,setModeForAcc]=useState<"edit"|"read">("read")
    const [newPassword,setNewPassword]=useState('')
    const {account} = useModel("accountModel")
    const accId = account?.id ?? 0;
    const stuId = account.boundEntity?.id ?? 0;
    const getStuSchema = () => {
        accountApi.getStudentProfileSchema().then((r) => {
            if (r) {
                setStuSchema(r)
            }
        })
    }
    const getMyAccountInfo = () => {
        accountApi.getAccount(accId).then((r)=>{
            setMyAccountInfo(r)
        })
    }
    const getMyStuInfo = () => {
        accountApi.getStudent(stuId).then((r) => {
            setMyStudentInfo(r)
            setEditStuInfo(r)
        })
    }
    const subNewPassword = () => {
        accountApi.updateAccountPassword(accId, {newPassword}).then((res) => {
            if (res == "") {
                openNotification('修改密码', '密码修改成功', 'success')
                setNewPassword('')
                setModeForAcc('read')
            }
        })
    }
    const editSub = () => {
        console.log(editStuInfo);
        accountApi.updateStudent(stuId, editStuInfo).then((res) => {
            console.log(res);
            if (res) {
                setMyStudentInfo(res);
                setEditStuInfo(res);
                setModeForStu('read');
            }
        });
    };
    useEffect(() => {
        getStuSchema()
        getMyStuInfo()
        getMyAccountInfo()
    }, [])
    return (
        <div
            style={{
                padding: '10px 30px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Divider>个人信息</Divider>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                <div style={{marginRight: 4}}>姓名:</div>
                <div style={{display: "flex", alignItems: "center", marginRight: 10}}>
                    <Input
                        value={modeForStu == 'read' ? myStudentInfo.name : editStuInfo.name}
                        onChange={(e) => {
                            setEditStuInfo({...editStuInfo, name: e.target.value});
                        }}
                        disabled={modeForStu == 'read'}
                    />
                </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                <div style={{marginRight: 4}}>障碍类型:</div>
                <div style={{display: "flex", alignItems: "center", marginRight: 10}}>
                    <Input

                        value={
                            modeForStu == 'read' ? myStudentInfo.disorderType : editStuInfo.disorderType
                        }
                        disabled={true}
                    />
                </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                <div style={{marginRight: 4}}>性别:</div>
                <div style={{display: "flex", alignItems: "center", marginRight: 10}}>
                    <Select
                        value={modeForStu == 'read' ? myStudentInfo.sex : editStuInfo.sex}
                        options={[
                            {value: 'MALE', label: '男'},
                            {value: 'FEMALE', label: '女'},
                        ]}
                        onChange={(e) => {
                            setEditStuInfo({...editStuInfo, sex: e});
                        }}
                        disabled={modeForStu == 'read'}
                    />
                </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                <div style={{marginRight: 4}}>出生日期:</div>
                <div style={{display: "flex", alignItems: "center", marginRight: 10}}>
                    <Input
                        value={modeForStu == 'read' ? myStudentInfo.birth : editStuInfo.birth}
                        onChange={(e) => {
                            setEditStuInfo({...editStuInfo, birth: e.target.value});
                        }}
                        disabled={modeForStu == 'read'}
                    />
                </div>
                <div style={{color: 'gray', fontSize: 19}}>
                    注:格式为形如 1999-01-01
                </div>
            </div>


            <div>
                <Button
                    type={'primary'}
                    style={{marginRight: 8}}
                    onClick={() => {
                        if (modeForStu == 'edit') {
                            setModeForStu('read');
                            setMyStudentInfo(myStudentInfo);
                        } else {
                            setModeForStu('edit');
                        }
                    }}
                >
                    {modeForStu == 'read' ? '修改' : '取消'}
                </Button>
                <Button
                    type={'primary'}
                    disabled={modeForStu == 'read'}
                    onClick={() => {
                        editSub();
                    }}
                >
                    提交
                </Button>
            </div>
            <Divider>账号信息</Divider>
            <div style={{display: 'flex', alignItems: 'center', marginTop: 8}}>
                <div style={{marginRight: 4}}>登录用户名:</div>
                <div>
                    <Input
                        value={myAccountInfo.username}
                        // onChange={(e) => {
                        //   setEditAccountInfo({ ...editAccountInfo, username: e.target.value });
                        // }}
                        disabled
                    />
                </div>
            </div>

            <Button
                size="large"
                style={{marginTop: 10}}
                onClick={() => {
                    setModeForAcc("edit")
                    if (modeForAcc == 'read') {
                        setModeForAcc('edit')
                    } else {
                        setModeForAcc('read')
                        setNewPassword("")
                    }
                }}>{modeForAcc == "read" ? '修改密码' : '取消'}</Button>
            <div style={{display: modeForAcc == "read" ? 'none' : 'flex', alignItems: 'center', marginTop: 8,}}>
                <div style={{marginRight: 4}}>新密码:</div>
                <div style={{display: "flex", alignItems: "center", marginRight: 10}}>
                    <Input
                        style={{height: '100%'}}
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                        }}
                    />
                </div>
                <Button type={"primary"}
                        onClick={() => {
                            subNewPassword()
                        }}
                >
                    提交
                </Button>
            </div>
        </div>
    )
}

export default StudentSelf
