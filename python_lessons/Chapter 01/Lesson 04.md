# Lesson 04: Numbers & Math Operations

Numerical data is information that comes in the form of numbers.

In this lesson, you'll learn how to deal with numerical data in your computer programs.

---

## Storing Numbers

Numerical values can be directly stored in variables.

```python
population = 8000000
```

Numerical data shouldn't be in quotation marks.

```python
book = "The Hobbit"
pages = 310
```

Here, `pages` is storing a numerical value and `book` is storing a string.

```python
points = 500
```

- **Variable name:** points
- **Variable value:** 500

---

## Printing Numbers

You can send a number to the screen with the `print()` statement. You just need to insert the number between the parentheses.

```python
print(280)
```

---

## Math Operations

You can perform math operations with numbers. Each `print()` instruction will add a value to the screen in a new line.

```python
print(7 + 3)    # Addition: 10
print(10 - 5)   # Subtraction: 5
print(5 * 3)    # Multiplication: 15
print(10 / 2)   # Division: 5.0
```

The symbol used to multiply numbers in Python is `*`.

---

## Print vs No Print

You can use the `print()` statement to check that the computer is following your instructions.

Both lines of code below will make the computer perform the calculation. But only the first one will show the result on the screen:

```python
print(3 + 7)  # Shows 10 on screen
3 + 7          # Calculates but shows nothing
```

---

## Accessing Variable Values

A variable's name is used to identify where that information is stored. You can access the value that a variable is storing by calling its name.

```python
budget = 200
print(budget)  # Shows: 200
```

You access the value stored in a variable by **calling the variable name**.

---

## Combining It All

```python
username = "magician"
points = 50
lives = 3
print(username)  # Shows: magician
print(points)    # Shows: 50
```

This code displays `magician` and `50` — only the values passed to `print()` are shown.

---

## Lesson Takeaways

Great work! You completed the lesson. You learned that:

- Numerical values can be stored in variables
- You can access the value stored in a variable by calling its name
- Numerical data should not be surrounded by quotation marks

In the next lesson, you'll learn to work with the data you stored in variables.
