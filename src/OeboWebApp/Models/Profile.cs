using System.ComponentModel.DataAnnotations;

namespace OeboWebApp.Models
{
    public class Profile
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }

        public Vehicle Vehicle { get; set; }
        public int Passengers { get; set; }

        public int Adults { get; set; }
        public int Children { get; set; }
        public int Seniors { get; set; }
        public int Infants { get; set; }
    }
}
