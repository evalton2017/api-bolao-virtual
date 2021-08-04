import { Request, Response } from 'express';
import ApostaService from '../services/apostasService';

class ApostaController {
  //REALIZA A CRIAÇÃO DO USUARIO
  async cadastrarAposta(
    request: Request,
    response: Response
  ): Promise<Response> {
    const apostaService = new ApostaService();
    const apostaDto = request.body;
    const aposta = await apostaService.cadastrarAposta(apostaDto);
    return response.json(aposta);
  }

  //REALIZA A BUSCA DOS JOGOS DO USUARIO NO MES CORRENTE
  async buscarApostas(request: Request, response: Response): Promise<Response> {
    const apostaService = new ApostaService();
    const email = request.params.email;
    const aposta = await apostaService.buscarApostas(email);
    return response.json(aposta);
  }
}

export default ApostaController;
