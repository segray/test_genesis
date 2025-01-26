import { Controller, Post, UseFilters } from '@nestjs/common';
import { AmoEntityService } from './amo-entity.service';
import { AmoEntityFilter } from './amo-entity.filter';

@Controller('entity')
@UseFilters(new AmoEntityFilter())
export class AmoEntityController {
  constructor(private readonly amoEntityService: AmoEntityService) {}

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
