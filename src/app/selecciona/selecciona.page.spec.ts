import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionaPage } from './selecciona.page';

describe('SeleccionaPage', () => {
  let component: SeleccionaPage;
  let fixture: ComponentFixture<SeleccionaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
