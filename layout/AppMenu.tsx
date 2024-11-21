/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [
                    { label: 'General', icon: 'pi pi-fw pi-home', to: '/' },
                    { label: 'Acerca de nosotros', icon: 'pi pi-fw pi-globe', to: '/landing' },
            ]
        },
        {
            label: 'Gestión',
            items: [
                    { label: 'Empleados', icon: ' pi pi-users', to: '/pages/employee/'},
                    { label: 'Productos', icon: 'pi pi-shopping-bag', to: '/pages/product/'},
                    { label: 'Materia prima', icon: 'pi pi-truck', to: '/pages/rawMaterial/'},
                    { label: 'Ordenes', icon: 'pi pi-file-edit', to: '/pages/orders/'},
                    { label: 'Ventas', icon: 'pi pi-chart-line', to: '/pages/empty/'},
                    { label: 'Gastos', icon: 'pi pi-money-bill', to: '/pages/empty/'},
                    { label: 'Nómina', icon: 'pi pi-id-card', to: '/pages/empty/'},
                    { label: 'Clientes', icon: 'pi pi-users', to: '/pages/empty/'},
                    { label: 'Proveedores', icon: 'pi pi-user', to: '/pages/empty/'},
                    { label: 'Documentos', icon: 'pi pi-file-o', to: '/pages/empty/'},
                    { label: 'Cronograma', icon: 'pi pi-calendar', to: '/pages/empty/'},
                    { label: 'Perdidas', icon: 'pi pi-trash', to: '/pages/empty/'},
            ]
        },

        {
            label: 'Componentes opcionales',
            items: [
                {label: 'Componentes',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
                { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
                { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
                { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
                    ]
                }
        ]
        },

        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [

                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/login'
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            to: '/auth/error'
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            to: '/auth/access'
                        }
                    ]
                },

                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/pages/timeline'
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    to: '/pages/notfound'
                },
                {
                    label: 'Pagina vacia:Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/empty'
                }
            ]
        },

        {
            label: 'Get Started',
            items: [
                {
                    label: 'Documentacion plantilla',
                    icon: 'pi pi-fw pi-question',
                    to: '/documentation'
                },

                {
                    label: 'Enlace github frontend',
                    icon: 'pi pi-fw pi-search',
                    url: 'https://github.com/KarolBedoya/Boulevar_Soft_Frontend',
                    target: '_blank'
                },
                {
                    label: 'Enlace github backend',
                    icon: 'pi pi-fw pi-search',
                    url: 'https://github.com/codexansaan/Proyecto_Final_Soft_Boulevar',
                    target: '_blank'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}


            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
