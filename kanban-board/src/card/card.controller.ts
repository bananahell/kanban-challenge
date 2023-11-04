import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CardService } from './card.service';
import { GetUser } from '../auth/decorator';
import { CreateCardDto } from './dto';

@UseGuards(JwtGuard)
@Controller('cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @Get()
  getCardsByUser(@GetUser('id') userId: number) {
    return this.cardService.getCardsByUser(userId);
  }

  @Get('statusList/:id')
  getCardsOfStatusList(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) statusListId: number,
  ) {
    return this.cardService.getCardsOfStatusList(userId, statusListId);
  }

  @Get('board/:id')
  getCardsOfBoard(@GetUser('id') userId: number, @Param('id', ParseIntPipe) boardId: number) {
    return this.cardService.getCardsOfBoard(userId, boardId);
  }

  @Get(':id')
  getCardById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) cardId: number) {
    return this.cardService.getCardById(userId, cardId);
  }

  @Post()
  createCard(@GetUser('id') userId: number, @Body() dto: CreateCardDto) {
    this.cardService.createCard(userId, dto);
  }
}
