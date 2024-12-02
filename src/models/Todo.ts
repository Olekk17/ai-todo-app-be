import { DataTypes } from "sequelize";
import {
  AllowNull,
  Column,
  PrimaryKey,
  Table,
  Model,
  AutoIncrement,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./User";

@Table({
  tableName: "todos",
  createdAt: true,
  updatedAt: true,
})
export class Todo extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.INTEGER,
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
  })
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
  })
  description!: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.INTEGER,
  })
  userId!: number;

  @AllowNull(false)
  @Column({
    type: DataTypes.STRING,
  })
  status!: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.DATE,
  })
  inProgressAt!: Date;

  @AllowNull(true)
  @Column({
    type: DataTypes.DATE,
  })
  completedAt!: Date;

  @AllowNull(false)
  @Column({
    type: DataTypes.FLOAT,
  })
  estimatedTime!: number;
}
