import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { SnippetModule } from './models/snippet/snippet.module';
import { TagsModule } from './models/tags/tags.module';
import { TutorialModule } from './models/tutorial/tutorial.module';
import { GamesModule } from './models/games/games.module';
import { CategoriesModule } from './models/categorys/categories.module';
import { RolesModule } from './models/roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { JwtStrategy } from './models/users/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    UsersModule,
    SnippetModule,
    TagsModule,
    TutorialModule,
    CategoriesModule,
    GamesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
