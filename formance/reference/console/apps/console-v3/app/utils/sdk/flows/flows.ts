import { SDK } from '@platform/sdks/formance/src/sdk';
import { RequestOptions } from '@platform/sdks/formance/src/lib/sdks';

import { NormalizedSDK } from '../sdk';
import {
  NormalizedGetInstanceRequest,
  NormalizedGetTriggerRequest,
  NormalizedGetWorkflowRequest,
  NormalizedListInstancesRequest,
  NormalizedListTriggerOccurencesRequest,
  NormalizedListTriggerRequest,
  NormalizedListWorkflowsRequest,
} from './requests';
import {
  NormalizedGetInstanceResponse,
  NormalizedGetTriggerResponse,
  NormalizedGetWorkflowResponse,
  NormalizedListInstancesResponse,
  NormalizedListTriggerOccurrencesResponse,
  NormalizedListTriggerResponse,
  NormalizedListWorkflowsResponse,
} from './responses';

export class NormalizedFlows {
  sdk: SDK;
  normalizedSDK: NormalizedSDK;
  version: string;

  constructor(sdk: SDK, version: string, normalizedSDK: NormalizedSDK) {
    this.normalizedSDK = normalizedSDK;
    this.version = version;
    this.sdk = sdk;
  }

  async listWorkflows(
    request: NormalizedListWorkflowsRequest,
    options?: RequestOptions
  ): Promise<NormalizedListWorkflowsResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.listWorkflows(request, options);
      }
    }
  }

  async getWorkflow(
    request: NormalizedGetWorkflowRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetWorkflowResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.getWorkflow(request, options);
      }
    }
  }

  async getInstance(
    request: NormalizedGetInstanceRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetInstanceResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.getInstance(request, options);
      }
    }
  }

  async listInstances(
    request: NormalizedListInstancesRequest,
    options?: RequestOptions
  ): Promise<NormalizedListInstancesResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.listInstances(request, options);
      }
    }
  }

  async getTrigger(
    request: NormalizedGetTriggerRequest,
    options?: RequestOptions
  ): Promise<NormalizedGetTriggerResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.readTrigger(request, options);
      }
    }
  }

  async listTriggerOccurrences(
    request: NormalizedListTriggerOccurencesRequest,
    options?: RequestOptions
  ): Promise<NormalizedListTriggerOccurrencesResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.listTriggersOccurrences(
          request,
          options
        );
      }
    }
  }

  async listTriggers(
    request: NormalizedListTriggerRequest,
    options?: RequestOptions
  ): Promise<NormalizedListTriggerResponse> {
    switch (this.version) {
      default: {
        return this.sdk.orchestration.v2.listTriggers(request, options);
      }
    }
  }
}
