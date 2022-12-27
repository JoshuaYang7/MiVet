using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Diagnostics
{
    public class DiagnosticAddRequest
    {
        [AllowNull]
        public string CurrentDiet { get; set; }
        [AllowNull]
        public string HealthDescription { get; set; }
        public List<string> MedsSupplementsVitamins { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int HorseProfileId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int PracticeId { get; set; }

        public int? Weight { get; set; }

        public decimal? Temp { get; set; }

        [Required]
        public bool IsEating { get; set; }

        [Required]
        public bool IsStanding { get; set; }

        [Required]
        public bool IsSwelling { get; set; }

        [Required]
        public bool IsInfection { get; set; }

        [Required]
        public bool IsArchived { get; set; }


    }
}
