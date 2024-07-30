import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-variation-dialog',
  standalone: true,
  imports: [
    MatDialogModule,

  ],
  templateUrl: './delete-variation-dialog.component.html',
  styleUrl: './delete-variation-dialog.component.scss'
})
export class DeleteVariationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteVariationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}