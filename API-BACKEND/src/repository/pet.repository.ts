/*
  - Este repositório específico lida com operações da entidade Pet.
  - O PetRepository é um repositório customizado que estende um repositório genérico (BaseRepository), promovendo reutilização de lógica de acesso a dados.
  - Pode conter métodos específicos da entidade Pet no futuro, além dos já herdados da base.
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pet } from '../models/pet.model';
import { BaseRepository } from './base.repository';

@Injectable()
export class PetRepository extends BaseRepository<Pet> {
  constructor(
    @InjectRepository(Pet) // Injeta o repositório da entidade Pet fornecido pelo TypeORM
    petOrmRepository: Repository<Pet>,
    dataSource: DataSource,
  ) {
    super(petOrmRepository, dataSource, 'id_pet'); // Define o nome da chave primária da entidade

  }

 
//MÉTODO: Para tratamento de DELETE
/* Aqui, é o metodo utilizado para quando tenta fazer o delete de um Adotante que já adotou algum PET*/
/* Que consta no banco de dados vinculado a algum pet */
async findByAdotanteId(adotanteId: number): Promise<Pet[]> {
  return this.repository.find({
    where: {
      adotante_id: {
        id_adotante: adotanteId, 
      },
    },
  });
}
}
