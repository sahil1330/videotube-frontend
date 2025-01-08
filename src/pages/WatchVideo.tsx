function WatchVideo() {
    return (
        <>
            <div className="video-player">
                <div className="aspect-video rounded-xl bg-muted/50" >
                    <video src="https://www.w3schools.com/html/mov_bbb.mp4" controls></video>
                </div>
            </div>
        </>
    )
}

export default WatchVideo