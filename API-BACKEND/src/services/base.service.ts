/*
 - Serviço base que contém métodos genéricos reutilizáveis por outros serviços de entidades.
 - Nesse base.service, contém validações como statusCode, HttpStatus, BAD_REQUEST
*/

import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt'; /* para segurança das senhas salvas */

export abstract class BaseService<T> {
  Delete: any;
  constructor(private readonly repository: any) {}

    // METODO: Retorna todos os registros, Deve ser retornado com Paginação:
    /** Tratamento de retorno para Filtros opcionais aqui dentro. **/
    /** Segurança nas senhas implementada aqui. **/
    async findAll(query?: any): Promise<any> {

        /* Extrai filtros e paginação do query */
        const { page = 1, limit = 10, ...filters } = query;

        /*Converte page e limit para number*/ 
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        /* Chama repository com filtros e paginação */ 
        const [data, total] = await this.repository.findAll(filters, pageNumber, limitNumber);

        return {
            statusCode: HttpStatus.OK,
            message: 'Registros retornados com sucesso.',
            data: this.sanitizePasswords(data), /* limpa campo senha */
            paginacao: { total, limit: limitNumber, page: pageNumber,
            },
        };
    }

    // METODO: Retorna um registro específico por ID:
    /** Segurança nas senhas implementada aqui. **/
    async findOne(id: number): Promise<any> {
        const data = await this.repository.findById(id);
        if (!data) {
        throw new HttpException(`Registro ${id} não encontrado.`, HttpStatus.NOT_FOUND);
        }
        return {
        statusCode: HttpStatus.OK,
        message: `Registro ${id} retornado com sucesso.`,
        data: this.sanitizePasswords(data), /* limpa campo senha */
        };
    }

    // METODO: Cria um novo registro:
    /** Segurança nas senhas implementada aqui. **/
    async create(data: T): Promise<any> {
        try {
            await this.hashPasswordIfPresent(data); /* aplica hash antes de salvar */

            const created = await this.repository.create(data);

            return {
            statusCode: HttpStatus.CREATED,
            message: 'Registro criado com sucesso.',
            data: created,
            };
        } catch (error: any) {
            throw new HttpException(
            {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Bad Request Exception',
                errors: error.response?.message || error.message || 'Erro desconhecido',
            },
            HttpStatus.BAD_REQUEST,
            );
        }
    }

    // METODO: Atualiza um registro existente com os dados fornecidos (parciais ou completos): 
    /** Segurança nas senhas implementada aqui. **/
    async update(id: number, data: Partial<T>): Promise<any> {
        try {
            await this.hashPasswordIfPresent(data); /* aplica hash se for atualização de senha */

            const updated = await this.repository.update(id, data);

            if (!updated) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Registro não encontrado.',
                    data: null,
                };
            }

            return {
                statusCode: HttpStatus.OK,
                message: `Registro ${id} atualizado com sucesso.`,
            };
        } catch (error: any) {
            throw new HttpException(
                {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Erro ao atualizar o registro.',
                errors: error.response?.message || error.message || 'Erro desconhecido',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }


    // METODO: Remove um registro:
    async remove(id: number): Promise<any> {
        const deleted = await this.repository.delete(id);
        if (!deleted) {
        throw new HttpException(`Registro ${id} não encontrado para remoção.`, HttpStatus.NOT_FOUND);
        }
        return {
            statusCode: HttpStatus.OK,
            message: `Registro ${id} removido com sucesso.`,
        };
    }

    // METODOS DE: VALIDAÇÕES REUTILIZAVEIS:
    /* Validação para campos de nome (ex: nomeAbrigo, nomeAdmin, nomeAdotante, nomePet), deve ser reaproveitada pelas entidades */
    protected validateNome(field: string, value: string, errors: string[]) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
        errors.push(`Campo "${field}" é obrigatório.`);
        } else if (value.length > 100) {
        errors.push(`Campo "${field}" deve ter no máximo 100 caracteres.`);
        }
    }

    /* Validação para campos de email (ex: emailAbrigo, emailAdmin, emailAdotante), deve ser reaproveitada pelas entidades */
    protected validateEmail(field: string, value: string, errors: string[]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!value || typeof value !== 'string' || value.trim().length === 0) {
        errors.push(`Campo "${field}" é obrigatório.`);
        } else if (!emailRegex.test(value)) {
        errors.push(`Campo "${field}" deve conter um e-mail válido.`);
        } else if (value.length > 150) {
        errors.push(`Campo "${field}" deve ter no máximo 150 caracteres.`);
        }
    }

    /* Validação para campos de celular (ex: celularAbrigo, celularAdmin, celularAdotante), deve ser reaproveitada pelas entidades */
    protected validateCelular(field: string, value: string, errors: string[]) {
        const celularRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;

        if (!value || typeof value !== 'string' || value.trim().length === 0) {
        errors.push(`Campo "${field}" é obrigatório.`);
        } else if (!celularRegex.test(value)) {
        errors.push(`Campo "${field}" deve conter um número de celular válido (ex: (11) 91234-5678).`);
        } else if (value.length > 20) {
        errors.push(`Campo "${field}" deve ter no máximo 20 caracteres.`);
        }
    }

    /* Validação para campos de senha (ex: senhaAdmin, senhaAdotante), deve ser reaproveitada pelas entidades */
    protected validateSenha(field: string, value: string, errors: string[]) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
        errors.push(`Campo "${field}" é obrigatório.`);
        } else if (value.length < 6) {
        errors.push(`Campo "${field}" deve conter no mínimo 6 caracteres.`);
        } else if (value.length > 50) {
        errors.push(`Campo "${field}" deve ter no máximo 50 caracteres.`);
        }
    }

    /* Validação para campos de data de cadastro (ex: dataCadastroAdmin, dataCadastroAdotante) */
    protected validateDataCadastro(field: string, value: any, errors: string[]) {
        const data = new Date(value);
        if (!value || isNaN(data.getTime())) {
        errors.push(`Campo "${field}" é obrigatório e deve conter uma data válida.`);
        }
    }

    /* Validação para campos de data de nascimento (ex: dataNascimentoPet) */
    protected validateDataNascimento(field: string, value: any, errors: string[]) {
        const data = new Date(value);
        if (!value || isNaN(data.getTime())) {
            errors.push(`Campo "${field}" é obrigatório e deve conter uma data válida.`);
        }
    }

    //METODO: Para hashear a senha, criar criptografia, segurança nas senhas:
    protected async hashPasswordIfPresent(data: any): Promise<void> {
        const senhaKey = Object.keys(data).find(key => key.toLowerCase().includes('senha'));
            if (senhaKey && typeof data[senhaKey] === 'string') {
            const saltOrRounds = 10;
            data[senhaKey] = await bcrypt.hash(data[senhaKey], saltOrRounds);
        }
    }

    //MÉTODOS: Para ocultar a senha nos retornos (GET), segurança nas senhas:
    private sanitizePasswords(data: any): any {
        if (Array.isArray(data)) { return data.map(obj => this.cleanPasswordField(obj)); }
        return this.cleanPasswordField(data);
    }

    private cleanPasswordField(obj: any): any {
        const newObj = { ...obj };
        for (const key of Object.keys(newObj)) {
            if (key.toLowerCase().includes('senha')) { newObj[key] = ''; /*ou null*/ }
        }
        return newObj;
    }


    // MÉTODO: Para autenticação, login. 
    /* Busca entidade por emailAdmin (usado em autenticação de Admin) */
    async findByEmail(email: string): Promise<T | null> {
        return this.repository.repository.findOne({
            where: { emailAdmin: email } as any,
        });
    }

}
