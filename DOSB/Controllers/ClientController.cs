﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class ClientController : Controller
    {
        //
        // GET: /Client/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in CPLStore.Instance.Clients
                       select new
                       {
                           ClientId = item.ClientId,
                           Name = item.Name
                       };
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}