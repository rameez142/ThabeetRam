using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Threading;


namespace MOI.AssetManagement.Controllers {
    public class FileUploadVwModal
    {
       public IFormFile File { get; set; }
        public long Size { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }

    

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

        [HttpPost]
        public async Task<IActionResult>PostUpload(FileUploadVwModal modal)
        {
            var file = modal.File;
            using (var fs = new FileStream("C://dt.doc", FileMode.Create))
            {
                file.CopyTo(fs);
            }
               return Ok(modal);
        }

        /*  public async Task<IActionResult> Post(List<IFormFile> files)
          {
              long size = files.Sum(f => f.Length);

              // full path to file in temp location
              var filePath = Path.GetTempFileName();

              foreach (var formFile in files)
              {
                  if (formFile.Length > 0)
                  {
                      using (var stream = new FileStream(filePath, FileMode.Create))
                      {
                          await formFile.CopyToAsync(stream);
                      }
                  }
              }


              return Ok(new { count = files.Count, size, filePath });
          }*/
    }


}