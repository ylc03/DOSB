using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class AttachmentController : Controller
    {

        public Guid AsyncUpload()
        {
            Attachment attachment = Attachment.NewAttachment(Request.Files[0]);
            return Guid.Parse(attachment.Guid);
        }
    }
}
