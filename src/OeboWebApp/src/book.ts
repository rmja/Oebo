import { autoinject } from "aurelia-framework";
import { library } from "@fortawesome/fontawesome-svg-core"
import { faCar, faPlus, faMinus, faSave, faCarSide, faRestroom, faBaby, faUser, faWalking, faBlind, faChild } from "@fortawesome/free-solid-svg-icons";
import { ProfileApi } from "./api/profile-api";
import { Profile } from "./api/profile";
import { VehicleType, isSeasonPass, asSeasonPass } from "./api/vehicle";
import { BookingApi } from "./api/booking-api";
import { CrossingType } from "./api/crossing";
import { DateTime } from "luxon";

library.add(faCar, faPlus, faMinus, faSave, faCarSide, faRestroom, faBaby, faUser, faWalking, faBlind, faChild);

type Tab = "driving" | "walking";
type Age = "adult" | "child" | "senior" | "infant";

@autoinject()
export class Book {
    tab: Tab = "driving";
    newProfile?: Partial<Profile>;
    age: Age = "adult";
    private crossing!: CrossingType;
    private departure!: DateTime;
    profiles!: ProfileViewModel[];

    get seasonPass() {
        const vehicle = this.newProfile && this.newProfile.vehicle;
        return vehicle ? isSeasonPass(vehicle) : false;
    }

    set seasonPass(value: boolean) {
        const currentVehicle = this.newProfile && this.newProfile.vehicle;
        if (this.newProfile && currentVehicle) {
            this.newProfile.vehicle = asSeasonPass(currentVehicle, value);
        }
    }

    constructor(private profileApi: ProfileApi, private bookingApi: BookingApi) {
    }

    async activate(params: {crossing: CrossingType, departure: string}) {
        this.crossing = params.crossing;
        this.departure = DateTime.fromMillis(parseInt(params.departure));
        this.profiles = (await this.profileApi.getAll().transfer()).map(x => new ProfileViewModel(x));
    }

    setTab(tab: Tab) {
        this.newProfile = undefined;
        this.tab = tab;
    }

    toggleAddProfile() {
        if (this.newProfile) {
            this.newProfile = undefined;
            return;
        }
        if (this.tab === "driving") {
            this.newProfile = {
                name: "Brobizz",
                username: "",
                password: "",
                vehicle: "car",
                passengers: 1
            };
        }
        else if (this.tab === "walking") {
            this.newProfile = {
                name: "",
                username: "",
                password: "",
                vehicle: "none"
            }
        }
    }

    setAge(age: Age) {
        this.age = age;
    }

    async submitProfile() {
        if (!this.newProfile) {
            throw new Error("There is no profile");
        }
        if (this.newProfile.vehicle === "none") {
            this.newProfile.adults = this.age === "adult" ? 1 : 0;
            this.newProfile.children = this.age === "child" ? 1 : 0;
            this.newProfile.seniors = this.age === "senior" ? 1 : 0;
            this.newProfile.infants = this.age === "infant" ? 1 : 0;
        }
        const profile = await this.profileApi.create(this.newProfile).transfer();

        this.newProfile = undefined;
        this.profiles.push(new ProfileViewModel(profile));
    }

    async deleteProfile(profile: ProfileViewModel) {
        await this.profileApi.delete(profile.id).send();

        const index = this.profiles.indexOf(profile);
        this.profiles.splice(index, 1);
    }

    incrementPassengers(profile:ProfileViewModel) {
        profile.passengers++;
    }

    decrementPassengers(profile:ProfileViewModel) {
        if (profile.passengers > 1) {
            profile.passengers--;
        }
    }

    async book(profile: ProfileViewModel) {
        await this.bookingApi.create([{
            crossing: this.crossing,
            departure: this.departure,
            vehicle: profile.vehicle,
            passengers: profile.passengers
        }], profile.username, profile.password).transfer();
    }
}

export class FilterProfilesValueConverter {
    toView(profiles: ProfileViewModel[], tab: Tab) {
        if (tab === "driving") {
            return profiles.filter(x => x.vehicle !== "none");
        }
        else {
            return profiles.filter(x => x.vehicle === "none");
        }
    }
}

class ProfileViewModel {
    id: number;
    name: string;
    username: string;
    password: string;
    vehicle: VehicleType;
    passengers: number;

    constructor(private profile: Profile) {
        this.id = profile.id;
        this.name = profile.name;
        this.username = profile.username;
        this.password = profile.password;
        this.vehicle = profile.vehicle;
        this.passengers = profile.passengers;
    }

    get age(): Age | undefined {
        if (this.profile.adults) {
            return "adult";
        }
        else if (this.profile.children) {
            return "child";
        }
        else if (this.profile.seniors) {
            return "senior";
        }
        else if (this.profile.infants) {
            return "infant";
        }
    }
}