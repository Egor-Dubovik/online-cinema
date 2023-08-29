import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movie')
export class MovieController {}
