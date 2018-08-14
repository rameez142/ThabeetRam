using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;


namespace MOI.AssetManagement.Controllers { 

public class QryString
{
    public string Qry { get; set; }
}

 /*   public class DriverInfo
    {
        public Int64 Id { get; set; },
         public string Name { get; set; }
    }*/

    [Route("api/[controller]")]
    public class MapController : Controller
    {
       
        public static string LngLat = "Rameez";
      //  public String constr = "Server=BCI666016PC57;Database=MOI_Assets;Integrated Security=true;User Id=Asset User;Password=12345;Trusted_Connection=True;MultipleActiveResultSets=true";
        public String constr2 = "Server=BCI666016PC57;Database=MOI_Assets;User Id =AssetUser;Password=12345;";

       [HttpGet]
        public DataTable GetDriverQuery(String w_clause)
        {
            SqlConnection cont = new SqlConnection();
            cont.ConnectionString = constr2;
            cont.Open();
            DataTable dt = new DataTable();
             SqlDataAdapter da = new SqlDataAdapter("select * from driverinfo "+ HttpUtility.HtmlDecode(w_clause), cont);
              da.Fill(dt);
            cont.Close();
            cont.Dispose();
          //  List <DriverInfo> = new List<DriverInfo>;

            return dt;
        }
    }
}