import { GrillaEsqueleto } from "@/components/GrillaEsqueleto";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="h-3 w-32 animate-pulse rounded bg-stone-200" />
      <div className="mt-3 h-10 w-48 animate-pulse rounded bg-stone-200" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-stone-200" />

      <div className="mt-8 h-28 animate-pulse rounded-3xl border border-stone-200 bg-white sm:h-32" />

      <div className="mt-10 space-y-3">
        <div className="h-7 w-64 animate-pulse rounded bg-stone-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
      </div>

      <div className="mt-6">
        <GrillaEsqueleto cantidad={8} />
      </div>
    </div>
  );
}
