import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUser1682000767896 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE user (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
           
            isAdmin boolean NOT NULL DEFAULT false,
            avatarUrl VARCHAR(255) NULL,
            isEmailVerified boolean NOT NULL DEFAULT false,
            emailVerificationToken VARCHAR(255) NULL,
            passwordResetToken VARCHAR(255) NULL,
            passwordResetTokenExpiresAt TIMESTAMP NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user`);
    }

}
