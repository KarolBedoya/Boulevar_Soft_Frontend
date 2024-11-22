//Manejo de Materia Prima
/* eslint-disable @next/next/no-img-element */
'use client';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { RawMaterialService } from '@/demo/service/RawMaterialService';
import { Demo } from '@/types';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const CrudRawMaterial = () => {
    let emptyRawMaterial: Demo.RawMaterial = {
        name: '',
        idRawMaterial: 0,
        stock: 0,
        unitPrice: 0,
        unitOfMeasurement: '',
    };


    const [rawMaterials, setRawMaterialsAll] = useState(null);//Estado para almacenar las materias primas obtenidas del backend
    const [rawMaterialsDialog, setRawMaterialDialog] = useState(false);//Controlar la visibilidad del diálogo de creación/edición de materia prima
    const [deleteRawMaterialDialog, setDeleteRawMaterialDialog] = useState(false);
    const [rawMaterial, setRawMaterial] = useState<Demo.RawMaterial>(emptyRawMaterial);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        RawMaterialService.getRawMaterial().then((data) => setRawMaterialsAll(data as any));
    }, []);



     //función para abrir el formulario de creación de una nueva materia prima
    const openNew = () => {
        setRawMaterial(emptyRawMaterial);
        setSubmitted(false);
        setRawMaterialDialog(true);
    };

    //cerrar el diálogo sin guardar cambios
    const hideDialog = () => {
        setSubmitted(false);
        setRawMaterialDialog(false);
    };

    //Cerrar el diálogo de confirmación de eliminación
    const hideDeleteRawMaterialDialog = () => {
        setDeleteRawMaterialDialog(false);
    };


    //Guardar o actualizar una materia prima
    const saveRawMaterial = () => {
        setSubmitted(true); //Validación del formulario

        if (rawMaterial.name.trim()) { // Si el nombre de la materia prima no está vacío
            const _rawMaterials = [...rawMaterials as any];
            const _rawMaterial = { ...rawMaterial };

            axios
            .post('http://localhost:8080/api/rawmaterials/save', _rawMaterial, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (rawMaterial.idRawMaterial) {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Materia Prima Actualizada con Éxito',
                            life: 3000,
                        });

                } else {

                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Materia Prima Creada con Éxito',
                        life: 3000,
                    });
                }

                setRawMaterialsAll(_rawMaterials as any);
                setRawMaterialDialog(false);
                setRawMaterial(emptyRawMaterial);
            })
            .catch((error) => {
                console.error("Error al guardar la materia prima:", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al guardar la materia prima',
                    life: 3000,
                });
            });
    }
};

    const editRawMaterial = (rawMaterial: Demo.RawMaterial) => {
        setRawMaterial({ ...rawMaterial });
        setRawMaterialDialog(true);
    };

     //confirmar la eliminación de una materia prima
    const confirmDeleteRawMaterial = (rawMaterial: Demo.RawMaterial) => {
        setRawMaterial(rawMaterial);
        setDeleteRawMaterialDialog(true);
    };

    const deleteRawMaterial = async () => {
        let _rawMaterials = (rawMaterials as any)?.filter((val: any) => val.id !== rawMaterial.idRawMaterial);

        axios
            .delete(`http://localhost:8080/api/rawmaterials/delete/${rawMaterial.idRawMaterial}`, {
                headers: {
                    'Content-Type': 'application/json', // Usa el tipo de contenido correcto
                },
            })

            .then(() => {
            setRawMaterialsAll(_rawMaterials);
            setDeleteRawMaterialDialog(false);
            setRawMaterial(emptyRawMaterial);
            toast.current?.show({
                severity: 'success',
                summary: 'Eliminación exitosa',
                detail: 'Materia Prima eliminada',
                life: 3000,
            });
        })
        .catch((error) => {
            console.error('Error al eliminar el producto:', error);
        });
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _rawMaterial = { ...rawMaterial };
        _rawMaterial[`${name}`] = val;

        setRawMaterial(_rawMaterial);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _rawMaterial = { ...rawMaterial };
        _rawMaterial[`${name}`] = val;

        setRawMaterial(_rawMaterial);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
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

    const idBodyTemplate = (rowData: Demo.RawMaterial) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.idRawMaterial}
            </>
        );
    };

    const rawMaterialBodyTemplate = (rowData: Demo.RawMaterial) => {
        return (
            <>
                <span className="p-column-title">Materia Prima</span>
                {rowData.name}
            </>
        );
    };



    const stockBodyTemplate = (rowData: Demo.RawMaterial) => {
        return (
            <>
                <span className="p-column-title">Stock</span>
                {rowData.stock}
            </>
        );
    };

    const unitPriceBodyTemplate = (rowData: Demo.RawMaterial) => {
        return (
            <>
                <span className="p-column-title">Precio Unitario</span>
                {rowData.unitPrice}
            </>
        );
    };

    const unitOfMeasurementBodyTemplate = (rowData: Demo.RawMaterial) => {
        return (
            <>
                <span className="p-column-title">Unidad de Medida</span>
                {rowData.unitOfMeasurement}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Demo.RawMaterial) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRawMaterial(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRawMaterial(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administracion de Materia Prima</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..."  value={globalFilter} />
            </span>
        </div>
    );


    const rawMaterialDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveRawMaterial} />
        </>
    );
    const deleteRawMaterialDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRawMaterialDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteRawMaterial} />
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
                        value={rawMaterials}
                        dataKey="idRawMaterial"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Producto no encontrado."
                        header={header}
                        scrollable
                        scrollHeight="400px"
                    >
                        <Column headerStyle={{ width: '4rem' }}></Column>
                        {/* <Column field="idEmployee" header="Codigo Empleado" body={idBodyTemplate}></Column> */}
                        <Column field="name" header="Materia Prima" body={rawMaterialBodyTemplate}></Column>
                        <Column field="stock" header="Stock" body={stockBodyTemplate}></Column>
                        <Column field="unitPrice" header="Precio Unitario" body={unitPriceBodyTemplate}></Column>
                        <Column field="unitOfMeasurement" header="Unidad de Medida" body={unitOfMeasurementBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={rawMaterialsDialog} style={{ width: '450px' }} header="Información de Materia Prima" modal className="p-fluid" footer={rawMaterialDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="name">Materia Prima</label>
                            <InputText
                                id="name"
                                value={rawMaterial.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !rawMaterial.name
                                })}
                            />
                            {submitted && !rawMaterial.name && <small className="p-invalid">El nombre de la materia prima es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="stock">Stock</label>
                            <InputNumber
                                id="stock"
                                value={rawMaterial.stock}
                                onValueChange={(e) => onInputNumberChange(e, 'stock')}
                            />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="unitPrice">Precio Unitario</label>
                                <InputNumber id="unitPrice" value={rawMaterial.unitPrice} onValueChange={(e) => onInputNumberChange(e, 'unitPrice')} mode="currency" currency="USD" locale="en-US" />
                            </div>

                            <div className="field col-6">
                                <label htmlFor="unitOfMeasurement">Unidad de Medida</label>
                                <InputText id="unitOfMeasurement" value={rawMaterial.unitOfMeasurement} onChange={(e) => onInputChange(e, 'unitOfMeasurement')} />
                            </div>

                        </div>
                    </Dialog>

                    <Dialog visible={deleteRawMaterialDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRawMaterialDialogFooter} onHide={hideDeleteRawMaterialDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {rawMaterial && (
                                <span>
                                    ¿Está seguro/a que quiere eliminar <b>{rawMaterial.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default CrudRawMaterial;
