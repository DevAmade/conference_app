import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConferenceDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;

    @IsNumber()
    @IsNotEmpty()
    nbrSeat: number;
}

export class ChangeSeatsDto {
    @IsNumber()
    @IsNotEmpty()
    nbrSeat: number;
}

export class ChangeDatesDto {
    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}