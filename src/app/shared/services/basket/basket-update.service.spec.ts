import { TestBed } from '@angular/core/testing';

import { BasketUpdateService } from './basket-update.service';

describe('BasketUpdateService', () => {
  let service: BasketUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasketUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
