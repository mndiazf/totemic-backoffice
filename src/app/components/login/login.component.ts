import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../utils/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { SuccessDialogComponent } from '../../utils/success-dialog/success-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          console.log('Login successful', response);
          this.errorMessage = null; // Clear error message on success
          this.openSuccessDialog();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = 'Authentication failed. Please check your username and password.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      );
    }
  }


  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      height: '200px', // Altura del diálogo
      width: '400px', // Ancho del diálogo
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/home']); // Redirige a la página de inicio
    });
  }

}