using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using OeboWebApp.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OeboWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimetableController : Controller
    {
        private readonly IDistributedCache _distributedCache;

        public TimetableController(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        [HttpGet("{crossing}")]
        public async Task<ActionResult<Timetable>> GetTimetable(Crossing crossing, DateTime? date, int days = 1)
        {
            var departureDate = (date ?? TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Romance Standard Time"))).Date;
            var departures = new List<Departure>();

            for (var i = 0; i < days; i++)
            {
                var key = $"departures:{crossing.GetId()}:{departureDate.ToString("yyyy-MM-dd")}";
                var serialized = await _distributedCache.GetStringAsync(key);

                if (serialized == null)
                {
                    return StatusCode(503); // Service Unavailable
                }

                var dayDepartures = JsonConvert.DeserializeObject<Departure[]>(serialized);
                departures.AddRange(dayDepartures);

                departureDate = departureDate.AddDays(1);
            }

            return new Timetable()
            {
                Departures = departures
            };
        }
    }
}
