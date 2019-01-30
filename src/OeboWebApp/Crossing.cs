using Microsoft.AspNetCore.Mvc;
using OeboWebApp.ModelBinders;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;

namespace OeboWebApp
{
    [ModelBinder(typeof(EnumValueModelBinder))]
    public enum Crossing
    {
        [EnumMember(Value = "laesoe~frederikshavn")]
        LaesoeFrederikshavn,
        [EnumMember(Value = "frederikshavn~laesoe")]
        FrederikshavnLaesoe
    }

    public static class RouteEx
    {
        public static string GetId(this Crossing crossing)
        {
            var attribute = typeof(Crossing).GetField(crossing.ToString()).GetCustomAttribute<EnumMemberAttribute>(false);
            return attribute.Value;
        }
    }
}
