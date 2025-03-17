import { Controller, Post, Body, UseInterceptors, UploadedFiles, UseGuards, BadRequestException } from "@nestjs/common"
import { FileFieldsInterceptor } from "@nestjs/platform-express"
import { ApiTags, ApiConsumes, ApiOperation, ApiBearerAuth, ApiBody } from "@nestjs/swagger"
import type { GamesService } from "./games.service"
import { CreateGameDto } from "./dto/create-game.dto"
import type { Game } from "./entities/game.entity"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import type { Express } from "express"

@ApiTags("games")
@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new game" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: CreateGameDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "cover_image", maxCount: 1 },
        { name: "screenshots", maxCount: 10 },
        { name: "game_description", maxCount: 1 },
        { name: "game_file", maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 500 * 1024 * 1024, // 500MB max file size
        },
      },
    ),
  )
  async create(
    @Body() createGameDto: CreateGameDto,
    @UploadedFiles() files: {
      cover_image?: Express.Multer.File[];
      screenshots?: Express.Multer.File[];
      game_description?: Express.Multer.File[];
      game_file?: Express.Multer.File[];
    },
  ): Promise<Game> {
    // Validate required files
    if (!files.cover_image || files.cover_image.length === 0) {
      throw new BadRequestException("Cover image is required")
    }
    if (!files.screenshots || files.screenshots.length === 0) {
      throw new BadRequestException("At least one screenshot is required")
    }
    if (!files.game_description || files.game_description.length === 0) {
      throw new BadRequestException("Game description file is required")
    }
    if (!files.game_file || files.game_file.length === 0) {
      throw new BadRequestException("Game file is required")
    }

    return this.gamesService.create(createGameDto, files as any)
  }
}

