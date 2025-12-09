export type NormalizedListWorkflowsRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
};
export type NormalizedGetWorkflowRequest = {
  flowId: string;
};
export type NormalizedListInstancesRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  workflowID?: string | undefined;
  running?: boolean | undefined;
};
export type NormalizedGetInstanceRequest = {
  instanceID: string;
};

export type NormalizedListTriggerRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  name?: string | undefined;
};
export type NormalizedListTriggerOccurencesRequest = {
  pageSize?: number | undefined;
  cursor?: string | undefined;
  name?: string | undefined;
  triggerID: string;
};
export type NormalizedGetTriggerRequest = {
  triggerID: string;
};
