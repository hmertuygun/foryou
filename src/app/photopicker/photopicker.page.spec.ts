import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotopickerPage } from './photopicker.page';

describe('PhotopickerPage', () => {
  let component: PhotopickerPage;
  let fixture: ComponentFixture<PhotopickerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotopickerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotopickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
