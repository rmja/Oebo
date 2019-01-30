using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace OeboWebApp.LaesoeLine
{
    public class BookingQueue
    {
        private readonly ConcurrentQueue<Func<CancellationToken, Task>> _queue = new ConcurrentQueue<Func<CancellationToken, Task>>();
        private readonly SemaphoreSlim _signal = new SemaphoreSlim(0);

        public IServiceProvider Services { get; private set; }

        public BookingQueue(IServiceProvider services)
        {
            Services = services;
        }

        public void Enqueue(Func<CancellationToken, Task> workItem)
        {
            _queue.Enqueue(workItem);
            _signal.Release();
        }

        public async Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken cancellationToken)
        {
            await _signal.WaitAsync(cancellationToken);
            _queue.TryDequeue(out var workItem);

            return workItem;
        }
    }
}
