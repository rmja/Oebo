using System;

namespace OeboWebApp.LaesoeLine
{
    static class CrossingValues
    {
        public static string GetValue(Crossing route)
        {
            switch (route)
            {
                case Crossing.LaesoeFrederikshavn: return "P~L-P~F";
                case Crossing.FrederikshavnLaesoe: return "P~F-P~L";
                default: throw new ArgumentException();
            }
        }
    }
}
