# Lesson 05: Working with Variables

Variables are key to software development. They allow you to store, label and play with data.

In this lesson, you'll learn to work with data that has been stored in variables.

---

## Quick Review

Store a string in a variable:

```python
size = "large"
```

Store a number in a variable:

```python
age = 25
```

Access a variable's value by calling its name:

```python
price = 150
print(price)  # Shows: 150
```

---

## Calculations with Variables

You can make calculations using the values in variables.

```python
budget = 20
print(budget + 10)  # Shows: 30
```

```python
price = 5
amount = 3
print(price * amount)  # Shows: 15
```

---

## Storing Calculation Results

You can store the result of a calculation in a variable.

```python
score = 7 + 8
print(score)  # Shows: 15
```

You can create a new variable to store the result of a calculation made using other variables.

```python
price = 5
amount = 6
total = price * amount
print(total)  # Shows: 30
```

---

## Reassigning Variables

You can update the value stored in a variable. The variable will forget the previously stored value.

```python
price = 99
price = 100
print(price)  # Shows: 100
```

Updating the value of a variable is called **reassigning** a variable.

```python
points = 35
points = 45
print(points)  # Shows: 45
```

---

## Putting It All Together

```python
name = "Tom"
level = 14
print(name)         # Shows: Tom
level = level + 1
print(level)        # Shows: 15
```

Creating a variable:

```python
credit = 200
```

---

## Lesson Takeaways

Great job! You learned that:

- You can run calculations using the values stored in variables
- You can store the result of a calculation in a variable
- Updating the value of a variable is called **reassigning** a variable

In the next lesson, you'll start fixing errors in broken code.
