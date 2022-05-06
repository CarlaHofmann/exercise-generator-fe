import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSheetsComponent } from './exercise-sheets.component';

describe('ExerciseSheetsComponent', () => {
  let component: ExerciseSheetsComponent;
  let fixture: ComponentFixture<ExerciseSheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseSheetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
