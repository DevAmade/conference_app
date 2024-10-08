import { createContainer, asClass, asValue } from 'awilix';

import { OrganizeConference } from '../../../conference/usecases/organize-conference';
import { ChangeSeats } from '../../../conference/usecases/change-seats';
import { ChangeDates } from '../../../conference/usecases/change-dates';
import { BookSeat } from '../../../conference/usecases/book-seat';
import { CancelConference } from '../../../conference/usecases/cancel-conference';
import { ConferenceRepository } from '../../../conference/ports/conference-repository.interface';
import { BookingRepository } from '../../../conference/ports/booking-repository.interface';
import { InMemoryBookingRepository } from '../../../conference/adapters/in-memory-booking-repository';
import { MongoConferenceRepository } from '../../../conference/adapters/mongo/mongo-conference-repository';
import { MongoConference } from '../../../conference/adapters/mongo/mongo-conference';

import { MongoUserRepository } from '../../../user/adapters/mongo/mongo-user-repository';
import { MongoUser } from '../../../user/adapters/mongo/mongo-user';
import { JwtAuthenticator } from '../../../user/services/jwt-authenticator';
import { UserRepository } from '../../../user/ports/user-repository.interface';

import { InMemoryMailer } from '../../../core/adapters/in-memory-mailer';
import { RandomIdGenerator } from '../../../core/adapters/random-id-generator';
import { CurrentDateGenerator } from '../../../core/adapters/current-date-generator';
import { IDGenerator } from '../../../core/ports/id-generator.interface';
import { DateGenerator } from '../../../core/ports/date-generator.interface';
import { Mailer } from '../../../core/ports/mailer.interface';

const container = createContainer();

container.register({
    conferenceRepository: asValue(new MongoConferenceRepository(MongoConference.ConferenceModel)),
    bookingRepository: asClass(InMemoryBookingRepository).singleton(),
    userRepository: asValue(new MongoUserRepository(MongoUser.UserModel)),
    idGenerator: asClass(RandomIdGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    mailer: asClass(InMemoryMailer).singleton(),
});

const conferenceRepository = container.resolve('conferenceRepository') as ConferenceRepository;
const bookingRepository = container.resolve('bookingRepository') as BookingRepository
const userRepository = container.resolve('userRepository') as UserRepository;
const idGenerator = container.resolve('idGenerator') as IDGenerator;
const dateGenerator = container.resolve('dateGenerator') as DateGenerator;
const mailer = container.resolve('mailer') as Mailer;

container.register({
    organizeConference: asValue(new OrganizeConference(conferenceRepository, idGenerator, dateGenerator)),
    changeSeats: asValue(new ChangeSeats(conferenceRepository, bookingRepository)),
    changeDates: asValue(new ChangeDates(conferenceRepository, dateGenerator, bookingRepository, mailer, userRepository)),
    bookSeat: asValue(new BookSeat(conferenceRepository, bookingRepository)),
    cancelConference: asValue(new CancelConference(conferenceRepository, bookingRepository)),
    authenticator: asValue(new JwtAuthenticator(userRepository))
});

export default container;