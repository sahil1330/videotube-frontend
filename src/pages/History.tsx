import React from 'react';

function History() {
    const watchedVideos = [
        { id: 1, title: 'Video 1', thumbnail: 'thumbnail1.jpg' },
        { id: 2, title: 'Video 2', thumbnail: 'thumbnail2.jpg' },
        { id: 3, title: 'Video 3', thumbnail: 'thumbnail3.jpg' },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Watch History</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {watchedVideos.map(video => (
                    <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <div className="text-lg font-semibold">{video.title}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;