import { Test, TestingModule } from '@nestjs/testing';
import { Personervice } from './person.service';

describe('Personervice', () => {
  let service: Personervice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Personervice],
    }).compile();

    service = module.get<Personervice>(Personervice);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
