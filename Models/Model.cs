using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;

namespace ASPNETCOREFORM.Models {

    public class Test {
        public int TestId {get;set;}
        public string ItemName {get;set;}
        public string Quantity {get;set;}
    }

    public class InventoryContext : DbContext
    {
        public DbSet<Test> Inventories {get;set;}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Filename=./Test.db");
        }

    }


}