import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { DEFAULT_MOVIE_FIELDS } from 'src/constant/movie';
import { MOVIE_INCREMENT } from 'src/constant/numbers';
import { MovieDto } from './movie.dto';
import { MovieModel } from './movie.model';

@Injectable()
export class MovieService {
	constructor(@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>) {}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [{ title: new RegExp(searchTerm, 'i') }],
			};
		}
		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec();
	}

	async getBySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug }).populate('actors genres').exec();
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async getByActor(actorId: string) {
		const movies = await this.MovieModel.find({ actors: actorId }).exec();
		if (!movies) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movies;
	}

	async getByGenreIds(genreIds: Types.ObjectId[]) {
		const movies = await this.MovieModel.find({ genres: { $in: genreIds } }).exec();
		if (!movies) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movies;
	}

	async getById(_id: string) {
		const movie = this.MovieModel.findById(_id);
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async createDefault() {
		const defaultValue: MovieDto = DEFAULT_MOVIE_FIELDS;
		const movie = await this.MovieModel.create(defaultValue);
		return movie._id;
	}
}
