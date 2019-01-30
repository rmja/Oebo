using OeboWebApp.Models;
using PuppeteerSharp;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace OeboWebApp.LaesoeLine
{
    public class BookingApi
    {
        public Task<BookResult> BookAsync(Booking booking)
        {
            if (booking.Journeys.Count == 1)
            {
                return BookOneWayAsync(booking.Journeys[0]);
            }
            else
            {
                throw new ArgumentException();
            }
        }

        public async Task<BookResult> BookOneWayAsync(Journey journey)
        {
            using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions()))
            {
                using (var page = await browser.NewPageAsync())
                {
                    await page.GoToAsync("https://booking.laesoe-line.dk/dk/customer-profile/");

                    await page.SetValueAsync(Selectors.CustomerUsername, "USERNAME");
                    await page.SetValueAsync(Selectors.CustomerPassword, "PASSWORD");

                    await page.ClickAsync(Selectors.LoginButton);
                    await page.WaitForSelectorToDisappearAsync(Selectors.LoadingSpinner);

                    if (journey.Vehicle == Vehicle.None)
                    {
                        await page.GoToAsync("https://booking.laesoe-line.dk/dk/book/obo-2018/Rejsedetaljer/");

                        await page.ClickAsync(Flows.OeboWalkOneWay);
                        await page.WaitForSelectorToDisappearAsync(Selectors.LoadingSpinner);

                        await page.SelectAsync(Selectors.Outbound_Route, CrossingValues.GetValue(journey.Crossing));
                        await page.SetValueAsync(Selectors.Outbound_Date, journey.Departure.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));

                        await page.SelectAsync(Selectors.Outbound_Adults, journey.Adults.ToString());
                        await page.SelectAsync(Selectors.Outbound_Children, journey.Children.ToString());
                        await page.SelectAsync(Selectors.Outbound_Seniors, journey.Seniors.ToString());
                        await page.SelectAsync(Selectors.Outbound_Infants, journey.Infants.ToString());
                    }
                    else
                    {
                        if (journey.Vehicle == Vehicle.CarSeasonPass)
                        {
                            await page.GoToAsync("https://booking.laesoe-line.dk/dk/book/aarskort-2018/Rejsedetaljer/");
                            await page.ClickAsync(Flows.OeboSeasonPassOneWay);
                            await page.WaitForSelectorToDisappearAsync(Selectors.LoadingSpinner);
                        }
                        else
                        {
                            await page.GoToAsync("https://booking.laesoe-line.dk/dk/book/obo-2018/Rejsedetaljer/");
                            await page.ClickAsync(Flows.OeboCarOneWay);
                            await page.WaitForSelectorToDisappearAsync(Selectors.LoadingSpinner);
                        }

                        await page.SelectAsync(Selectors.Outbound_Route, CrossingValues.GetValue(journey.Crossing));
                        await page.SetValueAsync(Selectors.Outbound_Date, journey.Departure.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));

                        await page.SelectAsync(Selectors.Outbound_Vehicle, VehicleValues.GetVehicle(journey.Vehicle));
                        await page.SelectAsync(Selectors.Outbound_Passengers, journey.Passengers.ToString());
                    }

                    await page.ClickAsync(Selectors.NextButton);
                    await page.WaitForNavigationAsync();

                    await page.ClickAsync(Selectors.Outbound_Departure(journey.Departure));

                    await page.ClickAsync(Selectors.NextButton);
                    await page.WaitForNavigationAsync();

                    await page.ClickAsync(Selectors.AcceptTerms);

                    await page.ClickAsync(Selectors.NextButton);
                    await page.WaitForNavigationAsync();

                    var bookingNumber = await page.GetInnerTextAsync(Selectors.ConfirmationBookingNumber);
                    var bookingPassword = await page.GetInnerTextAsync(Selectors.ConfirmationBookingPassword);

                    return BookResult.Success(bookingNumber, bookingPassword);
                }
            }
        }

        public async Task CancelAsync(Booking booking)
        {
            using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions()))
            {
                using (var page = await browser.NewPageAsync())
                {
                    await page.GoToAsync("https://booking.laesoe-line.dk/dk/my-booking/");

                    await page.SetValueAsync(Selectors.BookingUsername, booking.BookingNumber);
                    await page.SetValueAsync(Selectors.BookingPassword, booking.BookingPassword);

                    await page.ClickAsync(Selectors.LoginButton);
                    await page.WaitForNavigationAsync();

                    await page.ClickAsync(Selectors.CancelBookingButton);
                    await page.WaitForSelectorAsync(Selectors.CancelConfirmationDialog);
                    await page.ClickAsync(Selectors.CancelConfirmationConfirmButton);

                    await page.WaitForExpressionAsync("document.title.includes('Booking annulleret')");
                }
            }
        }
    }
}
