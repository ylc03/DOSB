using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DOSB.Models.EditableModels
{
    public class EditableTorqueLog
    {
        [ReadOnly(true)]
        public int TorqueId { get; set; }

        [ReadOnly(true)]
        public string PartNumber { get; set; }

        [ReadOnly(true)]
        public string SerialNumber { get; set; }

        [DataType("DateTime")]
        public DateTime? StartAt { get; set; }

        [DataType("DateTime")]
        public DateTime? FinishAt { get; set; }

        public int TorqueBy { get; set; }

        public int ApprovedBy { get; set; }
    }
}