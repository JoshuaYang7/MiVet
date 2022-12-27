using Sabio.Models;
using Sabio.Models.Domain.Diagnostics;
using Sabio.Models.Requests.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public interface IDiagnosticService
    {
        void Update(DiagnosticUpdateRequest model, int userId);

        BaseDiagnostic GetById(int id);

        List<Diagnostic> GetByPracticeId(int id);

        Paged<BaseDiagnostic> SearchPaginationByHorseId(int pageIndex, int pageSize, int query);



        void UpdateIsArchived(int id, int userId, bool isArchived);

        int AddV2(DiagnosticAddRequest model, int userId);


    }
}
