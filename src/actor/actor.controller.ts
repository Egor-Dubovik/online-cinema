import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';
import { ActorDto } from './actor.dto';
import { ActorService } from './actor.service';

@Controller('actors')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get('by-slug/:slug')
	async getActors(@Param('slug') slug: string) {
		return this.actorService.getBySlug(slug);
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.actorService.getAll(searchTerm);
	}

	@Get(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async getById(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.getById(id);
	}

	@Post()
	@Auth('admin')
	async create() {
		return this.actorService.createDefault();
	}

	@Put(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: ActorDto) {
		return this.actorService.update(id, dto);
	}

	@Delete(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.delete(id);
	}
}
