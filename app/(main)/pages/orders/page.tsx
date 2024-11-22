//Ordenes
'use client';

import axios from "axios";
import React, { useRef } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';



const orders = () => {



     return (
        <div className="col-12">
        <div className="card">
            <h5>Ordenes</h5>
            <Splitter style={{ height: '300px' }}>
                <SplitterPanel size={30} minSize={10}>
                    <div className="mt-1 ml-1 h-full flex align-items-start justify-content-start">


                    </div>
                </SplitterPanel>
                <SplitterPanel size={70}>
                    <Splitter layout="vertical">
                        <SplitterPanel size={50} minSize={10}>
                            <div className="h-full flex align-items-center justify-content-center">Panel 2
                            </div>
                        </SplitterPanel>
                        <SplitterPanel size={50} minSize={10}>
                            <div className="h-full flex align-items-end justify-content-end">
                            <Button className="mb-1 ml-1" label="Nueva orden" severity="success" />
                            </div>
                        </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
            </Splitter>
        </div>
    </div>
    )

}
export default orders;
