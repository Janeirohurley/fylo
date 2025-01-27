import { TestBed } from '@angular/core/testing';

import { DexieStorageService } from './dexie-storage.service';

describe('DexieStorageService', () => {
  let service: DexieStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexieStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
