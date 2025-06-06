/*
  - Este repositório específico lida com operações da entidade Adotante.
  - O AdotanteRepository é um repositório customizado que estende um repositório genérico (BaseRepository), promovendo reutilização de lógica de acesso a dados.
  - Pode conter métodos específicos da entidade Adotante no futuro, além dos já herdados da base.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Adotante } from '../models/adotante.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class AdotanteRepository extends BaseRepository<Adotante> {
  constructor(
    @InjectRepository(Adotante) // Injeta o repositório da entidade Adotante fornecido pelo TypeORM
    adotanteOrmRepository: Repository<Adotante>,
    dataSource: DataSource, 
  ) {
    super(adotanteOrmRepository, dataSource, 'id_adotante'); // Define o nome da chave primária da entidade

  }

}
