import { Exclude, Transform } from 'class-transformer';

export class User {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update

  @Transform(({ value }) => value.getTime())
  createdAt: number; // timestamp of creation

  @Transform(({ value }) => value.getTime())
  updatedAt: number; // timestamp of last update

  @Exclude()
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
