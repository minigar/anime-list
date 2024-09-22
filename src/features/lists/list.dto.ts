import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ListDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'Name can only contain letters and numbers.',
  })
  name: string;
}
