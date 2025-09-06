import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Env } from './env.model';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Env>) => ({
        type: 'postgres',
        host: configService.get('HOST_DB'),
        port: configService.get('PORT_DB'),
        username: configService.get('USER_DB'),
        password: configService.get('PASSWORD_DB'),
        database: configService.get('NAME_DB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
