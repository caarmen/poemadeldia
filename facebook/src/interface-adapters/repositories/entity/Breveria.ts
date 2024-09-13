import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("breverias")
export class Breveria {
  @PrimaryColumn("text")
  poem_number!: string;

  @Column("text")
  content!: string;

  @Column("text")
  year!: string;

  @Column("text")
  month!: string;
}
