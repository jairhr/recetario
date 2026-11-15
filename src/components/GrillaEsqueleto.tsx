interface GrillaEsqueletoProps {
  cantidad?: number;
}

export function GrillaEsqueleto({ cantidad = 8 }: GrillaEsqueletoProps) {
  const tarjetas = Array.from({ length: cantidad }, (_valor, indice) => indice);

  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {tarjetas.map((tarjeta) => (
        <div
          key={tarjeta}
          className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="aspect-[4/3] animate-pulse bg-stone-200" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
