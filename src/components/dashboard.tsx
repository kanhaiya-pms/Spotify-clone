import axios from 'axios'
import { useEffect, useState } from 'react'

const Dashboard = () => {
    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState<any[]>([])
    const [trackData, setTrackData] = useState<any[]>([]);
    const [audio, setAudio] = useState(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [songKey, setSongkey] = useState("");
    let [count, setCount] = useState(0);
    console.log('artist======',artists);
    


    useEffect(() => {
        setAudio(new Audio());
      }, []);


    useEffect(() => {
        const hash: any = window.location.hash
        let token: any = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find((elem: any) => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [token])

    const fetchSong = async () => {
        await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songKey)}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                const items = response.data.tracks.items;
                console.log('Track ID:-----', items[0].preview_url);
                setTrackData(items)

            })
            .catch(error => {
                console.error('Error searching for track:', error);
            });
    }


    console.log('trackdata', trackData);



    const logout = () => {
        setToken("")
        setTrackData([])
        setArtists([])
        window.localStorage.removeItem("token")
    }

    const searchArtists = async (e: any) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
        console.log('all data---------',data);
        
        setArtists(data.artists.items)
    }


    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"200px"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
                <p className='w-full bg-amber-500 font-semibold'>Name:-  {artist.name}</p>
            </div>
        ))
    }


    const playSong = (url: string) => {
        if (audio.paused || audio.src !== url) {
            audio.src = url;
            audio.play();
            setIsPlaying(true); 
        } else {
            audio.pause();
            setIsPlaying(false); 
        }
    };

    function next() {
        if (count < trackData.length - 1) {
            audio.pause(); // Pause the current song
            setCount(count + 1); // Move to the next song
        } else {
            // Optionally, you could restart the playlist from the beginning
            // setCount(0);
        }
        console.log('count value----------', count);
    }

    const back = () => {
        if (count > 0) {
            audio.pause(); // Pause the current song
            setCount(count - 1); // Move to the previous song
        }
    };
    

  


    return (
        <div className="App">
            <header className="flex justify-between items-center py-2 px-10 bg-pink-600">
                <p className='font-bold text-3xl'>Welcome to music-world</p>
                <button
                    className='py-1  px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white'
                    onClick={logout}>Logout</button>
            </header>
            <div
                className="flex justify-between items-center py-2 px-10 bg-black"
            >
                <form onSubmit={searchArtists}>
                    <input
                        className='bg-gray-300 py-1  px-3'
                        placeholder='search-artist'
                        type="text" onChange={e => setSearchKey(e.target.value)} />
                    <button
                        className='py-1  px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white'

                        type={"submit"}>Search</button>
                </form>
                <div>
                    <input type="text"
                        placeholder='search song'
                        className='bg-red-300 py-1  px-3'
                        onChange={(e) => setSongkey(e.target.value)}
                    />
                    <button type='submit'
                        className='py-1  px-3 bg-green-600 hover:bg-green-800 rounded-lg text-white'
                        onClick={() => fetchSong()} >search-song</button>
                </div>
            </div>


            <div className='flex '>
                <div className='bg-cyan-400 w-[70%]'>
                    <div className="flex gap-3 flex-wrap">
                        {Array.isArray(trackData) &&
                            trackData.map((item, index) => (
                                <div key={index} className="bg-white p-4 rounded shadow-md">
                                    {item.album.images.length ? (
                                        <img
                                            className="w-40 h-40 object-cover rounded"
                                            src={item.album.images[0].url}
                                            alt={`${item.name} Album Cover`}
                                        />
                                    ) : (
                                        <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded">
                                            No Image
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <h2 className="text-lg font-semibold">{item.name}</h2>
                                        <p className="text-sm text-gray-500">{item.album.name}</p>
                                    </div>
                                    <button
                                        className="mt-2 bg-green-600 text-white text-xl font-semibold py-1 px-3 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                                        onClick={() => playSong(item.preview_url)}
                                    >
                                        Play
                                    </button>
                                </div>
                            ))}
                    </div>
                    <div className='flex gap-3 flex-wrap '>
                        {renderArtists()}
                    </div>
                </div>
                <div className='bg-pink-400 w-[30%] flex flex-col p-4  items-center'>

                    <div className='py-2'>
                        {trackData[count] && trackData[count].album.images.length ? (
                            <img
                                className="w-40 h-40 object-cover rounded"
                                src={trackData[count].album.images[0].url}
                                alt={`${trackData[count].name} Album Cover`}
                            />
                        ) : (
                            <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded">
                                No Image
                            </div>
                        )}
                        <title>{trackData[count] && trackData[count].album.name}</title>
                    </div>
                    <div className='flex gap-2'>
                        <button
                            type='submit'
                            onClick={back}
                            className='bg-green-600 py-1 px-3 rounded-sm text-white '>back</button>
                        <button
                            className='bg-green-600 py-1 px-3 rounded-sm text-white'
                            onClick={() => playSong(trackData[count].preview_url)}
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button
                            type='submit'
                            onClick={next}
                            className='bg-green-600 py-1 px-3 rounded-sm text-white'>next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard