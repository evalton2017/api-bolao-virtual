import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Jogo } from "./jogo.model";

@Entity()
export class NumeroJogo{

    @PrimaryGeneratedColumn()
    id?:number;

    @Column()
    numero?: number;

    @ManyToOne(type => Jogo, jogo=> jogo.numeros)
    jogo?: Jogo;
}

