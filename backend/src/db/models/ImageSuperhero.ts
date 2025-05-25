import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Superhero } from './Superhero';

@Table({ tableName: 'image_superheroes', timestamps: false })
export class ImageSuperHero extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  url!: string;

  @Column(DataType.STRING)
  public_id!: string;

  @ForeignKey(() => Superhero)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  superheroId!: number;

  @BelongsTo(() => Superhero, {
    onDelete: 'CASCADE',
    as: 'superhero',
  })
  superhero!: Superhero;
}
