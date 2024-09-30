import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
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

  imgUrl?: string;

  @IsInt()
  @Min(1)
  @Max(5000)
  releasedEpisodes?: number;

  @IsInt()
  @Min(1)
  @Max(5000)
  episodes?: number;
}

export interface createTitleDtoIterface {
  name: string;

  description?: string;

  premiereYear: number;

  imgUrl?: string;

  releasedEpisodes?: number;

  episodes?: number;
}

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  @Matches(/^([1-9][0-9]{0,3}|10000)$/, {
    message: 'page must be a positive integer between 1 and 10000',
  })
  page?: string;

  @IsOptional()
  @IsNumberString()
  @Matches(/^([1-9][0-9]?|1[0-9][0]|200)$/, {
    message: 'perPage must be a positive integer between 1 and 200',
  })
  perPage?: string;
}

export interface PaginationInterface {
  page?: number;
  perPage?: number;
}

export enum TITLE_FILTER_ENUM {
  OrderByASC = 'ASC',
  OrderByDESC = 'DESC',
}
