using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Resources
{
    public class ResourcesUpdateRequest : ResourcesAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
    }
}
