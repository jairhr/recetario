import { GrillaEsqueleto } from "@/components/GrillaEsqueleto";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="h-3 w-28 animate-pulse rounded bg-stone-200" />
      <div className="mt-3 h-10 w-56 animate-pulse rounded bg-stone-200" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-stone-200" />

      <div className="mt-10">
        <GrillaEsqueleto cantidad={4} />
      </div>
    </div>
  );
}
