import { Controller, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { FileService } from './file.service';

@Controller('files')
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@Auth('admin')
	@UseInterceptors(FilesInterceptor('file'))
	async saveFiles(@UploadedFiles() file: Express.Multer.File[], @Query('folder') folder?: string) {
		return this.fileService.saveFiles(file, folder);
	}
}
