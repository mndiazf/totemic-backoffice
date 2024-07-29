import { Component } from '@angular/core';
import { Product } from '../../utils/models/product';
import { ProductService } from '../../utils/services/product.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Category } from '../../utils/models/category';
import { MenuService } from '../../utils/services/menu.service';
import { FormsModule } from '@angular/forms';
import { AddProductVariationDialogComponent } from '../../utils/add-product-variation-dialog/add-product-variation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-product-variation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-variation.component.html',
  styleUrl: './product-variation.component.scss'
})
export class ProductVariationComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedProduct: Product | null = null;
  variations: any[] = [];
  searchTerm: string = '';
  selectedCategoryId: string = '';
  selectedStoreId: string | null = null;
  errorMessage: string = '';

  constructor(private productService: ProductService, private menuService: MenuService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.menuService.selectedStoreId$.subscribe(storeId => {
      this.selectedStoreId = storeId;
      if (storeId) {
        this.loadProductsWithVariations(storeId);
        this.loadCategories(storeId);
      } else {
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
      }
    });
  }

  loadProductsWithVariations(storeId: string): void {
    this.productService.getProductsWithVariations().pipe(
      catchError(error => {
        this.errorMessage = 'Error loading products';
        console.error('Error loading products:', error);
        return of([]);
      })
    ).subscribe(products => {
      this.products = products.filter(product => product.store.id === storeId);
      this.filterProducts();
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

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearchTerm = this.searchTerm === '' || product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategoryId === '' || product.category.id.toString() === this.selectedCategoryId;
      return matchesSearchTerm && matchesCategory;
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.productService.getProductVariations(product.id).subscribe(
      variations => {
        this.variations = variations;
      },
      error => {
        this.errorMessage = 'Error loading product variations';
        console.error('Error loading product variations:', error);
      }
    );
  }

  openAddProductVariationDialog(): void {
    const dialogRef = this.dialog.open(AddProductVariationDialogComponent, {
      width: '600px',
      data: { categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProductsWithVariations(this.selectedStoreId!);
      }
    });
  }
}