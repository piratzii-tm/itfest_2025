export interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  store: string;
  date: string;
  items: Item[];
  total: number;
}
