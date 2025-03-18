import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get('SUPABASE_HOST'),
    port: 5432,
    username: configService.get('SUPABASE_USER'),
    password: configService.get('SUPABASE_PASSWORD'),
    database: configService.get('SUPABASE_DB'),
    entities: ['dist/models/**/*.{js,ts}'],
    migrations: ['dist/migrations/**/*.js'],
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: true,
  };
};
