import { FixedDateGenerator } from "../../core/adapters/fixed-date-generator";
import { FixedIdGenerator } from "../../core/adapters/fixed-id-generator";

import { User } from "../../user/entities/user.entity";

import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { Conference } from "../entities/conference.entity";

import { OrganizeConference } from "./organize-conference";

describe('Feature: Organize conference', () => {
    function expectConferenceToEqual(conference: Conference) {
        expect(conference.props).toEqual({
            id: 'id-1',
            organizerId: 'johnDoe',
            title: 'My first conference',
            startDate: new Date('2024-09-01T10:00:00.000Z'),
            endDate: new Date('2024-09-01T11:00:00.000Z'),
            nbrSeat: 100
        });
    }

    const johnDoe = new User({
        id: 'johnDoe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty'
    });

    let repository: InMemoryConferenceRepository;
    let idGenerator: FixedIdGenerator;
    let dateGenerator: FixedDateGenerator;
    let useCase: OrganizeConference;

    beforeEach(() => {
        repository = new InMemoryConferenceRepository();
        idGenerator = new FixedIdGenerator();
        dateGenerator = new FixedDateGenerator();
        useCase = new OrganizeConference(repository, idGenerator, dateGenerator);
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-09-01T10:00:00.000Z'),
            endDate: new Date('2024-09-01T11:00:00.000Z'),
            nbrSeat: 100
        }

        it('Should return the ID', async () => {
            const result = await useCase.execute(payload);
    
            expect(result.id).toEqual('id-1');
        })

        it('Shoud insert the conference into the database', async () => {
            await useCase.execute(payload);

            const createdConference = repository.database[0];
    
            expect(repository.database.length).toBe(1);
            expectConferenceToEqual(createdConference);
        })
    })

    describe('Scenario: Conference happens to soon', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-02T10:00:00.000Z'),
            endDate: new Date('2024-01-02T11:00:00.000Z'),
            nbrSeat: 100
        }

        it('Shoud throw an error', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must happen in at least 3 days');
        })

        it('Shoud not create a conference', async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (err) {}

            expect(repository.database.length).toBe(0);
        })
    })

    describe('Scenario: Conference has to many seat', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-10T10:00:00.000Z'),
            endDate: new Date('2024-01-10T11:00:00.000Z'),
            nbrSeat: 1001
        }

        it('Shoud throw an error', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must have a maximum of 1000 seats');
        })

        it('Shoud not create a conference', async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (err) {}

            expect(repository.database.length).toBe(0);
        })
    })

    describe('Scenario: Conference doesn\'t have enough seats', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-10T10:00:00.000Z'),
            endDate: new Date('2024-01-10T11:00:00.000Z'),
            nbrSeat: 19
        }

        it('Shoud throw an error', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must have a minimum of 20 seats');
        })

        it('Shoud not create a conference', async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (err) {}

            expect(repository.database.length).toBe(0);
        })
    })

    describe('Scenario: Conference is too long', () => {
        const payload = {
            user: johnDoe,
            title: 'My first conference',
            startDate: new Date('2024-01-10T10:00:00.000Z'),
            endDate: new Date('2024-01-10T14:00:00.000Z'),
            nbrSeat: 100
        }

        it('Shoud throw an error', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must be no longer than 3 hours');
        })

        it('Shoud not create a conference', async () => {
            try {
                await expect(useCase.execute(payload)).rejects.toThrow();
            } catch (err) {}

            expect(repository.database.length).toBe(0);
        })
    })
})