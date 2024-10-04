import { Model } from "mongoose"

import { TestApp } from "../../../test/utils/test-app"

import { testUser } from "../../tests/user-seed";

import { MongoUser } from "./mongo-user"
import { MongoUserRepository } from "./mongo-user-repository";

describe('MongoUserRepository', () => {
    let app: TestApp;
    let model: Model<MongoUser.UserDocument>;
    let repository: MongoUserRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoUser.UserModel;
        await model.deleteMany({});
        repository = new MongoUserRepository(model);

        const record = new model({
            _id: testUser.johnDoe.props.id,
            emailAddress: testUser.johnDoe.props.emailAddress,
            password: testUser.johnDoe.props.password
        })

        await record.save();
    })

    afterEach(async () => {
        await app.tearDown();
    })

    describe('Scenario: findByEmailAddress', () => {
        it('Should find user corresponding to the email address', async () => {
            const user = await repository.findByEmailAddress(testUser.johnDoe.props.emailAddress);

            expect(user?.props).toEqual(testUser.johnDoe.props);
        })

        it('Should return null if user not found', async () => {
            const user = await repository.findByEmailAddress('non-existing@gmail.com');

            expect(user).toBeNull();
        })
    })

    describe('Scenario: Create a user', () => {
        it('Should create user', async () => {
            await repository.create(testUser.bob);
            const fetchedUser = await model.findOne({ _id: testUser.bob.props.id });

            expect(fetchedUser?.toObject()).toEqual({
                _id: testUser.bob.props.id,
                emailAddress: testUser.bob.props.emailAddress,
                password: testUser.bob.props.password,
                __v: 0
            });
        })
    })

    describe('Scenario: findById', () => {
        it('Should find the user corresponding to the id', async () => {
            const user = await repository.findById(testUser.johnDoe.props.id);
            expect(user?.props).toEqual(testUser.johnDoe.props);
        })

        it('Should return null if no user found', async () => {
            const user = await repository.findById('non-existing-id');
            expect(user).toBeNull();
        })
    })
})