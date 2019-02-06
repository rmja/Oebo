namespace OeboWebApp.LaesoeLine
{
    public class BookResult
    {
        public BookStatus Status { get; set; }
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

        public static BookResult Error(BookStatus status)
        {
            return new BookResult()
            {
                Status = status
            };
        }
    }

    public enum BookStatus
    {
        Success,
        InvalidLogin
    }
}
