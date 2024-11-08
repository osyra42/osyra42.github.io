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
    <div class="skills">
    <h3>Skills</h3>
    <div class="skill-icons">
        <i class="fab fa-html5 skill-icon" title="HTML5"></i>
        <i class="fab fa-js-square skill-icon" title="JavaScript"></i>
        <i class="fab fa-css3-alt skill-icon" title="CSS3"></i>
        <i class="fab fa-python skill-icon" title="Python"></i>
        <i class="fa-solid fa-robot skill-icon" title="AI Prompting"></i>
    </div>
</div>
`;
