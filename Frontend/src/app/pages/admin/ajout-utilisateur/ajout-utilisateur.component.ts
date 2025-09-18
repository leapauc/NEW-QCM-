import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import * as bootstrap from 'bootstrap'; // importer Bootstrap JS

@Component({
  selector: 'app-ajout-utilisateur',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ajout-utilisateur.component.html',
})
export class AjoutUtilisateurComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group(
      {
        name: ['', Validators.required],
        firstname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        society: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        admin: [false],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.form.valid) {
      const { confirmPassword, ...userData } = this.form.value;
      if (!userData.admin) {
        userData.admin = false;
      }

      this.userService.createUser(userData).subscribe({
        next: (user) => {
          console.log('Utilisateur créé', user);
          this.form.reset();

          // Afficher le modal Bootstrap
          const modalEl = document.getElementById('successModal');
          const modal = new bootstrap.Modal(modalEl!);
          modal.show();
        },
        error: (err) => console.error('Erreur création utilisateur', err),
      });
    } else {
      console.log('Form invalid');
    }
  }
}
