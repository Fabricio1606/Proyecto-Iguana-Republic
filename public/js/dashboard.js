const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
const menuToggle = document.querySelectorAll(".menuToggle");

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener("click", function() {
        allSideMenu.forEach(i=> {
            i.parentElement.classList.remove("active");
        });
        li.classList.add("active");
    });
});

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})

if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');
const form = document.getElementById('form');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
		form.classList.add("dark")
		setCookie("mode", "dark", 31);
	} else {
		document.body.classList.remove('dark');
		form.classList.remove("dark")
		setCookie("mode", "day", 31);
	}
})

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

function checkCookie() {
	const switchMode = document.getElementById('switch-mode');
	const form = document.getElementById('form');
	let mode = getCookie("mode");
	
	if (mode == "") {
		document.body.classList.remove('dark');
		switchMode.checked = false;
		setCookie("mode", "day", 31);

		if(form != null) {
			form.classList.remove("dark")
		}
	} else if(mode == "day"){
		document.body.classList.remove('dark');
		switchMode.checked = false;
		setCookie("mode", "day", 31);

		if(form != null) {
			form.classList.remove("dark")
		}
	} else {
		document.body.classList.add('dark');
		setCookie("mode", "dark", 31);
		switchMode.checked = true;

		if(form != null) {
			form.classList.add("dark")
		}
	}
}

menuToggle.forEach(function(i) {
	i.addEventListener("click", function() {
		i.classList.toggle("active");
	})
})