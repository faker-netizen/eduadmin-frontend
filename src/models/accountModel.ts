import {defaultAccountInfo} from '@/@types/accountDefaults';
import {Roles} from '@/constants/auth';

export type EnhancedAccountInfo = Account.AccountInfo & {
  primaryRole: Account.Role;
  boundEntity: Account.BoundEntity;

  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isFinancial: () => boolean;
  isStudent: () => boolean;
  isTeacher: () => boolean;
};

export const defaultEnhancedAccountInfo: EnhancedAccountInfo = {
  ...defaultAccountInfo,
  get primaryRole(): Account.Role {
    if (this.roles.includes(Roles.SUPER_ADMIN)) {
      return Roles.SUPER_ADMIN;
    }
    if (this.roles.includes(Roles.ADMIN)) {
      return Roles.ADMIN;
    }
    if (this.roles.includes(Roles.FINANCIAL)) {
      return Roles.FINANCIAL;
    }
    if (this.roles.includes(Roles.TEACHER)) {
      return Roles.TEACHER;
    }
    return Roles.STUDENT;
  },
  boundEntity: null,
  isSuperAdmin() {
    return this.primaryRole === Roles.SUPER_ADMIN;
  },
  isAdmin() {
    return this.primaryRole === Roles.ADMIN;
  },
  isFinancial() {
    return this.primaryRole === Roles.FINANCIAL;
  },
  isStudent() {
    return this.primaryRole === Roles.STUDENT;
  },
  isTeacher() {
    return this.primaryRole === Roles.TEACHER;
  },
};

const useAccount = () => ({account: defaultEnhancedAccountInfo});

export default useAccount;
