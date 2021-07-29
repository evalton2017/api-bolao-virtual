import LoginController from "../modules/controllers/login-controller";
import * as express from "express";

const loginRouter = express.Router();
const loginController = new LoginController();

//ROTA PARA CRIAR USUARIO
loginRouter.route('/login/createUser').post(loginController.sigUpWithWmailAndPassword);

//ROTA PARA REALIZAR LOGIN
loginRouter.route('/login').post(loginController.signInwithWmailAndPassword);

//ROTA PARA RESETAR PASSWORD
loginRouter.route('/reset/password/:email').post(loginController.sendPasswordResetEmail);

//RECUPERA O PERFIL DO USUARIO
loginRouter.route('/login/rules').post(loginController.verificaRules);


export default loginRouter;



