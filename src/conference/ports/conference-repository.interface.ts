import { Conference } from "../entities/conference.entity";

export interface ConferenceRepository {

    create(conference: Conference): Promise<void>
    delete(conferenceId: string): Promise<void>
    findById(id: string): Promise <Conference | null>
    update(conference: Conference): Promise<void>
}