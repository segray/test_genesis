import { HttpService } from '@nestjs/axios';
import { AmoTokenService } from './amo-token.service';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AmoEntityError } from 'src/amo-entity/amo-entity.filter';

type TConfigWithSent = InternalAxiosRequestConfig & { sent: boolean };

// добавляем access токен во все запросы, перезапрашиваем токен, в случай ошибки авторизации
export const amoTokenInterceptor = (
  httpService: HttpService,
  amoTokenService: AmoTokenService,
) => {
  const axiosAccess = httpService.axiosRef;

  const extractHostname = (config: TConfigWithSent) => {
    return new URL((config.baseURL || config.url) ?? '').hostname;
  };

  const withAccessToken = async (config: TConfigWithSent) => {
    const hostname = extractHostname(config);

    if (!amoTokenService.exists(hostname)) {
      config.sent = true;
    }

    const newToken = await amoTokenService.get(hostname);
    config.headers.set('Authorization', `Bearer ${newToken}`);

    return config;
  };

  axiosAccess.interceptors.request.use((config: TConfigWithSent) => {
    return withAccessToken(config);
  });

  axiosAccess.interceptors.response.use(
    (response) => response,
    async (error: { config: TConfigWithSent; response: AxiosResponse }) => {
      const config = error.config;

      if (error.response && error.response.status === 401 && !config.sent) {
        // не делаем повторные запросы если новые токены не проходят
        config.sent = true;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        amoTokenService.refresh(extractHostname(config));
        return axiosAccess(await withAccessToken(config));
      }

      return Promise.reject(new AmoEntityError('', error.response.status));
    },
  );

  return httpService;
};
