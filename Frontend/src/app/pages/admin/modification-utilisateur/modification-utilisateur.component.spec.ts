import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationUtilisateurComponent } from './modification-utilisateur.component';

describe('ModificationStagiaireComponent', () => {
  let component: ModificationUtilisateurComponent;
  let fixture: ComponentFixture<ModificationUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationUtilisateurComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificationUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
