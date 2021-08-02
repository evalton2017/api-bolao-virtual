import { Aposta } from "../model/aposta.model";
import { Perfil } from "../model/perfil.model";

export interface PessoaInterface{

  id?: number;
  nome?: string;
  email?: string;
  cpf?: string;
  perfis?: Perfil[];
  apostas?: Aposta[];

}
