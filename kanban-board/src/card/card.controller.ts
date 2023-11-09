import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CardService } from './card.service';
import { GetUser } from '../auth/decorator';
import { CreateCardDto, EditCardDto, ManageCardUserDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('cards')
@UseGuards(JwtGuard)
@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get()
  async getCardsByUser(@GetUser('id') userId: number) {
    return await this.cardService.getCardsByUser(userId);
  }

  @Get('statusList/:id')
  async getCardsOfStatusList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
  ) {
    return await this.cardService.getCardsOfStatusList(userId, statusListId);
  }

  @Get('board/:id')
  async getCardsOfBoard(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    return await this.cardService.getCardsOfBoard(userId, boardId);
  }

  @Get(':id')
  async getCardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return await this.cardService.getCardById(userId, cardId);
  }

  @Post()
  async createCard(@GetUser('id') userId: number, @Body() dto: CreateCardDto) {
    return await this.cardService.createCard(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteCardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return await this.cardService.deleteCardById(userId, cardId);
  }

  @Patch('add-user')
  async addCardUser(@GetUser('id') userId: number, @Body() dto: ManageCardUserDto) {
    return await this.cardService.addCardUser(userId, dto);
  }

  @Patch('remove-user')
  async removeCardUser(@GetUser('id') userId: number, @Body() dto: ManageCardUserDto) {
    return await this.cardService.removeCardUser(userId, dto);
  }

  @Patch(':id')
  async editCardById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) cardId: number,
    @Body() dto: EditCardDto,
  ) {
    return await this.cardService.editCardById(userId, cardId, dto);
  }
}
