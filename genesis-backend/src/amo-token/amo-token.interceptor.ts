import { HttpService } from "@nestjs/axios";
import { AmoTokenService } from "./amo-token.service";

export const amoTokenInterceptor = (
  httpService: HttpService,
  amoTokenService: AmoTokenService,
) => {
  const axiosAccess = httpService.axiosRef;

  const extractHostname = (config) => {
    return new URL(config.baseURL || config.url).hostname;
  };

  const withAccessToken = async (config) => {
    const hostname = extractHostname(config);

    if (!amoTokenService.exists(hostname)) {
      config.sent = true;
    }

    const newToken = await amoTokenService.get(hostname);
    config.headers.set('Authorization', `Bearer ${newToken}`);

    return config;
  };

  axiosAccess.interceptors.request.use((config) => {
    return withAccessToken(config);
  });

  axiosAccess.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      if (error.response && error.response.status === 401 && !config.sent) {
        config.sent = true;
        amoTokenService.refresh(extractHostname(config));
        return axiosAccess(await withAccessToken(config));
      }

      return Promise.reject(error);
    },
  );

  return httpService;
};
