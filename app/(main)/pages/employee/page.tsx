//Manejo de empleados
/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { EmployeeService } from '@/demo/service/EmployeeService';
import { Demo } from '@/types';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const CrudEmployee = () => {
    let emptyEmployee: Demo.Employee = {
        name: '',
        idEmployee: '',
        lastName: '',
        phone: '',
        idNumber: 0,
        salary: 0,
        email: '',
        birthdate: '',
        image: '',
    };

    const [employees, setEmployees] = useState(null);
    const [employeesDialog, setEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
    const [employee, setEmployee] = useState<Demo.Employee>(emptyEmployee);
    const [selectedEmployees, setSelectedEmployees] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        EmployeeService.getEmployees().then((data) => setEmployees(data as any));
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const openNew = () => {
        setEmployee(emptyEmployee);
        setSubmitted(false);
        setEmployeeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEmployeeDialog(false);
    };

    const hideDeleteEmployeeDialog = () => {
        setDeleteEmployeeDialog(false);
    };

    const hideDeleteEmployeesDialog = () => {
        setDeleteEmployeesDialog(false);
    };

    const saveEmployee = () => {
        setSubmitted(true);

        if (employee.name.trim()) {
            let _employees = [...(employees as any)];
            let _employee = { ...employee };
            if (employee.idemployee) {
                const index = findIndexById(employee.idEmployee);

                _employees[index] = _employee;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000
                });
            } else {
                _employee.id = createIdEmployee();
                _employee.image = 'product-placeholder.svg';
                _employees.push(_employee);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000
                });
            }

            setEmployees(_employees as any);
            setEmployeeDialog(false);
            setEmployee(emptyEmployee);
        }
    };

    const editEmployee = (employee: Demo.Employee) => {
        setEmployee({ ...employee });
        setEmployeeDialog(true);
    };

    const confirmDeleteEmployee = (employee: Demo.Employee) => {
        setEmployee(employee);
        setDeleteEmployeeDialog(true);
    };

    const deleteEmployee = () => {
        let _employees = (employees as any)?.filter((val: any) => val.id !== employee.idemployee);
        setEmployees(_employees);
        setDeleteEmployeeDialog(false);
        setEmployee(emptyEmployee);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const findIndexById = (idemployee: string) => {
        let index = -1;
        for (let i = 0; i < (employees as any)?.length; i++) {
            if ((employees as any)[i].idemployee === idemployee) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createIdEmployee = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteEmployeesDialog(true);
    };

    const deleteSelectedEmployees = () => {
        let _employees = (employees as any)?.filter((val: any) => !(selectedEmployees as any)?.includes(val));
        setEmployees(_employees);
        setDeleteEmployeesDialog(false);
        setSelectedEmployees(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _employee = { ...employee };
        _employee[`${name}`] = val;

        setEmployee(_employee);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _employee = { ...employee };
        _employee[`${name}`] = val;

        setEmployee(_employee);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedEmployees || !(selectedEmployees as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.idEmployee}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Imagen</span>
                <img src={`/demo/images/employee/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const lastBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.lastName}
            </>
        );
    };

    const salaryBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Salario</span>
                {rowData.salary}
            </>
        );
    };

    const identificationBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Cedula</span>
                {rowData.idNumber}
            </>
        );
    };

    const phoneBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Celular</span>
                {rowData.phone}
            </>
        );
    };

    const birthdateBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <span className="p-column-title">Fecha de nacimiento</span>
                {rowData.birthdate ? new Date(rowData.birthdate as string | Date).toLocaleDateString() : 'N/A'}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Demo.Employee) => {
        return(
        <>
            <span className="p-column-title">Correo</span>
            {rowData.email}
        </>
        );
    };


    const actionBodyTemplate = (rowData: Demo.Employee) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editEmployee(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteEmployee(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administracion de empleados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const employeeDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveEmployee} />
        </>
    );
    const deleteEmployeeDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteEmployeeDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteEmployee} />
        </>
    );
    const deleteEmployeesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteEmployeesDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedEmployees} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={employees}
                        selection={selectedEmployees}
                        onSelectionChange={(e) => setSelectedEmployees(e.value as any)}
                        dataKey="idEmployee"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                        globalFilter={globalFilter}
                        emptyMessage="Empleado no encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="idEmployee" header="Codigo Empleado" body={idBodyTemplate}></Column>
                        <Column field="name" header="Nombres" body={nameBodyTemplate}></Column>
                        <Column field="lastName" header="Apellidos" body={lastBodyTemplate}></Column>
                        <Column field="salary" header="Salario" body={salaryBodyTemplate}></Column>
                        <Column field="idNumber" header="Cedula" body={identificationBodyTemplate}></Column>
                        <Column field="phone" header="Celular" body={phoneBodyTemplate}></Column>
                        <Column field="birthdate" header="Fecha de nacimiento" body={birthdateBodyTemplate}></Column>
                        <Column field="email" header="Correo" body={emailBodyTemplate}></Column>
                        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={employeesDialog} style={{ width: '450px' }} header="Información del empleado" modal className="p-fluid" footer={employeeDialogFooter} onHide={hideDialog}>

                        <div className="field">
                        <label htmlFor='imagen'>Imagen</label>
                            {employee.image && <img src={`/demo/images/employee/${employee.image}`} alt={employee.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nombres</label>
                            <InputText
                                id="name"
                                value={employee.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !employee.name
                                })}
                            />
                            {submitted && !employee.name && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="lastName">Apellidos</label>
                            <InputText
                                id="lastName"
                                value={employee.lastName}
                                onChange={(e) => onInputChange(e, 'lastName')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !employee.lastName
                                })}
                            />
                            {submitted && !employee.lastName && <small className="p-invalid">El apellido es requerido.</small>}
                        </div>

                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="salary">Salario</label>
                                <InputNumber id="salary" value={employee.salary} onValueChange={(e) => onInputNumberChange(e, 'salary')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="idNumber">Cedula</label>
                                <InputNumber id="idNumber" value={employee.idNumber} onValueChange={(e) => onInputNumberChange(e, 'idNumber')} />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="phone">Celular</label>
                                <InputText id="phone" value={employee.phone} onChange={(e) => onInputChange(e, 'phone')} />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="email">Correo</label>
                                <InputText id="email" value={employee.email} onChange={(e) => onInputChange(e, 'email')} />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="birthdate">Fecha de nacimiento</label>
                                <InputText id="birthdate" value={employee.birthdate ? employee.birthdate.toString(): ''} onChange={(e) => onInputChange(e, 'birthdate')} />
                            </div>

                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmployeeDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeeDialogFooter} onHide={hideDeleteEmployeeDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {employee && (
                                <span>
                                    Are you sure you want to delete <b>{employee.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteEmployeesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmployeesDialogFooter} onHide={hideDeleteEmployeesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {employee && <span>Esta seguro de eliminar este empleado?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CrudEmployee;
