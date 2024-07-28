import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../models/category';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    DragDropModule
  ],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public categories: Category[],
    private menuService: MenuService
  ) {}

  onDrop(event: CdkDragDrop<Category[]>): void {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.updateOrderIndexes();
  }

  updateOrderIndexes(): void {
    this.categories.forEach((category, index) => {
      category.displayOrder = index + 1; // Ajustar el índice según el nuevo orden
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Aquí podrías enviar los cambios al backend
    this.categories.forEach(category => {
      this.menuService.updateCategory(category).subscribe(response => {
        console.log(`Category ${response.title} updated successfully, displayOrder: ${response.displayOrder}`);
      });
    });
    this.dialogRef.close(this.categories);
  }
}