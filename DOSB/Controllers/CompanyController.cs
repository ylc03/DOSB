using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class CompanyController : Controller
    {
        //
        // GET: /Company/

        public ActionResult GetJson()
        {
            return Json(EditableCompanyRespository.All(), JsonRequestBehavior.AllowGet);
        }

    }
}
