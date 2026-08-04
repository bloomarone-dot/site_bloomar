export function DashboardPage() {
  const cards = [
    { label: "Visiteurs", value: "—", hint: "Analytics — Sprint 1" },
    { label: "Leads", value: "—", hint: "CRM — Sprint 2" },
    { label: "RDV", value: "—", hint: "CRM — Sprint 2" },
    { label: "Médias", value: "Actif", hint: "Upload disponible" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-bloomar-navy dark:text-white">Dashboard</h2>
        <p className="text-sm text-slate-500">Sprint 0 — socle technique opérationnel</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="mt-2 text-3xl font-black text-bloomar-navy dark:text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-bloomar-navy dark:text-white">Actions rapides</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <a className="btn-primary" href="/settings">Paramètres globaux</a>
          <a className="btn-secondary" href="/media">Bibliothèque médias</a>
        </div>
      </div>
    </div>
  );
}
