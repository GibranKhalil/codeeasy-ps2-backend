import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MulterModule } from "@nestjs/platform-express"
import { GamesController } from "./games.controller"
import { GamesService } from "./games.service"
import { Game } from "./entities/game.entity"
import { SupabaseModule } from "../config/supabase/supabase.module"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    MulterModule.register({
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
    }),
    SupabaseModule,
    AuthModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}

