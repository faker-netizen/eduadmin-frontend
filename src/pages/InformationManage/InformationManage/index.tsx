import { useLocation } from '@umijs/max';

const InformationManage: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <div style={{ height: '1200px' }}>{location.search}</div>
    </div>
  );
};

export default InformationManage;
