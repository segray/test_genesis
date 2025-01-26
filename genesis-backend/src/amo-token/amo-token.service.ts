import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AmoEntityError } from 'src/amo-entity/amo-entity.filter';

type TTokenResponse = {
  access_token: string;
};

@Injectable()
export class AmoTokenService {
  // временно хранится в памяти
  private static tokenDb: Record<string, Promise<string> | undefined> = {};

  // отдельный инстанс для обновления токена
  private static axiosRefresh: AxiosInstance;

  constructor(configService: ConfigService) {
    if (!AmoTokenService.axiosRefresh) {
      AmoTokenService.axiosRefresh = axios.create({
        baseURL: configService.get<string>('REFRESH_TOKEN_URL'),
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Id': configService.get<string>('AMO_CLIENT_ID'),
        },
      });
    }
  }

  get(hostname: string): Promise<string> {
    return AmoTokenService.tokenDb[hostname] ?? this.refresh(hostname);
  }

  refresh(hostname: string): Promise<string> {
    // в tokenDb перезаписываем промисы, чтобы другие таски не ломились обновлять одновременно
    return (AmoTokenService.tokenDb[hostname] = AmoTokenService.axiosRefresh
      .get('')
      .then((res: { data: TTokenResponse }) => {
        return res.data.access_token;
      })
      .catch((error: AxiosError) => {
        throw AmoEntityError.fromAxoisError(error);
      }));
  }

  exists(hostname: string): boolean {
    return AmoTokenService.tokenDb[hostname] !== undefined;
  }
}
