import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDBComponent } from './exercise-db.component';

describe('ExerciseDBComponent', () => {
  let component: ExerciseDBComponent;
  let fixture: ComponentFixture<ExerciseDBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseDBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
