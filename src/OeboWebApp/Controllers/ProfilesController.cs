using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OeboWebApp.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OeboWebApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfilesController : ControllerBase
    {
        private readonly OeboContext _db;

        public ProfilesController(OeboContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IEnumerable<Profile>> GetAll()
        {
            var profiles = await _db.Profiles
                .Where(x => x.UserId == User.GetId())
                .ToListAsync();

            return profiles;
        }

        [HttpPost]
        public async Task<Profile> Create(Profile profile)
        {
            profile.UserId = User.GetId();

            _db.Profiles.Add(profile);
            await _db.SaveChangesAsync();

            return profile;
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var profile = await _db.Profiles
                .Where(x => x.UserId == User.GetId())
                .FirstOrDefaultAsync(x => x.Id == id);

            if (profile == null)
            {
                return NotFound();
            }

            _db.Profiles.Remove(profile);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }
}
