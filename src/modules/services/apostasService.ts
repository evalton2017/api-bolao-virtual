import AppError from '../../shared/errors/AppError';
import { getRepository } from 'typeorm';
import { Aposta } from '../model/aposta.model';
import pessoaService from './pessoaService';
import { Numero } from '../model/numeros.model';
import { EnumStatus } from '../enums/EnumStatus';
import { Pessoa } from '../model/pessoa.model';
import { ApostaDTO } from '../dtos/apostaDto';
import {vigenciaAtual} from '../../util/data-util';

class ApostaService {
  async cadastrarAposta(apostaDto: ApostaDTO): Promise<Aposta> {
    const aposta: Aposta = new Aposta();
    const vigencia = vigenciaAtual();
    const pessoa = await pessoaService.getPessoaByEmail(apostaDto?.email);
    const numeros: Numero[] = [];
    apostaDto.apostas.forEach((ap: number) => {
      const numero: Numero = new Numero();
      numero.numero = ap;
      numeros.push(numero);
    });
    aposta.pessoa = this.converterPessoa(pessoa);
    aposta.numeros = numeros;
    aposta.ativo = true;
    aposta.dataAposta = new Date();
    aposta.status = EnumStatus.Pendente;
    aposta.valor = 40.00;
    aposta.acertos = 0;
    aposta.vigencia = vigencia;
    const apostaRepository = getRepository(Aposta);
    return await apostaRepository.save(aposta);

  }

 async buscarApostas(email: string) {
    const pessoa = this.converterPessoa(pessoaService.getPessoaByEmail(email));
    const vigencia = vigenciaAtual();
    return  await getRepository(Aposta)
   .createQueryBuilder("aposta") .leftJoinAndSelect("aposta.pessoa", "pessoa")
   .leftJoinAndSelect("aposta.numeros", "apostas")
   .setParameters({ idpessoa: pessoa.id })
   .setParameters({ vigencia: vigencia })
   .where("pessoa.id = :idpessoa")
   .where("aposta.vigencia = :vigencia")
   .getMany();

  }

  converterPessoa(obj: any): Pessoa {
    const pessoa: Pessoa = new Pessoa();
    if (obj) {
      pessoa.id = obj.id;
      pessoa.cpf = obj.cpf;
      pessoa.email = obj.email;
      pessoa.nome = obj.nome;
    }
    return pessoa;
  }

}

export default ApostaService;
