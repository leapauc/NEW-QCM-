import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant de modal réutilisable pour afficher un message de succès ou d'erreur.
 *
 * @description
 * Ce composant affiche une modal centrée avec un message, une icône et un bouton "Fermer".
 * Il utilise Bootstrap 5 pour le rendu et la gestion de l'ouverture/fermeture.
 *
 * @example
 * <app-modal
 *   [modalId]="'successModal'"
 *   [message]="'Opération réussie !'"
 *   [icon]="'✅'"
 *   (onClose)="handleClose()">
 * </app-modal>
 *
 * @selector app-modal
 * @component
 * @standalone
 * @template
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="modal fade"
      [id]="modalId"
      tabindex="-1"
      [attr.aria-labelledby]="modalId + 'Label'"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-3">
          <div class="modal-body">
            <div class="mb-3">
              <span style="font-size: 3rem">{{ icon }}</span>
            </div>
            <h5 class="modal-title mb-3" [id]="modalId + 'Label'">
              {{ message }}
            </h5>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              (click)="onClose.emit()"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  /**
   * ID unique pour identifier la modal et la contrôler via Bootstrap.
   * @default 'genericModal'
   */
  @Input() modalId = 'genericModal';
  /**
   * Message affiché dans la modal.
   */
  @Input() message = '';
  /**
   * Icône ou symbole affiché en haut de la modal.
   * @default 'ℹ️'
   */
  @Input() icon = 'ℹ️';
  /**
   * Événement émis lorsque l'utilisateur ferme la modal.
   */
  @Output() onClose = new EventEmitter<void>();
}
