import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVariationDialogComponent } from './delete-variation-dialog.component';

describe('DeleteVariationDialogComponent', () => {
  let component: DeleteVariationDialogComponent;
  let fixture: ComponentFixture<DeleteVariationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteVariationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteVariationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
