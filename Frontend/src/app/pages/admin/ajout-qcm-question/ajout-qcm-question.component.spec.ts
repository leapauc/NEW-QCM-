import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutQcmQuestionComponent } from './ajout-qcm-question.component';

describe('AjoutQcmQuestionComponent', () => {
  let component: AjoutQcmQuestionComponent;
  let fixture: ComponentFixture<AjoutQcmQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutQcmQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutQcmQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
