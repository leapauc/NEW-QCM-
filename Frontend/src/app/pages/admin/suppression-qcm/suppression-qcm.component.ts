import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QcmService } from '../../../services/qcm.service';
import * as bootstrap from 'bootstrap';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QCM } from '../../../models/qcm';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ConfirmationModalComponent } from '../../../components/confirmation_modal/confirmation_modal.component';

/**
 * Composant responsable de la suppression des QCM.
 *
 * @description
 * Ce composant permet :
 * - de charger et afficher la liste des QCM existants
 * - d'effectuer une recherche et une pagination sur les QCM
 * - de sélectionner un QCM et afficher une modale de confirmation
 * - de supprimer le QCM sélectionné après confirmation
 *
 * @usageNotes
 * ### Importation
 * Ce composant utilise :
 * - `CommonModule`, `FormsModule`, `ReactiveFormsModule`
 * - `SearchBarComponent` pour la recherche
 * - `PaginationComponent` pour la pagination
 * - `ConfirmationModalComponent` pour afficher un dialogue de confirmation avant suppression
 *
 * @example
 * <app-suppression-qcm></app-suppression-qcm>
 *
 * @selector app-suppression-qcm
 * @component
 */
@Component({
  selector: 'app-suppression-qcm',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './suppression-qcm.component.html',
})
export class SuppressionQcmComponent implements OnInit {
  /**
   * Liste complète des QCM récupérés depuis le backend.
   */
  qcms: QCM[] = [];
  /**
   * QCM actuellement sélectionné pour suppression.
   */
  selectedQcm: QCM | null = null;
  /**
   * Formulaire réactif utilisé pour afficher les détails du QCM sélectionné.
   */
  form: FormGroup;
  /**
   * Liste des QCM filtrés selon le terme de recherche.
   */
  filteredQcms: QCM[] = [];
  /**
   * Terme de recherche saisi par l'utilisateur.
   */
  searchTerm = '';
  /**
   * Liste des QCM à afficher pour la page courante (pagination).
   */
  paginatedQcms: QCM[] = [];
  /**
   * Message de confirmation ou d'erreur affiché après suppression.
   */
  message: string | null = null;
  /**
   * Classe CSS pour styliser le message (success/danger).
   */
  messageClass: string = '';
  /** Etat chargement des données */
  isLoading = true;

  /**
   * Constructeur du composant.
   * @param qcmService Service de gestion des QCM
   * @param fb FormBuilder pour initialiser le formulaire
   * @param cdr ChangeDetectorRef pour rafraîchir la vue après modifications asynchrones
   */
  constructor(
    private qcmService: QcmService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      user: ['', [Validators.required]],
      created_at: [''],
      updated_at: [''],
    });
  }

  /**
   * Cycle de vie Angular : Initialisation du composant.
   * Charge les QCM existants dès l'affichage.
   */
  ngOnInit() {
    this.loadQcms();
  }

  /**
   * Charge tous les QCM via le service et initialise la pagination.
   */
  loadQcms() {
    this.isLoading = true;

    this.qcmService.getAllQCM().subscribe({
      next: (data) => {
        this.qcms = data;
        this.filteredQcms = [...this.qcms];
        this.paginatedQcms = this.filteredQcms.slice(0, 5);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement QCMs', err);
        this.isLoading = false;
      },
    });
  }

  /**
   * Ouvre la modale de confirmation avant suppression.
   */
  openConfirmModal() {
    const modalEl = document.getElementById('confirmationModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  /**
   * Sélectionne un QCM pour suppression et déclenche l'ouverture de la modale.
   * @param qcm QCM à supprimer
   */
  selectQcm(qcm: QCM) {
    this.selectedQcm = qcm;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    this.openConfirmModal();
  }

  /**
   * Filtre les QCM selon le terme saisi dans la barre de recherche.
   */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredQcms = [...this.qcms];
    } else {
      this.filteredQcms = this.qcms.filter((qcm) =>
        (qcm.title + qcm.description + qcm.user).toLowerCase().includes(term)
      );
    }

    Promise.resolve().then(() => {
      this.paginatedQcms = this.filteredQcms.slice(0, 5);
      this.cdr.detectChanges();
    });
  }

  // Supprimer le QCM sélectionné
  /**
   * Supprime le QCM sélectionné via le service.
   * Affiche un message de succès ou d'erreur en fonction du résultat.
   */
  deleteQcm(): void {
    if (!this.selectedQcm || this.selectedQcm.id_qcm == null) return;

    this.qcmService.deleteQCM(this.selectedQcm.id_qcm).subscribe({
      next: () => {
        this.message = `QCM "${this.selectedQcm?.title}" supprimé avec succès !`;
        this.messageClass = 'alert alert-success';
        this.loadQcms();
        this.selectedQcm = null;

        const modalEl = document.getElementById('confirmationModal');
        if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

        setTimeout(() => (this.message = null), 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        this.message = 'Impossible de supprimer ce QCM.';
        this.messageClass = 'alert alert-danger';
        setTimeout(() => (this.message = null), 2000);
      },
    });
  }
}
