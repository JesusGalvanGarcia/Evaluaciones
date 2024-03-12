/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Evaluation360Component } from './Evaluation360.component';

describe('Evaluation360Component', () => {
  let component: Evaluation360Component;
  let fixture: ComponentFixture<Evaluation360Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Evaluation360Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Evaluation360Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
