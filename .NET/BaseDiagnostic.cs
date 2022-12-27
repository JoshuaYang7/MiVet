using Sabio.Models.Domain.HorseProfiles;
using Sabio.Models.Domain.Practices;
using Sabio.Models.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Diagnostics
{
    public class BaseDiagnostic
    {
        public int Id { get; set; }
        public string CurrentDiet { get; set; }
        public string HealthDescription { get; set; }
        public List<MedsSupplementsVitamins> MedsSupplementsVitamins { get; set; }
        public BaseHorseProfile HorseProfile { get; set; }
        public int PracticeId { get; set; }
        public int Weight { get; set; }
        public decimal Temp { get; set; }
        public bool IsEating { get; set; }
        public bool IsStanding { get; set; }
        public bool IsSwelling { get; set; }
        public bool IsInfection { get; set; }
        public bool IsArchived { get; set; }

        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }
}
