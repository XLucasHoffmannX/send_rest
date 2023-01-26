import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookModule } from './modules/book/book.module';
import { UserModule } from './modules/user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ArchivesModule } from './modules/archives/archives.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { SpreadsModule } from './modules/spreads/spreads.module';

@Module({
	imports: [BookModule, UserModule, ArchivesModule, DocumentsModule, SpreadsModule],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes('/access/user/edit/:id', '/access/user/delete/:id', 'access/user/auth', 'access/user/all', 'documents/up', '/spreads', '/archives/get');
	}
}
