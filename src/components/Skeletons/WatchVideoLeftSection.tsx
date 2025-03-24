import { Skeleton } from "../ui/skeleton";

function WatchVideoLeftSection() {
  return (
    <div className="left lg:w-4/6">
      <div className="video-player">
        <div className="aspect-video rounded-xl bg-muted/50 w-full">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <div className="video-engagement-buttons flex items-center gap-4">
          <div className="left-flex w-1/2 flex items-center gap-4">
            <div className="avatar w-[60px] h-[60px] rounded-full">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchVideoLeftSection;
