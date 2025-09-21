export function AboutPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4 text-sm leading-relaxed">
      <header>
        <h1 className="text-xl font-semibold">About Me</h1>
        <p className="text-muted-foreground">Un poco sobre quién soy y qué hago</p>
      </header>

      <section className="space-y-2">
        <p>
          Hola! Soy Manuel, desarrollador frontend con foco en experiencias
          UI modernas, micro-interacciones y performance. Me encanta trabajar
          con React, TypeScript y animaciones con Framer Motion.
        </p>
        <p>
          También disfruto diseñar sistemas de componentes accesibles,
          refinar detalles visuales y crear herramientas internas que
          simplifiquen flujos de equipo.
        </p>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Skills destacadas</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>React, TypeScript, Vite</li>
          <li>Tailwind CSS, shadcn/ui, diseño de componentes</li>
          <li>Framer Motion, accesibilidad (a11y)</li>
          <li>Testing básico (Vitest/RTL), buenas prácticas</li>
        </ul>
      </section>
    </div>
  );
}
