export default function AdminDocs() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
      <a
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        href="/typedoc/index.html"
        target="_blank"
        rel="noreferrer"
      >
        Open TypeDoc
      </a>
    </div>
  );
}
