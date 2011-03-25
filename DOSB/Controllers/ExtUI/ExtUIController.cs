using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers.ExtUI
{
    public class ExtUIController : Controller
    {
        private CPLDataContext store = new CPLDataContext();
        //
        // GET: /ExtUI/

        public ActionResult Index()
        {
            ViewData["upperCount"] = store.vwUpperCompletionAssemblies.Count();
            ViewData["upper"] = store.vwUpperCompletionAssemblies.ToList();
            ViewData["lowerCount"] = store.vwLowerCompletionAssemblies.Count();
            ViewData["lower"] = store.vwLowerCompletionAssemblies.ToList();

            ViewData["Company"] = EditableCompanyRespository.All().ToList();

            return View();
        }

        public ActionResult Test()
        {
            return View();
        }

        public ActionResult YearViewTest()
        {
            return View();
        }

        public ActionResult SiteMenu()
        {
            return View();
        }

        public ActionResult Test2()
        {
            return View();
        }
    }
}
