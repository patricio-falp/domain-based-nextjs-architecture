'use client';

// [Imports]
import { useCallback, useMemo, useState } from 'react';
import { debounce, filter, groupBy, orderBy } from 'lodash';
import { SpinnerCentered } from '@components/ui/Spinner';
import type { PatientStatus } from '../domain/patient.interface';
import { PATIENT_STATUS_LABELS } from '../domain/patient.constants';
import { useGetPatients } from '../hooks/useGetPatients';

// --- Status badge ---
const STATUS_STYLES: Record<PatientStatus, string> = {
  active: 'bg-(--color-success-subtle) text-(--color-success) border border-(--color-success)',
  pending: 'bg-(--color-warning-subtle) text-(--color-warning) border border-(--color-warning)',
  discharged: 'bg-(--color-bg-muted) text-(--color-fg-muted) border border-(--color-border)',
};

// [Methods]
function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {PATIENT_STATUS_LABELS[status]}
    </span>
  );
}

// --- Summary cards ---
// Consumes useGetPatients (unfiltered) to always show global totals.
// lodash groupBy counts patients per status.

function SummaryCards() {
  const { data } = useGetPatients();

  const byStatus = useMemo(() => groupBy(data?.patients ?? [], 'status'), [data]);

  const cards = [
    {
      label: 'Total',
      value: data?.meta.total ?? '—',
      color: 'text-(--color-primary)',
    },
    {
      label: PATIENT_STATUS_LABELS.active,
      value: byStatus.active?.length ?? 0,
      color: 'text-(--color-success)',
    },
    {
      label: PATIENT_STATUS_LABELS.pending,
      value: byStatus.pending?.length ?? 0,
      color: 'text-(--color-warning)',
    },
    {
      label: PATIENT_STATUS_LABELS.discharged,
      value: byStatus.discharged?.length ?? 0,
      color: 'text-(--color-fg-muted)',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(({ label, value, color }) => (
        <div
          key={label}
          className="rounded-lg border border-(--color-border) bg-(--color-bg) p-4 text-center"
        >
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          <p className="mt-1 text-sm text-(--color-fg-muted)">{label}</p>
        </div>
      ))}
    </div>
  );
}

// --- Sort key type ---

type SortKey = 'lastName' | 'status' | 'lastVisit' | 'treatingPhysician';

// --- Main table component ---

export function PatientTable() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('lastName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');

  const { data, isLoading, isError } = useGetPatients();

  // lodash debounce: delays filtering 300 ms while the user types
  const applyDebounce = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 300),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      applyDebounce(e.target.value);
    },
    [applyDebounce]
  );

  // Client-side filtering and sorting over the full dataset from the hook.
  const patients = useMemo(() => {
    let result = data?.patients ?? [];

    // lodash filter by status
    if (statusFilter !== 'all') {
      result = filter(result, { status: statusFilter });
    }

    // lodash filter by search term
    const query = debouncedSearch.toLowerCase().trim();
    if (query) {
      result = filter(
        result,
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
          p.rut.includes(query) ||
          p.diagnosis.toLowerCase().includes(query)
      );
    }

    // lodash orderBy — lastName uses firstName as secondary criterion
    return sortKey === 'lastName'
      ? orderBy(result, ['lastName', 'firstName'], [sortDir, 'asc'])
      : orderBy(result, [sortKey], [sortDir]);
  }, [data, statusFilter, debouncedSearch, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function SortIcon({ field }: { field: SortKey }) {
    if (sortKey !== field) return <span className="ml-1 text-(--color-fg-subtle)">↕</span>;
    return <span className="ml-1 text-(--color-primary)">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  }

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Paciente', key: 'lastName' },
    { label: 'Estado', key: 'status' },
    { label: 'Última visita', key: 'lastVisit' },
    { label: 'Médico tratante', key: 'treatingPhysician' },
  ];

  return (
    <div>
      <SummaryCards />

      {/* Controles */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Buscar por nombre, RUT o diagnóstico…"
          value={search}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-fg) placeholder:text-(--color-fg-subtle) focus:border-(--color-primary) focus:outline-none sm:max-w-xs"
        />

        <div className="flex gap-2">
          {(['all', 'active', 'pending', 'discharged'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-(--color-primary) text-white'
                  : 'border border-(--color-border) bg-(--color-bg) text-(--color-fg-muted) hover:bg-(--color-bg-subtle)'
              }`}
            >
              {status === 'all' ? 'Todos' : PATIENT_STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {isLoading && <SpinnerCentered label="Cargando pacientes…" className="min-h-40" />}

      {isError && (
        <p className="py-8 text-center text-sm text-(--color-danger)">
          Error al cargar los pacientes. Intenta nuevamente.
        </p>
      )}

      {/* Tabla */}
      {!isLoading && !isError && (
        <>
          <div className="overflow-x-auto rounded-lg border border-(--color-border)">
            <table className="w-full text-sm">
              <thead className="bg-(--color-bg-subtle)">
                <tr>
                  {headers.map(({ label, key }) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      className="cursor-pointer select-none px-4 py-3 text-left font-medium text-(--color-fg-muted) hover:text-(--color-fg)"
                    >
                      {label}
                      <SortIcon field={key} />
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-medium text-(--color-fg-muted)">
                    Diagnóstico
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-(--color-fg-muted)">RUT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border)">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-(--color-fg-muted)">
                      No se encontraron pacientes.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="bg-(--color-bg) hover:bg-(--color-bg-subtle)">
                      <td className="px-4 py-3 font-medium text-(--color-fg)">
                        {patient.lastName}, {patient.firstName}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={patient.status} />
                      </td>
                      <td className="px-4 py-3 text-(--color-fg-muted)">{patient.lastVisit}</td>
                      <td className="px-4 py-3 text-(--color-fg-muted)">
                        {patient.treatingPhysician}
                      </td>
                      <td className="px-4 py-3 text-(--color-fg-muted)">{patient.diagnosis}</td>
                      <td className="px-4 py-3 font-mono text-xs text-(--color-fg-subtle)">
                        {patient.rut}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-right text-xs text-(--color-fg-subtle)">
            {patients.length} de {data?.meta.total ?? 0}
          </p>
        </>
      )}
    </div>
  );
}
