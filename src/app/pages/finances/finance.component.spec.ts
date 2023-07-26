import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Finance } from './finance.component';

describe('Tab2Page', () => {
  let component: Finance;
  let fixture: ComponentFixture<Finance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Finance],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Finance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
