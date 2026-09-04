import { Skeleton, SkeletonCardGrid } from "@/components/ui/skeleton";

/** Shown while a dashboard route's code is still being fetched. */
export default function DashboardLoading() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 space-y-3">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <SkeletonCardGrid count={4} />
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}
