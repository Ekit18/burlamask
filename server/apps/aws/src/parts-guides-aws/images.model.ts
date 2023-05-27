import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

export enum staticType {
    Part = 'part',
    Guide = 'guide'
}
@Table({ tableName: 'images' })
export class Images extends Model<Images> {
    @ApiProperty({ example: "1", description: "Unique file ID" })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ApiProperty({ example: "https://parts-guides.s3.eu-central-1.amazonaws.com/uuid-s.txt", description: "Unique file URL" })
    @Column({ type: DataType.STRING, unique: true })
    url: string;

    @ApiProperty({ example: "part-uuid-partname.png", description: "Unique file key (name) in the bucket" })
    @Column({ type: DataType.STRING, unique: true })
    key: string;

    @ApiProperty({ example: "Part/Guide", description: "Type of static file" })
    @Column({ type: DataType.STRING })
    description: string;
}
