import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CloneSheetComponent} from './clone-sheet.component';

describe('CloneSheetComponent', () => {
  let component: CloneSheetComponent;
  let fixture: ComponentFixture<CloneSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
