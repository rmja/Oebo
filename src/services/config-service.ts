import { VehicleType } from "../api/vehicle";

export class ConfigService {
    username: string | null = null;
    password: string | null = null;
    vehicle: VehicleType = "car";
    local = true;
}