using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OeboWebApp.Migrations
{
    public partial class AddStateToBooking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CancellationScheduled",
                table: "Bookings",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Cancelled",
                table: "Bookings",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ConfirmationScheduled",
                table: "Bookings",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Confirmed",
                table: "Bookings",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Created",
                table: "Bookings",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Deleted",
                table: "Bookings",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Failed",
                table: "Bookings",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "Bookings",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CancellationScheduled",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Cancelled",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "ConfirmationScheduled",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Confirmed",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Failed",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Bookings");
        }
    }
}
