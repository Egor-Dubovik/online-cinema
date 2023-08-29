import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { UpdateGenreDto } from './dto/updateGenre.dto';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
	constructor(@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>) {}

	async getBySlug(slug: string) {
		return this.GenreModel.findOne({ slug }).exec();
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
		const genres = this.getAll();
		const collections = genres;
		// todo
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
