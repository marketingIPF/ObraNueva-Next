const STYLES = {
  disponible: "bg-status-available-bg text-status-available",
  reservada: "bg-status-reserved-bg text-status-reserved",
  vendida: "bg-status-sold-bg text-status-sold",
};

const LABELS = {
  disponible: "Disponible",
  reservada: "Reservada",
  vendida: "Vendida",
};

export default function StatusBadge({ estado, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STYLES[estado] || ""} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[estado] || estado}
    </span>
  );
}

export { LABELS as STATUS_LABELS };
