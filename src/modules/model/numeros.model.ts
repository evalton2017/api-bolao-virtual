import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aposta } from "./aposta.model";

@Entity()
export class Numero{

    @PrimaryGeneratedColumn()
    id?:number;

    @Column()
    numero?: number;

    @ManyToOne(type => Aposta, aposta=> aposta.numeros)
    aposta?: Aposta;
}

