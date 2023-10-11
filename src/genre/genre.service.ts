import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { MovieService } from '../movie/movie.service';
import { UpdateGenreDto } from './dto/updateGenre.dto';
import { ICollection } from './genre.interface';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService,
	) {}

	async getBySlug(slug: string) {
		const genre = await this.GenreModel.findOne({ slug }).exec();
		if (!genre) throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
		return genre;
	}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{ name: new RegExp(searchTerm, 'i') },
					{ slug: new RegExp(searchTerm, 'i') },
					{ description: new RegExp(searchTerm, 'i') },
				],
			};
		}
		return this.GenreModel.find(options).select('-__v').sort({ createdAt: 'desc' }).exec();
	}

	async getById(_id: string) {
		const genre = this.GenreModel.findById(_id);
		if (!genre) throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
		return genre;
	}

	async getCollections() {
		const genres = await this.getAll();
		const collections = await Promise.all(
			genres.map(async (genre) => {
				const moviesByGenre = await this.movieService.getByGenreIds([genre._id]);

				const result: ICollection = {
					_id: String(genre._id),
					image: moviesByGenre[0]?.bigPoster,
					slug: genre.slug,
					title: genre.name,
				};
				return result;
			}),
		);
		return collections;
	}

	async createDefault() {
		const defaultValue = { name: '', slug: '', description: '', icon: '' };
		const genre = await this.GenreModel.create(defaultValue);
		return genre._id;
	}

	async update(_id: string, dto: UpdateGenreDto) {
		const genre = await this.GenreModel.findByIdAndUpdate(_id, dto, { new: true }).exec();
		if (!genre) throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
		return genre;
	}

	async getCount() {
		return this.GenreModel.find().count().exec();
	}

	async delete(id: string) {
		const genre = await this.GenreModel.findByIdAndDelete(id);
		if (!genre) throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
		return genre;
	}
}
