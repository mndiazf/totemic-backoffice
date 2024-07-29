import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortProductsDialogComponent } from './sort-products-dialog.component';

describe('SortProductsDialogComponent', () => {
  let component: SortProductsDialogComponent;
  let fixture: ComponentFixture<SortProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortProductsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
