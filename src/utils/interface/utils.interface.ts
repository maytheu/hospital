interface QueryOptions {
  $regex: string;
  $options: string;
}

export interface LabObj {
  name: QueryOptions;
  result: QueryOptions;
  description: QueryOptions;
  sort: string;
  page: string;
  limit: string;
  patient: string;
  conductedBy: string;
}

export interface MedObj {
  treatment: QueryOptions;
  duration: QueryOptions;
  frequency: QueryOptions;
  drugsAndDosage: QueryOptions;
  sort: string;
  page: string;
  limit: string;
  patient: string;
  conductedBy: string;
}

export interface SurObj {
  name: QueryOptions;
  description: QueryOptions;
  result: QueryOptions;
  sort: string;
  page: string;
  limit: string;
  patient: string;
  conductedBy: string;
}
