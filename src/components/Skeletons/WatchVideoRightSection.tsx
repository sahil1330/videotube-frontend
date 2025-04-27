import { Skeleton } from "../ui/skeleton";

function WatchVideoRightSection() {
  return (
    <div className="right md:w-2/6  px-4">
      <div className="user-videos">
        <h1 className="text-2xl text-center font-bold">
          <Skeleton className="h-4 w-full" />
        </h1>
        <div className="user-videos-list flex flex-col gap-4 py-6">
          <div className="user-video-card flex">
            <div className="aspect-video rounded-xl bg-muted/50 w-1/2">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
            <div>
              <h1 className="md:text-sm text-lg font-bold p-2">
                <Skeleton className="h-4 w-3/4" />
              </h1>
              <p className="text-md px-2">
                              <Skeleton className="h-4 w-3/4" />
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchVideoRightSection;
