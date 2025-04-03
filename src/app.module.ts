import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { SnippetModule } from './models/snippet/snippet.module';
import { TutorialModule } from './models/tutorial/tutorial.module';
import { GamesModule } from './models/games/games.module';
import { CategoriesModule } from './models/categorys/categories.module';
import { RolesModule } from './models/roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { JwtStrategy } from './models/users/strategies/jwt.strategy';
import { SubmissionsModule } from './models/submissions/submissions.module';
import { StorageModule } from './models/storage/storage.module';
import { existsSync } from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: existsSync('.env.local') ? '.env.local' : '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    SnippetModule,
    TutorialModule,
    CategoriesModule,
    GamesModule,
    RolesModule,
    SubmissionsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
