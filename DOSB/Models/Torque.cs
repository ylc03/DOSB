using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DOSB.Models
{
    public partial class Torque
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
                        a.AttachableType == typeof(Torque).ToString()
                        && a.AttachableId == this.TorqueId
                        )).ToList();
                }
                return attachements;
            }
        }

        // 
        // Attachable: is this model can be attached.
        public bool Attachable
        {
            get { return (this.TorqueId > 0); }
        }

        //
        // Attach a attachment to pressure test
        public void Attach(Attachment att)
        {
            if (this.TorqueId == 0)
            {
                return;
            }
            this.attachements.Add(att);
            storeDB.AddToAttachment(att);
        }

        //
        // Delete a attachment to pressure test
        public void Detach(Attachment att)
        {
            if (this.TorqueId == 0)
            {
                return;
            }
            this.attachements.Remove(att);
            storeDB.Attachment.DeleteObject(att);
        }
    }
}