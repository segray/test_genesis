import { Controller, Post } from '@nestjs/common';
import { AmoEntityService } from './amo-entity.service';

@Controller('entity')
export class AmoEntityController {
  constructor(
    private readonly amoEntityService: AmoEntityService,
  ) {}

  @Post('companies')
  createCompany() {
    return this.amoEntityService.create('companies');
  }

  @Post('leads')
  createLead() {
    return this.amoEntityService.create('leads');
  }

  @Post('contacts')
  createContact() {
    return this.amoEntityService.create('contacts');
  }
}
