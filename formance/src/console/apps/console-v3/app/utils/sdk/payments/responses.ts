import * as components from '@platform/sdks/formance/src/models/components';
import * as errors from '@platform/sdks/formance/src/models/errors';
import { Cursor } from '@platform/sdks/utils/cursor';
import {
  NormalizedBankAccountModel,
  NormalizedCashPoolBalancesModel,
  NormalizedCashPoolModel,
  NormalizedConnectorDataModel,
  NormalizedConnectorListModel,
  NormalizedConnectorTaskModel,
  NormalizedConnectorTaskScheduleInstanceModel,
  NormalizedPaymentAccountBalanceModel,
  NormalizedPaymentAccountModel,
  NormalizedPaymentModel,
  NormalizedTransferInitiationModel,
} from './models';

export type NormalizedListPaymentsResponse =
  | components.PaymentsCursor
  | components.PaymentsErrorResponse
  | components.V3PaymentsCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedPaymentModel> };

export type NormalizedGetPaymentResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | components.V3GetPaymentResponse
  | components.V3ErrorResponse
  | components.PaymentResponse
  | components.PaymentsErrorResponse
  | { data: NormalizedPaymentModel };

export type NormalizedListPaymentsAccountsResponse =
  | components.V3AccountsCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedPaymentAccountModel> };

export type NormalizedGetPaymentAccountResponse =
  | components.V3GetAccountResponse
  | components.V3ErrorResponse
  | { data: NormalizedPaymentAccountModel };

export type NormalizedGetPaymentAccountsResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | { data: NormalizedPaymentAccountModel[] };

export type NormalizedGetPaymentAccountBalancesResponse =
  | components.BalancesCursor
  | components.PaymentsErrorResponse
  | components.V3BalancesCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedPaymentAccountBalanceModel> };

export type NormalizedListPoolsResponse =
  | components.PoolsCursor
  | components.PaymentsErrorResponse
  | components.V3PoolsCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedCashPoolModel> };

export type NormalizedCreateCashPoolResponse =
  | components.V3ErrorResponse
  | components.V3CreatePoolResponse
  | undefined;

export type NormalizedGetCashPoolResponse =
  | components.PaymentsErrorResponse
  | components.V3ErrorResponse
  | { data: NormalizedCashPoolModel };

export type NormalizedGetCashPoolBalancesResponse =
  | components.V3ErrorResponse
  | { data: NormalizedCashPoolBalancesModel };

export type NormalizedCreateTransferInitiationResponse =
  | components.PaymentsErrorResponse
  | components.V3InitiatePaymentResponse
  | components.V3ErrorResponse
  | { data: NormalizedTransferInitiationModel };

export type NormalizedListTransferInitiationsResponse =
  | components.TransferInitiationsCursor
  | components.PaymentsErrorResponse
  | components.V3PaymentInitiationsCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedTransferInitiationModel> };

export type NormalizedGetTransferResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | components.V3GetPaymentInitiationResponse
  | components.V3ErrorResponse
  | { data: NormalizedTransferInitiationModel };

export type NormalizedUpdateTransferInitiationResponse =
  | components.PaymentsErrorResponse
  | components.V3ApprovePaymentInitiationResponse
  | components.V3ErrorResponse
  | undefined;

export type NormalizedListBankAccountsResponse =
  | components.V3BankAccountsCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedBankAccountModel> };

export type NormalizedGetBankAccountResponse =
  | (errors.ErrorResponse | errors.V2ErrorResponse)
  | components.V3GetBankAccountResponse
  | components.V3ErrorResponse
  | { data: NormalizedBankAccountModel };

export type NormalizedCreateBankAccountResponse =
  | components.BankAccountResponse
  | components.PaymentsErrorResponse
  | components.V3CreateBankAccountResponse
  | components.V3ErrorResponse;

export type NormalizedGetConnectorResponse =
  | components.ConnectorConfigResponse
  | components.PaymentsErrorResponse
  | components.V3ErrorResponse
  | components.V3GetConnectorConfigResponse
  | { data: NormalizedConnectorDataModel };

export type NormalizedInstallConnectorResponse =
  | { data: { id: string } }
  | components.V3ErrorResponse
  | components.PaymentsErrorResponse;

export type NormalizedUninstallConnectorResponse =
  | components.V3UninstallConnectorResponse
  | components.V3ErrorResponse
  | components.PaymentsErrorResponse
  | undefined;

export type NormalizedListConnectorsResponse =
  | components.PaymentsErrorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedConnectorListModel> };

export type NormalizedListAllAvailableConnectorsResponse =
  | components.ConnectorsConfigsResponse
  | components.PaymentsErrorResponse
  | components.V3ConnectorConfigsResponse
  | components.V3ErrorResponse;

export type NormalizedListConnectorTasksResponse =
  | components.TasksCursor
  | components.V3ConnectorSchedulesCursorResponse
  | components.V3ErrorResponse
  | { cursor: Cursor<NormalizedConnectorTaskModel> };

export type NormalizedGetConnectorTaskResponse =
  | components.V3ErrorResponse
  | components.V3Schedule
  | components.PaymentsErrorResponse
  | { data: NormalizedConnectorTaskModel };

export type NormalizedGetConnectorTaskInstancesResponse =
  | components.V3ErrorResponse
  | components.V3ConnectorScheduleInstancesCursorResponse
  | components.PaymentsErrorResponse
  | { cursor: Cursor<NormalizedConnectorTaskScheduleInstanceModel> };
