using System;

namespace OeboWebApp.Models
{
    public class Journey
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public Crossing Crossing { get; set; }
        public DateTime Departure { get; set; }

        public Vehicle Vehicle { get; set; }
        public int Passengers { get; set; }

        public int Adults { get; set; }
        public int Children { get; set; }
        public int Seniors { get; set; }
        public int Infants { get; set; }
    }
}
