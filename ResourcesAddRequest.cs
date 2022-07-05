using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Resources
{
    public class ResourcesAddRequest
    {
        [Required]
        public string Name { get; set; }
        public string Headline { get; set; }
        public string Description { get; set; }
        public string Logo { get; set; }
        [Required]
        public int LocationId { get; set; }
        public string ContactName { get; set; }
        public string ContactEmail { get; set; }
        public string Phone { get; set; }
        public string SiteUrl { get; set; }
        [Required]
        public int CreatedBy { get; set; }
    }
}
