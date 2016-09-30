using houseNotificationsProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;


namespace houseNotificationsProject.Controllers
{
    public class RegionsController : Controller
    {
        // GET: Regions
        public ActionResult Index()
        {
            string URI = "http://house-utilities-api.azurewebsites.net/api/regions/getall/key=314";
            HttpClient client = new HttpClient();
            HttpResponseMessage response = client.GetAsync(URI).Result;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
                string resposeText = response.Content.ReadAsStringAsync().Result;
                IEnumerable<SubRegion> regions = jsSerializer.Deserialize<IEnumerable<SubRegion>>(resposeText);

                foreach (SubRegion item in regions)
                {
                    Console.WriteLine("{0} - {1} {2}", item.Name, item.SubRegionId, item.Streets);
                }

            }
            return View();
        }

      
    }
}