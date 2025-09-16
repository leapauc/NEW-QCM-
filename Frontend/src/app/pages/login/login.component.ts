import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Formulaire soumis');
    if (this.loginForm.invalid) return;

    const { name, password } = this.loginForm.value;

    this.authService.login(name, password).subscribe({
      next: (res) => {
        if (res.user.admin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/stagiaire']);
        }
      },
      error: (err) => {
        alert(err.error?.error || 'Identifiants incorrects');
      },
    });
  }
}
