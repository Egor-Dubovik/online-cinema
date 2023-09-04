import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';
import { ActorDto } from './actor.dto';
import { ActorModel } from './actor.model';

@Injectable()
export class ActorService {
	constructor(@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>) {}

	async getBySlug(slug: string) {
		const actor = await this.ActorModel.findOne({ slug }).exec();
		if (!actor) throw new NotFoundException(ERROR_MESSAGE.ACTOR_NOT_FOUND);
		return actor;
	}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [{ name: new RegExp(searchTerm, 'i') }, { slug: new RegExp(searchTerm, 'i') }],
			};
		}
		return this.ActorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				localField: '_id',
				foreignField: 'actors',
				as: 'movies',
			})
			.addFields({
				countMovies: {
					$size: '$movies',
				},
			})
			.project({ __v: 0, updatedAt: 0, movies: 0 })
			.sort({ createdAt: 'desc' })
			.exec();
	}

	// todo aggregation

	async getById(_id: string) {
		const actor = this.ActorModel.findById(_id);
		if (!actor) throw new NotFoundException(ERROR_MESSAGE.ACTOR_NOT_FOUND);
		return actor;
	}

	async createDefault() {
		const defaultValue: ActorDto = { name: '', slug: '', photo: '' };
		const actor = await this.ActorModel.create(defaultValue);
		return actor._id;
	}

	async update(_id: string, dto: ActorDto) {
		const actor = await this.ActorModel.findByIdAndUpdate(_id, dto, { new: true }).exec();
		if (!actor) throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
		return actor;
	}

	async getCount() {
		return this.ActorModel.find().count().exec();
	}

	async delete(id: string) {
		const actor = await this.ActorModel.findByIdAndDelete(id);
		if (!actor) throw new NotFoundException(ERROR_MESSAGE.GENRE_NOT_FOUND);
		return actor;
	}
}
