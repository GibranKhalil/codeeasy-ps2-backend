import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { SnippetModule } from './models/snippet/snippet.module';
import { TagsModule } from './models/tags/tags.module';
import { TutorialModule } from './models/tutorial/tutorial.module';
import { CategorysModule } from './models/categorys/categorys.module';
import { GamesModule } from './models/games/games.module';

@Module({
  imports: [UsersModule, SnippetModule, TagsModule, TutorialModule, CategorysModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
