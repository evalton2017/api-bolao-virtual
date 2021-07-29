import firebase from 'firebase';
import admin, { credential } from 'firebase-admin';
import AppError from './shared/errors/AppError';
import { AppLogger } from './util/appLogger';

const config = {
  apiKey: process.env.APP_AUTH_APIKEY,
  authDomain: process.env.APP_AUTH_AUTHDOMAIN,
  databaseURL: process.env.APP_AUTH_DATABASEURL,
  projectId: process.env.APP_AUTH_PROJECTID,
  storageBucket: process.env.APP_AUTH_STORAGEBUCKET,
  messagingSenderId: process.env.APP_AUTH_MESSAGINGSENDERID,
  appId: process.env.APP_AUTH_APPID,
  measurementId: process.env.APP_AUTH_MEASUREMENTID
};

const params = {
  type: process.env.APP_FIREBASE_TYPE,
  projectId: process.env.APP_FIREBASE_PROJECT_ID,
  privateKeyId: process.env.APP_FIREBASE_PRIVATE_KEY_ID,
  privateKey: `${process.env.APP_FIREBASE_PRIVATE_KEY}`,
  clientEmail: process.env.APP_FIREBASE_CLIENT_EMAIL,
  clientId: process.env.APP_FIREBASE_TYPE_CLIENT_ID,
  authUri: process.env.APP_FIREBASE_AUTH_URI,
  tokenUri: process.env.APP_FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.APP_FIREBASE_AUTH_PROVEDER,
  clientC509CertUrl: process.env.APP_FIREBASE_CLIENT_CERT_URL,
};

class Auth {
  constructor() {
    AppLogger.configureLogger();
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
      admin.initializeApp({ credential: admin.credential.cert(params) });
    } else {
      firebase.app();
    }
     const db = admin.firestore();
  }

  //METODO RESPONSAVEL POR CRIAR O USUARIO NO FIREBASE
  async SigUpWithWmailAndPassword(
    email: any,
    password: any,
    callback: any
  ): Promise<any> {
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      callback(user);
    } catch (error) {
      callback(new AppError(error.message));
    }
  }

  //REALIZA A AUTENTICAÇÃO DO USUARIO
  async SignInwithWmailAndPassword(
    email: any,
    password: any,
    callback: any
  ): Promise<any> {
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      callback(response);
    } catch (error) {
      callback(new AppError(error.message));
    }
  }

  //REALIZAR O RESETE DE SENHA DO USUARIO
  async SendPasswordResetEmail(email: any): Promise<any> {
    try {
      return await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
      return new AppError(error.message);
    }
  }

  //RETORNA DADOS DO USUARIO PASSANDO O EMAIL
  async getUserByEmail(email: any) {
    return admin
      .auth()
      .getUserByEmail(email)
      .then((user) => {
        //this.setCustomUserClaimms(user.uid, perfil);
        return this.verificaClaim(user.uid);
      })
      .catch(function (error) {
        return new AppError(error.message);
      });
  }

  //INSERI OS DADOS DO USUARIO NO FIREBASE
  insertUserData(name: any) {
    return firebase
      .database()
      .ref('users')
      .push({
        name,
      })
      .then(function () {
        console.log('Synchronization succes');
      })
      .catch(function (error) {
        console.log('Synchronization failed');
      });
  }

  //METODO PARA REALIZAR AUTORIZAÇÃO
  validate(req: any, res: any, next: any) {
    let token = req.headers['authorization'];
    token = token.split('Bearer ');
    if (token) {
      admin
        .auth()
        .verifyIdToken(token[1])
        .then((result) => {
          next();
        })
        .catch((error) => {
          return res.status(401).send({
            success: false,
            message: '401- unathorized',
          });
        });
    } else {
      return res.status(401).send({
        success: false,
        message: '401- unathorized',
      });
    }
  }

  //VERIFICA O CUSTOM DO USUARIO
  async verificaClaim(uid: any) {
    return admin
      .auth()
      .getUser(uid)
      .then((userRecord) => {
        AppLogger.info(userRecord);
        return userRecord;
      })
      .catch(function (error) {
        return new AppError(error.message);
      });
  }

  //retorno usuario com perfil
  async verificaPerfil(email: any): Promise<any> {
    return admin
      .auth()
      .getUserByEmail(email)
      .then((user) => {
        return this.retornaPerfil(user.uid);
      })
      .catch(function (error) {
        return new AppError(error.message);
      });
  }

  async retornaPerfil(uid: any): Promise<any> {
    return admin
      .auth()
      .getUser(uid)
      .then((userRecord) => {
        AppLogger.info(userRecord.customClaims);
        return userRecord.customClaims;
      })
      .catch(function (error) {
        return new AppError(error.message);
      });
  }

  /*  //SETA O CUSTOM NO USUARIO
    async setCustomUserClaimms(uid: any, tipo: any) {
      switch (tipo) {
        case 'User': {
          admin.auth().setCustomUserClaims(uid, { Filiado: true, Ativo: false })
          break;
        }
        case 'Competidor': {
          admin.auth().setCustomUserClaims(uid, { Competidor: true, Ativo: true })
          break;
        }
      }
    }*/
}

export default Auth;
