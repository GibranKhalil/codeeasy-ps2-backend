import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: configService.get<string>('SUPABASE_URL'),
    entities: ['dist/models/**/*.{js,ts}'],
    migrations: ['dist/migrations/**/*.js'],
    ssl: {
      rejectUnauthorized: false,
    },
    synchronize: false,
  };
};
