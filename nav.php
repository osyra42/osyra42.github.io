<style>
    .rainbow-text {
        font-size: inherit;
        background: linear-gradient(-90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        font-weight: bolder;
        background-size: 200% 100%;
        animation: move-horizontal 1s linear infinite;
    }

        @keyframes move-horizontal {
        0% {
            background-position: 0% 0%;
        }
        50% {
            background-position: -100% 0%;
        }
        100% {
            background-position: -200% 0%;
        }
    }
</style>
<!-- Header -->
<header id="header">
        <h1 id="logo"><a href="index.php">osyra42's Site</a></h1>
        <nav id="nav">
            <ul>
                <li><a href="../home">Home</a></li>
                <li><a href="../updates">Updates</a></li>

                <li>
                    <a href="#">Services</a>
                    <ul>
                        <hr style="padding:0px;margin:0px;">
                        <li><a href="../shop">Shop</a></li>
                        <li><a href="../3dprint">3D Prints</a></li>
                        <li><a href="../vtuber">Vtuber Model</a></li>
                        <li><a href="../pcfix">Computer Repair</a></li>
                    </ul>
                </li>
                <li><a href="../contact">Contact Me</a></li>
                <li><a href="../giveaway" class="rainbow-text">Giveaway</a></li>
                <li><a target="_blank" href="https://paypal.me/heartdabstudio" class="button primary">Donate</a></li>
            </ul>
        </nav>
    </header>