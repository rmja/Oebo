using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using OeboWebApp.Models;
using PuppeteerSharp;
using System;
using System.Collections.Async;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OeboWebApp.LaesoeLine
{
    public class TimetableSynchronizer : BackgroundService
    {
        private static readonly DistributedCacheEntryOptions _entryOptions = new DistributedCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromHours(12));

        private readonly IDistributedCache _distributedCache;

        public TimetableSynchronizer(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var today = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, Constants.Timezone).Date;

                    foreach (var crossing in Enum.GetValues(typeof(Crossing)).Cast<Crossing>())
                    {
                        var departuresStream = GetDeparturesAsync(crossing, today, 10);

                        await departuresStream.ForEachAsync(async (chunk) =>
                        {
                            var key = $"departures:{crossing.GetId()}:{chunk.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}";
                            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(chunk.Departures, Formatting.None), _entryOptions);
                        });
                    }

                    await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                }
                catch (OperationCanceledException e) when (e.CancellationToken == stoppingToken)
                {
                }
            }
        }

        private IAsyncEnumerable<(DateTime Date, Departure[] Departures)> GetDeparturesAsync(Crossing crossing, DateTime firstDate, int days)
        {
            return new AsyncEnumerable<(DateTime Date, Departure[] Departures)>(async yield =>
            {
                using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions()))
                {
                    using (var page = await browser.NewPageAsync())
                    {
                        await page.GoToAsync("https://booking.laesoe-line.dk/dk/book/obo-2018/Rejsedetaljer/");

                        await page.ClickAsync(Flows.OeboCarOneWay);
                        await page.WaitForSelectorToDisappearAsync(Selectors.LoadingSpinner);

                        await page.SelectAsync(Selectors.Outbound_Route, CrossingValues.GetValue(crossing));
                        await page.SetValueAsync(Selectors.Outbound_Date, firstDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));

                        await page.SelectAsync(Selectors.Outbound_Vehicle, VehicleValues.GetVehicle(Vehicle.Car));
                        await page.SelectAsync(Selectors.Outbound_Passengers, "1");

                        await page.ClickAsync(Selectors.NextButton);
                        await page.WaitForNavigationAsync();

                        var date = firstDate;

                        for (var i = 0; i < days; i++)
                        {
                            if (i > 0)
                            {
                                await page.ClickAsync(Selectors.Outbound_LaterDepartures);
                                await page.WaitForSelectorToDisappearAsync(Selectors.LoadingSpinner);
                            }

                            var formattedDepartureTimes = await page.EvaluateFunctionAsync<string[]>(@"
() => {
    const departureInputs = document.querySelectorAll(`input[data-cw-journeynum='1']`);
    return [].map.call(departureInputs, x => x.getAttribute(`data-cw-departure-datetime`));
}");
                            var departureTimes = formattedDepartureTimes.Select(x => DateTime.ParseExact(x, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture)).ToList();

                            var departures = departureTimes.Select(x => new Departure()
                            {
                                Crossing = crossing,
                                Departs = x,
                                Arrives = x.AddMinutes(90)
                            }).ToArray();

                            await yield.ReturnAsync((date, departures));

                            date = date.AddDays(1);
                        }
                    }
                }
            });
        }
    }
}
