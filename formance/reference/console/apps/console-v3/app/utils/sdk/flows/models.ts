export type NormalizedWorkflowConfigModel = {
  name?: string | undefined;
  stages: Array<{ [k: string]: any }>;
};
export type NormalizedWorkflowModel = {
  config: NormalizedWorkflowConfigModel;
  createdAt: Date;
  updatedAt: Date;
  id: string;
};

export type NormalizedInstanceStageStatusModel = {
  stage: number;
  instanceID: string;
  startedAt: Date;
  terminatedAt?: Date | undefined;
  error?: string | undefined;
};

export type NormalizedInstanceModel = {
  workflowID: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status?: Array<NormalizedInstanceStageStatusModel> | undefined;
  terminated: boolean;
  terminatedAt?: Date | undefined;
  error?: string | undefined;
  workflow?: NormalizedWorkflowModel;
};

export type NormalizedTriggerModel = {
  event: string;
  workflowID: string;
  filter?: string | undefined;
  vars?: { [k: string]: any } | undefined;
  name?: string | undefined;
  id: string;
  createdAt: Date;
};

export type NormalizedTriggerOccurrenceModel = {
  date: Date;
  workflowInstanceID?: string | undefined;
  workflowInstance?: NormalizedInstanceModel | undefined;
  triggerID: string;
  error?: string | undefined;
  event: { [k: string]: any };
};
