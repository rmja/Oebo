namespace OeboWebApp.LaesoeLine
{
    public class BookResult
    {
        public string BookingNumber { get; set; }
        public string BookingPassword { get; set; }

        public static BookResult Success(string bookingNumber, string bookingPassword)
        {
            return new BookResult()
            {
                BookingNumber = bookingNumber,
                BookingPassword = bookingPassword
            };
        }
    }
}
