using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;

namespace DOSB.Models.EditableModels
{
    public class EditableRig
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int RigId { get; set; }

        public string Name { get; set; }

        public int EngId { get; set; }
    }
}