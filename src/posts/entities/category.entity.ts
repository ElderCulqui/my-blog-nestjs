import { UpdateDateColumn, 
    ManyToMany, 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    Column 
} from "typeorm";
import { Post } from './post.entity';


@Entity({
    name: 'categories'
})
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true})
    name: string;

    @Column({ type: 'varchar', length: 800, nullable: true})
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'cover_image' })
    coverImage: string;

    @CreateDateColumn({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP', 
        name: 'created_at' 
    })
    createdAt: Date;

    @UpdateDateColumn({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP', 
        name: 'updated_at' 
    })
    updatedAt: Date;

    @ManyToMany(() => Post, (post) => post.categories)
    posts: Post[];
}
