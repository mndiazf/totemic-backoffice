import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductVariationDialogComponent } from './add-product-variation-dialog.component';

describe('AddProductVariationDialogComponent', () => {
  let component: AddProductVariationDialogComponent;
  let fixture: ComponentFixture<AddProductVariationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductVariationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductVariationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
