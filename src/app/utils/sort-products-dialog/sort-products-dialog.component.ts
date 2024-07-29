import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../models/product';
import { MenuService } from '../services/menu.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Category } from '../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-sort-products-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    DragDropModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sort-products-dialog.component.html',
  styleUrl: './sort-products-dialog.component.scss'
})
export class SortProductsDialogComponent {
  selectedCategory: string = '';
  filteredProducts: Product[] = [];

  constructor(
    public dialogRef: MatDialogRef<SortProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { products: Product[], categories: Category[] },
    private productService: ProductService
  ) {
    this.filteredProducts = [...data.products];
    this.sortProducts();
  }

  onDrop(event: CdkDragDrop<Product[]>): void {
    moveItemInArray(this.filteredProducts, event.previousIndex, event.currentIndex);
    this.updateOrderIndexes();
  }

  updateOrderIndexes(): void {
    this.filteredProducts.forEach((product, index) => {
      product.displayOrder = index + 1;
    });
  }

  filterProductsByCategory(): void {
    this.filteredProducts = this.data.products.filter(product => {
      return this.selectedCategory === '' || product.category.id.toString() === this.selectedCategory;
    });
    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.filteredProducts.forEach(product => {
      this.productService.updateProduct(product).subscribe(response => {
        console.log(`Product ${response.name} updated successfully, displayOrder: ${response.displayOrder}`);
      });
    });
    this.dialogRef.close(this.filteredProducts);
  }
}