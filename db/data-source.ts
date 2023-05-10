import RoleEntity from 'apps/my-app/src/roles/roles.entity';
import UserEntity from 'apps/my-app/src/users/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE as 'mysql') || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'newuser',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'test',
  entities: [UserEntity, RoleEntity],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
