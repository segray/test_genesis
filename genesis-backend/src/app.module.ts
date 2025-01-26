import { Module } from '@nestjs/common';
import { AmoEntityService } from './amo-entity/amo-entity.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmoTokenService } from './amo-token/amo-token.service';
import { amoTokenInterceptor } from './amo-token/amo-token.interceptor';
import { MockController } from './mock/mock.controller';
import { AmoEntityController } from './amo-entity/amo-entity.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get<string>('AMO_BASE_URL'),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [MockController, AmoEntityController],
  providers: [
    AmoEntityService,
    AmoTokenService,
    {
      provide: 'AmoRestHttp',
      inject: [HttpService, AmoTokenService],
      useFactory: amoTokenInterceptor,
    },
  ],
})
export class AppModule {}
