﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OeboWebApp;

namespace OeboWebApp.Migrations
{
    [DbContext(typeof(OeboContext))]
    [Migration("20190130105403_AddUserIdToBooking")]
    partial class AddUserIdToBooking
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OeboWebApp.Models.Booking", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("BookingNumber")
                        .HasMaxLength(10);

                    b.Property<string>("BookingPassword")
                        .HasMaxLength(10);

                    b.Property<DateTimeOffset?>("CancellationScheduled");

                    b.Property<DateTimeOffset?>("Cancelled");

                    b.Property<DateTimeOffset?>("ConfirmationScheduled");

                    b.Property<DateTimeOffset?>("Confirmed");

                    b.Property<DateTimeOffset>("Created");

                    b.Property<DateTimeOffset?>("Deleted");

                    b.Property<DateTimeOffset?>("Failed");

                    b.Property<int>("State");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Bookings");
                });

            modelBuilder.Entity("OeboWebApp.Models.Journey", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int>("Adults");

                    b.Property<int>("BookingId");

                    b.Property<int>("Children");

                    b.Property<int>("Crossing");

                    b.Property<DateTime>("Departure");

                    b.Property<int>("Infants");

                    b.Property<int>("Passengers");

                    b.Property<int>("Seniors");

                    b.Property<int>("Vehicle");

                    b.HasKey("Id");

                    b.HasIndex("BookingId");

                    b.ToTable("Journeys");
                });

            modelBuilder.Entity("OeboWebApp.Models.Journey", b =>
                {
                    b.HasOne("OeboWebApp.Models.Booking")
                        .WithMany("Journeys")
                        .HasForeignKey("BookingId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
