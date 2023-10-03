import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { MovieModel } from 'src/movie/movie.model';
import { UserModel } from '../user/user.model';

export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
	@prop()
	value: number;

	@prop({ ref: () => UserModel })
	userId: Ref<UserModel>;

	@prop({ ref: () => MovieModel })
	movieId?: Ref<MovieModel>;
}
