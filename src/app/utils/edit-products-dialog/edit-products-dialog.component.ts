import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-edit-products-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-products-dialog.component.html',
  styleUrl: './edit-products-dialog.component.scss'
})
export class EditProductsDialogComponent {
  productForm: FormGroup;
  storeId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product, categories: Category[] },
    private fb: FormBuilder,
    private productService: ProductService,
    private menuService: MenuService
  ) {
    this.productForm = this.fb.group({
      name: [data.product.name, Validators.required],
      description: [data.product.description, Validators.required],
      imgUrl: [data.product.imgUrl, Validators.required],
      displayOrder: [data.product.displayOrder, Validators.required],
      isEnabled: [data.product.isEnabled],
      isUpSelling: [data.product.isUpSelling],
      categoryId: [data.product.category.id, [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }

  ngOnInit(): void {
    // Obtener el storeId del producto original
    this.storeId = this.data.product.store?.id || this.menuService.getStoreIdFromLocalStorage();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid && this.storeId) {
      const updatedProduct: Product = {
        ...this.data.product,
        ...this.productForm.value,
        category: {
          ...this.data.product.category,
          id: Number(this.productForm.value.categoryId) // Asegurarse de que sea un número
        },
        store: {
          ...this.data.product.store,
          id: this.storeId
        }
      };

      this.productService.updateProduct(updatedProduct).subscribe(response => {
        console.log('Product updated:', response);
        this.dialogRef.close(response);
      });
    } else {
      console.error('Store ID is missing or form is invalid');
    }
  }
}