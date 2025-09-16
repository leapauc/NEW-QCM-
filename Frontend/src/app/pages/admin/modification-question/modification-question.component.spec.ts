import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationQuestionComponent } from './modification-question.component';

describe('ModificationQuestionComponent', () => {
  let component: ModificationQuestionComponent;
  let fixture: ComponentFixture<ModificationQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
