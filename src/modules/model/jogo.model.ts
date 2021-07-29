import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { NumeroJogo } from "./numero.jogo.model";

@Entity()
export class Jogo{

    @PrimaryColumn()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({length:50})
    concurso?: string;

    @Column("decimal")
    ganhadores?: number;

    @Column({nullable: true})
    data?: Date;

    @OneToMany(type => NumeroJogo, numeros => numeros.jogo,{cascade:true})
    numeros?: NumeroJogo[];

}
