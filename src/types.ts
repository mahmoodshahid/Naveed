export interface ExpenseItem {
  id: string;
  name: string;
}

export interface ExpenseState {
  [key: string]: {
    checked: boolean;
    amount: string;
  };
}
