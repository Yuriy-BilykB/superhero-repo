import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    HasMany,
} from 'sequelize-typescript';
import {ImageSuperHero} from "./ImageSuperhero";

@Table({ tableName: 'superheroes', timestamps: false })
export class Superhero extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    nickname!: string;

    @Column(DataType.STRING)
    real_name!: string;

    @Column(DataType.TEXT)
    origin_description!: string;

    @Column(DataType.STRING)
    superpowers!: string;

    @Column(DataType.STRING)
    catch_phrase!: string;

    @HasMany(() => ImageSuperHero, {
        onDelete: 'CASCADE',
        hooks: true,
        as: 'images'
    })
    images!: ImageSuperHero[];
}
