import { Component } from '@angular/core';
import { Product } from '../../utils/models/product';
import { Category } from '../../utils/models/category';
import { ProductService } from '../../utils/services/product.service';
import { MenuService } from '../../utils/services/menu.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SortProductsDialogComponent } from '../../utils/sort-products-dialog/sort-products-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddProductsDialogComponent } from '../../utils/add-products-dialog/add-products-dialog.component';
import { EditProductsDialogComponent } from '../../utils/edit-products-dialog/edit-products-dialog.component';
import { DeleteProductsDialogComponent } from '../../utils/delete-products-dialog/delete-products-dialog.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedStoreId: string | null = null;
  errorMessage: string = '';

  constructor(private productService: ProductService, private menuService: MenuService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.menuService.selectedStoreId$.subscribe(storeId => {
      this.selectedStoreId = storeId;
      if (storeId) {
        this.loadProducts(storeId);
        this.loadCategories(storeId);
      }
    });
  }

  loadProducts(storeId: string): void {
    this.productService.getProductsByStore(storeId).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading products';
        console.error('Error loading products:', error);
        return of([]);
      })
    ).subscribe(products => {
      this.products = products.sort((a, b) => a.displayOrder - b.displayOrder);
      this.filteredProducts = [...this.products];
    });
  }

  loadCategories(storeId: string): void {
    this.menuService.getCategories(storeId).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading categories';
        console.error('Error loading categories:', error);
        return of([]);
      })
    ).subscribe(categories => {
      this.categories = categories;
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      return (this.searchTerm === '' || product.name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
             (this.selectedCategory === '' || product.category.id.toString() === this.selectedCategory);
    }).sort((a, b) => a.displayOrder - b.displayOrder);
  }

  toggleProductEnabled(product: Product, event: any) {
    product.isEnabled = event.target.value === 'true';
    this.productService.updateProduct(product).subscribe(response => {
      console.log(`Product ${response.name} updated successfully, isEnabled: ${response.isEnabled}`);
    });
  }

  toggleProductUpSelling(product: Product, event: any) {
    product.isUpSelling = event.target.value === 'true';
    this.productService.updateProduct(product).subscribe(response => {
      console.log(`Product ${response.name} updated successfully, isUpSelling: ${response.isUpSelling}`);
    });
  }
  
  openSortProductsDialog(): void {
    const dialogRef = this.dialog.open(SortProductsDialogComponent, {
      width: '600px',
      data: { products: this.filteredProducts, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe((result: Product[]) => {
      if (result) {
        this.filteredProducts = result;
        this.products = [...result];  // Actualiza también la lista original de productos
      }
    });
  }

  openAddProductDialog(): void {
    if (!this.selectedStoreId) return;

    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '600px',
      data: { categories: this.categories, storeId: this.selectedStoreId, products: this.products }
    });

    dialogRef.afterClosed().subscribe((result: Product) => {
      if (result) {
        this.products.push(result);
        this.filterProducts();
      }
    });
  }

  openEditProductDialog(product: Product) {
    const dialogRef = this.dialog.open(EditProductsDialogComponent, {
      width: '600px',
      data: { product: product, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe((result: Product) => {
      if (result) {
        // Actualiza la lista de productos con el producto editado
        const index = this.products.findIndex(p => p.id === result.id);
        if (index !== -1) {
          this.products[index] = result;
          this.filterProducts();
        }
      }
    });
  }

  openDeleteProductDialog(product: Product) {
    const dialogRef = this.dialog.open(DeleteProductsDialogComponent, {
      width: '400px',
      data: { name: product.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.filterProducts();
        }, error => {
          this.errorMessage = 'Error deleting product';
        });
      }
    });
  }
}