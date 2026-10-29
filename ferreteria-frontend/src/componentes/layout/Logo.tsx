import { Layers } from 'lucide-react'

/** Marca temporal de Ivera; el logo definitivo se integrara en un sprint futuro. */
export function Logo({ claro = true }: { claro?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-marca text-white shadow-sm">
        <Layers className="size-5" strokeWidth={2.4} aria-hidden />
      </div>
      <div className="leading-tight">
        <p className={claro ? 'text-[17px] font-bold text-white' : 'text-[17px] font-bold text-tinta'}>Ivera</p>
        <p className="text-xs text-tinta-tenue">Sistema ERP</p>
      </div>
    </div>
  )
}
