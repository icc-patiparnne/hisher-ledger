import { getPaginatedAndFilteredList } from '@platform/remix';
import { V2ListLedgersRequest } from '@platform/sdks/formance/src/models/operations';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { LEDGERS_LIST, LEDGER_SELECTED } from '../constants';
import { Data } from './index';

export const v2Loader = async (
  api: NormalizedSDK,
  request: Request
): Promise<Data> => {
  // Extract ledger name from consolidated query
  const url = new URL(request.url);
  const queryParam = url.searchParams.get(LEDGERS_LIST);
  let selectedLedger: string | null = null;

  // Parse the V2 consolidated query to extract ledger name
  if (queryParam) {
    try {
      const parsedQuery = JSON.parse(queryParam);
      if (parsedQuery?.$match?.[LEDGER_SELECTED]) {
        selectedLedger = parsedQuery.$match[LEDGER_SELECTED];
      }
    } catch (e) {
      // Invalid JSON, continue without ledger name
    }
  }

  const allLedgers = (await getPaginatedAndFilteredList(
    async (config: V2ListLedgersRequest) => {
      if (selectedLedger) {
        try {
          const ledger = await api.ledger.getLedger({
            ledger: selectedLedger,
          });
          if (ledger && 'data' in ledger && ledger.data) {
            return api.mockCursor([ledger.data]);
          }

          return undefined;
        } catch (e: any) {
          if (e.rawResponse?.status === 404) {
            // Ledger not found, return undefined to show no results
            return undefined;
          }
          throw e;
        }
      }

      return api.ledger.listLedgers(config);
    },
    request,
    LEDGERS_LIST
  )) as Data['allLedgers'];

  return {
    allLedgers,
    serverSide: true,
  };
};
