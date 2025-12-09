import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { LEDGERS_LIST, LEDGER_SELECTED } from '../constants';
import { Data } from './index';

export const v1Loader = async (
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

  // If we have a ledger name from the filter, use getLedger for exact lookup
  if (selectedLedger) {
    try {
      const ledger = await api.ledger.getLedger({
        ledger: selectedLedger,
      });
      if (ledger && 'data' in ledger && ledger.data) {
        const allLedgers = api.mockCursor([ledger.data]);

        return {
          allLedgers,
          serverSide: true,
        };
      }

      // No ledger found, return undefined to show no results
      return {
        allLedgers: undefined,
        serverSide: true,
      };
    } catch (e: any) {
      if (e.rawResponse?.status === 404) {
        // Ledger not found, return undefined to show no results
        return {
          allLedgers: undefined,
          serverSide: true,
        };
      }
      throw e;
    }
  }

  // No specific ledger requested, return all ledgers
  const allLedgers = await api.ledger.listLedgers({});

  return {
    allLedgers,
    serverSide: true,
  };
};
