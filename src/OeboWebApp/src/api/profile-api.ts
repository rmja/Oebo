import { Http } from "ur-http";
import { Profile } from "./profile";

export class ProfileApi {
    getAll() {
        return Http.get("/Profiles")
            .expectJsonArray(Profile);
    }

    create(command: Partial<Profile>) {
        return Http.post("/Profiles")
            .withJson(command)
            .expectJson(Profile);
    }

    delete(id: number) {
        return Http.delete(`/Profiles/${id}`);
    }
}