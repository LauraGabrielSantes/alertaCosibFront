import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendMoreInfoPage } from './send-more-info.page';

describe('SendMoreInfoPage', () => {
  let component: SendMoreInfoPage;
  let fixture: ComponentFixture<SendMoreInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoreInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
