//Manejo de productos
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
import { ProductService } from '@/demo/service/ProductService';
import { Demo } from '@/types';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const CrudProduct = () => {
    let emptyProduct: Demo.Product = {
        name: '',
        idProduct: 0,
        description: '',
        price: 0,
        quantity: 0,
        category: '',
        image: '',
    };

    const [products, setProductsAll] = useState(null);
    const [productsDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        ProductService.getProductsAll().then((data) => setProductsAll(data as any));
    }, []);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };


    const saveProduct = () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let _products = [...(products as any)];
            let _product = { ...product };

            axios
                .post('http://localhost:8080/api/products/save', _product, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    if (product.idProduct) {
                            toast.current?.show({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Producto Actualizado con Éxito',
                                life: 3000,
                            });

                    } else {
                        _product.image ='product-placeholder.svg';
                        _products.push(_product);
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Producto Creado con Éxito',
                            life: 3000,
                        });
                    }

                    setProductsAll(_products as any);
                    setProductDialog(false);
                    setProduct(emptyProduct);
                })
                .catch((error) => {
                    console.error("Error al guardar el producto:", error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ocurrió un error al guardar el producto',
                        life: 3000,
                    });
                });
        }
    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };;

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = (products as any)?.filter((val: any) => val.id !== product.idProduct);

        axios
            .delete(`http://localhost:8080/api/products/delete/${product.idProduct}`, {
                headers: {
                    'Content-Type': 'application/json', // Usa el tipo de contenido correcto
                },
            })
            .then(() => {
                setProductsAll(_products);
                setDeleteProductDialog(false);
                setProduct(emptyProduct);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Producto eliminado',
                    life: 3000
                });
            })
            .catch((error) => {
                console.error('There was an error deleting the product:', error);
            });
    };


    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
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

    const idBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.idProduct}
            </>
        );
    };

    const productBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Producto</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Imagen</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Descripcion</span>
                {rowData.description}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {rowData.price}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.category}
            </>
        );
    };

    const quantityBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.quantity}
            </>
        );
    };



    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administracion de Productos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
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
                        value={products}
                        dataKey="idProduct"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="Producto no encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column headerStyle={{ width: '4rem' }}></Column>
                        {/* <Column field="idEmployee" header="Codigo Empleado" body={idBodyTemplate}></Column> */}
                        <Column field="name" header="Producto" body={productBodyTemplate}></Column>
                        <Column field="description" header="Descripcion" body={descriptionBodyTemplate}></Column>
                        <Column field="price" header="Precio" body={priceBodyTemplate}></Column>
                        <Column field="category" header="Categoria" body={categoryBodyTemplate}></Column>
                        <Column field="quantity" header="Cantidad" body={quantityBodyTemplate}></Column>
                        <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productsDialog} style={{ width: '450px' }} header="Información del producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                        <div className="field">
                        <label htmlFor='image'>Imagen</label>
                            {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Producto</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !product.name
                                })}
                            />
                            {submitted && !product.name && <small className="p-invalid">El nombre del producto es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="description">Descripción</label>
                            <InputText
                                id="description"
                                value={product.description}
                                onChange={(e) => onInputChange(e, 'description')}
                            />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col-6">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="quantity">Cantidad</label>
                                <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                            </div>
                            <div className="field col-6">
                                <label htmlFor="category">Categoria</label>
                                <InputText id="category" value={product.category} onChange={(e) => onInputChange(e, 'category')} />
                            </div>

                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    ¿Está seguro/a que quiere eliminar <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default CrudProduct;
