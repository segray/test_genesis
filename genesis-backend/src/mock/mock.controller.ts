import { Controller, Get, Post } from '@nestjs/common';
import { TAmoEntity } from 'src/amo-entity/amo-entity.type';

@Controller('api/v4')
export class MockController {
  private create(entity: TAmoEntity) {
    const id = Math.floor(Math.random() * 10 ** 9);

    return {
      _embedded: {
        [entity]: [
          {
            id: id,
          },
        ],
      },
    };
  }

  @Post('leads')
  createLead() {
    return this.create('leads');
  }

  @Post('contacts')
  createContact() {
    return this.create('contacts');
  }

  @Post('companies')
  createCompany() {
    return this.create('companies');
  }

  @Get('refresh-token')
  refreshToken() {
    return {
      access_token: 'ny9mrOihjFw',
      base_domain: "---",
    };
  }
}