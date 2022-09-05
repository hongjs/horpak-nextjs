import _ from 'lodash';
import { format } from 'date-fns';
import {
  FETCH_USERS,
  FETCH_AUTH_USER_PENDING,
  FETCH_AUTH_USER_SUCCESS,
} from 'reducers/actions/userAction';
import {
  LOADING_BANK,
  FETCH_BANKS,
  GET_BANK,
  EDIT_BANK,
  DELETE_BANK,
} from 'reducers/actions/bankAction';
import {
  LOADING_BRANCH,
  FETCH_BRANCHS,
  GET_BRANCH,
  EDIT_BRANCH,
  DELETE_BRANCH,
  SHEET_SELECT,
} from 'reducers/actions/branchAction';
import {
  CHECK_TOKEN,
  LOADING_DRIVE,
  FETCH_DRIVE,
  GET_DRIVE_USER,
  FETCH_SHEETS,
  PROCESSING_DATA,
  PROCESS_DATA_DONE,
  FETCH_SHEET_CONTENT_PENDING,
  FETCH_SHEET_CONTENT_SUCCESS,
  CLEAR_REPORT,
} from 'reducers/actions/driveAction';
import { OPEN_ALERT, CLOSE_ALERT } from 'reducers/actions/globalAction';
import { AppReducerType, AppState } from 'types/state';

export const AppReducer: AppReducerType = (state: AppState, action: any) => {
  switch (action.type) {
    case FETCH_USERS: {
      return {
        ...state,
        users: action.payload,
      };
    }
    case FETCH_AUTH_USER_PENDING: {
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: true,
        },
      };
    }
    case FETCH_AUTH_USER_SUCCESS: {
      const { currentUser, noAdmin } = action.payload;
      return {
        ...state,
        auth: {
          ...state.auth,
          loading: false,
          currentUser,
          noAdmin,
        },
      };
    }

    case OPEN_ALERT: {
      const { message, severity } = action.payload;
      return {
        ...state,
        alert: {
          ...state.alert,
          open: true,
          message,
          severity,
        },
      };
    }
    case CLOSE_ALERT: {
      return {
        ...state,
        alert: {
          ...state.alert,
          open: false,
        },
      };
    }

    //---------------- BANK ----------------
    case LOADING_BANK: {
      return {
        ...state,
        bank: { ...state.bank, loading: true },
      };
    }
    case FETCH_BANKS:
      return {
        ...state,
        bank: { ...state.bank, banks: action.payload, loading: false },
      };

    case GET_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          item: action.payload,
          loading: false,
          saved: false,
        },
      };

    case EDIT_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          item: action.payload,
          loading: false,
          saved: true,
        },
      };

    case DELETE_BANK:
      return {
        ...state,
        bank: {
          ...state.bank,
          banks: _.filter(state.bank.banks, (row: any) => {
            return row._id !== action.payload.id;
          }),
          loading: false,
        },
      };

    //---------------- BRANCH ----------------
    case LOADING_BRANCH: {
      return {
        ...state,
        branch: { ...state.branch, loading: true },
      };
    }
    case FETCH_BRANCHS:
      return {
        ...state,
        branch: { ...state.branch, branches: action.payload, loading: false },
      };

    case GET_BRANCH:
      return {
        ...state,
        branch: {
          ...state.branch,
          item: action.payload,
          loading: false,
          saved: false,
        },
      };

    case EDIT_BRANCH:
      return {
        ...state,
        branch: {
          ...state.branch,
          item: action.payload,
          loading: false,
          saved: true,
        },
      };

    case DELETE_BRANCH:
      return {
        ...state,
        branch: {
          ...state.branch,
          branches: _.filter(state.branch.branches, (row: any) => {
            return row._id !== action.payload.id;
          }),
          loading: false,
        },
      };
    case SHEET_SELECT: {
      const branch = state.branch.branches.find(
        (i) => i._id === action.payload.branchId
      );

      if (branch) {
        branch.sheetId = action.payload.newSheetId;
      }

      return {
        ...state,
        branch: {
          ...state.branch,
          branches: [...state.branch.branches],
        },
      };
    }

    //---------------- DRIVE & Spreadsheet ----------------
    case CHECK_TOKEN: {
      return {
        ...state,
        drive: {
          ...state.drive,
          hasToken: action.payload,
        },
      };
    }
    case LOADING_DRIVE: {
      return {
        ...state,
        drive: {
          ...state.drive,
          loading: true,
        },
      };
    }
    case FETCH_DRIVE:
      return {
        ...state,
        drive: {
          ...state.drive,
          loading: false,
          files: _.orderBy(action.payload, ['mimeType', 'name']),
        },
      };

    case GET_DRIVE_USER:
      return {
        ...state,
        drive: {
          ...state.drive,
          loading: false,
          user: action.payload,
        },
      };
    case FETCH_SHEETS: {
      const branch = state.branch.branches.find(
        (i) => i._id === action.payload.branchId
      );
      if (branch) {
        branch.sheets = action.payload.sheets;
        branch.sheetId = action.payload.sheetId;
      }

      return {
        ...state,
        branch: {
          ...state.branch,
          branches: [...state.branch.branches],
          loading: false,
        },
      };
    }
    case PROCESSING_DATA: {
      var branch = state.branch.branches.find((i) => i._id === action.payload);
      if (branch) {
        branch.processing = true;
      }
      return {
        ...state,
        branch: { ...state.branch, branches: [...state.branch.branches] },
      };
    }
    case PROCESS_DATA_DONE: {
      var branch = state.branch.branches.find(
        (i) => i._id === action.payload.branchId
      );
      if (branch) {
        branch.processing = false;
        branch.error = undefined;
        branch.lastProcessSheet = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        action.payload.updatedSheets.forEach((sheet: any) => {
          if (branch && branch.sheets) {
            let item = branch.sheets.find((i) => i.sheetId === sheet.sheetId);
            if (item) {
              item.title = sheet.title;
            } else {
              branch.sheets.push(sheet);
            }
          }
        });
      }
      return {
        ...state,
        branch: { ...state.branch, branches: [...state.branch.branches] },
      };
    }

    //---------------- Report ----------------
    case FETCH_SHEET_CONTENT_PENDING: {
      return {
        ...state,
        report: { ...state.report, loading: true },
      };
    }
    case FETCH_SHEET_CONTENT_SUCCESS: {
      const { sheet, items, errors } = action.payload;
      return {
        ...state,
        report: {
          ...state.report,
          loading: false,
          sheet: sheet,
          items: items,
          errors: errors,
        },
      };
    }
    case CLEAR_REPORT: {
      return {
        ...state,
        report: {
          loading: false,
        },
      };
    }

    default: {
      return state;
    }
  }
};
