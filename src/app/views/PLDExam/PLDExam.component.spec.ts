/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PLDExamComponent } from './PLDExam.component';

describe('PLDExamComponent', () => {
  let component: PLDExamComponent;
  let fixture: ComponentFixture<PLDExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PLDExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PLDExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
