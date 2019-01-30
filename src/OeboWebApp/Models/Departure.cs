using System;

namespace OeboWebApp.Models
{
    public class Departure
    {
        public Crossing Crossing { get; set; }
        public DateTime Departs { get; set; }
        public DateTime Arrives { get; set; }
        public DepartureState State { get; set; }
    }

    public enum DepartureState
    {
        Available,
        SoldOut,
        Expired
    }
}
