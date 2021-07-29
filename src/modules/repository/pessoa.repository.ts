import { Pessoa } from "../model/pessoa.model";
import {EntityRepository, Repository} from "typeorm";


@EntityRepository(Pessoa)
export class PessoaRepository extends Repository<Pessoa>{

}
