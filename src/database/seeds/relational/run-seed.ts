import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(StatusSeedService).run();

  await app.close();
};

void runSeed();
