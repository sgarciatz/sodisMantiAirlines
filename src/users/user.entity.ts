import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity({database: 'manti', name: 'users'})
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  username: string;

  @Column()
  password: string;
}
