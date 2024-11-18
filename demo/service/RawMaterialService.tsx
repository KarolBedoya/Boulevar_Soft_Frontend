import { Demo } from '@/types';

export const RawMaterialService = {

    getRawMaterial() {
        return fetch('http://localhost:8080/api/rawmaterials/', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.RawMaterial[]);
    },


};
