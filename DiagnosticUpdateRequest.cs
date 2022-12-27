using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Diagnostics
{
    public class DiagnosticUpdateRequest : DiagnosticAddRequest, IModelIdentifier
    {
        public int Id { get; set; }


    }
}
