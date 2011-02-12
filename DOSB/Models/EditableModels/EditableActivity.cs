using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DOSB.Models.EditableModels
{
    public class EditableActivity
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int ActivityId { get; set; }

        public string Description { get; set; }

        public bool Forklift { get; set; }

        public int Torque { get; set; }

        public int PressureTest { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime FinishedAt { get; set; }

        public DateTime CanceledAt { get; set; }

        public List<WorkshopAssignment> Assignments { get; set; }
    }
}