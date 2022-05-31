import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExerciseSheetComponent } from './create-exercise-sheet.component';

describe('AddExerciseComponent', () => {
  let component: CreateExerciseSheetComponent;
  let fixture: ComponentFixture<CreateExerciseSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExerciseSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExerciseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
