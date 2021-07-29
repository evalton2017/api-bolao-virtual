import LoginController from "../modules/controllers/login-controller";
import * as express from "express";
import LoginService from "../modules/services/loginService";
import Auth from '../firebase-auth';

const publicRouter = express.Router();
const auth = new Auth();
const service = new LoginService(auth);
const loginController = new LoginController();

//ROTA PARA CRIAR USUARIO
publicRouter.route('/buscaCep/:cep').post(loginController.buscaCep);


export default publicRouter;
