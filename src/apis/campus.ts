import accountApi from './account';

const campusApi = {
  async getCampusInfo(): Promise<Campus.CampusInfo> {
    const students: Array<
      Partial<Campus.CampusInfo['students'][number]> & {
        info: Account.StudentInfo;
      }
    > = (await accountApi.getAllStudents()).map((student) => ({
      info: student,
    }));
    await Promise.all(
      students.map(async (student) => {
        student.attendance = await accountApi.getStudentAttendance(
          student.info.id,
        );
        student.lessons = student.attendance.map(
          (attendance) => attendance.lesson,
        );
        student.payments = await accountApi.getStudentPayments(student.info.id);
        student.regularPayments = student.payments.filter(
          (payment) => payment.category === 'REGULAR',
        );
        student.refunds = await accountApi.getStudentRefunds(student.info.id);
        student.transactions = [...student.payments, ...student.refunds].sort(
          (a, b) => a.creationDateTime.localeCompare(b.creationDateTime),
        );
      }),
    );
    const teachers = await accountApi.getAllTeachers();
    return {
      students: students as Campus.CampusInfo['students'],
      teachers,
    };
  },
};

export default campusApi;
