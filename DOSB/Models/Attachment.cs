using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace DOSB.Models
{
    public partial class Attachment
    {
        private static string uploadsFolder = HostingEnvironment.MapPath("~/App_Data/Attachments");
        private static CPLDataContext storeDB = new CPLDataContext();

        public void AttachTo(Type type, int id)
        {
            if (type.ToString() == this.AttachableType) return;

            string oldFolder = string.IsNullOrWhiteSpace(this.AttachableType) ? "" : this.AttachableType;
            string newFolder = string.IsNullOrWhiteSpace(type.ToString()) ? "" : type.ToString();
            string oldPath = System.IO.Path.Combine(uploadsFolder, oldFolder, this.Guid);
            string newPath = System.IO.Path.Combine(uploadsFolder, newFolder, this.Guid);

            this.AttachableType = type.ToString();
            this.AttachableId = id;
            System.IO.File.Move(oldPath, newPath);
        }

        public static Attachment NewAttachment(HttpPostedFileBase fileBase)
        {
            Attachment attachment = new Attachment();
            attachment.FileName = fileBase.FileName;
            attachment.Guid = System.Guid.NewGuid().ToString();
            fileBase.SaveAs(GetDiskLocation(attachment));

            storeDB.Attachments.InsertOnSubmit(attachment);
            storeDB.SubmitChanges();
            return attachment;
        }

        private static string GetDiskLocation(Attachment attachment)
        {
            string folder = String.IsNullOrEmpty(attachment.AttachableType) ? "" : attachment.AttachableType;

            return System.IO.Path.Combine(uploadsFolder, folder, attachment.Guid);
        }
    }
}