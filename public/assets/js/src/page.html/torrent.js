res = [
    "4k",
    "2k",
    "1080",
    "720"
]

let searchRes = {
    "4k": {},
    "2k": {},
    "1080": {},
    "720": {},
}

function searchTorrent(query) {
    if (searchParams.get('media_type') == 'tv') {
        query = query + ` ${document.getElementById('tv-select').value}`
    }
    socket.emit('searchTorrent', {query: query})
    socket.on('searchTorrentResults', (data) => {
        document.getElementById('poster').classList.add('tiny-img')
        document.getElementById('search-btn').style.display = 'none'
        document.getElementById(`results`).style.display = 'block'
        i=0
        res.forEach(rs => {
            if (!data[rs]) {
                document.getElementById(`results`).innerHTML += `
                <tr>
                    <th>${rs}</th>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                    <th></th>
                </tr>
                `
            } else {
                searchRes[rs] = data[rs]
                document.getElementById(`results`).innerHTML += `
                <tr>
                    <th>${rs}</th>
                    <th>${data[rs].seeds}</th>
                    <th>${data[rs].peers}</th>
                    <th>${data[rs].size}</th>
                    <th><button onclick=download('${rs}')>Download</button></th>
                </tr>
                `
                // <th><button onclick=dl(${i},'${data[rs].magnet}')>Download</button></th>
                i++
            }
        })
        console.log(searchRes)
    })
}

document.getElementById('search-btn').addEventListener('click', (e) => {
    e.target.textContent = '...'
    e.target.disabled = true
    searchTorrent(contentData.name)
})


async function download(res) {
    console.log(searchRes[res])
    document.getElementById(`results`).style.display = 'none'
    document.getElementById('poster').classList.remove('tiny-img')
    document.getElementById('download-status').style.display = 'initial'

    if (searchParams.get('media_type') == 'tv') {
        nName = contentData.name + ` ${document.getElementById('tv-select').value}`
    } else {
        nName = contentData.name
    }

    socket.emit('downloadTorrent', {torrentData: searchRes[res], media_type: searchParams.get('media_type'), name: nName, media_id: searchParams.get('id'), media_image: document.getElementById('poster').src})
    socket.on('downloadTorrentSuccess', (data) => {
        if (searchParams.get('media_type') == 'tv') {
            query = document.getElementById('title').textContent + ` ${document.getElementById('tv-select').value}`
        }
        document.getElementById('download-status').textContent = 'Download Finished!'
    })
}