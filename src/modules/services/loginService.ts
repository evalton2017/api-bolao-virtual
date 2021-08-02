import Auth from '../../firebase-auth';
import AppError from '../../shared/errors/AppError';
import { getRepository } from 'typeorm';
import { Pessoa } from '../model/pessoa.model';
import { UserLogado } from '../model/userLogado.model';

class LoginService {
  constructor(private auth: Auth) {}

  async createdUser(pessoa: Pessoa, callback: any): Promise<any> {
    try {
      await this.auth.SigUpWithWmailAndPassword(
        pessoa.email = pessoa.email?.toLocaleLowerCase(),
        pessoa.password,
        (response: any) => {
          if (response.statusCode != 400) {
            this.cadastrarPessoa(pessoa);
            callback(response);
          } else {
            throw new AppError('Email invalido ou com cadastro ativo.');
          }
        }
      );
    } catch (error) {
      callback(error);
    }
  }

  async cadastrarPessoa(pessoa: any): Promise<void> {
    const repository = getRepository(Pessoa);
    const perfis = [{id: null, nome: 'USUARIO'}]
    pessoa.perfis = perfis;
    repository.save(pessoa);
   //this.setCustom(pessoa.email, pessoa.perfis[0].nome);
 }

 /*async setCustom(email: string, custom:any): Promise<void> {
  Auth.getUserByEmail(email, custom);
}*/


  async signInwithWmailAndPassword(user: UserLogado, callback: any): Promise<any> {
    try {
      await this.auth.SignInwithWmailAndPassword(
        user.email,
        user.password,
        (response: any) => {
          if (!response.statusCode) {
            const userLogado: UserLogado = new UserLogado();
            this.setUserLogado(response, userLogado);
            callback(response);
          } else {
            callback(new AppError('Email ou senha invalido.'));
          }
        }
      );
    } catch (error) {
      callback(error.message);
    }
  }

  public sendPasswordResetEmail(email: string): Promise<any> {
    return this.auth
      .SendPasswordResetEmail(email)
      .then((resposta: any) => {
        console.log(resposta);
        if (resposta?.statusCode) {
          return false;
        } else {
          return true;
        }
      })
      .catch((error) => {
        throw new AppError(error.message);
      });
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.auth
      .getUserByEmail(email)
      .then((resposta) => {
        return resposta ? true : false;
      })
      .catch((error) => {
        return error;
      });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async verificaRules(email: any) {
    return this.auth
      .verificaPerfil(email)
      .then((retorno) => {
        return retorno;
      })
      .catch((error) => {
        return error;
      });
  }

  async setUserLogado(user: any, userLogado: UserLogado): Promise<UserLogado> {
    userLogado.token = user.user ? user.user.za : user.token;
    userLogado.email = user.user ? user.user.email : user.email;
    userLogado.uid = user.user ? user.user.uid : user.uid;
    userLogado.rules = [await this.verificaRules(userLogado.email)];
    return userLogado;
  }
}

export default LoginService;
