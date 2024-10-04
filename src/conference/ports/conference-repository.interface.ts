import { Conference } from "../entities/conference.entity";

export interface ConferenceRepository {

    create(conference: Conference): Promise<void>
    findById(id: string): Promise <Conference | null>
    update(conference: Conference): Promise<void>
}