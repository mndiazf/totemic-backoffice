import { Category } from './category';
import { Store } from './store';

export interface Product {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  displayOrder: number;
  store: Store;
  category: Category;
  isEnabled: boolean;
  isUpSelling: boolean;
}