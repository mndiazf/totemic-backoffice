import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductsDialogComponent } from './edit-products-dialog.component';

describe('EditProductsDialogComponent', () => {
  let component: EditProductsDialogComponent;
  let fixture: ComponentFixture<EditProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
