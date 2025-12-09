# openapi

<div align="left">
    <a href="https://www.speakeasy.com/?utm_source=<no value>&utm_campaign=typescript"><img src="https://custom-icon-badges.demolab.com/badge/-Built%20By%20Speakeasy-212015?style=for-the-badge&logoColor=FBE331&logo=speakeasy&labelColor=545454" /></a>
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" style="width: 100px; height: 28px;" />
    </a>
</div>


## 🏗 **Welcome to your new SDK!** 🏗

It has been generated successfully based on your OpenAPI spec. However, it is not yet ready for production use. Here are some next steps:
- [ ] 🛠 Make your SDK feel handcrafted by [customizing it](https://www.speakeasy.com/docs/customize-sdks)
- [ ] ♻️ Refine your SDK quickly by iterating locally with the [Speakeasy CLI](https://github.com/speakeasy-api/speakeasy)
- [ ] 🎁 Publish your SDK to package managers by [configuring automatic publishing](https://www.speakeasy.com/docs/advanced-setup/publish-sdks)
- [ ] ✨ When ready to productionize, delete this section from the README

<!-- Start SDK Installation [installation] -->
## SDK Installation

### NPM

```bash
npm add <UNSET>
```

### PNPM

```bash
pnpm add <UNSET>
```

### Bun

```bash
bun add <UNSET>
```

### Yarn

```bash
yarn add <UNSET> zod

# Note that Yarn does not install peer dependencies automatically. You will need
# to install zod as shown above.
```
<!-- End SDK Installation [installation] -->

<!-- Start Requirements [requirements] -->
## Requirements

For supported JavaScript runtimes, please consult [RUNTIMES.md](RUNTIMES.md).
<!-- End Requirements [requirements] -->

<!-- Start SDK Example Usage [usage] -->
## SDK Example Usage

### Example

```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions();

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->

<!-- Start Available Resources and Operations [operations] -->
## Available Resources and Operations

### [SDK](docs/sdks/sdk/README.md)

* [getVersions](docs/sdks/sdk/README.md#getversions) - Show stack version information


### [auth.v1](docs/sdks/v1/README.md)

* [getOIDCWellKnowns](docs/sdks/v1/README.md#getoidcwellknowns) - Retrieve OpenID connect well-knowns.
* [getServerInfo](docs/sdks/v1/README.md#getserverinfo) - Get server info
* [listClients](docs/sdks/v1/README.md#listclients) - List clients
* [createClient](docs/sdks/v1/README.md#createclient) - Create client
* [readClient](docs/sdks/v1/README.md#readclient) - Read client
* [updateClient](docs/sdks/v1/README.md#updateclient) - Update client
* [deleteClient](docs/sdks/v1/README.md#deleteclient) - Delete client
* [createSecret](docs/sdks/v1/README.md#createsecret) - Add a secret to a client
* [deleteSecret](docs/sdks/v1/README.md#deletesecret) - Delete a secret from a client
* [listUsers](docs/sdks/v1/README.md#listusers) - List users
* [readUser](docs/sdks/v1/README.md#readuser) - Read user

### [ledger](docs/sdks/ledger/README.md)

* [getInfo](docs/sdks/ledger/README.md#getinfo) - Show server information
* [getMetrics](docs/sdks/ledger/README.md#getmetrics) - Read in memory metrics

### [ledger.v1](docs/sdks/sdkv1/README.md)

* [getInfo](docs/sdks/sdkv1/README.md#getinfo) - Show server information
* [getLedgerInfo](docs/sdks/sdkv1/README.md#getledgerinfo) - Get information about a ledger
* [countAccounts](docs/sdks/sdkv1/README.md#countaccounts) - Count the accounts from a ledger
* [listAccounts](docs/sdks/sdkv1/README.md#listaccounts) - List accounts from a ledger
* [getAccount](docs/sdks/sdkv1/README.md#getaccount) - Get account by its address
* [addMetadataToAccount](docs/sdks/sdkv1/README.md#addmetadatatoaccount) - Add metadata to an account
* [getMapping](docs/sdks/sdkv1/README.md#getmapping) - Get the mapping of a ledger
* [updateMapping](docs/sdks/sdkv1/README.md#updatemapping) - Update the mapping of a ledger
* [~~runScript~~](docs/sdks/sdkv1/README.md#runscript) - Execute a Numscript :warning: **Deprecated**
* [readStats](docs/sdks/sdkv1/README.md#readstats) - Get statistics from a ledger
* [countTransactions](docs/sdks/sdkv1/README.md#counttransactions) - Count the transactions from a ledger
* [listTransactions](docs/sdks/sdkv1/README.md#listtransactions) - List transactions from a ledger
* [createTransaction](docs/sdks/sdkv1/README.md#createtransaction) - Create a new transaction to a ledger
* [getTransaction](docs/sdks/sdkv1/README.md#gettransaction) - Get transaction from a ledger by its ID
* [addMetadataOnTransaction](docs/sdks/sdkv1/README.md#addmetadataontransaction) - Set the metadata of a transaction by its ID
* [revertTransaction](docs/sdks/sdkv1/README.md#reverttransaction) - Revert a ledger transaction by its ID
* [createTransactions](docs/sdks/sdkv1/README.md#createtransactions) - Create a new batch of transactions to a ledger
* [getBalances](docs/sdks/sdkv1/README.md#getbalances) - Get the balances from a ledger's account
* [getBalancesAggregated](docs/sdks/sdkv1/README.md#getbalancesaggregated) - Get the aggregated balances from selected accounts
* [listLogs](docs/sdks/sdkv1/README.md#listlogs) - List the logs from a ledger

### [ledger.v2](docs/sdks/v2/README.md)

* [listLedgers](docs/sdks/v2/README.md#listledgers) - List ledgers
* [getLedger](docs/sdks/v2/README.md#getledger) - Get a ledger
* [createLedger](docs/sdks/v2/README.md#createledger) - Create a ledger
* [updateLedgerMetadata](docs/sdks/v2/README.md#updateledgermetadata) - Update ledger metadata
* [deleteLedgerMetadata](docs/sdks/v2/README.md#deleteledgermetadata) - Delete ledger metadata by key
* [getLedgerInfo](docs/sdks/v2/README.md#getledgerinfo) - Get information about a ledger
* [createBulk](docs/sdks/v2/README.md#createbulk) - Bulk request
* [countAccounts](docs/sdks/v2/README.md#countaccounts) - Count the accounts from a ledger
* [listAccounts](docs/sdks/v2/README.md#listaccounts) - List accounts from a ledger
* [getAccount](docs/sdks/v2/README.md#getaccount) - Get account by its address
* [addMetadataToAccount](docs/sdks/v2/README.md#addmetadatatoaccount) - Add metadata to an account
* [deleteAccountMetadata](docs/sdks/v2/README.md#deleteaccountmetadata) - Delete metadata by key
* [readStats](docs/sdks/v2/README.md#readstats) - Get statistics from a ledger
* [countTransactions](docs/sdks/v2/README.md#counttransactions) - Count the transactions from a ledger
* [listTransactions](docs/sdks/v2/README.md#listtransactions) - List transactions from a ledger
* [createTransaction](docs/sdks/v2/README.md#createtransaction) - Create a new transaction to a ledger
* [getTransaction](docs/sdks/v2/README.md#gettransaction) - Get transaction from a ledger by its ID
* [addMetadataOnTransaction](docs/sdks/v2/README.md#addmetadataontransaction) - Set the metadata of a transaction by its ID
* [deleteTransactionMetadata](docs/sdks/v2/README.md#deletetransactionmetadata) - Delete metadata by key
* [revertTransaction](docs/sdks/v2/README.md#reverttransaction) - Revert a ledger transaction by its ID
* [getBalancesAggregated](docs/sdks/v2/README.md#getbalancesaggregated) - Get the aggregated balances from selected accounts
* [getVolumesWithBalances](docs/sdks/v2/README.md#getvolumeswithbalances) - Get list of volumes with balances for (account/asset)
* [listLogs](docs/sdks/v2/README.md#listlogs) - List the logs from a ledger
* [importLogs](docs/sdks/v2/README.md#importlogs)
* [exportLogs](docs/sdks/v2/README.md#exportlogs) - Export logs
* [listExporters](docs/sdks/v2/README.md#listexporters) - List exporters
* [createExporter](docs/sdks/v2/README.md#createexporter) - Create exporter
* [getExporterState](docs/sdks/v2/README.md#getexporterstate) - Get exporter state
* [deleteExporter](docs/sdks/v2/README.md#deleteexporter) - Delete exporter
* [listPipelines](docs/sdks/v2/README.md#listpipelines) - List pipelines
* [createPipeline](docs/sdks/v2/README.md#createpipeline) - Create pipeline
* [getPipelineState](docs/sdks/v2/README.md#getpipelinestate) - Get pipeline state
* [deletePipeline](docs/sdks/v2/README.md#deletepipeline) - Delete pipeline
* [resetPipeline](docs/sdks/v2/README.md#resetpipeline) - Reset pipeline
* [startPipeline](docs/sdks/v2/README.md#startpipeline) - Start pipeline
* [stopPipeline](docs/sdks/v2/README.md#stoppipeline) - Stop pipeline


### [payments.v1](docs/sdks/sdkpaymentsv1/README.md)

* [paymentsgetServerInfo](docs/sdks/sdkpaymentsv1/README.md#paymentsgetserverinfo) - Get server info
* [createPayment](docs/sdks/sdkpaymentsv1/README.md#createpayment) - Create a payment
* [listPayments](docs/sdks/sdkpaymentsv1/README.md#listpayments) - List payments
* [getPayment](docs/sdks/sdkpaymentsv1/README.md#getpayment) - Get a payment
* [updateMetadata](docs/sdks/sdkpaymentsv1/README.md#updatemetadata) - Update metadata
* [listTransferInitiations](docs/sdks/sdkpaymentsv1/README.md#listtransferinitiations) - List Transfer Initiations
* [createTransferInitiation](docs/sdks/sdkpaymentsv1/README.md#createtransferinitiation) - Create a TransferInitiation
* [getTransferInitiation](docs/sdks/sdkpaymentsv1/README.md#gettransferinitiation) - Get a transfer initiation
* [deleteTransferInitiation](docs/sdks/sdkpaymentsv1/README.md#deletetransferinitiation) - Delete a transfer initiation
* [updateTransferInitiationStatus](docs/sdks/sdkpaymentsv1/README.md#updatetransferinitiationstatus) - Update the status of a transfer initiation
* [reverseTransferInitiation](docs/sdks/sdkpaymentsv1/README.md#reversetransferinitiation) - Reverse a transfer initiation
* [retryTransferInitiation](docs/sdks/sdkpaymentsv1/README.md#retrytransferinitiation) - Retry a failed transfer initiation
* [listPools](docs/sdks/sdkpaymentsv1/README.md#listpools) - List Pools
* [createPool](docs/sdks/sdkpaymentsv1/README.md#createpool) - Create a Pool
* [getPool](docs/sdks/sdkpaymentsv1/README.md#getpool) - Get a Pool
* [deletePool](docs/sdks/sdkpaymentsv1/README.md#deletepool) - Delete a Pool
* [addAccountToPool](docs/sdks/sdkpaymentsv1/README.md#addaccounttopool) - Add an account to a pool
* [removeAccountFromPool](docs/sdks/sdkpaymentsv1/README.md#removeaccountfrompool) - Remove an account from a pool
* [getPoolBalances](docs/sdks/sdkpaymentsv1/README.md#getpoolbalances) - Get historical pool balances at a particular point in time
* [getPoolBalancesLatest](docs/sdks/sdkpaymentsv1/README.md#getpoolbalanceslatest) - Get latest pool balances
* [createAccount](docs/sdks/sdkpaymentsv1/README.md#createaccount) - Create an account
* [paymentslistAccounts](docs/sdks/sdkpaymentsv1/README.md#paymentslistaccounts) - List accounts
* [paymentsgetAccount](docs/sdks/sdkpaymentsv1/README.md#paymentsgetaccount) - Get an account
* [getAccountBalances](docs/sdks/sdkpaymentsv1/README.md#getaccountbalances) - Get account balances
* [createBankAccount](docs/sdks/sdkpaymentsv1/README.md#createbankaccount) - Create a BankAccount in Payments and on the PSP
* [listBankAccounts](docs/sdks/sdkpaymentsv1/README.md#listbankaccounts) - List bank accounts created by user on Formance
* [getBankAccount](docs/sdks/sdkpaymentsv1/README.md#getbankaccount) - Get a bank account created by user on Formance
* [forwardBankAccount](docs/sdks/sdkpaymentsv1/README.md#forwardbankaccount) - Forward a bank account to a connector
* [updateBankAccountMetadata](docs/sdks/sdkpaymentsv1/README.md#updatebankaccountmetadata) - Update metadata of a bank account
* [listAllConnectors](docs/sdks/sdkpaymentsv1/README.md#listallconnectors) - List all installed connectors
* [listConfigsAvailableConnectors](docs/sdks/sdkpaymentsv1/README.md#listconfigsavailableconnectors) - List the configs of each available connector
* [installConnector](docs/sdks/sdkpaymentsv1/README.md#installconnector) - Install a connector
* [~~uninstallConnector~~](docs/sdks/sdkpaymentsv1/README.md#uninstallconnector) - Uninstall a connector :warning: **Deprecated**
* [uninstallConnectorV1](docs/sdks/sdkpaymentsv1/README.md#uninstallconnectorv1) - Uninstall a connector
* [~~readConnectorConfig~~](docs/sdks/sdkpaymentsv1/README.md#readconnectorconfig) - Read the config of a connector :warning: **Deprecated**
* [updateConnectorConfigV1](docs/sdks/sdkpaymentsv1/README.md#updateconnectorconfigv1) - Update the config of a connector
* [readConnectorConfigV1](docs/sdks/sdkpaymentsv1/README.md#readconnectorconfigv1) - Read the config of a connector
* [~~resetConnector~~](docs/sdks/sdkpaymentsv1/README.md#resetconnector) - Reset a connector :warning: **Deprecated**
* [resetConnectorV1](docs/sdks/sdkpaymentsv1/README.md#resetconnectorv1) - Reset a connector
* [~~listConnectorTasks~~](docs/sdks/sdkpaymentsv1/README.md#listconnectortasks) - List tasks from a connector :warning: **Deprecated**
* [listConnectorTasksV1](docs/sdks/sdkpaymentsv1/README.md#listconnectortasksv1) - List tasks from a connector
* [~~getConnectorTask~~](docs/sdks/sdkpaymentsv1/README.md#getconnectortask) - Read a specific task of the connector :warning: **Deprecated**
* [getConnectorTaskV1](docs/sdks/sdkpaymentsv1/README.md#getconnectortaskv1) - Read a specific task of the connector
* [connectorsTransfer](docs/sdks/sdkpaymentsv1/README.md#connectorstransfer) - Transfer funds between Connector accounts

### [payments.v3](docs/sdks/v3/README.md)

* [createAccount](docs/sdks/v3/README.md#createaccount) - Create a formance account object. This object will not be forwarded to the connector. It is only used for internal purposes.

* [listAccounts](docs/sdks/v3/README.md#listaccounts) - List all accounts
* [getAccount](docs/sdks/v3/README.md#getaccount) - Get an account by ID
* [getAccountBalances](docs/sdks/v3/README.md#getaccountbalances) - Get account balances
* [createBankAccount](docs/sdks/v3/README.md#createbankaccount) - Create a formance bank account object. This object will not be forwarded to the connector until you called the forwardBankAccount method.

* [listBankAccounts](docs/sdks/v3/README.md#listbankaccounts) - List all bank accounts
* [getBankAccount](docs/sdks/v3/README.md#getbankaccount) - Get a Bank Account by ID
* [updateBankAccountMetadata](docs/sdks/v3/README.md#updatebankaccountmetadata) - Update a bank account's metadata
* [forwardBankAccount](docs/sdks/v3/README.md#forwardbankaccount) - Forward a Bank Account to a PSP for creation
* [listConnectors](docs/sdks/v3/README.md#listconnectors) - List all connectors
* [installConnector](docs/sdks/v3/README.md#installconnector) - Install a connector
* [listConnectorConfigs](docs/sdks/v3/README.md#listconnectorconfigs) - List all connector configurations
* [uninstallConnector](docs/sdks/v3/README.md#uninstallconnector) - Uninstall a connector
* [getConnectorConfig](docs/sdks/v3/README.md#getconnectorconfig) - Get a connector configuration by ID
* [v3UpdateConnectorConfig](docs/sdks/v3/README.md#v3updateconnectorconfig) - Update the config of a connector
* [resetConnector](docs/sdks/v3/README.md#resetconnector) - Reset a connector. Be aware that this will delete all data and stop all existing tasks like payment initiations and bank account creations.
* [listConnectorSchedules](docs/sdks/v3/README.md#listconnectorschedules) - List all connector schedules
* [getConnectorSchedule](docs/sdks/v3/README.md#getconnectorschedule) - Get a connector schedule by ID
* [listConnectorScheduleInstances](docs/sdks/v3/README.md#listconnectorscheduleinstances) - List all connector schedule instances
* [createPayment](docs/sdks/v3/README.md#createpayment) - Create a formance payment object. This object will not be forwarded to the connector. It is only used for internal purposes.

* [listPayments](docs/sdks/v3/README.md#listpayments) - List all payments
* [getPayment](docs/sdks/v3/README.md#getpayment) - Get a payment by ID
* [updatePaymentMetadata](docs/sdks/v3/README.md#updatepaymentmetadata) - Update a payment's metadata
* [initiatePayment](docs/sdks/v3/README.md#initiatepayment) - Initiate a payment
* [listPaymentInitiations](docs/sdks/v3/README.md#listpaymentinitiations) - List all payment initiations
* [deletePaymentInitiation](docs/sdks/v3/README.md#deletepaymentinitiation) - Delete a payment initiation by ID
* [getPaymentInitiation](docs/sdks/v3/README.md#getpaymentinitiation) - Get a payment initiation by ID
* [retryPaymentInitiation](docs/sdks/v3/README.md#retrypaymentinitiation) - Retry a payment initiation
* [approvePaymentInitiation](docs/sdks/v3/README.md#approvepaymentinitiation) - Approve a payment initiation
* [rejectPaymentInitiation](docs/sdks/v3/README.md#rejectpaymentinitiation) - Reject a payment initiation
* [reversePaymentInitiation](docs/sdks/v3/README.md#reversepaymentinitiation) - Reverse a payment initiation
* [listPaymentInitiationAdjustments](docs/sdks/v3/README.md#listpaymentinitiationadjustments) - List all payment initiation adjustments
* [listPaymentInitiationRelatedPayments](docs/sdks/v3/README.md#listpaymentinitiationrelatedpayments) - List all payments related to a payment initiation
* [createPaymentServiceUser](docs/sdks/v3/README.md#createpaymentserviceuser) - Create a formance payment service user object
* [listPaymentServiceUsers](docs/sdks/v3/README.md#listpaymentserviceusers) - List all payment service users
* [getPaymentServiceUser](docs/sdks/v3/README.md#getpaymentserviceuser) - Get a payment service user by ID
* [deletePaymentServiceUser](docs/sdks/v3/README.md#deletepaymentserviceuser) - Delete a payment service user by ID
* [deletePaymentServiceUserConnector](docs/sdks/v3/README.md#deletepaymentserviceuserconnector) - Remove a payment service user from a connector, the PSU will still exist in Formance
* [forwardPaymentServiceUserToProvider](docs/sdks/v3/README.md#forwardpaymentserviceusertoprovider) - Register/forward a payment service user on/to a connector
* [createLinkForPaymentServiceUser](docs/sdks/v3/README.md#createlinkforpaymentserviceuser) - Create an authentication link for a payment service user on a connector, for oauth flow
* [getPaymentServiceUserLinkAttemptFromConnectorID](docs/sdks/v3/README.md#getpaymentserviceuserlinkattemptfromconnectorid) - Get a link attempt for a payment service user on a connector
* [deletePaymentServiceUserConnectionFromConnectorID](docs/sdks/v3/README.md#deletepaymentserviceuserconnectionfromconnectorid) - Delete a connection for a payment service user on a connector
* [updateLinkForPaymentServiceUserOnConnector](docs/sdks/v3/README.md#updatelinkforpaymentserviceuseronconnector) - Update/Regenerate a link for a payment service user on a connector
* [addBankAccountToPaymentServiceUser](docs/sdks/v3/README.md#addbankaccounttopaymentserviceuser) - Add a bank account to a payment service user
* [forwardPaymentServiceUserBankAccount](docs/sdks/v3/README.md#forwardpaymentserviceuserbankaccount) - Forward a payment service user's bank account to a connector
* [createPool](docs/sdks/v3/README.md#createpool) - Create a formance pool object
* [listPools](docs/sdks/v3/README.md#listpools) - List all pools
* [getPool](docs/sdks/v3/README.md#getpool) - Get a pool by ID
* [deletePool](docs/sdks/v3/README.md#deletepool) - Delete a pool by ID
* [getPoolBalances](docs/sdks/v3/README.md#getpoolbalances) - Get historical pool balances from a particular point in time
* [getPoolBalancesLatest](docs/sdks/v3/README.md#getpoolbalanceslatest) - Get latest pool balances
* [addAccountToPool](docs/sdks/v3/README.md#addaccounttopool) - Add an account to a pool
* [removeAccountFromPool](docs/sdks/v3/README.md#removeaccountfrompool) - Remove an account from a pool
* [getTask](docs/sdks/v3/README.md#gettask) - Get a task and its result by ID


### [wallets.v1](docs/sdks/sdkwalletsv1/README.md)

* [walletsgetServerInfo](docs/sdks/sdkwalletsv1/README.md#walletsgetserverinfo) - Get server info
* [getTransactions](docs/sdks/sdkwalletsv1/README.md#gettransactions)
* [listWallets](docs/sdks/sdkwalletsv1/README.md#listwallets) - List all wallets
* [createWallet](docs/sdks/sdkwalletsv1/README.md#createwallet) - Create a new wallet
* [getWallet](docs/sdks/sdkwalletsv1/README.md#getwallet) - Get a wallet
* [updateWallet](docs/sdks/sdkwalletsv1/README.md#updatewallet) - Update a wallet
* [getWalletSummary](docs/sdks/sdkwalletsv1/README.md#getwalletsummary) - Get wallet summary
* [listBalances](docs/sdks/sdkwalletsv1/README.md#listbalances) - List balances of a wallet
* [createBalance](docs/sdks/sdkwalletsv1/README.md#createbalance) - Create a balance
* [getBalance](docs/sdks/sdkwalletsv1/README.md#getbalance) - Get detailed balance
* [debitWallet](docs/sdks/sdkwalletsv1/README.md#debitwallet) - Debit a wallet
* [creditWallet](docs/sdks/sdkwalletsv1/README.md#creditwallet) - Credit a wallet
* [getHolds](docs/sdks/sdkwalletsv1/README.md#getholds) - Get all holds for a wallet
* [getHold](docs/sdks/sdkwalletsv1/README.md#gethold) - Get a hold
* [confirmHold](docs/sdks/sdkwalletsv1/README.md#confirmhold) - Confirm a hold
* [voidHold](docs/sdks/sdkwalletsv1/README.md#voidhold) - Cancel a hold


### [reconciliation.v1](docs/sdks/sdkreconciliationv1/README.md)

* [reconciliationgetServerInfo](docs/sdks/sdkreconciliationv1/README.md#reconciliationgetserverinfo) - Get server info
* [createPolicy](docs/sdks/sdkreconciliationv1/README.md#createpolicy) - Create a policy
* [listPolicies](docs/sdks/sdkreconciliationv1/README.md#listpolicies) - List policies
* [deletePolicy](docs/sdks/sdkreconciliationv1/README.md#deletepolicy) - Delete a policy
* [getPolicy](docs/sdks/sdkreconciliationv1/README.md#getpolicy) - Get a policy
* [reconcile](docs/sdks/sdkreconciliationv1/README.md#reconcile) - Reconcile using a policy
* [listReconciliations](docs/sdks/sdkreconciliationv1/README.md#listreconciliations) - List reconciliations
* [getReconciliation](docs/sdks/sdkreconciliationv1/README.md#getreconciliation) - Get a reconciliation


### [orchestration.v1](docs/sdks/sdkorchestrationv1/README.md)

* [flowsgetServerInfo](docs/sdks/sdkorchestrationv1/README.md#flowsgetserverinfo) - Get server info
* [listTriggers](docs/sdks/sdkorchestrationv1/README.md#listtriggers) - List triggers
* [createTrigger](docs/sdks/sdkorchestrationv1/README.md#createtrigger) - Create trigger
* [readTrigger](docs/sdks/sdkorchestrationv1/README.md#readtrigger) - Read trigger
* [deleteTrigger](docs/sdks/sdkorchestrationv1/README.md#deletetrigger) - Delete trigger
* [listTriggersOccurrences](docs/sdks/sdkorchestrationv1/README.md#listtriggersoccurrences) - List triggers occurrences
* [listWorkflows](docs/sdks/sdkorchestrationv1/README.md#listworkflows) - List registered workflows
* [createWorkflow](docs/sdks/sdkorchestrationv1/README.md#createworkflow) - Create workflow
* [getWorkflow](docs/sdks/sdkorchestrationv1/README.md#getworkflow) - Get a flow by id
* [deleteWorkflow](docs/sdks/sdkorchestrationv1/README.md#deleteworkflow) - Delete a flow by id
* [runWorkflow](docs/sdks/sdkorchestrationv1/README.md#runworkflow) - Run workflow
* [listInstances](docs/sdks/sdkorchestrationv1/README.md#listinstances) - List instances of a workflow
* [getInstance](docs/sdks/sdkorchestrationv1/README.md#getinstance) - Get a workflow instance by id
* [sendEvent](docs/sdks/sdkorchestrationv1/README.md#sendevent) - Send an event to a running workflow
* [cancelEvent](docs/sdks/sdkorchestrationv1/README.md#cancelevent) - Cancel a running workflow
* [getInstanceHistory](docs/sdks/sdkorchestrationv1/README.md#getinstancehistory) - Get a workflow instance history by id
* [getInstanceStageHistory](docs/sdks/sdkorchestrationv1/README.md#getinstancestagehistory) - Get a workflow instance stage history

### [orchestration.v2](docs/sdks/sdkv2/README.md)

* [getServerInfo](docs/sdks/sdkv2/README.md#getserverinfo) - Get server info
* [listTriggers](docs/sdks/sdkv2/README.md#listtriggers) - List triggers
* [createTrigger](docs/sdks/sdkv2/README.md#createtrigger) - Create trigger
* [readTrigger](docs/sdks/sdkv2/README.md#readtrigger) - Read trigger
* [deleteTrigger](docs/sdks/sdkv2/README.md#deletetrigger) - Delete trigger
* [testTrigger](docs/sdks/sdkv2/README.md#testtrigger) - Test trigger
* [listTriggersOccurrences](docs/sdks/sdkv2/README.md#listtriggersoccurrences) - List triggers occurrences
* [listWorkflows](docs/sdks/sdkv2/README.md#listworkflows) - List registered workflows
* [createWorkflow](docs/sdks/sdkv2/README.md#createworkflow) - Create workflow
* [getWorkflow](docs/sdks/sdkv2/README.md#getworkflow) - Get a flow by id
* [deleteWorkflow](docs/sdks/sdkv2/README.md#deleteworkflow) - Delete a flow by id
* [runWorkflow](docs/sdks/sdkv2/README.md#runworkflow) - Run workflow
* [listInstances](docs/sdks/sdkv2/README.md#listinstances) - List instances of a workflow
* [getInstance](docs/sdks/sdkv2/README.md#getinstance) - Get a workflow instance by id
* [sendEvent](docs/sdks/sdkv2/README.md#sendevent) - Send an event to a running workflow
* [cancelEvent](docs/sdks/sdkv2/README.md#cancelevent) - Cancel a running workflow
* [getInstanceHistory](docs/sdks/sdkv2/README.md#getinstancehistory) - Get a workflow instance history by id
* [getInstanceStageHistory](docs/sdks/sdkv2/README.md#getinstancestagehistory) - Get a workflow instance stage history


### [webhooks.v1](docs/sdks/sdkwebhooksv1/README.md)

* [getManyConfigs](docs/sdks/sdkwebhooksv1/README.md#getmanyconfigs) - Get many configs
* [insertConfig](docs/sdks/sdkwebhooksv1/README.md#insertconfig) - Insert a new config
* [deleteConfig](docs/sdks/sdkwebhooksv1/README.md#deleteconfig) - Delete one config
* [updateConfig](docs/sdks/sdkwebhooksv1/README.md#updateconfig) - Update one config
* [testConfig](docs/sdks/sdkwebhooksv1/README.md#testconfig) - Test one config
* [activateConfig](docs/sdks/sdkwebhooksv1/README.md#activateconfig) - Activate one config
* [deactivateConfig](docs/sdks/sdkwebhooksv1/README.md#deactivateconfig) - Deactivate one config
* [changeConfigSecret](docs/sdks/sdkwebhooksv1/README.md#changeconfigsecret) - Change the signing secret of a config
<!-- End Available Resources and Operations [operations] -->

<!-- Start Retries [retries] -->
## Retries

Some of the endpoints in this SDK support retries.  If you use the SDK without any configuration, it will fall back to the default retry strategy provided by the API.  However, the default retry strategy can be overridden on a per-operation basis, or across the entire SDK.

To change the default retry strategy for a single API call, simply provide a retryConfig object to the call:
```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions({
        retries: {
            strategy: "backoff",
            backoff: {
                initialInterval: 1,
                maxInterval: 50,
                exponent: 1.1,
                maxElapsedTime: 100,
            },
            retryConnectionErrors: false,
        },
    });

    // Handle the result
    console.log(result);
}

run();

```

If you'd like to override the default retry strategy for all operations that support retries, you can provide a retryConfig at SDK initialization:
```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    retryConfig: {
        strategy: "backoff",
        backoff: {
            initialInterval: 1,
            maxInterval: 50,
            exponent: 1.1,
            maxElapsedTime: 100,
        },
        retryConnectionErrors: false,
    },
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions();

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Retries [retries] -->

<!-- Start Error Handling [errors] -->
## Error Handling

All SDK methods return a response object or throw an error. If Error objects are specified in your OpenAPI Spec, the SDK will throw the appropriate Error type.

| Error Object           | Status Code            | Content Type           |
| ---------------------- | ---------------------- | ---------------------- |
| errors.V2ErrorResponse | 5XX                    | application/json       |
| errors.SDKError        | 4xx-5xx                | */*                    |

Validation errors can also occur when either method arguments or data returned from the server do not match the expected format. The `SDKValidationError` that is thrown as a result will capture the raw value that failed validation in an attribute called `rawValue`. Additionally, a `pretty()` method is available on this error that can be used to log a nicely formatted string since validation errors can list many issues and the plain error string may be difficult read when debugging. 


```typescript
import { SDK } from "openapi";
import { SDKValidationError } from "openapi/models/errors";

const sdk = new SDK({
    security: {
        clientID: "",
    },
});

async function run() {
    let result;
    try {
        result = await sdk.ledger.getInfo();
    } catch (err) {
        switch (true) {
            case err instanceof SDKValidationError: {
                // Validation errors can be pretty-printed
                console.error(err.pretty());
                // Raw value may also be inspected
                console.error(err.rawValue);
                return;
            }
            case err instanceof errors.V2ErrorResponse: {
                console.error(err); // handle exception
                return;
            }
            default: {
                throw err;
            }
        }
    }

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Error Handling [errors] -->

<!-- Start Server Selection [server] -->
## Server Selection

### Select Server by Index

You can override the default server globally by passing a server index to the `serverIdx` optional parameter when initializing the SDK client instance. The selected server will then be used as the default on the operations that use it. This table lists the indexes associated with the available servers:

| # | Server | Variables |
| - | ------ | --------- |
| 0 | `http://localhost` | None |
| 1 | `https://{organization}.{environment}.formance.cloud` | `organization` (default is `orgID-stackID`), `environment` (default is `eu.sandbox`) |

```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    serverIdx: 1,
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions();

    // Handle the result
    console.log(result);
}

run();

```

#### Variables

Some of the server options above contain variables. If you want to set the values of those variables, the following optional parameters are available when initializing the SDK client instance:
 * `organization: string`
 * `environment: models.ServerEnvironment`

### Override Server URL Per-Client

The default server can also be overridden globally by passing a URL to the `serverURL` optional parameter when initializing the SDK client instance. For example:

```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    serverURL: "http://localhost",
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions();

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Server Selection [server] -->

<!-- Start Custom HTTP Client [http-client] -->
## Custom HTTP Client

The TypeScript SDK makes API calls using an `HTTPClient` that wraps the native
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This
client is a thin wrapper around `fetch` and provides the ability to attach hooks
around the request lifecycle that can be used to modify the request or handle
errors and response.

The `HTTPClient` constructor takes an optional `fetcher` argument that can be
used to integrate a third-party HTTP client or when writing tests to mock out
the HTTP client and feed in fixtures.

The following example shows how to use the `"beforeRequest"` hook to to add a
custom header and a timeout to requests and how to use the `"requestError"` hook
to log errors:

```typescript
import { SDK } from "openapi";
import { HTTPClient } from "openapi/lib/http";

const httpClient = new HTTPClient({
  // fetcher takes a function that has the same signature as native `fetch`.
  fetcher: (request) => {
    return fetch(request);
  }
});

httpClient.addHook("beforeRequest", (request) => {
  const nextRequest = new Request(request, {
    signal: request.signal || AbortSignal.timeout(5000)
  });

  nextRequest.headers.set("x-custom-header", "custom value");

  return nextRequest;
});

httpClient.addHook("requestError", (error, request) => {
  console.group("Request Error");
  console.log("Reason:", `${error}`);
  console.log("Endpoint:", `${request.method} ${request.url}`);
  console.groupEnd();
});

const sdk = new SDK({ httpClient });
```
<!-- End Custom HTTP Client [http-client] -->

<!-- Start Authentication [security] -->
## Authentication

### Per-Client Security Schemes

This SDK supports the following security schemes globally:

| Name           | Type           | Scheme         |
| -------------- | -------------- | -------------- |
| `clientID`     | oauth2         | OAuth2 token   |
| `clientSecret` | oauth2         | OAuth2 token   |

You can set the security parameters through the `security` optional parameter when initializing the SDK client instance. The selected scheme will be used by default to authenticate with the API for all operations that support it. For example:
```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions();

    // Handle the result
    console.log(result);
}

run();

```
<!-- End Authentication [security] -->

<!-- Start File uploads [file-upload] -->
## File uploads

Certain SDK methods accept files as part of a multi-part request. It is possible and typically recommended to upload files as a stream rather than reading the entire contents into memory. This avoids excessive memory consumption and potentially crashing with out-of-memory errors when working with very large files. The following example demonstrates how to attach a file stream to a request.

> [!TIP]
>
> Depending on your JavaScript runtime, there are convenient utilities that return a handle to a file without reading the entire contents into memory:
>
> - **Node.js v20+:** Since v20, Node.js comes with a native `openAsBlob` function in [`node:fs`](https://nodejs.org/docs/latest-v20.x/api/fs.html#fsopenasblobpath-options).
> - **Bun:** The native [`Bun.file`](https://bun.sh/docs/api/file-io#reading-files-bun-file) function produces a file handle that can be used for streaming file uploads.
> - **Browsers:** All supported browsers return an instance to a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) when reading the value from an `<input type="file">` element.
> - **Node.js v18:** A file stream can be created using the `fileFrom` helper from [`fetch-blob/from.js`](https://www.npmjs.com/package/fetch-blob).

```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.ledger.v2.importLogs({
        ledger: "ledger001",
        requestBody: new TextEncoder().encode("0xeaCf7fa2e6"),
    });

    // Handle the result
    console.log(result);
}

run();

```
<!-- End File uploads [file-upload] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->

# Development

## Maturity

This SDK is in beta, and there may be breaking changes between versions without a major version update. Therefore, we recommend pinning usage
to a specific package version. This way, you can install the same version each time without breaking changes unless you are intentionally
looking for the latest version.

## Contributions

While we value open-source contributions to this SDK, this library is generated programmatically. Any manual changes added to internal files will be overwritten on the next generation. 
We look forward to hearing your feedback. Feel free to open a PR or an issue with a proof of concept and we'll do our best to include it in a future release. 

### SDK Created by [Speakeasy](https://www.speakeasy.com/?utm_source=<no value>&utm_campaign=typescript)
