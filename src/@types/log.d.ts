declare namespace Log {
  type LogLevel = 'INFO' | 'WARNING' | 'ERROR';
  type LogType = 'LOGIN' | 'LOGOUT' | 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE';

  interface LogInfo {
    id: number;
    timestamp: string;
    level: LogLevel;
    type: LogType;
    operator: Account.AccountInfo;
    message: string;
    influencedEntities: string[];
  }
}
