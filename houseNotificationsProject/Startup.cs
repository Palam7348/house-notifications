using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(houseNotificationsProject.Startup))]
namespace houseNotificationsProject
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
