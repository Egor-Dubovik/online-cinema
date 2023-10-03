import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { MovieService } from '../movie/movie.service';
import { SetRatingDto } from './dto/setRating.dto';
import { RatingModel } from './rating.model';

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel) private readonly RatingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService,
	) {}

	async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		const data = await this.RatingModel.findOne({ movieId, userId }).select('value');
		return data ? data.value : 0;
	}

	async getAverageRatingByMovieId(movieId: Types.ObjectId | string) {
		const ratingsMovie: RatingModel[] = await this.RatingModel.aggregate().match({
			movieId: new Types.ObjectId(movieId),
		});
		return ratingsMovie.reduce((acc, rate) => acc + rate.value, 0) / ratingsMovie.length;
	}

	async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
		const { movieId, value } = dto;
		const newRating = await this.RatingModel.findOneAndUpdate(
			{ userId, movieId },
			{ userId, movieId, value },
			{ new: true, upsert: true, setDefaultsOnInsert: true },
		);

		const averageRating = await this.getAverageRatingByMovieId(movieId);
		await this.movieService.updateRating(movieId, averageRating);
		return newRating;
	}
}
