import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class createTitleDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9\s\-:,!.?']{1,100}$/, {
    message:
      'Title must be 1-100 characters long and can only contain letters, numbers, spaces, and basic punctuation.',
  })
  name: string;

  @IsString()
  @MaxLength(1300, {
    message: 'Description must not exceed 1300 characters.',
  })
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(2099)
  premiereYear: number;
}
