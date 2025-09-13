import {
  // common
  Module,
} from '@nestjs/common';

import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SessionService } from './session.service';

// Use only relational database (PostgreSQL)
const infrastructurePersistenceModule = RelationalSessionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
