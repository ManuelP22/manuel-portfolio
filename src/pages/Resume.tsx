export default function Resume() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 bg-base text-accent">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-accent">
        Resume
      </h1>

      <section className="space-y-6">
        {/* Experiencia */}
        <div className="p-4 rounded-md bg-secondary/40 border border-secondary/70">
          <h2 className="text-xl font-semibold mb-2 text-accent">Experiencia</h2>
          <ul className="space-y-3">
            <li>
              <div className="flex items-start justify-between">
                <strong className="text-accent">
                  Frontend Dev – Empresa X
                </strong>
                <span className="text-accent/60">2023–2025</span>
              </div>
              <p className="text-sm text-accent/80">
                React, Tailwind, animaciones, rendimiento.
              </p>
            </li>
          </ul>
        </div>

        {/* Educación */}
        <div className="p-4 rounded-md bg-secondary/40 border border-secondary/70">
          <h2 className="text-xl font-semibold mb-2 text-accent">Educación</h2>
          <p className="text-sm text-accent/80">Tu formación aquí…</p>
        </div>
      </section>
    </main>
  );
}
