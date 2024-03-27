import accountApi from '@/apis/account';
import loginApi from '@/apis/login';
import { setJwtToken } from '@/utils/token';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import { getAvailRoutes, getNameFromPath } from '@/utils/common';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { account } = useModel('accountModel');

  const loginIssue = async () => {
    const loginResponse = await loginApi.login({
      username,
      password,
    });

    if (loginResponse.token) {
      setJwtToken(loginResponse.token);
      const accountInfoResponse = await accountApi.getAccount(loginResponse.id);
      account.id = accountInfoResponse.id;
      account.username = accountInfoResponse.username;
      account.roles = accountInfoResponse.roles;
      account.phone = accountInfoResponse.phone;
      account.email = accountInfoResponse.email;
      account.routes = accountInfoResponse.routes;

      localStorage.setItem('account', JSON.stringify(account));
      if (account.isSuperAdmin()) {
        account.routes = getAvailRoutes('super_admin') as string[];
        history.push(account.routes[0]);
        // history.push("/accountManage/labels");
        localStorage.setItem('account', JSON.stringify(account));
      } else if (account.isAdmin()) {
        if (account.routes.length === 0) {
          account.routes = getAvailRoutes('admin') as string[];
        }
        history.push(account.routes[0]);
        localStorage.setItem('account', JSON.stringify(account));
      } else if (account.isTeacher()) {
        account.routes = getAvailRoutes('teacher') as string[];
        const boundInfoResponse = await accountApi.getAccountBoundInfo(
          accountInfoResponse.id,
        );
        if (boundInfoResponse.boundTo === 'TEACHER') {
          const teacherInfoResponse = await accountApi.getTeacher(
            boundInfoResponse.boundId,
          );
          account.boundEntity = teacherInfoResponse;
        }
        localStorage.setItem('account', JSON.stringify(account));
        history.push(account.routes[0]);
      } else {
        // const boundInfoResponse = await accountApi.getAccountBoundInfo(
        //     accountInfoResponse.id,
        // );
        // if (boundInfoResponse.boundTo === 'STUDENT') {
        //     const studentInfoResponse = await accountApi.getStudent(
        //         boundInfoResponse.boundId,
        //     );
        //
        //     account.boundEntity = studentInfoResponse;
        // }
        // localStorage.setItem("account",JSON.stringify(account))
        // history.push('/course/stuSelfCourses')
        // TODO: 为财务人员添加默认页面（history.push）
        history.push(account.routes[0]);
      }
    } else {
      message.error('登录失败');
    }
  };

  return (
    <div className={styles['main']}>
      <div className={styles['content']}>
        <div className={'text-2xl text-white text-center '}>
          {getNameFromPath()[0]}
        </div>
        <div className={styles['inputDIV']}>
          <div className="login-label">账号</div>
          <input
            className={'text-sm'}
            value={username}
            placeholder="账号"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className={styles['inputDIV']}>
          <div className="login-label">密码</div>
          <input
            value={password}
            placeholder="密码"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          className={styles['loginBtn']}
          onClick={loginIssue}
          type="button"
        >
          登录
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
