/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PLDComponent } from './PLD.component';

describe('PLDComponent', () => {
  let component: PLDComponent;
  let fixture: ComponentFixture<PLDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PLDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PLDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
