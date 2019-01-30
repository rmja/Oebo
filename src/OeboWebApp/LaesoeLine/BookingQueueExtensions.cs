using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using OeboWebApp.Models;

namespace OeboWebApp.LaesoeLine
{
    public static class BookingQueueExtensions
    {
        public static void EnqueueBook(this BookingQueue queue, int bookingId)
        {
            queue.Enqueue(async cancellationToken =>
            {
                var api = queue.Services.GetRequiredService<BookingApi>();
                var hub = queue.Services.GetRequiredService<IHubContext<EventHub>>();

                using (var scope = queue.Services.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<OeboContext>();

                    var booking = await db.Bookings
                        .Include(x => x.Journeys)
                        .FirstOrDefaultAsync(x => x.Id == bookingId);

                    booking.SetState(BookingState.PendingConfirmation);
                    await db.SaveChangesAsync();
                    await hub.PublishBookingStateChangedAsync(booking.UserId, booking.Id, booking.State);

                    var bookResult = await api.BookAsync(booking);
                    booking.BookingNumber = bookResult.BookingNumber;
                    booking.BookingPassword = bookResult.BookingPassword;

                    booking.SetState(BookingState.Confirmed);
                    await db.SaveChangesAsync();
                    await hub.PublishBookingStateChangedAsync(booking.UserId, booking.Id, booking.State);
                }
            });
        }

        public static void EnqueueCancel(this BookingQueue queue, int bookingId)
        {
            queue.Enqueue(async cancellationToken =>
            {
                var api = queue.Services.GetRequiredService<BookingApi>();
                var hub = queue.Services.GetRequiredService<IHubContext<EventHub>>();

                using (var scope = queue.Services.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<OeboContext>();

                    var booking = await db.Bookings.FirstOrDefaultAsync(x => x.Id == bookingId);

                    booking.SetState(BookingState.PendingCancellation);
                    await db.SaveChangesAsync();
                    await hub.PublishBookingStateChangedAsync(booking.UserId, booking.Id, booking.State);

                    await api.CancelAsync(booking);

                    booking.SetState(BookingState.Cancelled);
                    await db.SaveChangesAsync();
                    await hub.PublishBookingStateChangedAsync(booking.UserId, booking.Id, booking.State);
                }
            });
        }
    }
}
