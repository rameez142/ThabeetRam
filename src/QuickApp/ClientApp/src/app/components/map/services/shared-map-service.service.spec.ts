import { TestBed, inject } from '@angular/core/testing';

import { SharedMapServiceService } from './shared-map-service.service';

describe('SharedMapServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedMapServiceService]
    });
  });

  it('should be created', inject([SharedMapServiceService], (service: SharedMapServiceService) => {
    expect(service).toBeTruthy();
  }));
});
