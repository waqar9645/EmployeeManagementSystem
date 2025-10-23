﻿namespace EmployeeManagementSystem.DTOs
{
    public class SearchOptionDto
    {
        public string? Search { get; set; }
        public int? PageIndex { get; set; }
        public int? PageSize { get; set; } = 10;

        public int? EmployeeId { get; set; }
    }
    public class PagedData<T>
    {
        public int TotalData { get; set; }
        public List<T> Data { get; set; } = new List<T>();
    }
}
