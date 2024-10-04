import { NextFunction, Request, Response } from "express";
import { AwilixContainer } from "awilix";

import { ChangeDatesDto, ChangeSeatsDto, CreateConferenceDto } from "../dto/conference.dto";
import { ValidatorRequest } from "../utils/validate-request";

export function createConference(container: AwilixContainer) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;
    
            const { errors, input } = await ValidatorRequest(CreateConferenceDto, body);
    
            if(errors) {
                return res.jsonError(errors, 400);
            }
    
            const result = await container.resolve('organizeConference').execute({
                user: req.user,
                title: input.title,
                startDate: input.startDate,
                endDate: input.endDate,
                nbrSeat: input.nbrSeat
            });
    
            return res.jsonSuccess({ id: result.id }, 201);
        } catch (error) {
            next(error);
        }
    }
}

export function changeSeats(container: AwilixContainer) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const body = req.body;
    
            const { errors, input } = await ValidatorRequest(ChangeSeatsDto, body);
    
            if(errors) {
                return res.jsonError(errors, 400);
            }
    
            await container.resolve('changeSeats').execute({
                user: req.user,
                conferenceId: id,
                nbrSeat: input.nbrSeat
            });
    
            return res.jsonSuccess({ message: 'The number of seats was changed correctly' }, 200);
        } catch (error) {
            next(error);
        }
    }
}

export function changeDates(container: AwilixContainer) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const body = req.body;
    
            const { errors, input } = await ValidatorRequest(ChangeDatesDto, body);
    
            if(errors) {
                return res.jsonError(errors, 400);
            }
    
            await container.resolve('changeDates').execute({
                user: req.user,
                conferenceId: id,
                startDate: input.startDate,
                endDate: input.endDate
            });
    
            return res.jsonSuccess({ message: 'The dates was changed correctly' }, 200);
        } catch (error) {
            next(error);
        }
    }
}