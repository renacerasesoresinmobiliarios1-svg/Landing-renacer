import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import Home from '../../../src/components/Home';

interface Props {
    auth?: {
        user?: any;
    };
}

export default function Welcome({ auth }: Props) {
    const pageProps = usePage().props as any;
    const user = auth?.user || pageProps?.auth?.user;

    return (
        <>
            <Head title="RENACER - Grupo Inmobiliario | Chihuahua y Guadalajara">
                <meta
                    name="description"
                    content="Venta y renta de propiedades exclusivas en Chihuahua y Guadalajara. Asesoría inmobiliaria profesional de alta gama con certeza jurídica."
                />
            </Head>
            <Home authUser={user} />
        </>
    );
}