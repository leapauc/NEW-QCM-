import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../services/question.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { typeValidator } from '../../../validators/type.validator';
import * as bootstrap from 'bootstrap';
import { SearchBarComponent } from '../../../components/search_bar/search_bar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { ConfirmationModalComponent } from '../../../components/confirmation_modal/confirmation_modal.component';

/**
 * Composant responsable de la suppression des questions.
 *
 * @description
 * Ce composant permet :
 * - de charger et afficher la liste des questions disponibles
 * - de filtrer les questions grâce à une barre de recherche
 * - de sélectionner une question et afficher une modale de confirmation
 * - de supprimer la question sélectionnée via le service QuestionService
 *
 * @usageNotes
 * ### Importation
 * Ce composant importe et utilise :
 * - `CommonModule`, `FormsModule`, `ReactiveFormsModule`
 * - `SearchBarComponent` pour la recherche
 * - `PaginationComponent` pour la pagination
 * - `ConfirmationModalComponent` pour afficher le dialogue de confirmation avant suppression
 *
 * @example
 * <app-suppression-question></app-suppression-question>
 *
 * @selector app-suppression-question
 * @component
 */
@Component({
  selector: 'app-suppression-question',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './suppression-question.component.html',
})
export class SuppressionQuestionComponent implements OnInit {
  /**
   * Liste complète des questions récupérées depuis l'API.
   */
  questions: any[] = [];
  /**
   * Question actuellement sélectionnée pour suppression.
   */
  selectedQuestion: any | null = null;
  /**
   * Formulaire réactif permettant d'afficher les informations de la question sélectionnée.
   */
  form: FormGroup;
  /**
   * Liste des questions filtrées selon la recherche.
   */
  filteredQuestions: any[] = [];
  /**
   * Terme de recherche saisi par l'utilisateur.
   */
  searchTerm = '';
  /**
   * Message de retour affiché après suppression (succès ou erreur).
   */
  message: string | null = null;
  /**
   * Classe CSS appliquée au message (ex. "alert-success", "alert-danger").
   */
  messageClass: string = '';
  /**
   * Liste paginée des questions affichées dans le tableau.
   */
  paginatedQuestions: any[] = [];
  /** Etat chargement des données */
  isLoading = true;

  /**
   * Constructeur du composant.
   * @param questionService Service pour récupérer et supprimer les questions.
   * @param fb FormBuilder pour créer et gérer le formulaire réactif.
   * @param cdr ChangeDetectorRef pour forcer la détection des changements après mises à jour asynchrones.
   */
  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      type: ['', [Validators.required, typeValidator()]],
      position: ['', Validators.required],
    });
  }

  /**
   * Cycle de vie Angular : Initialisation du composant.
   * Charge les questions dès l'affichage.
   */
  ngOnInit() {
    this.loadQuestions();
  }

  /**
   * Charge toutes les questions depuis le service et initialise la pagination.
   */
  loadQuestions() {
    this.isLoading = true;

    this.questionService.getAllQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        this.filteredQuestions = [...this.questions];
        this.paginatedQuestions = this.filteredQuestions.slice(0, 5);

        this.isLoading = false; // fin du chargement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement questions : ', err);
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
   * Sélectionne une question et préremplit le formulaire, puis affiche la modale.
   * @param question Question à supprimer.
   */
  selectQuestion(question: any) {
    this.selectedQuestion = question;
    this.form.patchValue({
      question: question.question,
      type: question.type,
      position: question.position,
    });
    this.openConfirmModal();
  }

  /**
   * Supprime la question sélectionnée via le service.
   * Affiche un message de succès ou d'erreur et recharge la liste des questions.
   */
  deleteQuestion(): void {
    if (!this.selectedQuestion?.id_question) return;

    this.questionService
      .deleteQuestion(this.selectedQuestion.id_question)
      .subscribe({
        next: () => {
          this.message = `Question "${this.selectedQuestion?.question}" supprimée avec succès !`;
          this.messageClass = 'alert alert-success';
          this.loadQuestions();
          this.selectedQuestion = null;

          // Fermer le modal après suppression
          const modalEl = document.getElementById('confirmationModal');
          if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();

          setTimeout(() => (this.message = null), 2000);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.message = 'Impossible de supprimer cette question.';
          this.messageClass = 'alert alert-danger';
          setTimeout(() => (this.message = null), 2000);
        },
      });
  }

  /**
   * Filtre les questions en fonction du terme saisi.
   */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter((question) =>
        (question.question + question.title).toLowerCase().includes(term)
      );
    }

    Promise.resolve().then(() => {
      this.paginatedQuestions = this.filteredQuestions.slice(0, 5);
      this.cdr.detectChanges();
    });
  }
}
