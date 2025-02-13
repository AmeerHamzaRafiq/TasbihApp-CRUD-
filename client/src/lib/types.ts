export interface Counter {
  id: string;
  title: string;
  count: number;
  current: number;
}

export interface EditCounterFormData {
  title: string;
  count: number;
}
