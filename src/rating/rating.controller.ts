import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from '../auth/decorators/auth.decorators';
import { IdValidationPipe } from '../pipes/idValidation.pipe';
import { User } from '../user/decorators/user.decorator';
import { SetRatingDto } from './dto/setRating.dto';
import { RatingService } from './rating.service';

@Controller('ratings')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Get(':movieId')
	@Auth()
	async getMovieValueByUser(
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User('_id') _id: Types.ObjectId,
	) {
		return this.ratingService.getMovieValueByUser(movieId, _id);
	}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@Auth()
	async setRating(@User('_id') _id: Types.ObjectId, @Body() dto: SetRatingDto) {
		return this.ratingService.setRating(_id, dto);
	}
}
