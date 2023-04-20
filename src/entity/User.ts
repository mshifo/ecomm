import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import bcrypt from "bcryptjs";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ default: false })
    isadmin!: boolean;

    @Column({ nullable: true })
    avatarurl!: string;

    @Column({ default: false })
    isemailverified!: boolean;

    @Column({ nullable: true })
    emailverificationtoken!: string;

    @Column({ nullable: true })
    passwordresettoken!: string;

    @Column({ nullable: true })
    passwordresettokenexpiresat!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
