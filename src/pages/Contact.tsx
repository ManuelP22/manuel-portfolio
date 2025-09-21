export function ContactPage() {
  return (
    <div className="p-4 sm:p-6 space-y-4">
      <header>
        <h1 className="text-xl font-semibold">Contact</h1>
        <p className="text-muted-foreground">Hablemos ✉️</p>
      </header>

      <section className="space-y-2 text-sm leading-relaxed">
        <p>
          ¿Tienes una idea interesante o quieres colaborar? Estoy abierto a
          propuestas freelance y proyectos creativos.
        </p>
        <ul className="space-y-1">
          <li>
            <strong>Email:</strong> <a href="mailto:you@example.com" className="underline">you@example.com</a>
          </li>
          <li>
            <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/username" className="underline">/in/username</a>
          </li>
          <li>
            <strong>GitHub:</strong> <a href="https://github.com/username" className="underline">@username</a>
          </li>
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="font-semibold">Disponibilidad</h2>
        <p>Actualmente disponible para proyectos a medio tiempo.</p>
      </section>
    </div>
  );
}
