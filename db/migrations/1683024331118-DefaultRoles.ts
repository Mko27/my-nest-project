import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultRoles1683024331118 implements MigrationInterface {
  name = 'DefaultRoles1683024331118';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('admin')`);
    await queryRunner.query(`INSERT INTO roles (name) VALUES ('user')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE name = 'admin'`);
    await queryRunner.query(`DELETE FROM roles WHERE name = 'user'`);
  }
}
