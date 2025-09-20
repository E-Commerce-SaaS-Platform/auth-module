import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserSchema1757769878395 implements MigrationInterface {
  name = 'UpdateUserSchema1757769878395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes for columns that will be removed
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );

    // Drop foreign key constraint for photoId
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );

    // Remove old columns
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socialId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photoId"`);

    // Add new columns
    await queryRunner.query(
      `ALTER TABLE "user" ADD "fullName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatarUrl" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "phoneNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "address" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "keycloakUserId" character varying NOT NULL`,
    );

    // Create unique index for keycloakUserId
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_keycloak_user_id" ON "user" ("keycloakUserId")`,
    );

    // Create index for fullName for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_user_full_name" ON "user" ("fullName")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new indexes
    await queryRunner.query(`DROP INDEX "public"."IDX_user_full_name"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_keycloak_user_id"`);

    // Remove new columns
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "keycloakUserId"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarUrl"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullName"`);

    // Add back old columns
    await queryRunner.query(`ALTER TABLE "user" ADD "photoId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "socialId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "provider" character varying NOT NULL DEFAULT 'email'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "password" character varying`,
    );

    // Recreate foreign key constraint for photoId
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Recreate old indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId")`,
    );
  }
}
