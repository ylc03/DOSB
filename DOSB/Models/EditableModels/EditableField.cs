using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;

namespace DOSB.Models.EditableModels
{
    public class EditableField
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int FieldId { get; set; }

        public string Name { get; set; }

        public int ClientId { get; set; }

        public string ClientName { get; set; }

        public int CountryId { get; set; }

        public string CountryName { get; set; } 
    }
}