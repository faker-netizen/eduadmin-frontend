import { getJwtToken } from '@/utils/token';
import { useLocation } from '@umijs/max';
import { Navigate, Outlet } from 'umi';

export default () => {
  const isLogin = getJwtToken() !== null && getJwtToken() !== '';
  const location = useLocation();
  if (isLogin || (!isLogin && location.pathname === '/login')) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
