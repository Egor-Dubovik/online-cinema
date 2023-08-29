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
import { UpdateGenreDto } from './dto/updateGenre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('by-slug/:slug')
	async getGenres(@Param('slug') slug: string) {
		return this.genreService.getBySlug(slug);
	}

	@Get('collections')
	async getCollections() {
		return this.genreService.getCollections();
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.genreService.getAll(searchTerm);
	}

	@Get(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async getById(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.getById(id);
	}

	@Post()
	@Auth('admin')
	async create() {
		return this.genreService.createDefault();
	}

	@Put(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateGenreDto) {
		return this.genreService.update(id, dto);
	}

	@Delete(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.delete(id);
	}
}
