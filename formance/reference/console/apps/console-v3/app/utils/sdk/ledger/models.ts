// volume
export type NormalizedVolumeModel = {
  input: bigint;
  output: bigint;
  balance?: bigint | undefined;
};

// account
export type NormalizedAccountModel = {
  // v1
  address: string;
  type?: string | undefined;
  // v1 | v2
  metadata?: { [k: string]: any } | { [k: string]: string };
  // v2
  volumes?: { [k: string]: NormalizedVolumeModel } | undefined;
  effectiveVolumes?: { [k: string]: NormalizedVolumeModel } | undefined;
};

// posting
export type NormalizedPostingModel = {
  amount: bigint;
  asset: string;
  destination: string;
  source: string;
};

// transaction
export type NormalizedTransactionModel = {
  // v1
  txid?: bigint;
  // v1/v2
  reverted?: boolean;
  revertedAt?: Date | undefined;
  timestamp: Date;
  postings: Array<NormalizedPostingModel>;
  reference?: string | undefined;
  metadata?: { [k: string]: string } | null | undefined;
  preCommitVolumes?:
    | { [k: string]: { [k: string]: NormalizedVolumeModel } }
    | undefined;
  postCommitVolumes?:
    | { [k: string]: { [k: string]: NormalizedVolumeModel } }
    | undefined;
  // v2
  id: bigint;
  preCommitEffectiveVolumes?:
    | { [k: string]: { [k: string]: NormalizedVolumeModel } }
    | undefined;
  postCommitEffectiveVolumes?:
    | { [k: string]: { [k: string]: NormalizedVolumeModel } }
    | undefined;
};

// ledger
export type NormalizedLedgerModel = {
  name: string;
  // v2
  id?: number;
  bucket?: string;
  features?: { [k: string]: string } | undefined;
  metadata?: { [k: string]: string } | undefined;
  addedAt?: Date;
};

// info
export type NormalizedLedgerInfoModel = {
  name?: string | undefined;
  storage?: NormalizedStorageModel | undefined;
};

// migration
export type NormalizedMigrationInfoModel = {
  version?: string | undefined | number;
  name?: string | undefined;
  date?: Date | undefined;
  state?: 'TO DO' | 'DONE' | 'PROGRESS' | undefined;
};

// storage
export type NormalizedStorageModel = {
  migrations?: Array<NormalizedMigrationInfoModel> | undefined;
};

// stats
export type NormalizedStatsModel = {
  accounts: number | bigint;
  transactions: bigint | number;
};

// log
export type NormalizedLogModel = {
  id: number | bigint;
  type:
    | 'SET_METADATA'
    | 'NEW_TRANSACTION'
    | 'REVERTED_TRANSACTION'
    | 'DELETE_METADATA';
  data: { [k: string]: any };
  hash: string;
  date: Date;
};

export type NormalizedVolumeWithBalanceModel = {
  account: string;
  asset: string;
  input: bigint;
  output: bigint;
  balance: bigint;
};

// volumes with balances
export type NormalizedVolumesWithBalancesModel = {
  pageSize: number;
  hasMore: boolean;
  previous?: string | undefined;
  next?: string | undefined;
  data: Array<NormalizedVolumeWithBalanceModel> | [];
};
