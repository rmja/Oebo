using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OeboWebApp.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public BookingState State { get; set; }
        public List<Journey> Journeys { get; set; } = new List<Journey>();

        [MaxLength(10)]
        public string BookingNumber { get; set; }
        [MaxLength(10)]
        public string BookingPassword { get; set; }

        public DateTimeOffset Created { get; set; }
        public DateTimeOffset? ConfirmationScheduled { get; set; }
        public DateTimeOffset? Confirmed { get; set; }
        public DateTimeOffset? CancellationScheduled { get; set; }
        public DateTimeOffset? Cancelled { get; set; }
        public DateTimeOffset? Failed { get; set; }

        private Booking()
        {
        }

        public static Booking Create(string userId, IEnumerable<Journey> journeys)
        {
            var booking = new Booking()
            {
                UserId = userId,
                State = BookingState.Created,
                Created = DateTimeOffset.UtcNow
            };

            booking.Journeys.AddRange(journeys);

            return booking;
        }

        public void SetState(BookingState state)
        {
            State = state;

            switch (state)
            {
                case BookingState.PendingConfirmation:
                    ConfirmationScheduled = DateTimeOffset.UtcNow;
                    break;
                case BookingState.Confirmed:
                    Confirmed = DateTimeOffset.UtcNow;
                    break;
                case BookingState.PendingCancellation:
                    CancellationScheduled = DateTimeOffset.UtcNow;
                    break;
                case BookingState.Cancelled:
                    Cancelled = DateTimeOffset.UtcNow;
                    break;
                case BookingState.Failed:
                    Failed = DateTimeOffset.UtcNow;
                    break;
            }
        }
    }

    public enum BookingState
    {
        Created,
        PendingConfirmation,
        Confirmed,
        PendingCancellation,
        Cancelled,
        Failed
    }
}
