import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExerciseSheetComponent } from './create-sheet.component';

describe('CreateSheetComponent', () => {
  let component: CreateSheetComponent;
  let fixture: ComponentFixture<CreateSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
