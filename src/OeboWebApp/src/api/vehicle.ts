export type VehicleType = "none" | "car" | "carSeasonPass";

const map: { [vehicle in VehicleType]: VehicleType } = {
    "car": "carSeasonPass",
    "carSeasonPass": "car",
    "none": "none"
}

export function isSeasonPass(vehicle: VehicleType) {
    return vehicle === "carSeasonPass";
}

export function asSeasonPass(vehicle: VehicleType, enabled = true): VehicleType {
    if (enabled !== isSeasonPass(vehicle)) {
        return map[vehicle];
    }
    return vehicle;
}