import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationQcmComponent } from './modification-qcm.component';

describe('ModificationQcmComponent', () => {
  let component: ModificationQcmComponent;
  let fixture: ComponentFixture<ModificationQcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationQcmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationQcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
