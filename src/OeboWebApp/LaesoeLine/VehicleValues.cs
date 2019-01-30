using System;

namespace OeboWebApp.LaesoeLine
{
    static class VehicleValues
    {
        public static string GetVehicle(Vehicle vehicle)
        {
            switch (vehicle)
            {
                case Vehicle.Car: return "19";
                case Vehicle.CarSeasonPass: return "319";
                default: throw new ArgumentException();
            }
        }
    }
}
