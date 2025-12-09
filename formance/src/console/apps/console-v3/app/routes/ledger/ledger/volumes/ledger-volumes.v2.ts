import { getPaginatedAndFilteredList } from '@platform/remix';
import { getSearchParamServerSide } from '@platform/remix/src/utils/helper';
import { V2GetVolumesWithBalancesRequest } from '@platform/sdks/formance/src/models/operations';
import { serializeBigInt } from '@platform/utils';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import {
  LEDGER_VOLUMES_END_TIME,
  LEDGER_VOLUMES_GROUP_BY,
  LEDGER_VOLUMES_LIST,
  LEDGER_VOLUMES_START_TIME,
} from '../../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request,
  ledgerName: string
): Promise<Data> => {
  const ledger = await api.ledger.getLedger({ ledger: ledgerName });
  const ledgerStats = await api.ledger.getLedgerStats({
    ledger: ledgerName,
  });

  // Read URL parameters for date and groupBy filters
  const startTimeParam = getSearchParamServerSide(
    request,
    LEDGER_VOLUMES_START_TIME
  );
  const endTimeParam = getSearchParamServerSide(
    request,
    LEDGER_VOLUMES_END_TIME
  );
  const groupByParam = getSearchParamServerSide(
    request,
    LEDGER_VOLUMES_GROUP_BY
  );

  // Convert RFC3339 date strings to Date objects if provided
  const startTime = startTimeParam ? new Date(startTimeParam) : undefined;
  const endTime = endTimeParam ? new Date(endTimeParam) : undefined;
  const groupBy = groupByParam ? Number(groupByParam) : 0;

  const ledgerVolumesWithBalances = await getPaginatedAndFilteredList(
    (config: V2GetVolumesWithBalancesRequest) =>
      api.ledger.getVolumesWithBalances({
        ...config,
        ledger: ledgerName,
        startTime,
        endTime,
        groupBy,
      }),
    request,
    LEDGER_VOLUMES_LIST
  );

  return {
    ledger,
    ledgerStats: serializeBigInt(ledgerStats),
    ledgerVolumesWithBalances: serializeBigInt(ledgerVolumesWithBalances),
  };
};
