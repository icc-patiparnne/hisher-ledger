import * as components from '@platform/sdks/formance/src/models/components';
import { Cursor } from '@platform/sdks/utils/cursor';
import {
  NormalizedInstanceModel,
  NormalizedTriggerModel,
  NormalizedTriggerOccurrenceModel,
  NormalizedWorkflowModel,
} from './models';

export type NormalizedListWorkflowsResponse =
  | components.V2Error
  | {
      cursor: Cursor<NormalizedWorkflowModel>;
    };

export type NormalizedListInstancesResponse =
  | components.V2Error
  | {
      cursor: Cursor<NormalizedInstanceModel>;
    };

export type NormalizedGetWorkflowResponse =
  | components.V2Error
  | {
      data: NormalizedWorkflowModel;
    };

export type NormalizedGetInstanceResponse =
  | components.V2Error
  | {
      data: NormalizedInstanceModel;
    };

export type NormalizedListTriggerResponse =
  | components.V2Error
  | {
      cursor: Cursor<NormalizedTriggerModel>;
    };

export type NormalizedListTriggerOccurrencesResponse =
  | components.V2Error
  | {
      cursor: Cursor<NormalizedTriggerOccurrenceModel>;
    };

export type NormalizedGetTriggerResponse =
  | components.V2Error
  | {
      data: NormalizedTriggerModel;
    };
