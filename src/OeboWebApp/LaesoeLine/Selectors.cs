using System;
using System.Globalization;

namespace OeboWebApp.LaesoeLine
{
    static class Selectors
    {
        public const string CustomerUsername = "#cw-login-customer-customerCode";
        public const string CustomerPassword = "#cw-login-customer-password";
        public const string BookingUsername = "#cw-login-booking-code";
        public const string BookingPassword = "#cw-login-booking-password";
        public const string LoginButton = "button[type='submit']";

        public const string CopyDetails = "input[name='journeysearch-passengers-copy']";
        public const string Outbound_Route = "#j1_route-j1_route";
        public const string Outbound_Date = "input[name='cw_journeysearch_j1_date']";
        public const string Outbound_Vehicle = "select[name='cw_journeysearch_j1_vehicles[0][ctg]']";
        public const string Outbound_Passengers = "select[name='cw_journeysearch_j1_passengers[0][qty]']";
        public const string Outbound_Adults = "select[name='cw_journeysearch_j1_passengers[0][qty]']";
        public const string Outbound_Children = "select[name='cw_journeysearch_j1_passengers[1][qty]']";
        public const string Outbound_Seniors = "select[name='cw_journeysearch_j1_passengers[2][qty]']";
        public const string Outbound_Infants = "select[name='cw_journeysearch_j1_passengers[3][qty]']";
        public const string Return_Route = "#j2_route-j2_route";
        public const string Return_Date = "input[name='cw_journeysearch_j2_date']";
        public const string Return_Vehicle = "select[name='cw_journeysearch_j2_vehicles[0][ctg]']";
        public const string Return_Passengers = "select[name='cw_journeysearch_j2_passengers[0][qty]']";
        public const string Return_Adults = "select[name='cw_journeysearch_j2_passengers[0][qty]']";
        public const string Return_Children = "select[name='cw_journeysearch_j2_passengers[1][qty]']";
        public const string Return_Seniors = "select[name='cw_journeysearch_j2_passengers[2][qty]']";
        public const string Return_Infants = "select[name='cw_journeysearch_j2_passengers[3][qty]']";

        public const string Outbound_Departures = "input[data-cw-journeynum='1']";
        public static string Outbound_Departure(DateTime departs) => $"input[data-cw-journeynum='1'][data-cw-departure-datetime='{departs.ToString("yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture)}']";
        public const string Outbound_LaterDepartures = "span[data-cw-journeynum='1'][data-cw-action='laterDepartures']";

        public const string AcceptTerms = "#acceptTerms";

        public const string ConfirmationBookingNumber = ".cw-booking-code";
        public const string ConfirmationBookingPassword = ".cw-booking-pwd";

        public const string CancelBookingButton = ".cw-action-cancelBooking";
        public const string CancelConfirmationDialog = "div.fancybox-inner > div.cancel-booking-message";
        public const string CancelConfirmationConfirmButton = "div.fancybox-wrap div.fancybox-dialog-buttons > button:last-child";

        public const string LoadingSpinner = ".cw-loading-mask-spinner";
        public const string NextButton = ".cw-action-next";
    }
}
