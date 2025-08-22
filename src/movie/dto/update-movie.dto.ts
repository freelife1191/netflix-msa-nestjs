import { IsDefined, IsNotEmpty, IsOptional, registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";

export class UpdateMovieDto {
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @IsNotEmpty()
    @IsOptional()
    genre?: string;
}