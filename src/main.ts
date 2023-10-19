import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';

async function bootstrap() {
	const PORT = process.env.PORT || 7000;
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.enableCors({ origin: process.env.CLIENT_URL });

	const config = new DocumentBuilder()
		.setTitle('Online cinema')
		.setDescription('REST API Documentation')
		.setVersion('1.0.0')
		.addTag('egolab')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api/docs', app, document);
	await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
bootstrap();
