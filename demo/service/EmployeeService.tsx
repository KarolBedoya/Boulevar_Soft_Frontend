import { Demo } from '@/types';

export const EmployeeService = {

    getEmployees() {
        return fetch('http://localhost:8080/api/employees/', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Employee[]);
    },

    
};
