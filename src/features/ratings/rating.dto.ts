import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class RatingDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  value: number;
}
