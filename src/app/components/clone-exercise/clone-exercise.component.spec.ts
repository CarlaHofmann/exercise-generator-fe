import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CloneExerciseComponent} from './clone-exercise.component';

describe('CloneExerciseComponent', () => {
  let component: CloneExerciseComponent;
  let fixture: ComponentFixture<CloneExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneExerciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
