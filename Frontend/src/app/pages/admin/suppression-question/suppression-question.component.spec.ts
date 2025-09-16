import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppressionQuestionComponent } from './suppression-question.component';

describe('SuppressionQuestionComponent', () => {
  let component: SuppressionQuestionComponent;
  let fixture: ComponentFixture<SuppressionQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppressionQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppressionQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
