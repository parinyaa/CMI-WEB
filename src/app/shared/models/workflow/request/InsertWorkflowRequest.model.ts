export class InsertWorkflowRequest {

  workflowTypeId: number;
  frequency: number;
  durationCode: string;
  extendedDate: Date;
  note: string;
  decisionNote: string;
  decisionBy: string;
  assignTo: string;
  yearTerm: number;
  monthTerm: number;
  dataMatrixId: number;
  creatorUrl: string;
  assignUrl: string;
  baseYearId: number;
  cpaId: number;
}
