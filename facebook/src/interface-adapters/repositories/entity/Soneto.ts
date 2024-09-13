import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("sonetos")
export class Soneto {
  @PrimaryColumn("text")
  poem_number!: string;

  @Column("text")
  title!: string;

  @Column("text")
  pre_content: string | undefined;

  @Column("text")
  content!: string;

  @Column("text")
  location!: string;

  @Column("text")
  year!: string;

  @Column("text")
  month!: string;

  @Column("text")
  day!: string;
}
