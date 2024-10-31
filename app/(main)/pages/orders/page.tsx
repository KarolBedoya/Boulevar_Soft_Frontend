//Ordenes
'use client';

import axios from "axios";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import { Menu } from 'primereact/menu';
import React, { useRef } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';

const orders = () => {

    return (
        <div className="col-12">
                <div className="card">
                    <h5>Splitter</h5>
                    <Splitter style={{ height: '300px' }}>
                        <SplitterPanel size={30} minSize={10}>
                            <div className="h-full flex align-items-center justify-content-center">Panel 1</div>
                        </SplitterPanel>
                        <SplitterPanel size={70}>
                            <Splitter layout="vertical">
                                <SplitterPanel size={50} minSize={10}>
                                    <div className="h-full flex align-items-center justify-content-center">Panel 2</div>
                                </SplitterPanel>
                                <SplitterPanel size={50} minSize={10}>
                                    <div className="h-full flex align-items-center justify-content-center">Panel 3</div>
                                </SplitterPanel>
                            </Splitter>
                        </SplitterPanel>
                    </Splitter>
                </div>
            </div>
    )

}
export default orders;
