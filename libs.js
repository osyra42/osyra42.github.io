//jQuery
var scriptElement = document.createElement("script");
scriptElement.src = "https://code.jquery.com/jquery-3.7.0.min.js";
document.head.appendChild(scriptElement);

//global js
var scriptElement = document.createElement("script");
scriptElement.src = "../global.js";
document.head.appendChild(scriptElement);

//local js
var scriptElement = document.createElement("script");
scriptElement.src = "script.js";
document.head.appendChild(scriptElement);


//font awesome 
var cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
cssLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(cssLink);

//global css
var cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
cssLink.href = "../global.css";
document.head.appendChild(cssLink);

//local css
var cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
cssLink.href = "style.css";
document.head.appendChild(cssLink);