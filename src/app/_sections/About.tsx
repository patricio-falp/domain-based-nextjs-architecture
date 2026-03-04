export default function About() {
  return (
    <section id="about" className="py-24 bg-(--color-bg-subtle)">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-(--color-fg) mb-4">About</h2>
        <p className="text-(--color-fg-muted) text-lg leading-relaxed mb-6">
          We build modern, scalable web applications with a focus on developer experience and
          production readiness. Our stack is designed to get you from idea to deployment quickly
          without sacrificing code quality.
        </p>
        <p className="text-(--color-fg-muted) text-lg leading-relaxed">
          This template includes everything you need: authentication, state management, data
          fetching, forms with validation, charts, and a comprehensive UI component library — all
          configured and ready to use.
        </p>
      </div>
    </section>
  );
}
