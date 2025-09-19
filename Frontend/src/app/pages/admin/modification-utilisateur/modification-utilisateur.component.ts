import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { User, UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-utilisateur-stagiaire',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modification-utilisateur.component.html',
  styleUrl: './modification-utilisateur.component.css',
})
export class ModificationUtilisateurComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  form: FormGroup;
  currentPage = 1;
  pageSize = 5;
  selectedUserBefore!: User;
  selectedUserAfter!: User;
  message: string | null = null;
  messageClass: string = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      society: ['', Validators.required],
      password: [''],
      admin: [false],
    });

    // 👇 Ajout : écoute les changements sur admin
    this.form.get('admin')?.valueChanges.subscribe((isAdmin: boolean) => {
      if (isAdmin) {
        this.form.patchValue({ society: 'LECLIENT' });
      }
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error(err),
    });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.form.patchValue({
      name: user.name,
      firstname: user.firstname,
      email: user.email,
      society: user.society,
      password: '', // ne pas pré-remplir le mot de passe
      admin: user.admin || false,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  onSubmit() {
    if (!this.selectedUser) return;

    if (this.form.valid) {
      const updatedData = { ...this.form.value };
      updatedData.admin = updatedData.admin || false;

      const modalEl = document.getElementById('confirmModal');
      const modal = new bootstrap.Modal(modalEl!);

      this.selectedUserBefore = { ...this.selectedUser };
      this.selectedUserAfter = { ...this.selectedUser, ...updatedData };

      modal.show();
    }
  }

  confirmUpdate() {
    if (!this.selectedUser) {
      this.message = 'Impossible de modifier cet utilisateur.';
      this.messageClass = 'alert alert-danger';
      setTimeout(() => (this.message = null), 2000);
      return;
    }

    const updatedData = { ...this.form.value };
    updatedData.admin = updatedData.admin || false;

    this.userService
      .updateUser(this.selectedUser.id_user!, updatedData)
      .subscribe({
        next: (user) => {
          console.log('Utilisateur mis à jour', user);
          this.loadUsers();
          this.selectedUser = null;
          this.form.reset();
          const modalEl = document.getElementById('confirmModal');
          const modal = bootstrap.Modal.getInstance(modalEl!);
          modal?.hide();
        },
        error: (err) => console.error(err),
      });
    this.message = `Utilisateur "${this.selectedUser?.name}" modifié avec succès !`;
    this.messageClass = 'alert alert-success';
    setTimeout(() => (this.message = null), 2000);
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.users.length)
      this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
