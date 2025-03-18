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

@Module({
  imports: [
    UsersModule,
    SnippetModule,
    TagsModule,
    TutorialModule,
    CategoriesModule,
    GamesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
