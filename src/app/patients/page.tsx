// [Imports]
import type { Metadata } from 'next';
import { Card } from '@components/ui/Card';
import { PatientTable } from './_features/components/patientTable';

export const metadata: Metadata = {
  title: 'Patients | My App',
  description: 'Patient management and records.',
};

export default function PatientsPage() {
  return (
    <main className="min-h-screen bg-(--color-bg-subtle) p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-(--color-fg)">Pacientes</h1>
          <p className="mt-2 text-(--color-fg-muted)">
            Gestión y visualización de registros de pacientes.
          </p>
        </div>

        <Card variant="elevated">
          <Card.Header
            title="Lista de Pacientes"
            description="Usa el buscador o los filtros para encontrar pacientes. Haz clic en los encabezados de columna para ordenar."
          />
          <Card.Content>
            <PatientTable />
          </Card.Content>
        </Card>
      </div>
    </main>
  );
}
