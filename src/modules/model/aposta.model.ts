import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Numero } from "./numeros.model";
import { Pessoa } from "./pessoa.model";

@Entity()
export class Aposta{

    @PrimaryColumn()
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({nullable: true})
    status?: string;

    @Column({nullable: true})
    vigencia?: string;

    @Column({nullable: true})
    ativo?: boolean;

    @Column("decimal", { precision: 8, scale: 2 })
    valor?: number;

    @Column("decimal")
    acertos?: number;

    @Column({nullable: true})
    dataAposta?: Date;

    @OneToMany(type => Numero, numeros => numeros.aposta,{cascade:true})
    numeros?: Numero[];


    @ManyToOne(type => Pessoa, pessoa=> pessoa.apostas)
    pessoa?: Pessoa;

}
