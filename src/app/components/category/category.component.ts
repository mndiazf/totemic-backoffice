import { Component, Input, SimpleChanges } from '@angular/core';
import { Category } from '../../utils/models/category';
import { MenuService } from '../../utils/services/menu.service';
import { catchError, of, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryDialogComponent } from '../../utils/category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryDialogComponent } from '../../utils/add-category-dialog/add-category-dialog.component';
import { EditCategoryDialogComponent } from '../../utils/edit-category-dialog/edit-category-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../utils/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  categories: Category[] = [];
  errorMessage: string | null = null;
  selectedStoreId: string | null = null;
  private storeIdSubscription!: Subscription;

  constructor(private menuService: MenuService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.storeIdSubscription = this.menuService.selectedStoreId$.subscribe(storeId => {
      this.selectedStoreId = storeId;
      if (storeId) {
        this.loadCategories(storeId);
      } else {
        this.categories = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.storeIdSubscription) {
      this.storeIdSubscription.unsubscribe();
    }
  }

  loadCategories(storeId: string): void {
    this.menuService.getCategories(storeId).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading categories';
        console.error('Error loading categories:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.categories = data.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);
    });
  }

  toggleCategoryEnabled(category: Category, event: any): void {
    const isEnabled = event.target.value === 'true';
    const updatedCategory = { ...category, isEnabled };
    console.log(`Updating category ${category.title}, new isEnabled: ${updatedCategory.isEnabled}`);

    // Update the category on the server
    this.menuService.updateCategory(updatedCategory).pipe(
      catchError(error => {
        this.errorMessage = 'Error updating category';
        console.error('Error updating category:', error);
        return of(null); // Return null to avoid breaking the stream
      })
    ).subscribe(response => {
      if (response) {
        // Update the category in the local state
        const index = this.categories.findIndex(cat => cat.id === response.id);
        if (index !== -1) {
          this.categories[index] = response;
        }
        console.log(`Category ${response.title} updated successfully, isEnabled: ${response.isEnabled}`);
      } else {
        console.log('Failed to update category on server.');
      }
    });
  }

  openSortDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: [...this.categories] // Pasar una copia de las categorías
    });

    dialogRef.afterClosed().subscribe((result: Category[] | undefined) => {
      if (result) {
        this.categories = result.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);
        // Aquí podrías enviar los cambios al backend
        console.log('Updated categories:', this.categories);
      }
    });
  }

  openAddCategoryDialog(): void {
    if (!this.selectedStoreId) return;
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      data: { categories: this.categories, storeId: this.selectedStoreId },
      height: '720px', // Altura del diálogo
      width: '300px', // Ancho del diálogo
      disableClose: true
    });


    dialogRef.afterClosed().subscribe((newCategory: Category | undefined) => {
      if (newCategory) {
        this.categories.push(newCategory);
        this.categories.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);
      }
    });
  }

  openEditCategoryDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: { category },
      width: '300px', // Ancho del diálogo
      disableClose: true
    
    });

    dialogRef.afterClosed().subscribe((updatedCategory: Category | undefined) => {
      if (updatedCategory) {
        const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
          this.categories.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);
        }
      }
    });
  }

  openDeleteCategoryDialog(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { title: category.title }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.menuService.deleteCategory(category.id).subscribe(() => {
          this.categories = this.categories.filter(cat => cat.id !== category.id);
          this.categories.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder);
        });
      }
    });
  }
}