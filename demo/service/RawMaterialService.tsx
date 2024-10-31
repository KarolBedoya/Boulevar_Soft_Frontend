import { Demo } from '@/types';

export const RawMaterialService = {

    getRawMaterial() {
        return fetch('http://localhost:8080/api/rawmaterial/', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.RawMaterial[]);
    },


};
