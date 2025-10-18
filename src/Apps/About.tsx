export function AboutPage() {
  return (
    <div className="p-4 sm:p-6 space-y-5 text-sm leading-relaxed">
      <header>
        <h1 className="text-xl font-semibold">About Me</h1>
        <p className="text-muted-foreground">
          Desarrollador full-stack con foco en frontend y experiencia integrando APIs y desplegando en producción.
        </p>
      </header>

      <section className="space-y-2">
        <p>
          Me gusta construir interfaces limpias, rápidas y accesibles. Trabajo
          con React y un stack moderno de tooling para entregar productos
          mantenibles y con buena DX. También tengo base sólida en backend con
          C#/.NET y SQL Server, por lo que puedo moverme con comodidad de punta
          a punta en el ciclo de desarrollo.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {/* Frontend */}
        <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-white/5">
          <h2 className="font-semibold mb-2">Frontend</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>React + TypeScript</li>
            <li>Vite (bundling, dev tooling)</li>
            <li>CSS moderno (Flex/Grid), utilidades y arquitectura</li>
            <li>Tailwind CSS (diseño de componentes y system tokens)</li>
            <li>Axios para consumo de APIs RESTful</li>
          </ul>
        </div>

        {/* Backend */}
        <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-white/5">
          <h2 className="font-semibold mb-2">Backend</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>C# / .NET (APIs REST, servicios)</li>
            <li>SQL Server (modelado, consultas, performance básica)</li>
          </ul>
        </div>

        {/* DevOps / Herramientas */}
        <div className="rounded-lg border border-black/10 dark:border-white/10 p-4 bg-white/50 dark:bg-white/5 sm:col-span-2">
          <h2 className="font-semibold mb-2">Herramientas & Deploy</h2>
          <ul className="list-disc pl-5 grid gap-1 sm:grid-cols-2">
            <li>Git & GitHub (flujo PR, issues, CI básico)</li>
            <li>IIS (despliegue y hosting en Windows)</li>
            <li>Buenas prácticas de a11y y rendimiento</li>
            <li>Escritura de documentación ligera y handoff</li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Lo que busco</h2>
        <p>
          Proyectos donde pueda aportar en UI/UX y arquitectura de frontend, integrarme
          con APIs REST, y colaborar con el equipo en la calidad del producto y el proceso
          de entrega.
        </p>
      </section>
    </div>
  );
}
