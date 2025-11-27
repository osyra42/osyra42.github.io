// changelog.js
// Changelog data for Coffee Byte Dev website

window.changelogData = `
. ............................
LEGEND OF COLORS
. decoration text
# yellow: timestamps
@ purple: project
- red: removed
+ green: added
> blue: description
$ bugs: known/fixed
  normal text

. ............................
# 2025 NOV 27
@ website
+ added Fishing Mini Game to Projects
+ added Clutter Chrome Extension to My Creations
> fishing mini game with procedural terrain, merchant trading, minimap, and character customization
> seasonal decorations extension with interactive physics

. ............................
# 2025 NOV 25
@ website
+ added vocabulary definitions matching worksheet
+ added word scramble worksheet
+ updated Vanity legal documents
+ fixed mobile sidebar scrolling issue
> uses dictionary API to fetch definitions

. ............................
# 2025 NOV 21
> I forgot to update the changelog
@ website
+ changed how changelog is handled
+ added Home School
+ added arithmetic worksheets
+ added measurement worksheets
+ added currency worksheets
+ added fractions worksheets
+ added decimal to fraction worksheets
+ added anonymous tracking to improve website
+ added back and logout buttons to homeschool pages
+ experimented with jsCanvas to draw the worksheets
+ added image to My Creations
+ added recommendations page
+ added donate page
+ merged about me with index page
+ enhanced skills section with professional terminology
+ added a way for changelog to work with CORS
+ added changelogData to changelog.js
+ updated commissions.html to include free policies
- removed changelog.txt
- removed form folder (replaced by new commissions system)
- removed form/form.html
- removed form/form.css
- removed form/3d_prints.html
- removed form/discord_bot.html
- removed form/vtuber_models.html
- removed form/code_help.html
- removed form/other.html
> old form system replaced by JSON-based commissions.html
> adjusted wording on many pages
> click on the red eye to see the tracking data

. ............................
# 2025 OCT 24
@ website
- removed the redundant pages my_research.html and my_projects.html
- removed request_form.html
+ added my_creations.html
+ added commissions.html
  adjusted the about me bio
> this update is for simplifying projects, fixed encoding

. ............................
# 2025 OCT 19
@ website
- most class tags were redundant
+ minimized the html
+ fixed mobile view (scroll fix and menu fix)
> this update is best for maintaining the website
$ wrong encoding on osyra's tale files

. ............................
# 2025 OCT 18
@ website
- head.js
+ repaired form
+ utf-8 encoding to fix emoji
> simplified files for faster loading
$ mobile view is broken, requires scroll fix and menu fix

. ............................
# 2025 OCT 16
@ website
- head.html
- discord links
+ head.js
+ sidebar "NEW" tag is automatic
+ lang="en"
> fixed flash on load and meta data missing
$ wrong encoding

. ............................
# 2025 OCT 07
@ website
@ book
@ clutter
+ added back clutter
+ added clutter toggle
+ transferred all chapters to @website
> moved about 40 chapters to be readable
$ wrong encoding
$ meta data missing

. ............................
# 2025 OCT 03
@ website
- jQuery
- mobile.css
- mobile.html
+ mobile.js (as library)
+ sidebar.js (as library)
+ changelog.html
> this website now uses vanilla JS and has a changelog (here) for all users to view
> mobile view is now functional, the page title has been restored
$ website still flashes white on fast reload
$ icons in the about me page are white
$ emojis are broken

. ............................
# 2025 SEP 26
@ website
- burgerbytestudio.com
- php
+ coffeebyte.dev
+ html (with jQuery)
> website url was changed to rebrand and to mark a server downgrade
$ website flashes white on fast reload
$ page title is missing
`;
