import { Model } from "mongoose"

import { TestApp } from "../../../test/utils/test-app"

import { testConference } from "../../tests/conference-seed";
import { Conference } from "../../entities/conference.entity";

import { MongoConference } from "./mongo-conference";
import { MongoConferenceRepository } from "./mongo-conference-repository";

describe('MongoConferenceRepository', () => {
    let app: TestApp;
    let model: Model<MongoConference.ConferenceDocument>;
    let repository: MongoConferenceRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoConference.ConferenceModel;
        await model.deleteMany({});
        repository = new MongoConferenceRepository(model);

        const record = new model({
            _id: testConference.conference1.props.id,
            organizerId: testConference.conference1.props.organizerId,
            title: testConference.conference1.props.title,
            startDate: testConference.conference1.props.startDate,
            endDate: testConference.conference1.props.endDate,
            nbrSeat: testConference.conference1.props.nbrSeat
        })

        await record.save();
    })

    afterEach(async () => {
        await app.tearDown();
    })

    describe('Scenario: Update a conference', () => {
        it('Should update conference corresponding to the id', async () => {
            await repository.update(new Conference({
                id: testConference.conference1.props.id,
                organizerId: testConference.conference1.props.organizerId,
                title: 'My other title of conference',
                startDate: testConference.conference1.props.startDate,
                endDate: testConference.conference1.props.endDate,
                nbrSeat: 100
            }));

            const fetchedConference = await repository.findById(testConference.conference1.props.id);

            expect(fetchedConference?.props).toEqual({
                id: testConference.conference1.props.id,
                organizerId: testConference.conference1.props.organizerId,
                title: 'My other title of conference',
                startDate: testConference.conference1.props.startDate,
                endDate: testConference.conference1.props.endDate,
                nbrSeat: 100
            });
        })
    })

    describe('Scenario: Create a conference', () => {
        it('Should create a conference', async () => {
            await repository.create(testConference.conference2);
            const fetchedConference = await repository.findById(testConference.conference2.props.id);

            expect(fetchedConference?.props).toEqual(testConference.conference2.props);
        })
    })

    describe('Scenario: Delete a conference', () => {
        it('Should delete a conference', async () => {
            await repository.delete(testConference.conference1.props.id);
            const fetchedConference = await repository.findById(testConference.conference1.props.id);

            expect(fetchedConference).toBeNull();
        })
    })

    describe('Scenario: findById', () => {
        it('Should find the conference corresponding to the id', async () => {
            const conference = await repository.findById(testConference.conference1.props.id);
            expect(conference?.props).toEqual(testConference.conference1.props);
        })

        it('Should return null if no conference found', async () => {
            const conference = await repository.findById('non-existing-id');
            expect(conference).toBeNull();
        })
    })
})