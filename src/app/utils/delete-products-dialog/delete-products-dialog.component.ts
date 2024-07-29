import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-products-dialog',
  standalone: true,
  imports: [
    MatDialogModule,

  ],
  templateUrl: './delete-products-dialog.component.html',
  styleUrl: './delete-products-dialog.component.scss'
})
export class DeleteProductsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}