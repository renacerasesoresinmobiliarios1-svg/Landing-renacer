import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardAdmin from '../../../../src/components/DashboardAdmin';
import DashboardVendedor from '../../../../src/components/DashboardVendedor';

interface Props {
  role?: string;
  user?: any;
  kpis?: any;
  properties?: any[];
}

export default function DashboardPage({ role = 'admin', user, kpis, properties = [] }: Props) {
  const [currentRole, setCurrentRole] = useState(role);

  const handleSwitchRole = async (newRole: string) => {
    try {
      await fetch('/quick-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      window.location.reload();
    } catch (err) {
      setCurrentRole(newRole);
    }
  };

  const isAdmin = currentRole === 'admin';

  return (
    <>
      <Head title={`Panel ${isAdmin ? 'Administrador (Jorge)' : 'Asesor (Vendedor)'} - Renacer`} />

      {isAdmin ? (
        <DashboardAdmin
          user={user}
          kpis={kpis}
          properties={properties}
          onSwitchRole={handleSwitchRole}
        />
      ) : (
        <DashboardVendedor
          user={user}
          properties={properties}
          onSwitchRole={handleSwitchRole}
        />
      )}
    </>
  );
}