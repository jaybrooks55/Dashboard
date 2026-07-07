export default function StubPage({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
      <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
        Coming soon.
      </div>
    </div>
  );
}
