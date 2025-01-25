import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { TAmoEntity } from './amo-entity.type';

@Injectable()
export class AmoEntityService {
  constructor(
    @Inject('AmoRestHttp') private readonly httpService: HttpService,
  ) {}

  create(entity: TAmoEntity) {
    return this.httpService.post(`/api/v4/${entity}`, [{}]).pipe(
      map(({ data }) => {
        const id: number = data?._embedded[entity]?.[0]?.id;
        return {
          id,
          entity,
          href: new URL(
            `/${entity}/detail/${id}`,
            this.httpService.axiosRef.defaults.baseURL,
          ).href,
        };
      }),
      catchError(() => {
        throw new ServiceUnavailableException();
      }),
    );
  }
}
