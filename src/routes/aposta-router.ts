import * as express from "express";
import ApostaController from "../modules/controllers/aposta-controller";

const apostaRouter = express.Router();
const apostaController = new ApostaController();

//ROTA PARA CRIAR JOGOS
apostaRouter.route('/cadastrar').post(apostaController.cadastrarAposta);

//ROTA PARA BUSCAR JOGOS DO USUARIO LOGADO
apostaRouter.route('/consultar/:email').post(apostaController.buscarApostas);

export default apostaRouter;
