using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace OeboWebApp
{
    class EventHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}
