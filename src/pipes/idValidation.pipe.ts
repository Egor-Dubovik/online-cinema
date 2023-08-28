import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ERROR_MESSAGE } from 'src/constant/message/error.message';

export class IdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') return value;
		if (!Types.ObjectId.isValid(value)) throw new BadRequestException(ERROR_MESSAGE.INVALID_ID);
		return value;
	}
}
