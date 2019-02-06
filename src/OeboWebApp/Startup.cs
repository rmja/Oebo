using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Converters;
using OeboWebApp.LaesoeLine;
using PuppeteerSharp;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace OeboWebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddEntityFrameworkSqlServer()
                .AddDbContext<OeboContext>()
                .AddSingleton<BookingApi>()
                .AddSingleton<BookingQueue>()
                .AddHostedService<TimetableSynchronizer>();

            //for (var i = 0; i < Environment.ProcessorCount; i++)
            {
                services.AddHostedService<BookingWorker>();
            }

            services.AddStackExchangeRedisCache(options => options.ConfigurationOptions = ConfigurationOptions.Parse("localhost,defaultDatabase=14"));

            services.AddSignalR();

            services
                .AddAuthentication(options =>
                 {
                     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                 })
                .AddJwtBearer(options =>
                {
                    options.Authority = $"https://oebo.eu.auth0.com";
                    options.Audience = "api://oebo";

                    // We have to hook the OnMessageReceived event in order to
                    // allow the JWT authentication handler to read the access
                    // token from the query string when a WebSocket or 
                    // Server-Sent Events request comes in.
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            if (!string.IsNullOrEmpty(accessToken) && context.HttpContext.Request.Path.StartsWithSegments("/events"))
                            {
                                // Read the token out of the query string
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options => options.SerializerSettings.Converters.Add(new StringEnumConverter(true)))
                .AddRazorPagesOptions(options => options.Conventions.AddPageRoute("/Index", "{*url:regex(^(?!(locales|api)).*$)}")); // https://github.com/aspnet/JavaScriptServices/issues/1354
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceScopeFactory serviceScopeFactory)
        {
            new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision).Wait();

            using (var scope = serviceScopeFactory.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<OeboContext>();

                db.Database.Migrate();
            }

            if (env.IsDevelopment())
            {
                app
                    .UseDeveloperExceptionPage()
                    .UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions { HotModuleReplacement = true });
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseSignalR(builder => builder.MapHub<EventHub>("/events"));
            app.UseMvc();
        }
    }
}
