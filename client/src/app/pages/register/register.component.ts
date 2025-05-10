import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatInput,
    MatButtonModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardTitle,
    MatCardContent,
    MatDialogModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registrationForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
        ),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  get isFormValid(): boolean {
    return this.registrationForm.valid;
  }

  register() {
    if (this.registrationForm.invalid) return;

    const { name, email, password } = this.registrationForm.value;

    this.authService
      .register({ name: name!, email: email!, password: password! })
      .subscribe({
        next: () => {
          console.log('Successfully registered!');
          this.showSuccessDialog(
            'Registration successful! You can now log in.'
          );
        },
        error: (err) => {
          console.error('Error in the registration', err);
          this.showErrorDialog('Login failed. Please check your credentials.');
        },
      });
  }

  showSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: { message },
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  showErrorDialog(message: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
      width: '300px',
    });
  }
}

// SuccessDialogComponent definition
@Component({
  selector: 'app-success-dialog',
  template: `
    <h2 mat-dialog-title>Success</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class SuccessDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

// ErrorDialogComponent definition
@Component({
  selector: 'app-error-dialog',
  template: `
    <h2 mat-dialog-title>Error</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
