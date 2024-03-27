import { setJwtToken } from '@/utils/token';
import { history } from '@@/core/history';
import { UserOutlined } from '@ant-design/icons';
import { Navigate, Outlet, useLocation, useModel } from '@umijs/max';
import { Avatar, ConfigProvider, Layout, Menu, Popover } from 'antd';
import { ItemType as MenuItemType } from 'antd/lib/menu/hooks/useItems';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { Location } from 'history';
import { SelectEventHandler as MenuSelectEventHandler } from 'rc-menu/lib/interface';
import { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import {
  defaultEnhancedAccountInfo,
  EnhancedAccountInfo,
} from '@/models/accountModel';
import { Roles } from '@/constants/auth';
import {
  filterRouteForLeft,
  filterRouteForTop,
  getNameFromPath,
} from '@/utils/common';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// 课程管理  包括 教师排课管理   教师课表查看  消课管理
// 信息管理  包括 咨询登记      成交登记   统计分析
// 账号管理  包括 账号列表      新建账号
// 档案管理  包括 学生档案管理  自闭儿童档案  培智儿童档案  听障儿童档案
type RouteTree = {
  [role in Roles]: {
    [topMenuTitle: string]: {
      default: string;
      contents: { [leftMenuTitle: string]: string };
    };
  };
};

// ! 只需要修改这里
const routeTree: RouteTree = {
  [Roles.SUPER_ADMIN]: {
    课程管理: {
      default: '/courseManage/courseManage',
      contents: {
        已创建课程列表: '/courseManage/courseList',
        课程模式管理: '/courseManage/courseModel',
        教师课表查看: '/courseManage/teacherCourse',
        学生课程管理: '/courseManage/studentCourseBinding',
        课程绑定总览: '/courseManage/courseGroupStatus',
        班级管理: '/courseManage/courseManage',
        消课管理: '/courseManage/xiaoke',
        调课管理: '/courseManage/lessonChange',
      },
    },
    财务管理: {
      default: '/informationManage/summary',
      contents: {
        统计分析: '/informationManage/summary',
        付款方式: '/informationManage/PayImage',
      },
    },
    账号管理: {
      default: '/accountManage/accountList',
      contents: {
        账号列表: '/accountManage/accountList',
        权限分配: '/accountManage/permission',
        角色信息模版: '/accountManage/formFormat',
        学生列表: '/accountManage/studentList',
        教师列表: '/accountManage/teacherList',
        标签管理: '/accountManage/labels',
        教室管理: '/accountManage/classroom',
        课表时间轴: '/accountManage/timeScale',
      },
    },
    文件管理: {
      default: '/fileManage',
      contents: {
        档案管理: '/fileManage',
      },
    },
  },
  [Roles.ADMIN]: {
    课程管理: {
      default: '/courseManage/courseManage',
      contents: {
        已创建课程列表: '/courseManage/courseList',
        课程模式管理: '/courseManage/courseModel',
        教师课表查看: '/courseManage/teacherCourse',
        学生课程管理: '/courseManage/studentCourseBinding',
        课程绑定总览: '/courseManage/courseGroupStatus',
        班级管理: '/courseManage/courseManage',
        消课管理: '/courseManage/xiaoke',
        调课管理: '/courseManage/lessonChange',
      },
    },
    财务管理: {
      default: '/informationManage/summary',
      contents: {
        统计分析: '/informationManage/summary',
        付款方式: '/informationManage/PayImage',
      },
    },
    账号管理: {
      default: '/accountManage/accountList',
      contents: {
        账号列表: '/accountManage/accountList',
        权限分配: '/accountManage/permission',
        角色信息模版: '/accountManage/formFormat',
        学生列表: '/accountManage/studentList',
        教师列表: '/accountManage/teacherList',
        标签管理: '/accountManage/labels',
        教室管理: '/courseManage/classroom',
        课表时间轴: '/accountManage/timeScale',
      },
    },
    文件管理: {
      default: '/fileManage',
      contents: {
        档案管理: '/fileManage',
      },
    },
  },
  [Roles.FINANCIAL]: {
    课程管理: {
      default: '/courseManage/courseManage',
      contents: {
        已创建课程列表: '/courseManage/courseList',
        课程模式管理: '/courseManage/courseModel',
        教师课表查看: '/courseManage/teacherCourse',
        学生课程管理: '/courseManage/studentCourseBinding',
        课程绑定总览: '/courseManage/courseGroupStatus',
        班级管理: '/courseManage/courseManage',
        消课管理: '/courseManage/xiaoke',
        调课管理: '/courseManage/lessonChange',
      },
    },
    财务管理: {
      default: '/informationManage/summary',
      contents: {
        统计分析: '/informationManage/summary',
        付款方式: '/informationManage/PayImage',
      },
    },
    账号管理: {
      default: '/accountManage/accountList',
      contents: {
        账号列表: '/accountManage/accountList',
        权限分配: '/accountManage/permission',
        角色信息模版: '/accountManage/formFormat',
        学生列表: '/accountManage/studentList',
        教师列表: '/accountManage/teacherList',
        标签管理: '/account/labels',
        教室管理: '/courseManage/classroom',
        课表时间轴: '/accountManage/timeScale',
      },
    },
    文件管理: {
      default: '/fileManage',
      contents: {
        档案管理: '/fileManage',
      },
    },
  },
  [Roles.STUDENT]: {
    课程信息: {
      default: '/courseManage/stuSelfCourses',
      contents: {
        个人课表: '/courseManage/stuSelfCourses',
      },
    },
    个人中心: {
      default: '/accountManage/stuSelfAccount',
      contents: {
        个人信息: '/accountManage/stuSelfAccount',
        缴费信息: '/informationManage/stuPay',
      },
    },
  },
  [Roles.TEACHER]: {
    课程信息: {
      default: '/courseManage/userTeacher',
      contents: {
        个人课表: '/courseManage/userTeacher',
        消课: '/courseManage/userTeacherXiaoke',
      },
    },
    账号信息: {
      default: '/accountManage/userAccount',
      contents: {
        个人账号: '/accountManage/userAccount',
        // 学生列表: '/accountManage/studentList',
      },
    },
  },
};

const getTopMenuKeyFromPathname = (
  role: Account.Role,
  location: Location,
): {
  topMenuTitle: string;
  topMenuKey: string;
  withSearchParams: boolean;
} => {
  for (const [topMenuTitle, topMenuMap] of Object.entries(routeTree[role])) {
    if (Object.values(topMenuMap.contents).includes(location.pathname)) {
      return {
        topMenuTitle,
        topMenuKey: topMenuMap.default,
        withSearchParams: false,
      };
    }
    if (
      Object.values(topMenuMap.contents).includes(
        `${location.pathname}${location.search}`,
      )
    ) {
      return {
        topMenuTitle,
        topMenuKey: topMenuMap.default,
        withSearchParams: true,
      };
    }
  }

  throw new Error('未找到对应的顶部菜单');
};

const LayoutPage: React.FC = () => {
  const location = useLocation();
  const [leftMenuItems, setLeftMenuItems] = useState<MenuItemType[]>([]);
  const [itemsChange, setItemsChange] = useState(true);
  const [leftMenuSelected, setLeftMenuSelected] = useState<string[]>([]);
  const [topMenuSelected, setTopMenuSelected] = useState<string[]>([]);

  const { account } = useModel('accountModel');
  if (location.pathname !== '/login') {
    const accountFromLocalStorageString = localStorage.getItem('account');
    const accountFromLocalStorage: EnhancedAccountInfo =
      accountFromLocalStorageString
        ? (JSON.parse(accountFromLocalStorageString) as EnhancedAccountInfo)
        : defaultEnhancedAccountInfo;

    account.boundEntity = accountFromLocalStorage.boundEntity;
    account.roles = accountFromLocalStorage.roles;
    account.email = accountFromLocalStorage.email;
    account.username = accountFromLocalStorage.username;
    account.phone = accountFromLocalStorage.phone;
    account.id = accountFromLocalStorage.id;
    account.routes = accountFromLocalStorage.routes;

    // console.log(accountFromLocalStorage)
  }

  // 根据当前角色，设置顶部菜单
  const topMenuItems: MenuItemType[] = Object.entries(
    routeTree[account.primaryRole],
  ).map(([key, value]) => ({ label: key, key: value.default }));

  // 路由变化时，更新顶部菜单的选中状态，并更新左侧菜单
  useEffect(() => {
    // console.log(location.pathname);
    if (!['/', '/login'].includes(location.pathname)) {
      // 根据当前路由获取顶部标题和对应的key

      const { topMenuTitle, topMenuKey, withSearchParams } =
        getTopMenuKeyFromPathname(account.primaryRole, location);
      // 设置顶部菜单选中状态
      setTopMenuSelected([topMenuKey]);

      // 设置左侧菜单
      setLeftMenuItems(
        Object.entries(
          routeTree[account.primaryRole][topMenuTitle].contents,
        ).map(([leftMenuTitle, leftMenuPath]) => ({
          label: leftMenuTitle,
          key: leftMenuPath,
        })),
      );

      // 设置左侧菜单选中状态
      if (withSearchParams) {
        setLeftMenuSelected([`${location.pathname}${location.search}`]);
      } else {
        setLeftMenuSelected([location.pathname]);
      }
    }
  }, [location.pathname]);

  const onTopPathChanged: MenuSelectEventHandler = useCallback((e) => {
    setItemsChange(!itemsChange);
    history.push(e.key);
  }, []);
  const onLeftPathChanged: MenuSelectEventHandler = useCallback((e) => {
    history.push(e.key);
    setLeftMenuSelected([e.key]);
  }, []);

  const content = (
    <div style={{ width: '200px', height: 70, cursor: 'pointer' }}>
      <div
        className={styles['userIconDiv']}
        onClick={() => {
          history.push('/login');
          setJwtToken('');
        }}
      >
        退出登录
      </div>
    </div>
  );

  if (location.pathname === '/login') {
    return <Outlet />;
  }

  if (location.pathname === '/') {
    return <Navigate to="/login" />;
  }

  return (
      <QueryClientProvider client={queryClient}>
    <ConfigProvider locale={zhCN}>
      <div style={{ width: '100%' }}>
        <div className={styles['main']}>
          <Layout.Header className={styles['header']}>
            <div
              className={styles['topLogo']}
              onClick={() => {
                // console.log(topMenuItems, leftMenuItems)
              }}
            >
              {getNameFromPath()[1]}
            </div>
            <Menu
              className={styles['topMenu']}
              selectedKeys={topMenuSelected}
              theme="dark"
              mode="horizontal"
              onSelect={onTopPathChanged}
              // items={topMenuItems}
              items={
                account.primaryRole === 'teacher' ||
                account.primaryRole === 'student'
                  ? topMenuItems
                  : filterRouteForTop(
                      account.routes,
                      topMenuItems as {
                        label: string;
                        key: string;
                      }[],
                    )
              }
            />
            <div className={styles['topAvatar']}>
              <Popover content={content} placement="bottom">
                <Avatar size="large" icon={<UserOutlined />} />
              </Popover>
            </div>
          </Layout.Header>
          <div className={styles['content']}>
            <div className={styles['contentMenu']}>
              <Menu
                style={{
                  width: '250px',
                  backgroundColor: '#152646',
                  color: '#b7e3fa',
                }}
                selectedKeys={leftMenuSelected}
                theme="dark"
                mode="vertical"
                // items={leftMenuItems}
                items={
                  account.primaryRole === 'teacher' ||
                  account.primaryRole === 'student'
                    ? leftMenuItems
                    : filterRouteForLeft(
                        account.routes,
                        leftMenuItems as {
                          label: string;
                          key: string;
                        }[],
                      )
                }
                onSelect={onLeftPathChanged}
              />
            </div>

            <div className={styles['contentRight']}>
              <div className={styles['realContent']}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
      </QueryClientProvider>
  );
};

export default LayoutPage;
