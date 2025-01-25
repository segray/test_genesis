import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AmoTokenService {
  // временно хранится в памяти
  static tokenDb: Record<string, Promise<string> | undefined> = {};
  static axiosRefresh: AxiosInstance;

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
    return (AmoTokenService.tokenDb[hostname] = AmoTokenService.axiosRefresh
      .get('')
      .then((res) => {
        return res.data.access_token as string;
      }));
  }

  exists(hostname: string): boolean {
    return AmoTokenService.tokenDb[hostname] !== undefined;
  }
}
