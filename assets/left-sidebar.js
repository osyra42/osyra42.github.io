document.getElementById("left-sidebar").innerHTML = `
<div class="text-center">
    <a href="index.html">
        <h1>Burger Byte Studio</h1>
    </a>
    <p style="font-style: italic; text-align: center; font-size:12px;"
    title="In computing, a nibble is an aggregation of four-bits; half of a byte&#013In burgerology a nibble is a small bite&#013In cryptocoin a Nibble is a worthless coin&#013In Vanity's research and development, a Nibble is a premium currency.">
    "Progress happens one Nibble at a time."</p>
    <div class="avatar-container">
        <img src="images/${image}" alt="${title}" />
    </div>
    <h2>${title}</h2>
</div>

<button id="disable-clutter" title=":rolling eyes: Disable Clutter"><i class="fa-solid fa-face-rolling-eyes"></i> Disable Clutter</button>
`;
