import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  UseGuards,
  ParseUUIDPipe 
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() createRequestDto: CreateRequestDto, @CurrentUser() user: any) {
    return this.requestsService.create(createRequestDto, user.userId);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get('stats')
  getStats(@CurrentUser() user: any) {
    return this.requestsService.getRequestStats(user.userId);
  }

  @Get('assignment-users')
  getUsersForAssignment(@CurrentUser() user: any) {
    return this.requestsService.getUsersForAssignment(user.userId);
  }

  @Get('my-requests')
  findByUser(@CurrentUser() user: any) {
    return this.requestsService.findByUser(user.userId);
  }

  @Get('pending-approvals')
  findPendingForApprover(@CurrentUser() user: any) {
    return this.requestsService.findPendingForApprover(user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRequestStatusDto: UpdateRequestStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.updateStatus(id, updateRequestStatusDto, user.userId);
  }
}