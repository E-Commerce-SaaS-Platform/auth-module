import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { FilesModule } from '../files/files.module';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersService } from './users.service';

// Use only relational database (PostgreSQL)
const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
