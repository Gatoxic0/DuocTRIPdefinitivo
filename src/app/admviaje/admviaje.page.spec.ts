import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmviajePage } from './admviaje.page';

describe('AdmviajePage', () => {
  let component: AdmviajePage;
  let fixture: ComponentFixture<AdmviajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmviajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
