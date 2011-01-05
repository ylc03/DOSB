using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DOSB.Models
{
    public partial class PressureTest
    {
        private List<Attachment> attachements = new List<Attachment>();
        private DOSBEntities storeDB = new DOSBEntities(); 

        public List<Attachment> Attachments
        {
            get
            {
                if (this.attachements == null)
                {
                    this.attachements = storeDB.Attachment.Where(a => (
                        a.AttachableType == typeof(PressureTest).ToString()
                        && a.AttachableId == this.PressureTestId
                        )).ToList();
                }
                return attachements;
            }
        }

        //
        // Attach a attachment to pressure test
        public void Attach(Attachment att)
        {
            if (this.PressureTestId == 0)
            {
                return;
            }
            this.attachements.Add(att);
            storeDB.AddToAttachment(att);
        }

        //
        // Delete a attachment to pressure test
        public void Dettach(Attachment att)
        {
            if (this.PressureTestId == 0)
            {
                return;
            }
            this.attachements.Remove(att);
            storeDB.Attachment.DeleteObject(att);
        }
    }
}