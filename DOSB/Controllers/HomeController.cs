using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class HomeController : Controller
    {
        CPLDataContext store = new CPLDataContext();
        //
        // GET: /Home/

        public ActionResult Index()
        {
            // redirect to log on page
            if (User.Identity.IsAuthenticated == false) return RedirectToAction("LogOnAjax", "Account");

            ViewData["upperCount"] = store.vwUpperCompletionAssemblies.Count();
            ViewData["upper"] = store.vwUpperCompletionAssemblies.ToList();
            ViewData["lowerCount"] = store.vwLowerCompletionAssemblies.Count();
            ViewData["lower"] = store.vwLowerCompletionAssemblies.ToList();

            ViewData["Company"] = EditableCompanyRespository.All().ToList();

            return View();
        }

    }
}
