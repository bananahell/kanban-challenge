import { Controller, UseGuards } from '@nestjs/common';
import { StatusListService } from './status-list.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('status-lists')
export class StatusListController {
  constructor(private statusListService: StatusListService) {}
}
