import { Request, Response } from 'express';
import LoginService from '../services/loginService';
import Auth from '../../firebase-auth';

class LoginController {


  //REALIZA A CRIAÇÃO DO USUARIO
  async sigUpWithWmailAndPassword(req: Request, res: Response): Promise<Response> {
    const auth = new Auth();
    const service = new LoginService(auth);
    const pessoa = req.body;
    return service.createdUser(pessoa, (response: Response) => {
      if (response) {
        res.send(response);
      } else {
        res.status(422).send('Usuario ou senha inválidos');
      }
    });
  }
  
  //REALIZA O ACESSO
  async signInwithWmailAndPassword(req: Request, res: Response): Promise<Response> {
    const auth = new Auth();
    const service = new LoginService(auth);
    const user = req.body;
   return service.signInwithWmailAndPassword(user, (response: Response) => {
     if (response) {
        res.send(response);
      } else {
        res.status(422).send('Erro: Usuario ou senha invalido');
      }
    });
  }

  //REALIZA A REDEFINIÇÃO DA SENHA
  async sendPasswordResetEmail(req: Request, res: Response): Promise<any> {
    const email = req.params.email;
    const auth = new Auth();
    const service = new LoginService(auth);
    return  service
      .sendPasswordResetEmail(email)
      .then((resposta) => {
        console.log(resposta)
        if(resposta){
          res.json('Redefinição de senha encaminhada para o email');
        }else{
          res
          .status(400)
          .send('Erro, verifique o email e tente novamente.');
        }
      })
      .catch((error) => {
        res
          .status(400)
          .send('Erro, verifique o email e tente novamente.' + error.message);
      });
  }

  async verificaRules(req: Request, res: Response): Promise<any> {
    const getBody = req.body;
    const auth = new Auth();
    const service = new LoginService(auth);
    return service.verificaRules(getBody.email);
  }

  async buscaCep(req: any, res: any): Promise<any> {
  /*  let cep = req.params.cep;
    cep = cep.replace(/\.|-/g, '');
    const url = `http://viacep.com.br/ws/${cep}/json`;
    await axios
      .get<any>(url)
      .then((endereco) =>
        Helper.sendResponse(res, httpStatus.OK, endereco.data)
      )
      .catch((error) => console.error.bind(console, `Error ${error}`));*/
  }

}



export default LoginController;
