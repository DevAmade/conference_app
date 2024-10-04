import { Model } from "mongoose";

import { Conference } from "../../entities/conference.entity";
import { ConferenceRepository } from "../../ports/conference-repository.interface";

import { MongoConference } from "./mongo-conference";

export class ConferenceMapper {
    toCore(model: MongoConference.ConferenceDocument): Conference {
        return new Conference({
            id: model._id,
            organizerId: model.organizerId,
            title: model.title,
            startDate: model.startDate,
            endDate: model.endDate,
            nbrSeat: model.nbrSeat
        });
    }

    toPersistance(conference: Conference): MongoConference.ConferenceDocument {
        return new MongoConference.ConferenceModel({
            _id: conference.props.id,
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
            nbrSeat: conference.props.nbrSeat
        });
    }
}

export class MongoConferenceRepository implements ConferenceRepository {
    private readonly mapper: ConferenceMapper = new ConferenceMapper();
    
    constructor(private readonly model: Model<MongoConference.ConferenceDocument>) {}

    async update(conference: Conference): Promise<void> {
        const fetchedConference = await this.model.findOne({ _id: conference.props.id });

        if(!fetchedConference) return;

        await fetchedConference.updateOne(this.mapper.toPersistance(conference));
    }

    async create(conference: Conference): Promise<void> {
        const record = this.mapper.toPersistance(conference);

        await record.save();
    }

    async findById(id: string): Promise<Conference | null> {
        const conference = await this.model.findOne({ _id: id });

        if(!conference) return null;

        return this.mapper.toCore(conference);
    }
}