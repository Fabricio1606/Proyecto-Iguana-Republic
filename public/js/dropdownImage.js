let dropdown = document.querySelector("#menu")

const dropArea = document.getElementById("drop-area")
const inputFile = document.getElementById("input-file")
const imageView = document.getElementById("img-view")
const imgHolder = document.getElementById("changeImage")

if(dropdown != null) {
    dropdown.addEventListener("click", function() {
        dropdown.classList.toggle("active")
    });
}

function show(a) {
    document.querySelector(".menu").value = a;
}

if(inputFile != null) {
    inputFile.addEventListener("change", uploadImage);
} 
function uploadImage() {
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.style.border = 0;
    imgHolder.src = ``;
}

if(dropArea != null) {
    dropArea.addEventListener("dragover", function(e) {
        e.preventDefault();
    });
    dropArea.addEventListener("drop", function(e) {
        e.preventDefault();
        inputFile.files = e.dataTransfer.files;
        uploadImage();
    })
}