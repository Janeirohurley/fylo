import { TestBed } from '@angular/core/testing';

import { NetworkDetectorService } from './network-detector.service';

describe('NetworkDetectorService', () => {
  let service: NetworkDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
