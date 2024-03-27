declare namespace Campus {
  interface CampusInfo {
    students: Array<{
      info: Account.StudentInfo;
      lessons: Course.LessonInfo[];
      attendance: Course.AttendanceRecord[];
      regularPayments: Payment.PaymentInfo[];
      payments: Payment.PaymentInfo[];
      refunds: Payment.RefundInfo[];
      transactions: Payment.TransactionInfo[];
    }>;
    teachers: Account.TeacherInfo[];
  }
}
