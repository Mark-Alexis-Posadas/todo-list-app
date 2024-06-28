export interface TodoItemType {
  item: string;
  index: number;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  isEditing: boolean;
}
