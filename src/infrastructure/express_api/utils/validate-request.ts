import { validate, ValidationError } from "class-validator";
import { ClassConstructor, plainToClass } from 'class-transformer';

async function validationError(input: any): Promise<ValidationError[] | false> {
    const errors = await validate(input, { validationError: { target: true } });

    if(errors.length) {
        return errors;
    }
     
    return false;
}

export async function ValidatorRequest<T>(type: ClassConstructor<T>, body: any): Promise<{ errors: boolean | string, input: T }> {
    const input = plainToClass(type, body);
    const errors = await validationError(input);

    if(errors) {
        const errorMessage = errors.map(err => (Object as any).values(err.constraints)).join(', ');
        return { errors: errorMessage, input };
    }

    return { errors: false, input };
}