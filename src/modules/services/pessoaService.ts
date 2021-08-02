import {getCustomRepository, getRepository } from 'typeorm';
import { Pessoa } from '../model/pessoa.model';
import * as nodemailer from 'nodemailer';
import { PessoaRepository } from '../repository/pessoa.repository';
import { PessoaInterface } from '../interface/pessoa.interface';

class PessoaService{

    erro:any;

    transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'ctmclube@gmail.com',
            pass:'ctm@293847'
        }
    });

    async getPessoas() {
        const repository = getCustomRepository(PessoaRepository);
        return repository.find({relations:["perfis"]});
    }

    async getPessoaByEmail(email:string): Promise<Pessoa | undefined> {
        const repository = getCustomRepository(PessoaRepository);
        return repository.findOne({email:email},{relations:["perfis"]})
    }




    adicionarMinutos(data:any, minutos:any) {
        return new Date(data.getTime() + minutos * 60000);
   }

   emailContato(email: any){
        const mailOptions = {
        from: email.email,
        to:   'duke.ndsg@gmail.com',
        subject: email.assunto +' - Enviado pelo usuario '+email.email,
        text: email.mensagem
       };

      this.transporter.sendMail(mailOptions, function (err, info) {
              if (err) {
                console.log(err);
              }
              else {
                  console.log('email enviado');
              }
          })
   }
}

export default new PessoaService();
