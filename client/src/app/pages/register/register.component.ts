import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
registerForm!: FormGroup;

constructor(private location: Location, private formBuilder: FormBuilder, private authService: AuthService, private router: Router){}

ngOnInit(): void {
  this.registerForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });
}

passwordMatchValidator(group: AbstractControl) {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}

onSubmit() {
  if (this.registerForm.invalid) return;

  const { name, email, password } = this.registerForm.value;

  this.authService.register({ name: name!, email: email!, password: password! }).subscribe({
    next: () => {
      console.log('Successfully registered!');
      this.router.navigate(['/login']);
    },
    error: err => {
      console.error('Error in the registration', err);
    }
  });
}



  goBack() {
    this.location.back();
  }
}
