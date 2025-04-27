
function VideosListSkeleton() {
  return (
    <div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="aspect-video rounded-xl bg-muted/50">
              <div className="h-full w-full animate-pulse rounded-xl bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-md font-bold p-2">
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/50" />
              </h1>
              <p className="text-md px-2">
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/50" />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideosListSkeleton;
