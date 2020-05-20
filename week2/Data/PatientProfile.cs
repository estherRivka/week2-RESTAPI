using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using week2.Data.Entities;
using week2.Models;

namespace week2.Data
{
    public class PatientProfile : Profile
    {
        public PatientProfile()
        {
            this.CreateMap<Patient, PatientModel>()
                .ForMember(dest => dest.PatientId, opt => opt.MapFrom(m => m.Id))
                //.ForMember(dest=>dest.Paths, )
                .ReverseMap()
                .ForMember(dest => dest.Moniker, opt => opt.Ignore());
       
            this.CreateMap<Path, PathModel>()
                .ReverseMap()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

        }
    }
}
