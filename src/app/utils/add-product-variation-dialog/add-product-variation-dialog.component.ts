import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { MenuService } from '../services/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product-variation-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-product-variation-dialog.component.html',
  styleUrl: './add-product-variation-dialog.component.scss'
})
export class AddProductVariationDialogComponent {
  variationForm: FormGroup;
  categories: Category[] = [];
  products: Product[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProductVariationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.variationForm = this.fb.group({
      categoryId: [null, Validators.required],
      productId: [null, Validators.required],
      options: this.fb.array([]),
      isEnabled: [true],
      displayOrder: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categories = this.data.categories;
  }

  get options(): FormArray {
    return this.variationForm.get('options') as FormArray;
  }

  getCharacteristics(optionIndex: number): FormArray {
    return this.options.at(optionIndex).get('characteristics') as FormArray;
  }

  addOption(): void {
    const optionGroup = this.fb.group({
      name: ['', Validators.required],
      basePrice: ['', Validators.required],
      characteristics: this.fb.array([])
    });
    this.options.push(optionGroup);
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  addCharacteristic(optionIndex: number): void {
    const characteristics = this.getCharacteristics(optionIndex);
    const characteristicGroup = this.fb.group({
      name: ['', Validators.required],
      extraPrice: ['', Validators.required]
    });
    characteristics.push(characteristicGroup);
  }

  removeCharacteristic(optionIndex: number, characteristicIndex: number): void {
    const characteristics = this.getCharacteristics(optionIndex);
    characteristics.removeAt(characteristicIndex);
  }

  onCategoryChange(): void {
    const categoryId = this.variationForm.get('categoryId')!.value;
    if (categoryId) {
      this.productService.getProductsByCategory(categoryId).subscribe(
        products => {
          this.products = products;
        },
        error => {
          console.error('Error loading products for selected category', error);
        }
      );
    } else {
      this.products = [];
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSave(): Promise<void> {
    if (this.variationForm.valid) {
      const productId = this.variationForm.get('productId')!.value;
      const options = this.variationForm.value.options;

      // Crear opciones y características
      const optionRequests = options.map(async (option: any) => {
        const characteristicRequests = option.characteristics.map((characteristic: any) =>
          this.productService.createCharacteristic(characteristic).toPromise()
        );

        const characteristics = await Promise.all(characteristicRequests);
        const characteristicIds = characteristics.map((c: any) => c.id);
        const createdOption = await this.productService.createOption({ ...option, characteristicIds }).toPromise();
        return createdOption;
      });

      const createdOptions = await Promise.all(optionRequests);
      const optionIds = createdOptions.map((option: any) => option.id);
      const variationPayload = {
        isEnabled: this.variationForm.get('isEnabled')!.value,
        displayOrder: this.variationForm.get('displayOrder')!.value,
        optionIds
      };

      this.productService.createProductVariation(productId, variationPayload).subscribe(
        response => {
          console.log('Product variation created:', response);
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error creating product variation', error);
        }
      );
    }
  }
}