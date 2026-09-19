import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans text-center px-4">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">404 - Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-full bg-[#002E6E] text-white text-xs font-semibold hover:bg-[#002456] transition-colors shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
