using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace OeboWebApp.LaesoeLine
{
    public class BookingWorker : BackgroundService
    {
        private readonly BookingQueue _queue;

        public BookingWorker(BookingQueue queue)
        {
            _queue = queue;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var workItem = await _queue.DequeueAsync(stoppingToken);

                    await workItem(stoppingToken);
                }
                catch (OperationCanceledException e) when (e.CancellationToken == stoppingToken)
                {
                }
            }
        }
    }
}
