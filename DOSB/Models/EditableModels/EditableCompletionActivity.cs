using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;

namespace DOSB.Models.EditableModels
{
    public class EditableCompletionActivity
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int ActivityId { get; set; }

        public Rigs Rig {get; set;}

        public Wells Well {get; set;}

        public CompletionTypes CompletionType {get; set;}

        public IList<CompletionActivityRelations> Jobs { get; set; }

        public string Comment { get; set; }

        public DateTime? ShowAt { get; set; }
    }
}