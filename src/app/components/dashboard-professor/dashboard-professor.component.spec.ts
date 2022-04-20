import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfessorComponent } from './dashboard-professor.component';

describe('DashboardProfessorComponent', () => {
  let component: DashboardProfessorComponent;
  let fixture: ComponentFixture<DashboardProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProfessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
