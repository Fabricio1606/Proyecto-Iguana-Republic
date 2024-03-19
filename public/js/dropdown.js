let dropdown = document.querySelector("#menu")

const dropArea = document.getElementById("drop-area")
const inputFile = document.getElementById("input-file")
const imageView = document.getElementById("img-view")

dropdown.addEventListener("click", function() {
    dropdown.classList.toggle("active")
});

function show(a) {
    document.querySelector(".menu").value = a;
}

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imageView.style.backgroundImage = `url(${imgLink})`;
    imageView.textContent = "";
    imageView.style.border = 0;
}

dropArea.addEventListener("dragover", function(e) {
    e.preventDefault();
});
dropArea.addEventListener("drop", function(e) {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadImage();
})