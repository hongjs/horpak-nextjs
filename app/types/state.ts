import { AuthState, UserType } from './auth'

export type AppReducerType = (state: AppState, action: any) => AppState

export type AppState = {
  auth: AuthState
  alert: AlertState
  users: UserType[]
  bank: BankState
  branch: BranchState
  drive: DriveState
  report: ReportState
}

type BankState = {
  loading: boolean
  saved: boolean
  item?: BankItemState
  banks: BankItemState[]
}

export type BankItemState = {
  _id?: string
  bankId?: number
  bankName?: string
  accountNo?: string
  accountName?: string
  remark?: string
  modifiedDate?: Date
  modifiedBy?: string
  logo?: string
}

type BranchState = {
  loading: boolean
  saved: boolean
  item?: BranchItemState
  branches: BranchItemState[]
}

export type DriveSheetItem = {
  sheetId: number
  title: string
  index: number
}

export type BranchItemState = {
  _id?: string
  name?: string
  spreadSheetId?: string
  spreadSheetName?: string
  lastProcessSheet?: string
  reportAddress?: string
  reportContact?: string
  reportHeader?: string
  reportRemark?: string

  processing?: boolean
  sheetId?: number
  sheets?: DriveSheetItem[]
  error?: string
}

type AlertState = {
  open: boolean
  message: string
  severity: AlertColor
}

export type AlertColor = 'success' | 'info' | 'warning' | 'error'

export type DriveItem = {
  id: string
  name: string
  mimeType: string
  parents?: string[]
}

export type ReportItem = {
  room: number
  name: string
  water_start: number
  water_end: number
  water_unit_price: number
  water_unit: number
  water_min_cost: number
  water_cost: number
  electric_start: number
  electric_end: number
  electric_unit_price: number
  electric_unit: number
  electric_cost: number
  room_cost: number
  share_cost: number
  internet_cost: number
  penalty_cost: number
  arrear: number
  electric_extra: string
  electric_extra_cost: number
  water_extra: string
  water_extra_cost: number
  other1: string
  other1_cost: number
  other2: string
  other2_cost: number
  other3: string
  other3_cost: number
  bank_id: number
  total: number
}

type DriveUser = {
  name: string
  picture: string
  email: string
  updatedBy: string
  updatedDate: string
  expiryDate: string
}

type DriveState = {
  loading: boolean
  hasToken: boolean
  files: DriveItem[]
  user?: DriveUser
}

type ReportState = {
  loading: boolean
  sheet?: {
    sheetId: number
    title: string
    index: number
    sheetType: string
    gridProperties: {
      rowCount: number
      columnCount: number
      frozenRowCount: number
      frozenColumnCount: number
    }
  }
  items?: ReportItem[]
  errors?: string[]
}
