// Assuming jsonData is the array of JSON objects you provided

// 1. Get reference to the parent element
var container = document.querySelector('.container');

// 2. Loop through each JSON object
data.forEach(function(item) {
    // 3. Create HTML elements
    var div = document.createElement('div');
    div.classList.add('box');

    var h3 = document.createElement('h3');
    h3.textContent = item.title;

    var img = document.createElement('img');
    img.src = item.image;
    img.alt = "";

    var p = document.createElement('p');
    p.textContent = item.description;

    // 4. Append elements to the parent element
    div.appendChild(h3);
    div.appendChild(img);
    div.appendChild(p);

    container.appendChild(div);
});
