import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDatabaseComponent } from './exercise-database.component';

describe('ExerciseDatabaseComponent', () => {
  let component: ExerciseDatabaseComponent;
  let fixture: ComponentFixture<ExerciseDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
