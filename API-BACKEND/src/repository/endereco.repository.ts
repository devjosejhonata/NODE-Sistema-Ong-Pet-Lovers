
/*
  - Este repositório específico lida com operações da entidade Endereco.
  - O EnderecoRepository é um repositório customizado que estende um repositório genérico, promovendo reutilização de lógica de acesso a dados.
  - Ele estende a funcionalidade genérica provida pelo BaseRepository.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { Endereco } from '../models/endereco.model';
import { BaseRepository } from './base.repository';

@Injectable() 
export class EnderecoRepository extends BaseRepository<Endereco> {
  constructor(
    @InjectRepository(Endereco) // Injeta o repositório da entidade Endereco fornecido pelo TypeORM
    enderecoOrmRepository: Repository<Endereco>,
    dataSource: DataSource, 
  ) {
    super(enderecoOrmRepository, dataSource, 'id_endereco');// Chama o construtor da classe base, passando o repositório injetado e o nome da chave primária da entidade
  }


  // Adicionar métodos específicos da entidade Endereco, se necessário no futuro.
}
