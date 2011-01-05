using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Objects;
using System.Data;

namespace DOSB.Models
{
    public partial class DOSBEntities
    {
        partial void OnContextCreated()
        {
            this.SavingChanges +=new EventHandler(context_SavingChanges);
        }

        private static void context_SavingChanges(object sender, EventArgs e)
        {
           // foreach (ObjectStateEntry entry in
           //((ObjectContext)sender).ObjectStateManager.GetObjectStateEntries(
           //EntityState.Added | EntityState.Modified))
           // {
           //     // Add pressure test attachments in to database
           //     if (entry.Entity is PressureTest)
           //     {
           //         foreach (Attachment a in (entry.Entity as PressureTest).Attachments)
           //         {
           //             if (a.AttachmentId == 0) // new attachment
           //             {
           //                 (sender as DOSBEntities).Attachment.AddObject(a);
           //             }
           //         }
           //     }
           // }
        }
    }
}