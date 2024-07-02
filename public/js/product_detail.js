var knowBtn = document.querySelector(".know-more");
var buyBtn = document.querySelector(".buy")


// gsap.from(".card", {
//     scale: 0,
//     duration: 1,
// })
// gsap.from(".left", {
//     y: -1000,
//     duration: 0.7,
//     delay: 0.5
// })
// gsap.from(".right", {
//     y: 1000,
//     duration: 0.7,
//     delay: 1.5
// })
// gsap.from(".product", {
//     y: 1000,
//     duration: 0.7,
//     delay: 2
// })

// knowBtn.addEventListener("click", ()=>{
//     gsap.to(".left", {
//         width: "100%",
//         duration: 0.5
//     })
//     gsap.to(".right", {
//         width: "0%",
//         opacity: 0,
//         padding: 0,
//         duration: 0.5
//     })
//     gsap.to(".right .sections", {
//         display: "none",
//         opacity: 0,
//     })
//     gsap.to(".right button", {
//         display: "none",
//         opacity: 0,
//     })
//     gsap.to(".product", {
//         x: 50
//     })
//     gsap.to(".left", {
//         y: -200,
//         opacity: 0,
//         delay: 0.5
//     })
//     gsap.to(".description", {
//         y: 0,
//         opacity: 1,
//         delay: 0.5,
//         duration: 0.9,
//         display: "block"
//     })
//     gsap.from(".description-icon", {
//         y: -100,
//         opacity: 0,
//         delay: 1.4,
//         duration: 0.8,
//     })
//     gsap.to(".description .text .title, .description .text .content, .rating", {
//         y: 0,
//         opacity: 1,
//         delay: 1.4,
//         stagger: 0.2,
//     })
// })
// buyBtn.addEventListener("click", ()=>{
//     gsap.to(".description .text .title, .description .text .content, .rating", {
//         y: 100,
//         opacity: 0,
//     })
//     gsap.to(".description-icon", {
//         y: -100,
//         opacity: 0,
//     })
//     gsap.to(".description", {
//         y: -1000,
//         opacity: 0,
//         delay: 0.5,
//         duration: 1,
//         display: "none"
//     })
//     gsap.to(".product", {
//         x:"-57%",
//         delay: 0.5
//     })
//     gsap.to(".left", {
//         y: 0,
//         duration: 0.5,
//         opacity: 1,
//         delay: 0.5
//     })
//     gsap.to(".left", {
//         width: "60%",
//         delay: 1
//     })
//     gsap.to(".right", {
//         padding: "20px 60px",
//         width: "40%",
//         opacity: 1,
//         delay: 1.5,
//         duration: 0.5,
//         x: 0
//     })
//     gsap.to(".right .sections", {
//         display: "block",
//         opacity: 1,
//         delay: 1
//     })
//     gsap.to(".right button", {
//         display: "block",
//         opacity: 1,
//         delay: 1
//     })
// })

gsap.from('.nav__logo', {opacity: 0, duration: 1, delay: 1, y:10})
gsap.from('.nav__list .nav__item', {opacity: 0, duration: 1, delay: 1.2, y:30, stagger: 0.2})

gsap.from('.title', {opacity: 0, duration: 1, delay: 0.5, y:30})
gsap.from('.description', {opacity: 0, duration: 1, delay: 0.7, y:30})
gsap.from('.price', {opacity: 0, duration: 1, delay: 1, y:30})
gsap.from('.cart-button', {opacity: 0, duration: 1, delay: 1.5, y:30})
gsap.from('.image', {opacity: 0, duration: 1, delay: 1.7, y:30})