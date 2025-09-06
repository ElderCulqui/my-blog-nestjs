import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
    updatedAt: Date;

    @OneToOne(() => Profile, { nullable: false, cascade: true })
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @OneToMany(() => Post, (post) => post.user)
    @JoinColumn({ name: 'user_id' })
    posts: Post[];
}