export interface TodoType {
  text: string;
  completed: boolean;
}

export interface CurrentTodoType {
  index: number | null;
  text: string | number;
}
