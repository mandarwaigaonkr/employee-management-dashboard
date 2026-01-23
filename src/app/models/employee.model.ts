export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
    status: 'Active' | 'Inactive';
}
