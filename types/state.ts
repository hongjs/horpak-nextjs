import { AuthState, UserType } from './auth';

export type AppReducerType = (state: AppState, action: any) => AppState;

export type AppState = {
  auth: AuthState;
  alert: AlertState;
  users: UserType[];
  bank: BankState;
};

type BankState = {
  loading: boolean;
  saved: boolean;
  item?: BankItemState;
  banks: BankItemState[];
};

export type BankItemState = {
  _id?: string;
  bankId?: number;
  bankName?: string;
  accountNo?: string;
  accountName?: string;
  remark?: string;
  modifiedDate?: Date;
  modifiedBy?: string;
};

type AlertState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

export type AlertColor = 'success' | 'info' | 'warning' | 'error';
