import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { DEFAULT_MOVIE_FIELDS } from 'src/constant/movie';
import { MOVIE_INCREMENT } from 'src/constant/numbers';
import { TelegramService } from '../telegram/telegram.service';
import { MovieDto } from './dto/movie.dto';
import { MovieModel } from './movie.model';

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService,
	) {}

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
		const movie = await this.MovieModel.findOne({ slug }).populate('actors genres');
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async getByActor(actorId: Types.ObjectId) {
		const movies = await this.MovieModel.find({ actors: actorId });
		if (!movies) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movies;
	}

	async getByGenreIds(genreIds: Types.ObjectId[]) {
		const movies = await this.MovieModel.find({ genres: { $in: genreIds } });
		if (!movies) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movies;
	}

	async getById(_id: string) {
		const movie = await this.MovieModel.findById(_id);
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async getMostPopular() {
		return this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec();
	}

	async createDefault() {
		const defaultValue: MovieDto = DEFAULT_MOVIE_FIELDS;
		const movie = await this.MovieModel.create(defaultValue);
		return movie._id;
	}

	async update(_id: string, dto: MovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto);
			dto.isSendTelegram = true;
		}
		const movie = await this.MovieModel.findByIdAndUpdate(_id, dto, { new: true });
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async updateCountOpened(slug: string) {
		const movie = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{ $inc: { countOpened: MOVIE_INCREMENT } },
			{ new: true },
		);
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async delete(id: string) {
		const movie = await this.MovieModel.findByIdAndDelete(id);
		if (!movie) throw new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND);
		return movie;
	}

	async sendNotification(dto: MovieDto) {
		// if (process.env.NODE_ENV !== 'development') {
		// 	await this.telegramService.sendPhoto(dto.poster);
		// }

		await this.telegramService.sendPhoto(
			'https://cdn.marvel.com/content/1x/antmanandthewaspquantumania_lob_crd_03.jpg',
		);

		const msg = `<b>${dto.title}</b>\n${dto.description}`;

		await this.telegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://okko.tv/movie/free-guy',
							text: '🍿 Go to watch',
						},
					],
				],
			},
		});
	}
}
