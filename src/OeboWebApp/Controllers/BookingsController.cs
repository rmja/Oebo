using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OeboWebApp.LaesoeLine;
using OeboWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OeboWebApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly OeboContext _db;
        private readonly BookingQueue _bookingQueue;

        public BookingsController(OeboContext db, BookingQueue bookingQueue)
        {
            _db = db;
            _bookingQueue = bookingQueue;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAll()
        {
            var bookings = await _db.Bookings
                .Include(x => x.Journeys)
                .Where(x => x.UserId == User.GetId())
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return bookings;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> Get(int id)
        {
            var booking = await _db.Bookings
                .Include(x => x.Journeys)
                .Where(x => x.UserId == User.GetId())
                .FirstOrDefaultAsync(x => x.Id == id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        [HttpPost]
        public async Task<Booking> Post(List<Journey> journeys, string username, string password)
        {
            var booking = Booking.Create(User.GetId(), journeys);

            _db.Bookings.Add(booking);
            await _db.SaveChangesAsync();

            _bookingQueue.EnqueueBook(booking.Id, username, password);

            return booking;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var booking = await _db.Bookings
                .Where(x => x.UserId == User.GetId())
                .FirstOrDefaultAsync(x => x.Id == id);

            switch (booking?.State)
            {
                case null:
                    return NotFound();
                case BookingState.Created:
                case BookingState.Cancelled:
                case BookingState.FailedInvalidLogin:
                    _db.Bookings.Remove(booking);
                    await _db.SaveChangesAsync();
                    return NoContent();
                case BookingState.PendingConfirmation:
                case BookingState.PendingCancellation:
                    return Conflict();
                case BookingState.Confirmed:
                    _bookingQueue.EnqueueCancel(booking.Id);
                    return NoContent();
            }

            throw new InvalidOperationException();
        }
    }
}
