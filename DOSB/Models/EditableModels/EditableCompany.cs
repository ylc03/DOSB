using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

using DOSB.Models;

namespace DOSB.Models.EditableModels
{
    public class EditableCompany
    {
        [ReadOnly(true)]
        [ScaffoldColumn(false)]
        public int CompanyId { get; set; }

        public string ShortName { get; set; }

        public string FullName { get; set; }

        public string BackgroundColor { get; set; }

        public string TextColor { get; set; }
    }
}