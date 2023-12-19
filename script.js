const collected = 61;

var x = document.getElementById('progress');
var string = document.getElementById('string');


x.max = 135;
x.value = collected;
let percent = Math.floor(x.value/x.max*100)

string.innerHTML = `I have collected $${x.value}.<br>
Thats ${percent}% of the original $${x.max}.<br>
Thank you all. <3`;