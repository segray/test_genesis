import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { TAmoEntity, TAmoResponse } from './amo-entity.type';

@Injectable()
export class AmoEntityService {
  constructor(
    @Inject('AmoRestHttp') private readonly httpService: HttpService,
  ) {}

  create(entity: TAmoEntity) {
    // создаем одну пустую сущность
    return this.httpService.post(`/api/v4/${entity}`, [{}]).pipe(
      map(({ data }: { data: TAmoResponse }) => {
        const id: number = data?._embedded?.[entity]?.[0]?.id ?? 0;
        return {
          id,
          entity,
          href: new URL(
            `/${entity}/detail/${id}`,
            this.httpService.axiosRef.defaults.baseURL,
          ).href,
        };
      }),
    );
  }
}
