import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductsDialogComponent } from './delete-products-dialog.component';

describe('DeleteProductsDialogComponent', () => {
  let component: DeleteProductsDialogComponent;
  let fixture: ComponentFixture<DeleteProductsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProductsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProductsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
