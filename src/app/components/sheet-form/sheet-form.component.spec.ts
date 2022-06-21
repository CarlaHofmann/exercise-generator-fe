import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SheetFormComponent} from './sheet-form.component';

describe('SheetFormComponent', () => {
  let component: SheetFormComponent;
  let fixture: ComponentFixture<SheetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
