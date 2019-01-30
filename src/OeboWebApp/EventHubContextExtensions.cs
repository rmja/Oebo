using Microsoft.AspNetCore.SignalR;
using OeboWebApp.Models;
using System.Threading.Tasks;

namespace OeboWebApp
{
    static class EventHubContextExtensions
    {
        public static Task PublishBookingStateChangedAsync(this IHubContext<EventHub> hub, string userId, int bookingId, BookingState newState) =>
            hub.Clients.User(userId).SendAsync("booking-state-changed", bookingId, StringUtils.ToCamelCase(newState.ToString()));
    }
}
