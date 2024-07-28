import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MenuService } from '../services/menu.service';
import { Category } from '../models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-category-dialog.component.html',
  styleUrl: './edit-category-dialog.component.scss'
})
export class EditCategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: Category },
    private fb: FormBuilder,
    private menuService: MenuService
  ) {
    this.categoryForm = this.fb.group({
      title: [data.category.title, Validators.required],
      description: [data.category.description, Validators.required],
      imageUrl: [data.category.imageUrl, Validators.required],
      isEnabled: [data.category.isEnabled],
      showTotem: [data.category.showTotem]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        ...this.data.category,
        ...this.categoryForm.value
      };

      this.menuService.updateCategory(updatedCategory).subscribe(response => {
        console.log('Category updated:', response);
        this.dialogRef.close(response);
      });
    }
  }
}