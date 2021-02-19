// Интерфейс разделен на две части. В левой части пользователь видит список альбомов. 

// Когда пользователь нажмет на какой-то альбом в правой части он увидит фотографии 
//из этого альбома. Их берем из https://jsonplaceholder.typicode.com/photos?albumId=ID где вместо ID подставляем id нужного альбома.

// Сразу при загрузке приложения и получения списка альбомов, в правой части нужно показать фотографии из первого альбома в списке

const albumsList = $('.js-album-list');
const gallery = $('.js-gallery');

//LOGIC
function getAlbums() {
    const request = sendAlbumsRequest();
    request.then((response) => {
        renderAlbums(response);
    });
}

function setActive() {
    const album = $('.js-album:first');
    album.addClass('active-album');
    getActiveAlbum();
}

function getActiveAlbum() {
    const album = $('.active-album');
    getPhotos(album.attr('id'))
}

function getPhotos(albumID) {
    const photos = sendPhotosRequest(albumID);
    photos.then((response) => {
        renderPhotos(response);
    });
}

function createAlbumEventListener() {
    albumsList.click((event) => {
        if (event.target.classList.contains('js-album')) {
            clearActive();
            clearGallery();
            getPhotos(event.target.id);
        }
    });
}

//HTML
function getAlbumItem(album) {
    return `<a href="#" class="list-group-item list-group-item-action list-group-item-primary js-album" id="${album.id}">${album.title}</a>`
}

function getPhotoItem(photo) {
    return `<div class="card" album-id = "${photo.albumId} "id="${photo.id}"><img src="${photo.url}" class="card-img-top" alt="..."></div>`;
}

//REQUESTS

function sendAlbumsRequest() {
    return new Promise((resolve, reject) => {
        $.ajax('https://jsonplaceholder.typicode.com/albums', {
            success: (data) => {
                resolve(data);
            },
            error: (errorThrown) => {
                reject(new Error(errorThrown));
            },
        });
    });
}

function sendPhotosRequest(albumID) {
    return new Promise((resolve, reject) => {
        $.ajax(`https://jsonplaceholder.typicode.com/photos?albumId=${albumID}`, {
            success: (data) => {
                resolve(data);
            },
            error: (errorThrown) => {
                reject(new Error(errorThrown));
            },
        });
    });
}


//RENDER
function renderAlbums(response) {
    const album = response.map(album => getAlbumItem(album));
    albumsList.html(album.join(''));
    setActive()
}

function renderPhotos(response) {
    const photos = response.map(photo => getPhotoItem(photo));
    gallery.html(photos.join(''));
}

//CLEAR
function clearActive() {
    albumsList.find('.active-album').removeClass('active-album');
}

function clearGallery() {
    gallery.html('');
}


//INIT

init();

function init() {
    getAlbums();
    createAlbumEventListener();
}