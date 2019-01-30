using Microsoft.EntityFrameworkCore;
using OeboWebApp.Models;

namespace OeboWebApp
{
    public class OeboContext : DbContext
    {
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Journey> Journeys { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Database=Oebo;Trusted_Connection=True;MultipleActiveResultSets=True");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var booking = modelBuilder.Entity<Booking>();

            booking.Property(x => x.UserId).HasMaxLength(100).IsRequired();
            booking.HasIndex(x => x.UserId);
            
            booking.HasMany(x => x.Journeys).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
