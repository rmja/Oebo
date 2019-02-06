import { jsonProperty } from "ur-json";
import { VehicleType } from "./vehicle";

export class Profile {
    @jsonProperty()
    id!: number;
    @jsonProperty()
    name!: string;
    @jsonProperty()
    username!: string;
    @jsonProperty()
    password!: string;
    @jsonProperty()
    vehicle!: VehicleType;
    @jsonProperty()
    passengers!: number;
    @jsonProperty()
    adults!: number;
    @jsonProperty()
    children!: number;
    @jsonProperty()
    seniors!: number;
    @jsonProperty()
    infants!: number;
}