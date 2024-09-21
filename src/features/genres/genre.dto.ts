import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GenreDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40, { message: 'should be less than 40 symbols' })
  name: string;
}
