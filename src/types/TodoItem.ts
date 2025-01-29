export interface TodoItemType {
  item: { text: string; completed: boolean };
  index: number;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  isEditing: boolean;
  handleToggleCompleted: (index: number) => void;
}
