import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';
import { GenreIdsDto } from './dto/genreIds.dto';
import { MovieDto } from './dto/movie.dto';
import { UpdateCountDto } from './dto/updateCount.dto';
import { MovieService } from './movie.service';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async getMovies(@Param('slug') slug: string) {
		return this.movieService.getBySlug(slug);
	}

	@Get('by-actor/:actorId')
	async getMoviesByActor(@Param('actorId') actorId: Types.ObjectId) {
		return this.movieService.getByActor(actorId);
	}

	@Post('by-genres')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async getMoviesByGenres(@Body() { genreIds }: GenreIdsDto) {
		return this.movieService.getByGenreIds(genreIds);
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm: string) {
		return this.movieService.getAll(searchTerm);
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular();
	}

	@Get(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async getById(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.getById(id);
	}

	@Post()
	@Auth('admin')
	async create() {
		return this.movieService.createDefault();
	}

	@Put('update-count-opened')
	@UsePipes(new ValidationPipe())
	async updateCountOpened(@Body() { slug }: UpdateCountDto) {
		return this.movieService.updateCountOpened(slug);
	}

	@Put(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: MovieDto) {
		return this.movieService.update(id, dto);
	}

	@Delete(':id')
	@Auth('admin')
	@UsePipes(new ValidationPipe())
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.delete(id);
	}
}
