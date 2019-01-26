
"use strict";

var microgram = null;
var photosDiv = null;
var row = null;
var gridBtn = null;
var listBtn = null;
var col1 = null;
var col2 = null;
var col3 = null;
var col4 = null;
var items = [];

function setupGrid() {
    row = document.createElement('div');
    col1 = document.createElement('div');
    col2 = document.createElement('div');
    col3 = document.createElement('div');
    col4 = document.createElement('div');
    row.className = 'row';
    col1.className = 'column';
    col1.id = 'col-1';
    col2.className = 'column';
    col2.id = 'col-2';
    col3.className = 'column';
    col3.id = 'col-3';
    col4.className = 'column';
    col4.id = 'col-4';
    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);
    row.appendChild(col4);
    microgram.appendChild(row);
}


function setupMenu() {
    gridBtn = document.createElement('a');
    listBtn = document.createElement('a');
    gridBtn.id = 'grid-btn';
    listBtn.id = 'list-btn';
    gridBtn.innerHTML = '&nbsp;';
    listBtn.innerHTML = '&nbsp;';
    var gridBtnLi = document.createElement('li');
    var listBtnLi = document.createElement('li');
    var btnUl = document.createElement('ul');
    var sw = document.createElement('div');
    sw.id = 'switch';
    gridBtnLi.appendChild(gridBtn);
    btnUl.appendChild(gridBtnLi);
    listBtnLi.appendChild(listBtn);
    btnUl.appendChild(listBtnLi);
    sw.appendChild(btnUl);
    microgram.appendChild(sw);
}


function addEventListeners() {

    listBtn.addEventListener('click', function () {
        listView()
    })
    gridBtn.addEventListener('click', function () {
        gridView()
    })

}

function setup() {
    microgram = document.getElementById('microgram');
    setupMenu();
    photosDiv = document.createElement('div');
    photosDiv.id = 'list';
    microgram.appendChild(photosDiv);
    setupGrid();
    addEventListeners();
    loadImages();
}



function listView() {
    col1.innerHTML = '';
    col2.innerHTML = '';
    col3.innerHTML = '';
    col4.innerHTML = '';
    items.forEach(function (image) {
        setTimeout(renderImage(image, -1), 100);
    });
    lozad().observe();
}

function gridView() {
    // photosDiv.innerHTML = '';
    while (photosDiv.firstChild) {
        photosDiv.removeChild(photosDiv.firstChild);
    }
    var count = 0;
    items.forEach(function (image) {
        setTimeout(renderImage(image, count % 4), 100);
        count++;
    });
    lozad().observe();
}

function renderImage(image, col) {
    var a = document.createElement('a');
    a.className = 'photo-link';
    a.href = image['url'];
    var img = document.createElement('img');
    a.appendChild(img);
    var text = document.createElement('p')
    text.classList.add('photo-description')
    var url = '';

    if (col === -1) {
        url = image['image'];
        img.classList.add('photo-fullsize');
        text.innerHTML = image["content_text"].split('\n', -1)[0];
        img.onload = function (ev) {
            img.style.minHeight = 'initial';
            img.parentNode.style.minHeight = 'initial';
        }
    } else {
        url = image['_microblog']['thumbnail_url'];
        img.onload = function (ev) {
            if (ev.target.height !== ev.target.width) {
                ev.target.style.height = '' + ev.target.width + 'px';
                // console.log(ev.target);
            }
            img.style.minHeight = 'initial';
            img.parentNode.style.minHeight = 'initial';
        }
    }
    img.setAttribute("data-src", url);
    img.classList.add('photo');
    img.classList.add('lozad');


    switch (col) {
        case 0:
            col1.appendChild(a);
            break;
        case 1:
            col2.appendChild(a);
            break;
        case 2:
            col3.appendChild(a);
            break;
        case 3:
            col4.appendChild(a);
            break;
        case -1:
            photosDiv.appendChild(a);
            photosDiv.appendChild(text);
            photosDiv.appendChild(document.createElement('hr'));
            break;
        default:
    }

}

function renderNoContent() {
    var p = document.createElement('p');
    p.innerText = 'No photos.'
    photosDiv.appendChild(p);
}

function loadImages() {

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open('GET', "/photos/index.json", true);
    xhr.send();
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.response.length == 0) {
                renderNoContent();
            } else {
                microgram.removeChild(microgram.firstChild);
                var count = 0;
                items = xhr.response['items']
                items.forEach(function (image) {
                    setTimeout(renderImage(image, count % 4), 100);
                    count++;
                });
                lozad().observe();
            }
        } else if (xhr.readyState == 4 && xhr.status !== 200) {
            renderNoContent();
        }
    }
}

setup();