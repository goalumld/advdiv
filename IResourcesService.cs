using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IResourcesService
    {
        int Create(ResourcesAddRequest model, int userId);
        Paged<Resources> Paginated(int pageIndex, int pageSize);
        void Update(ResourcesUpdateRequest model);
        void Delete(int id);
        Resources GetById(int id);
    }
}
