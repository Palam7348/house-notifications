﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace houseNotificationsProject.Models
{
    public class Porch
    {
        
        [Key]
        public int PorchId { get; set; }
        
        [Required]
        [Display(Name = "Номер подьезда")]
        public int PorchNumber { get; set; }

        public List<Apartment> Apartments;
        
 //       public House house { get; set; }
        
        public int HouseId { get; set; }
    }
}