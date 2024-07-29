import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../models/category';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-add-products-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-products-dialog.component.html',
  styleUrl: './add-products-dialog.component.scss'
})
export class AddProductsDialogComponent {
  productForm: FormGroup;
  storeId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[], products: Product[] },
    private fb: FormBuilder,
    private productService: ProductService,
    private menuService: MenuService // Inyectamos el MenuService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imgUrl: ['', Validators.required],
      displayOrder: [1, Validators.required], // This will be updated in ngOnInit
      isEnabled: [true],
      isUpSelling: [false],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtener el storeId del MenuService
    this.storeId = this.menuService.getStoreIdFromLocalStorage();

    // Calculate the displayOrder based on the current list of products
    const maxDisplayOrder = this.data.products.length > 0 
      ? Math.max(...this.data.products.map(p => p.displayOrder)) 
      : 0;
    this.productForm.get('displayOrder')?.setValue(maxDisplayOrder + 1);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid && this.storeId) { // Verificamos si storeId está presente
      const newProduct = {
        ...this.productForm.value,
        storeId: this.storeId
      };

      this.productService.createProduct(newProduct).subscribe(response => {
        console.log('Product created:', response);
        this.dialogRef.close(response);
      });
    } else {
      console.error('Store ID is missing');
    }
  }
}