# 🐍 How to Learn Programming
::toc::
🎯 Don't learn a language just to learn it — **have a purpose.** The fastest way to learn programming is to pick one small project and finish it. Everything else follows from there.

If you're wondering where to start: **build a guess the number game.** It's the perfect first project because it works in almost any language, and it forces you to use every core concept a beginner needs.

---

## 🎮 Start Here: Guess the Number

The computer picks a random number between 1 and 100. You guess. It tells you "too high" or "too low." You keep guessing until you get it right.

That's it. Simple enough to finish in an afternoon, but it teaches you:

- **Variables** — storing the secret number and the player's guess
- **Data types** — numbers and text
- **Input/output** — getting a guess from the player and printing feedback
- **Conditionals** — if/else logic to compare the guess to the secret
- **Loops** — repeating until the player guesses correctly
- **Randomness** — generating a random number
- **Error handling** — what if the player types "banana" instead of a number?

Once you can build this from scratch without a tutorial, you understand the fundamentals. Everything after that is just new syntax for the same ideas.

**Build it in whatever language you're learning.** Python, JavaScript, Rust, Java, C#, C++, PHP, Lua — they can all do this. Pick one and finish it.

---

## 🧠 How to Actually Learn

Knowing what to build is only half the battle. The other half is how you approach the process.

### 📒 Learn by Doing, Not by Watching

Watching tutorial videos feels productive, but it's passive learning. You'll understand the concept while watching and forget it an hour later. This is called **tutorial hell** — the trap of consuming endless tutorials without ever building anything yourself.

**The rule:** For every hour you spend watching or reading a tutorial, spend at least an hour writing code.

**Active learning techniques:**

- **Type out the code yourself** — Don't copy-paste. Typing builds muscle memory.
- **Change something immediately** — After following a tutorial, modify the result. Add a feature, change the output, reorder the logic.
- **Explain it back** — Try to explain a concept out loud without looking at the source. If you can't, you don't understand it yet.
- **Rebuild from memory** — Delete your project and recreate it without the tutorial. You'll find the gaps in your understanding fast.

### 🧩 Break Problems Down

Programming isn't about knowing syntax — it's about breaking big problems into small, solvable pieces. "Build a guess the number game" is overwhelming as one task. Broken down, it's manageable:

1. **Generate a random number** — Figure out how your language does randomness
2. **Get input from the player** — Figure out how to read user input
3. **Compare the guess to the secret** — Write the if/else logic
4. **Loop until correct** — Wrap it in a while loop
5. **Handle bad input** — What if they type something that isn't a number?

Solve each piece individually, then stitch them together. This process works for every project you'll ever build.

### 🔍 Learn to Read Errors

Error messages are not your enemy — they're the computer telling you exactly what went wrong.

