
import TimeTable from '@/components/TimeTable';
import { useModel } from '@umijs/max';

const StudentSelfCourses: React.FC = () => {
    const { account } = useModel('accountModel');
    const studentId = account.boundEntity?.id ?? 0;

    return (
        <div className="p-5">
            <TimeTable type="student" entityId={studentId} />
        </div>
    );
};

export default StudentSelfCourses;
