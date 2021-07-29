import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Aposta } from "./aposta.model";
import { Perfil } from "./perfil.model";

@Entity()
export class Pessoa{

    @PrimaryColumn()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length:200})
    nome?: string;

    password?: string;

    @Column()
    email?: string;

    @Column({nullable: true})
    cpf?: string;

    @OneToMany(type => Perfil, perfis => perfis.pessoa,{cascade:true})
    perfis?: Perfil[];

    @OneToMany(type => Aposta, apostas => apostas.pessoa,{cascade:true})
    apostas?: Aposta[];

}
