import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSheetsComponent } from './sheet-database.component';

describe('SheetDatabaseComponent', () => {
  let component: SheetDatabaseComponent;
  let fixture: ComponentFixture<SheetDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
