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

// export const getDatabaseConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => {
//   return {
//     type: 'postgres',
//     host: configService.get<string>('SUPABASE_HOST'),
//     username: configService.get<string>('SUPABASE_USER'),
//     password: configService.get<string>('SUPABASE_PASSWORD'),
//     database: configService.get<string>('SUPABASE_DB'),
//     entities: ['dist/models/**/*.{js,ts}'],
//     migrations: ['dist/migrations/**/*.js'],
//     ssl: {
//       rejectUnauthorized: false,
//     },
//     synchronize: true,
//   };
// };