- **Look at the error type** — SyntaxError, TypeError, NameError, IndexError. This tells you the category of mistake.
- **Look at the line number** — The traceback shows you exactly which line caused the problem.
- **Read the message** — It usually describes the issue in plain-ish English ("name 'x' is not defined" means you used a variable you haven't created yet).
- **Google the exact error** — Copy the message, paste it into Google. Stack Overflow is your friend.

Don't be afraid of Stack Overflow. Every professional programmer looks things up constantly.

### 🐛 Debugging is a Skill

You will spend more time debugging than writing code. That's normal.

- **Print everything** — Add `print()` statements to see what your variables actually hold. The number one cause of bugs is assuming a variable contains something it doesn't.
- **Narrow the scope** — Comment out sections until it works again. The last thing you uncommented is likely the culprit.
- **Check your assumptions** — "I'm sure this variable is 5" — print it. It's probably not 5.
- **Rubber duck debugging** — Explain your code line by line to a rubber duck. Saying it out loud often reveals the problem.
- **Take a break** — Staring at the same bug for an hour? Walk away. Fresh eyes work wonders.

### 🧱 Build a Foundation, Then Go Deep

Don't try to learn five languages at once. Pick one, learn it well, and the concepts will transfer.

**Core concepts every language shares:**

- **Variables** — storing data
- **Data types** — numbers, text, booleans, lists, dictionaries
- **Conditionals** — if/else logic
- **Loops** — repeating actions (for, while)
- **Functions** — reusable blocks of code
- **Error handling** — dealing with things that go wrong
- **Data structures** — how to organize and access data efficiently

The guess the number game touches all of these. That's why it's the perfect first project.

### 🤝 Learn with Others

Programming can be lonely, but it doesn't have to be.

- **Join a Discord server** — Find communities for your language. Most are welcoming to beginners.
- **Read other people's code** — Browse open-source projects on GitHub.
- **Ask questions** — Don't suffer in silence. Stack Overflow, Reddit (r/learnprogramming), and Discord servers are full of people who want to help.
- **Answer questions** — Once you understand a concept, try answering beginner questions. Teaching reinforces your own understanding.
- **Pair program** — Find a friend and work on a project together.

---

## 📚 Resources

Sololearn is a great starting point, but it shouldn't be your only one. Each language below includes a mix of interactive courses, official documentation, and project-based learning.

### 🐍 Python

- [Sololearn: Python Developer](https://www.sololearn.com/en/learn/courses/python-developer)
- [Sololearn: Coding for Data (Python + SQL)](https://www.sololearn.com/en/learn/courses/data-programming)
- [Python Official Tutorial](https://docs.python.org/3/tutorial/)
- [Automate the Boring Stuff with Python](https://automatetheboringstuff.com/)
- [CS50P - Harvard](https://cs50.harvard.edu/python/)
- [Think Python (3rd Edition)](https://greenteapress.com/thinkpython3/)
- [A Byte of Python](https://python.swaroopch.com/)
- [Exercism Python Track](https://exercism.org/tracks/python)
- [Real Python](https://realpython.com/)
- [Corey Schafer - YouTube](https://www.youtube.com/user/schafer5)

### 🌐 HTML & CSS

- [Sololearn: Introduction to HTML](https://www.sololearn.com/en/learn/courses/html-introduction)
- [Sololearn: Introduction to CSS](https://www.sololearn.com/en/learn/courses/css-introduction)
- [Sololearn: Web Development](https://www.sololearn.com/en/learn/courses/web-development)
- [MDN Web Docs: HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [MDN Web Docs: CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [freeCodeCamp Responsive Web Design](https://www.freecodecamp.org/learn/2022/responsive-web-design/)

### 🌐 JavaScript

- [Sololearn: JavaScript Intermediate](https://www.sololearn.com/en/learn/courses/javascript-intermediate)
- [Sololearn: Angular](https://www.sololearn.com/en/learn/courses/angular)
- [Sololearn: Web Development](https://www.sololearn.com/en/learn/courses/web-development)
- [MDN Web Docs: JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)
- [freeCodeCamp JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

### 🦀 Rust

- [The Rust Programming Language (Official Book)](https://doc.rust-lang.org/book/title-page.html)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Exercism Rust Track](https://exercism.org/tracks/rust)

### ☕ Java

- [Sololearn: Introduction to Java](https://www.sololearn.com/en/learn/courses/java-introduction)
- [Sololearn: Java Intermediate](https://www.sololearn.com/en/learn/courses/java-intermediate)
- [Java Official Tutorials](https://dev.java/learn/)
- [Exercism Java Track](https://exercism.org/tracks/java)

### 💎 C#

- [Sololearn: C# Intermediate](https://www.sololearn.com/en/learn/courses/c-sharp-intermediate)
- [Microsoft C# Documentation](https://learn.microsoft.com/en-us/dotnet/csharp/)
- [Exercism C# Track](https://exercism.org/tracks/csharp)

### ⚙️ C / C++

- [Sololearn: Introduction to C](https://www.sololearn.com/en/learn/courses/c-introduction)
- [Sololearn: C Intermediate](https://www.sololearn.com/en/learn/courses/c-intermediate)
- [Sololearn: C++ Intermediate](https://www.sololearn.com/en/learn/courses/c-plus-plus-intermediate)
- [Learn C](https://www.learn-c.org/)
- [Learn C++](https://www.learncpp.com/)
- [Exercism C Track](https://exercism.org/tracks/c)
- [Exercism C++ Track](https://exercism.org/tracks/cpp)

### 🐘 PHP

- [PHP Manual](https://www.php.net/manual/en/)
- [PHP: The Right Way](https://phptherightway.com/)
- [W3Schools PHP Tutorial](https://www.w3schools.com/php/)
- [Exercism PHP Track](https://exercism.org/tracks/php)

### 🎮 Lua

- [Programming in Lua (Official Book)](https://www.lua.org/pil/)
- [Learn Lua in 15 Minutes](https://tylerneylon.com/a/learn-lua/)
- [LÖVE 2D Game Framework](https://love2d.org/)
- [Roblox Developer Hub](https://create.roblox.com/docs) — for Luau, Roblox's Lua derivative

### 📊 SQL

- [Sololearn: Introduction to SQL](https://www.sololearn.com/en/learn/courses/sql-introduction)
- [Sololearn: SQL Intermediate](https://www.sololearn.com/en/learn/courses/sql-intermediate)
- [SQLBolt](https://sqlbolt.com/)
- [Mode SQL Tutorial](https://mode.com/sql-tutorial/)

### 🗺️ Learning Paths & General Resources

- [roadmap.sh](https://roadmap.sh/) — Visual tech trees for frontend, backend, DevOps, and more.
- [Sololearn](https://www.sololearn.com/) — Free courses for picking up new languages.
- [Exercism](https://exercism.org/) — Free code practice with mentor feedback across 70+ languages.
- [freeCodeCamp](https://www.freecodecamp.org/) — Free, project-based certification tracks.

---

## 💡 Tips and Best Practices

- **Start small and finish** — A completed tiny project beats an abandoned big one every time. The guess the number game is small enough to finish.
- **Be consistent** — 30 minutes a day beats 5 hours once a week.
- **Don't memorize syntax** — Focus on understanding concepts, not memorizing exact function names.
- **Read the docs** — Official documentation is the most accurate source. Learning to read docs is a skill in itself.
- **Use version control** — Learn Git early. [GitHub](https://github.com/) and [GitLab](https://gitlab.com/) both offer free private repositories.
- **Comment your code** — Explain why you did something, not just what it does.
- **Name things well** — `calculate_total_price()` is infinitely better than `func1()`.
- **Don't compare yourself to others** — The only comparison that matters is you today vs. you last month.
- **Take breaks** — Burnout is real. Your brain consolidates learning during rest.
- **Embrace the struggle** — If it feels easy, you're not learning. Frustration is the feeling of your brain rewiring itself.
- **Keep a learning journal** — Write down what you learned each session, even if it's just one thing.
- **Don't switch languages too early** — Give your first language enough time to click. The grass isn't greener — it's just different syntax.

---

## 🚀 What to Build After Guess the Number

Once you've finished it, extend it:

- **Add difficulty levels** — Easy (1–10), Medium (1–100), Hard (1–1000)
- **Add a guess limit** — You only get 7 tries
- **Add a replay option** — Ask if they want to play again
- **Track statistics** — How many guesses did they average?
- **Add a hint system** — "You're getting warmer"

Each of these teaches you something new while building on what you already know. That's how you get good — one small finished project at a time.