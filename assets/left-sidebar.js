document.getElementById("left-sidebar").innerHTML = `
<div class="text-center">
    <a href="index.html">
        <h1>Burger Byte Studio</h1>
    </a>
    <div class="avatar-container">
        <img src="images/${image}" alt="${title}" />
    </div>
    <h2>${title}</h2>
</div>

<button id="disable-clutter" title=":rolling eyes: Disable Clutter"><i class="fa-solid fa-face-rolling-eyes"></i> Disable Clutter</button>
`;
