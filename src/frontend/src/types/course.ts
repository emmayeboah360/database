export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type LessonId = string;
export type ModuleId = string;
export type CertificateId = string;
export type UserId = string;
export type Timestamp = bigint;

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: LessonId;
  moduleId: ModuleId;
  title: string;
  description: string;
  content: string;
  difficulty: Difficulty;
  durationMinutes: number;
  order: number;
  quiz?: QuizQuestion[];
}

export interface Module {
  id: ModuleId;
  title: string;
  description: string;
  order: number;
}

export interface LessonWithStatus {
  lesson: Lesson;
  completed: boolean;
  completedAt?: Timestamp;
}

export interface ModuleWithLessons {
  module_: Module;
  lessons: LessonWithStatus[];
  completedCount: number;
  totalCount: number;
}

export interface DashboardData {
  completionPercentage: number;
  currentModuleId?: ModuleId;
  nextLessonId?: LessonId;
  totalLessons: number;
  completedLessons: number;
}

export type CertificateLevel = "StandardLevel" | "HigherLevel";

export interface Certificate {
  id: CertificateId;
  userId: UserId;
  learnerName: string;
  courseTitle: string;
  completedAt: Timestamp;
  issuedAt: Timestamp;
  level?: CertificateLevel;
}

export interface UserProfile {
  userId: UserId;
  isEnrolled: boolean;
  overallProgressPercentage: number;
  certificates: Certificate[];
}

export interface CourseOverview {
  title: string;
  description: string;
  totalModules: number;
  totalLessons: number;
  estimatedHours: number;
}

// Static lesson content for the Python course
export const PYTHON_MODULES: ModuleWithLessons[] = [
  {
    module_: {
      id: "mod-1",
      title: "Python Foundations",
      description: "Core Python syntax, variables, and basic operations",
      order: 1,
    },
    completedCount: 0,
    totalCount: 4,
    lessons: [
      {
        lesson: {
          id: "lesson-1-1",
          moduleId: "mod-1",
          title: "Introduction to Python",
          order: 1,
          description:
            "Get started with Python — history, philosophy, and your first script.",
          difficulty: "Beginner",
          durationMinutes: 15,
          content: `# Introduction to Python

Python is a high-level, interpreted programming language known for its clean syntax and readability. Created by Guido van Rossum in 1991, Python has become one of the world's most popular languages.

## Why Python?

- **Readable syntax** — code reads almost like English
- **Versatile** — web development, data science, automation, AI, and more
- **Huge ecosystem** — hundreds of thousands of packages via PyPI
- **Beginner-friendly** — quick to learn, quick to ship

## Your First Python Program

\`\`\`python
# This is a comment
print("Hello, World!")

name = "Python Learner"
print(f"Welcome, {name}!")
\`\`\`

## How Python Runs Code

Python is an **interpreted** language. The Python interpreter reads your source code line by line and executes it directly — no compilation step needed.

\`\`\`python
# Running Python interactively
>>> 2 + 2
4
>>> "hello".upper()
'HELLO'
\`\`\`

## Variables and Assignment

In Python, variables are created when you first assign a value. No declaration needed.

\`\`\`python
age = 25
name = "Alice"
height = 1.75
is_student = True

print(f"{name} is {age} years old")
\`\`\``,
          quiz: [
            {
              id: "q-1-1-1",
              question:
                "Who created Python and in what year was it first released?",
              options: [
                "James Gosling in 1995",
                "Guido van Rossum in 1991",
                "Linus Torvalds in 1991",
                "Dennis Ritchie in 1972",
              ],
              correctIndex: 1,
              explanation:
                "Python was created by Guido van Rossum and first released in 1991. It was designed with readability and simplicity as core principles.",
            },
            {
              id: "q-1-1-2",
              question:
                "What does the following code print?\n\nname = 'Alice'\nprint(f'Hello, {name}!')",
              options: [
                "Hello, name!",
                "Hello, {name}!",
                "Hello, Alice!",
                "SyntaxError",
              ],
              correctIndex: 2,
              explanation:
                "f-strings (formatted string literals) evaluate expressions inside `{}` at runtime. `{name}` is replaced with the value of the variable `name`, which is 'Alice'.",
            },
            {
              id: "q-1-1-3",
              question:
                "Python is described as an 'interpreted' language. What does this mean?",
              options: [
                "Python code must be compiled to machine code before running",
                "Python requires a virtual machine like the JVM",
                "The interpreter reads and executes source code directly, line by line",
                "Python code is translated to C before execution",
              ],
              correctIndex: 2,
              explanation:
                "An interpreted language has its source code read and executed directly by the interpreter at runtime, without a separate compile step. This makes development faster but can be slower at runtime than compiled languages.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-1-2",
          moduleId: "mod-1",
          title: "Data Types & Variables",
          order: 2,
          description:
            "Explore Python's built-in data types: integers, floats, strings, and booleans.",
          difficulty: "Beginner",
          durationMinutes: 20,
          content: `# Data Types & Variables

Python has several built-in data types. Understanding them is fundamental to writing correct code.

## Numeric Types

\`\`\`python
# Integer
count = 42
negative = -10

# Float
pi = 3.14159
temperature = -5.5

# Complex
z = 3 + 4j

print(type(count))    # <class 'int'>
print(type(pi))       # <class 'float'>
\`\`\`

## Strings

Strings are sequences of characters, enclosed in single or double quotes.

\`\`\`python
greeting = "Hello, World!"
name = 'Alice'
multiline = """
This spans
multiple lines
"""

# String operations
print(greeting.upper())         # HELLO, WORLD!
print(greeting.lower())         # hello, world!
print(len(greeting))            # 13
print(greeting[0:5])            # Hello
print(f"My name is {name}")     # My name is Alice
\`\`\`

## Booleans

\`\`\`python
is_active = True
is_deleted = False

print(is_active and is_deleted)  # False
print(is_active or is_deleted)   # True
print(not is_active)             # False
\`\`\`

## Type Conversion

\`\`\`python
num_str = "42"
num_int = int(num_str)   # 42
num_float = float(num_str)  # 42.0
back_to_str = str(num_int)  # "42"
\`\`\``,
          quiz: [
            {
              id: "q-1-2-1",
              question: "What is the output of `type(3.14)`?",
              options: [
                "<class 'int'>",
                "<class 'number'>",
                "<class 'float'>",
                "<class 'decimal'>",
              ],
              correctIndex: 2,
              explanation:
                "In Python, `3.14` is a floating-point number, so `type(3.14)` returns `<class 'float'>`. Use `int()` for whole numbers and `float()` for decimals.",
            },
            {
              id: "q-1-2-2",
              question: "What does `'Hello, World!'[0:5]` evaluate to?",
              options: ["'Hello'", "'Hello,'", "'ello,'", "'World'"],
              correctIndex: 0,
              explanation:
                "Python slicing `[start:stop]` returns characters from index `start` up to but not including `stop`. Index 0 is 'H', 1 is 'e', 2 is 'l', 3 is 'l', 4 is 'o' — giving 'Hello'.",
            },
            {
              id: "q-1-2-3",
              question: "What is the result of `bool(0)` in Python?",
              options: ["True", "False", "0", "TypeError"],
              correctIndex: 1,
              explanation:
                "In Python, `0`, empty strings `''`, empty lists `[]`, and `None` are all falsy. `bool(0)` returns `False`. Any non-zero number is truthy.",
            },
            {
              id: "q-1-2-4",
              question:
                "Which of these correctly converts the string `'42'` to an integer?",
              options: [
                "integer('42')",
                "int('42')",
                "str.toInt('42')",
                "Number('42')",
              ],
              correctIndex: 1,
              explanation:
                "Python's built-in `int()` function converts a string or float to an integer. `int('42')` returns the integer `42`. Note that `int('3.14')` would raise a ValueError — use `int(float('3.14'))` for that.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-1-3",
          moduleId: "mod-1",
          title: "Control Flow",
          order: 3,
          description:
            "Master if/elif/else statements and comparison operators.",
          difficulty: "Beginner",
          durationMinutes: 20,
          content: `# Control Flow

Control flow determines the order in which your code executes based on conditions.

## If / Elif / Else

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade: {grade}")  # Your grade: B
\`\`\`

## Comparison Operators

\`\`\`python
x = 10
y = 20

print(x == y)   # False (equal)
print(x != y)   # True  (not equal)
print(x < y)    # True  (less than)
print(x > y)    # False (greater than)
print(x <= 10)  # True  (less than or equal)
print(x >= 10)  # True  (greater than or equal)
\`\`\`

## Logical Operators

\`\`\`python
age = 25
has_ticket = True

if age >= 18 and has_ticket:
    print("Access granted")

if age < 16 or not has_ticket:
    print("Access denied")
\`\`\`

## Ternary Expression

\`\`\`python
# Compact one-line conditional
status = "adult" if age >= 18 else "minor"
print(status)  # adult
\`\`\``,
          quiz: [
            {
              id: "q-1-3-1",
              question:
                "Given `score = 85`, what does the if/elif/else chain in this lesson print?",
              options: [
                "Your grade: A",
                "Your grade: B",
                "Your grade: C",
                "Your grade: F",
              ],
              correctIndex: 1,
              explanation:
                "85 is not >= 90, but it is >= 80, so the `elif score >= 80` branch runs and sets `grade = 'B'`. Python evaluates conditions top-to-bottom and stops at the first true one.",
            },
            {
              id: "q-1-3-2",
              question:
                "What is the output of `status = 'adult' if 20 >= 18 else 'minor'`?",
              options: ["minor", "adult", "True", "SyntaxError"],
              correctIndex: 1,
              explanation:
                "The ternary expression evaluates the condition `20 >= 18` which is True, so `status` is assigned `'adult'`. This is Python's compact one-line if/else.",
            },
            {
              id: "q-1-3-3",
              question:
                "Which operator checks if two values are NOT equal in Python?",
              options: ["<>", "!=", "=/=", "not =="],
              correctIndex: 1,
              explanation:
                "In Python, `!=` is the not-equal operator. The old `<>` syntax was removed in Python 3. While `not (a == b)` works, `!=` is the idiomatic form.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-1-4",
          moduleId: "mod-1",
          title: "Loops & Iteration",
          order: 4,
          description:
            "Learn for loops, while loops, and loop control statements.",
          difficulty: "Beginner",
          durationMinutes: 25,
          content: `# Loops & Iteration

Loops let you repeat code efficiently instead of writing the same statement over and over.

## For Loops

\`\`\`python
# Iterate over a range
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Iterate over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# With enumerate (index + value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
\`\`\`

## While Loops

\`\`\`python
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# User input loop
while True:
    answer = input("Type 'quit' to exit: ")
    if answer == "quit":
        break
    print(f"You said: {answer}")
\`\`\`

## Loop Control

\`\`\`python
# break — exit the loop entirely
for num in range(10):
    if num == 5:
        break
    print(num)  # 0, 1, 2, 3, 4

# continue — skip this iteration
for num in range(10):
    if num % 2 == 0:
        continue
    print(num)  # 1, 3, 5, 7, 9

# else clause (runs if loop completes normally)
for num in range(5):
    print(num)
else:
    print("Loop finished!")
\`\`\``,
          quiz: [
            {
              id: "q-1-4-1",
              question: "What does `range(5)` produce?",
              options: [
                "[1, 2, 3, 4, 5]",
                "[0, 1, 2, 3, 4]",
                "[0, 1, 2, 3, 4, 5]",
                "[1, 2, 3, 4]",
              ],
              correctIndex: 1,
              explanation:
                "`range(5)` generates numbers starting from 0 up to (but not including) 5: 0, 1, 2, 3, 4. To start at 1, use `range(1, 6)`. To include 5, use `range(6)`.",
            },
            {
              id: "q-1-4-2",
              question: "What does the `break` statement do inside a loop?",
              options: [
                "Skips the current iteration and moves to the next",
                "Pauses the loop for one second",
                "Exits the loop entirely",
                "Restarts the loop from the beginning",
              ],
              correctIndex: 2,
              explanation:
                "`break` immediately terminates the loop and execution continues after the loop block. Use `continue` to skip only the current iteration without ending the loop.",
            },
            {
              id: "q-1-4-3",
              question:
                "Which built-in function gives you both the index and value when iterating a list?",
              options: ["zip()", "index()", "enumerate()", "map()"],
              correctIndex: 2,
              explanation:
                "`enumerate(iterable)` returns pairs of `(index, value)` so you can track position without a separate counter. Example: `for i, v in enumerate(['a', 'b', 'c'])` gives `(0, 'a'), (1, 'b'), (2, 'c')`.",
            },
          ],
        },
        completed: false,
      },
    ],
  },
  {
    module_: {
      id: "mod-2",
      title: "Data Structures",
      description: "Lists, tuples, dicts, sets, and comprehensions",
      order: 2,
    },
    completedCount: 0,
    totalCount: 4,
    lessons: [
      {
        lesson: {
          id: "lesson-2-1",
          moduleId: "mod-2",
          title: "Lists & Tuples",
          order: 1,
          description:
            "Master Python's sequence types — mutable lists and immutable tuples.",
          difficulty: "Beginner",
          durationMinutes: 25,
          content: `# Lists & Tuples

Lists and tuples are Python's primary sequence data structures for ordered collections.

## Lists

Lists are **mutable** — you can change them after creation.

\`\`\`python
# Creating lists
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]
nested = [[1, 2], [3, 4], [5, 6]]

# Accessing elements
print(numbers[0])    # 1  (first)
print(numbers[-1])   # 5  (last)
print(numbers[1:3])  # [2, 3] (slice)

# Modifying lists
numbers.append(6)          # Add to end
numbers.insert(0, 0)       # Insert at index
numbers.remove(3)          # Remove by value
popped = numbers.pop()     # Remove and return last
numbers.sort()             # Sort in-place
numbers.reverse()          # Reverse in-place

print(len(numbers))        # Length
\`\`\`

## Tuples

Tuples are **immutable** — fixed once created.

\`\`\`python
# Creating tuples
point = (3, 7)
rgb = (255, 128, 0)
single = (42,)  # Note the trailing comma!

# Unpacking
x, y = point
print(f"x={x}, y={y}")  # x=3, y=7

r, g, b = rgb
print(f"Red: {r}, Green: {g}, Blue: {b}")

# Tuples as dict keys (lists cannot be keys)
locations = {(40.7, -74.0): "New York", (51.5, -0.1): "London"}
\`\`\``,
          quiz: [
            {
              id: "q-2-1-1",
              question:
                "What is the key difference between a list and a tuple in Python?",
              options: [
                "Lists are ordered; tuples are unordered",
                "Lists are mutable; tuples are immutable",
                "Tuples can hold more items than lists",
                "Lists use () and tuples use []",
              ],
              correctIndex: 1,
              explanation:
                "Lists are mutable — you can add, remove, or change elements after creation. Tuples are immutable — once created, they cannot be changed. Lists use `[]` and tuples use `()`.",
            },
            {
              id: "q-2-1-2",
              question:
                "What does `numbers[-1]` return if `numbers = [10, 20, 30, 40, 50]`?",
              options: ["10", "50", "-1", "IndexError"],
              correctIndex: 1,
              explanation:
                "Negative indices count from the end. `-1` is the last element, `-2` is second-to-last, etc. So `numbers[-1]` returns `50`.",
            },
            {
              id: "q-2-1-3",
              question:
                "Why must a single-element tuple be written as `(42,)` instead of `(42)`?",
              options: [
                "Python requires a comma after all tuple elements",
                "Without the comma, Python treats it as a parenthesised integer, not a tuple",
                "The trailing comma prevents type errors",
                "It's just a style convention, both work the same",
              ],
              correctIndex: 1,
              explanation:
                "`(42)` is just the integer `42` in parentheses for grouping. The trailing comma `(42,)` tells Python this is a single-element tuple. Always add the comma for single-element tuples.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-2-2",
          moduleId: "mod-2",
          title: "Dictionaries & Sets",
          order: 2,
          description:
            "Work with key-value stores and unique element collections.",
          difficulty: "Intermediate",
          durationMinutes: 25,
          content: `# Dictionaries & Sets

## Dictionaries

Dictionaries store **key-value pairs** for fast lookups.

\`\`\`python
# Creating dicts
person = {
    "name": "Alice",
    "age": 30,
    "city": "Berlin"
}

# Accessing values
print(person["name"])              # Alice
print(person.get("email", "N/A"))  # N/A (safe default)

# Modifying
person["email"] = "alice@example.com"  # Add/update
del person["city"]                      # Delete
person.update({"age": 31, "role": "dev"})

# Iterating
for key, value in person.items():
    print(f"{key}: {value}")

for key in person.keys():
    print(key)

for value in person.values():
    print(value)
\`\`\`

## Sets

Sets store **unique** elements with no guaranteed order.

\`\`\`python
# Creating sets
fruits = {"apple", "banana", "cherry"}
numbers = set([1, 2, 2, 3, 3, 4])  # {1, 2, 3, 4}

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # Union:        {1,2,3,4,5,6}
print(a & b)   # Intersection: {3,4}
print(a - b)   # Difference:   {1,2}
print(a ^ b)   # Symmetric:    {1,2,5,6}

# Membership test (O(1) — very fast!)
print("apple" in fruits)  # True
\`\`\``,
          quiz: [
            {
              id: "q-2-2-1",
              question:
                "What is the difference between `dict['key']` and `dict.get('key', default)`?",
              options: [
                "They are identical in behaviour",
                "`dict['key']` raises KeyError if missing; `.get()` returns a default value",
                "`.get()` raises KeyError; `dict['key']` returns None",
                "`dict['key']` only works for string keys",
              ],
              correctIndex: 1,
              explanation:
                "`dict['key']` raises a `KeyError` if the key doesn't exist, which can crash your program. `dict.get('key', default)` safely returns the default value (or `None`) if the key is missing.",
            },
            {
              id: "q-2-2-2",
              question:
                "Given `a = {1, 2, 3}` and `b = {2, 3, 4}`, what is `a & b`?",
              options: [
                "{1, 2, 3, 4}",
                "{2, 3}",
                "{1, 4}",
                "{1, 2, 3, 2, 3, 4}",
              ],
              correctIndex: 1,
              explanation:
                "`&` is the intersection operator — it returns elements present in BOTH sets. Both `a` and `b` contain `2` and `3`, so `a & b` is `{2, 3}`. Use `|` for union, `-` for difference.",
            },
            {
              id: "q-2-2-3",
              question:
                "Why is `'apple' in my_set` faster than `'apple' in my_list`?",
              options: [
                "Sets are always smaller than lists",
                "Sets use hash tables for O(1) average-time lookup; list search is O(n)",
                "Python caches set lookups but not list lookups",
                "Lists have to sort themselves before searching",
              ],
              correctIndex: 1,
              explanation:
                "Sets are implemented as hash tables, so membership testing is O(1) on average regardless of size. Lists must scan each element sequentially — O(n). For frequent membership checks, always prefer a set.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-2-3",
          moduleId: "mod-2",
          title: "List Comprehensions",
          order: 3,
          description:
            "Write elegant, Pythonic one-liners with comprehensions.",
          difficulty: "Intermediate",
          durationMinutes: 20,
          content: `# List Comprehensions

Comprehensions are a concise, Pythonic way to create collections in a single expression.

## List Comprehensions

\`\`\`python
# Traditional way
squares = []
for n in range(10):
    squares.append(n ** 2)

# Comprehension — cleaner and faster
squares = [n ** 2 for n in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With condition (filter)
even_squares = [n ** 2 for n in range(10) if n % 2 == 0]
# [0, 4, 16, 36, 64]

# Nested comprehension
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]
# [[1,2,3],[2,4,6],[3,6,9]]
\`\`\`

## Dict Comprehensions

\`\`\`python
words = ["python", "code", "learn"]
word_lengths = {word: len(word) for word in words}
# {"python": 6, "code": 4, "learn": 5}

# Invert a dict
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
# {1: "a", 2: "b", 3: "c"}
\`\`\`

## Generator Expressions

\`\`\`python
# Memory-efficient alternative (lazy evaluation)
total = sum(n ** 2 for n in range(1_000_000))

# vs list comprehension (creates full list in memory)
total = sum([n ** 2 for n in range(1_000_000)])
\`\`\``,
          quiz: [
            {
              id: "q-2-3-1",
              question: "What does `[n ** 2 for n in range(5)]` produce?",
              options: [
                "[1, 4, 9, 16, 25]",
                "[0, 1, 4, 9, 16]",
                "[0, 2, 4, 6, 8]",
                "[1, 2, 3, 4, 5]",
              ],
              correctIndex: 1,
              explanation:
                "`range(5)` yields 0, 1, 2, 3, 4. Squaring each: 0²=0, 1²=1, 2²=4, 3²=9, 4²=16. Result: `[0, 1, 4, 9, 16]`. Remember `range(5)` starts at 0, not 1.",
            },
            {
              id: "q-2-3-2",
              question:
                "Which comprehension creates `{'python': 6, 'code': 4}` from `['python', 'code']`?",
              options: [
                "[word: len(word) for word in words]",
                "{word: len(word) for word in words}",
                "(word: len(word) for word in words)",
                "{for word in words: len(word)}",
              ],
              correctIndex: 1,
              explanation:
                "Dict comprehensions use `{key: value for item in iterable}` syntax. The curly braces `{}` with a colon `:` create a dict. Square brackets `[]` create a list, and parentheses `()` create a generator.",
            },
            {
              id: "q-2-3-3",
              question:
                "What is the advantage of `sum(n**2 for n in range(1_000_000))` over `sum([n**2 for n in range(1_000_000)])`?",
              options: [
                "The generator version is syntactically cleaner",
                "The generator is faster because it uses a C extension",
                "The generator evaluates lazily — it never builds the full list in memory",
                "There is no difference; Python optimises both the same way",
              ],
              correctIndex: 2,
              explanation:
                "Generator expressions are lazy — they yield values one at a time without storing the entire sequence in memory. The list comprehension version first builds a million-element list in RAM, then sums it. The generator streams values directly into `sum()`.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-2-4",
          moduleId: "mod-2",
          title: "Functions & Scope",
          order: 4,
          description:
            "Define reusable functions, understand scope and closures.",
          difficulty: "Intermediate",
          durationMinutes: 30,
          content: `# Functions & Scope

Functions are the primary way to organize and reuse code in Python.

## Defining Functions

\`\`\`python
def greet(name):
    """Return a greeting string for the given name."""
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

## Parameters & Default Values

\`\`\`python
def create_user(name, role="user", active=True):
    return {"name": name, "role": role, "active": active}

user1 = create_user("Alice")                    # Uses defaults
user2 = create_user("Bob", role="admin")        # Override one default
user3 = create_user("Charlie", active=False)    # Keyword argument

# *args — variable positional arguments
def sum_all(*numbers):
    return sum(numbers)

print(sum_all(1, 2, 3, 4, 5))  # 15

# **kwargs — variable keyword arguments
def build_config(**settings):
    for key, value in settings.items():
        print(f"{key} = {value}")

build_config(debug=True, version="2.0", theme="dark")
\`\`\`

## Scope: LEGB Rule

\`\`\`python
x = "global"  # Global scope

def outer():
    x = "enclosing"  # Enclosing scope
    
    def inner():
        x = "local"  # Local scope
        print(x)     # "local"
    
    inner()
    print(x)          # "enclosing"

outer()
print(x)              # "global"
\`\`\``,
          quiz: [
            {
              id: "q-2-4-1",
              question: "What does `*args` allow in a function definition?",
              options: [
                "Passing keyword arguments by name",
                "Accepting any number of positional arguments as a tuple",
                "Defining optional arguments with defaults",
                "Accepting only string arguments",
              ],
              correctIndex: 1,
              explanation:
                "`*args` collects any number of extra positional arguments into a tuple. `def f(*args)` lets you call `f(1, 2, 3)` and inside `f`, `args` will be `(1, 2, 3)`. Use `**kwargs` for variable keyword arguments.",
            },
            {
              id: "q-2-4-2",
              question: "In Python's LEGB rule, what does 'E' stand for?",
              options: ["External", "Enclosing", "Exported", "Exception"],
              correctIndex: 1,
              explanation:
                "LEGB stands for Local → Enclosing → Global → Built-in. Python looks up names in this order. 'Enclosing' refers to scopes of outer (but not global) functions — relevant when using closures and nested functions.",
            },
            {
              id: "q-2-4-3",
              question:
                "What happens if you call `create_user('Alice')` given `def create_user(name, role='user', active=True)`?",
              options: [
                "TypeError: missing required argument 'role'",
                "Returns `{'name': 'Alice', 'role': 'user', 'active': True}`",
                "Returns `{'name': 'Alice'}`",
                "Returns `{'name': 'Alice', 'role': None, 'active': None}`",
              ],
              correctIndex: 1,
              explanation:
                "Default parameter values are used when the caller doesn't provide them. Since `role` defaults to `'user'` and `active` defaults to `True`, calling `create_user('Alice')` returns the full dict with those defaults.",
            },
          ],
        },
        completed: false,
      },
    ],
  },
  {
    module_: {
      id: "mod-3",
      title: "Object-Oriented Programming",
      description: "Classes, inheritance, polymorphism, and magic methods",
      order: 3,
    },
    completedCount: 0,
    totalCount: 4,
    lessons: [
      {
        lesson: {
          id: "lesson-3-1",
          moduleId: "mod-3",
          title: "Classes & Objects",
          order: 1,
          description:
            "Define classes, create instances, and work with attributes and methods.",
          difficulty: "Intermediate",
          durationMinutes: 30,
          content: `# Classes & Objects

Object-Oriented Programming (OOP) lets you model real-world concepts as code.

## Defining a Class

\`\`\`python
class BankAccount:
    """A simple bank account class."""
    
    bank_name = "Codex Bank"  # Class attribute (shared)
    
    def __init__(self, owner: str, balance: float = 0.0):
        # Instance attributes (unique per object)
        self.owner = owner
        self.balance = balance
        self._transactions: list = []  # "private" by convention
    
    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount
        self._transactions.append(("deposit", amount))
    
    def withdraw(self, amount: float) -> None:
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        self._transactions.append(("withdraw", amount))
    
    def get_statement(self) -> str:
        lines = [f"Account: {self.owner}"]
        for tx_type, amount in self._transactions:
            lines.append(f"  {tx_type:>10}: £{amount:.2f}")
        lines.append(f"  {'Balance':>10}: £{self.balance:.2f}")
        return "\\n".join(lines)

# Create instances
alice = BankAccount("Alice", 1000.0)
bob = BankAccount("Bob")

alice.deposit(500)
alice.withdraw(200)
print(alice.get_statement())
print(f"Bank: {BankAccount.bank_name}")
\`\`\``,
          quiz: [
            {
              id: "q-3-1-1",
              question: "What is the purpose of `__init__` in a Python class?",
              options: [
                "It is called when the class is deleted",
                "It initialises a new instance's attributes when the object is created",
                "It defines class-level (shared) attributes only",
                "It is optional and only needed for inheritance",
              ],
              correctIndex: 1,
              explanation:
                "`__init__` is the constructor — Python calls it automatically when you create a new instance. It sets up instance attributes unique to that object. Without it, your instances would have no initial state.",
            },
            {
              id: "q-3-1-2",
              question:
                "What is the difference between a class attribute and an instance attribute?",
              options: [
                "Class attributes are defined inside methods; instance attributes outside",
                "Class attributes are shared across all instances; instance attributes are unique per object",
                "Instance attributes cannot be changed after creation",
                "Class attributes are always private; instance attributes are always public",
              ],
              correctIndex: 1,
              explanation:
                "Class attributes like `bank_name` are shared by all instances of the class. Instance attributes like `self.owner` are set in `__init__` and belong to a specific object. Changing a class attribute affects all instances; changing an instance attribute only affects that one object.",
            },
            {
              id: "q-3-1-3",
              question:
                "What does the leading underscore in `self._transactions` signal in Python?",
              options: [
                "The attribute is deleted after the method runs",
                "It is a syntax error — underscores are forbidden in attribute names",
                "It is a convention indicating the attribute is intended to be private/internal",
                "The attribute is read-only and cannot be modified",
              ],
              correctIndex: 2,
              explanation:
                "A single leading underscore is a Python convention (not enforcement) meaning 'treat this as private — don't access it from outside the class'. Python does not enforce true privacy, so external code can still access it, but should not.",
            },
            {
              id: "q-3-1-4",
              question:
                "Given `alice = BankAccount('Alice', 1000.0)`, what does `BankAccount.bank_name` refer to?",
              options: [
                "Alice's personal bank name stored on her instance",
                "A class-level attribute shared by all BankAccount instances",
                "A function that returns the bank name",
                "This would raise an AttributeError",
              ],
              correctIndex: 1,
              explanation:
                "`bank_name` is defined directly on the class (not inside `__init__`), making it a class attribute. It's accessed via `BankAccount.bank_name` or any instance. All instances share the same value unless overridden on a specific instance.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-3-2",
          moduleId: "mod-3",
          title: "Inheritance",
          order: 2,
          description:
            "Extend classes through inheritance and method overriding.",
          difficulty: "Intermediate",
          durationMinutes: 30,
          content: `# Inheritance

Inheritance lets you build new classes based on existing ones, reusing and extending behavior.

## Basic Inheritance

\`\`\`python
class Animal:
    def __init__(self, name: str, sound: str):
        self.name = name
        self.sound = sound
    
    def speak(self) -> str:
        return f"{self.name} says {self.sound}!"
    
    def __repr__(self) -> str:
        return f"Animal({self.name!r})"

class Dog(Animal):
    def __init__(self, name: str, breed: str):
        super().__init__(name, "Woof")  # Call parent __init__
        self.breed = breed
    
    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"
    
    # Override parent method
    def speak(self) -> str:
        return f"{self.name} barks: WOOF WOOF!"

rex = Dog("Rex", "German Shepherd")
print(rex.speak())        # Rex barks: WOOF WOOF!
print(rex.fetch("ball"))  # Rex fetches the ball!
print(isinstance(rex, Dog))     # True
print(isinstance(rex, Animal))  # True (is also an Animal)
\`\`\`

## Multiple Inheritance & MRO

\`\`\`python
class Flyable:
    def fly(self) -> str:
        return f"{self.name} is flying!"

class Swimmable:
    def swim(self) -> str:
        return f"{self.name} is swimming!"

class Duck(Animal, Flyable, Swimmable):
    def __init__(self, name: str):
        super().__init__(name, "Quack")

donald = Duck("Donald")
print(donald.speak())  # Donald says Quack!
print(donald.fly())    # Donald is flying!
print(donald.swim())   # Donald is swimming!

# MRO — Python resolves method lookup left to right
print(Duck.__mro__)
\`\`\``,
          quiz: [
            {
              id: "q-3-2-1",
              question:
                "What does `super().__init__(name, 'Woof')` do inside `Dog.__init__`?",
              options: [
                "Creates a second Dog instance with those arguments",
                "Calls Animal's __init__ to set up the inherited attributes",
                "Overrides the parent class entirely",
                "Raises a TypeError because super() can't take arguments",
              ],
              correctIndex: 1,
              explanation:
                "`super()` gives you a proxy to the parent class. Calling `super().__init__(...)` runs the parent's constructor, ensuring inherited attributes like `self.name` and `self.sound` are properly set up before adding Dog-specific ones.",
            },
            {
              id: "q-3-2-2",
              question:
                "What is `isinstance(rex, Animal)` if `rex` is a `Dog` instance and `Dog` inherits from `Animal`?",
              options: [
                "False — rex is a Dog, not an Animal",
                "True — rex is an instance of Dog AND Animal",
                "TypeError — isinstance doesn't work with inheritance",
                "It depends on whether rex overrides any Animal methods",
              ],
              correctIndex: 1,
              explanation:
                "`isinstance` checks the entire inheritance chain. Since `Dog` inherits from `Animal`, every `Dog` instance is also an `Animal`. This is the Liskov Substitution Principle — a subclass can always stand in for its parent.",
            },
            {
              id: "q-3-2-3",
              question:
                "When `rex.speak()` is called, which `speak` method runs — Animal's or Dog's?",
              options: [
                "Animal's, because Animal defines it first",
                "Both, because Python calls all parent methods automatically",
                "Dog's, because Python uses the most derived (child) class first",
                "Neither — you must call the method explicitly on the class",
              ],
              correctIndex: 2,
              explanation:
                "Python uses Method Resolution Order (MRO): it looks up the method starting from the most specific (child) class. Since `Dog` defines its own `speak`, that version runs. This is called method overriding.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-3-3",
          moduleId: "mod-3",
          title: "Magic Methods",
          order: 3,
          description:
            "Implement dunder methods to customize Python's built-in behaviors.",
          difficulty: "Advanced",
          durationMinutes: 35,
          content: `# Magic Methods (Dunder Methods)

Magic methods (surrounded by double underscores) let your classes work with Python's built-in syntax and functions.

## Essential Magic Methods

\`\`\`python
class Vector:
    """2D mathematical vector."""
    
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    
    # String representation
    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"
    
    def __str__(self) -> str:
        return f"({self.x}, {self.y})"
    
    # Arithmetic operators
    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)
    
    def __sub__(self, other: "Vector") -> "Vector":
        return Vector(self.x - other.x, self.y - other.y)
    
    def __mul__(self, scalar: float) -> "Vector":
        return Vector(self.x * scalar, self.y * scalar)
    
    # Comparison
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y
    
    # Length / magnitude
    def __abs__(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5
    
    # Boolean value
    def __bool__(self) -> bool:
        return self.x != 0 or self.y != 0

v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1 + v2)    # (4, 6)
print(v1 - v2)    # (2, 2)
print(v1 * 2)     # (6, 8)
print(abs(v1))    # 5.0
print(bool(v1))   # True
\`\`\``,
          quiz: [
            {
              id: "q-3-3-1",
              question:
                "What is the difference between `__str__` and `__repr__`?",
              options: [
                "They are identical — Python uses them interchangeably",
                "`__repr__` is for developers (unambiguous); `__str__` is for end-users (readable)",
                "`__str__` is called by `repr()`; `__repr__` is called by `str()`",
                "`__repr__` only works in the REPL; `__str__` only works in print()",
              ],
              correctIndex: 1,
              explanation:
                "`__repr__` should return an unambiguous string useful for debugging, ideally one you could paste back into Python. `__str__` is for human-readable display. `print()` uses `__str__`; the REPL and `repr()` use `__repr__`.",
            },
            {
              id: "q-3-3-2",
              question:
                "What Python operation does `__add__` enable for your class?",
              options: [
                "The `+` operator between two instances",
                "Adding new methods to the class at runtime",
                "The `+=` augmented assignment only",
                "String concatenation via `str(obj)`",
              ],
              correctIndex: 0,
              explanation:
                "When you define `__add__(self, other)`, Python calls it when you write `v1 + v2`. This is operator overloading — you teach Python what `+` means for your custom type. Similarly, `__sub__` handles `-`, `__mul__` handles `*`, etc.",
            },
            {
              id: "q-3-3-3",
              question: "Given `v1 = Vector(3, 4)`, what does `abs(v1)` call?",
              options: [
                "__abs__ on v1, returning the vector's magnitude",
                "__len__ on v1",
                "The built-in abs() ignores custom classes",
                "__float__ on v1",
              ],
              correctIndex: 0,
              explanation:
                "Python's `abs()` function calls `__abs__` on the object. For a 2D vector, the natural magnitude is `sqrt(x²+y²)`. With `v1 = Vector(3,4)`, `abs(v1)` calls `v1.__abs__()` which returns `5.0` (the classic 3-4-5 right triangle).",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-3-4",
          moduleId: "mod-3",
          title: "Decorators & Properties",
          order: 4,
          description:
            "Use @property, @staticmethod, @classmethod, and custom decorators.",
          difficulty: "Advanced",
          durationMinutes: 35,
          content: `# Decorators & Properties

Decorators modify the behavior of functions or classes. Properties let you add logic to attribute access.

## @property

\`\`\`python
class Temperature:
    def __init__(self, celsius: float = 0):
        self._celsius = celsius
    
    @property
    def celsius(self) -> float:
        return self._celsius
    
    @celsius.setter
    def celsius(self, value: float) -> None:
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value
    
    @property
    def fahrenheit(self) -> float:
        return self._celsius * 9/5 + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value: float) -> None:
        self.celsius = (value - 32) * 5/9

t = Temperature(100)
print(t.fahrenheit)  # 212.0
t.fahrenheit = 32
print(t.celsius)     # 0.0
\`\`\`

## Custom Decorators

\`\`\`python
import time
from functools import wraps

def timer(func):
    """Measure execution time of a function."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

def retry(max_attempts: int = 3):
    """Retry a function on exception."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"Attempt {attempt+1} failed: {e}")
        return wrapper
    return decorator

@timer
@retry(max_attempts=3)
def fetch_data(url: str) -> dict:
    # simulated network call
    return {"status": "ok"}
\`\`\``,
          quiz: [
            {
              id: "q-3-4-1",
              question: "What is the primary purpose of `@property` in Python?",
              options: [
                "To make an attribute read-only permanently",
                "To add validation or computed logic to attribute access without changing the public API",
                "To share an attribute across all instances",
                "To prevent subclasses from overriding the attribute",
              ],
              correctIndex: 1,
              explanation:
                "`@property` lets you expose what looks like a simple attribute (`t.celsius`) while running code behind the scenes — validation, computation, or transformation. This means you can start with a plain attribute and later add logic without breaking callers.",
            },
            {
              id: "q-3-4-2",
              question:
                "What does `@wraps(func)` do inside a decorator's wrapper function?",
              options: [
                "It calls `func` automatically so you don't have to",
                "It copies the original function's name, docstring, and metadata to the wrapper",
                "It prevents the wrapper from being called more than once",
                "It makes the decorator work with both sync and async functions",
              ],
              correctIndex: 1,
              explanation:
                "Without `@wraps(func)`, the decorated function loses its `__name__`, `__doc__`, and other metadata — they'd show the wrapper's info instead. `functools.wraps` copies that metadata, so tools like `help()` and logging still show the correct function name.",
            },
            {
              id: "q-3-4-3",
              question:
                "What does applying multiple decorators `@timer` then `@retry(max_attempts=3)` mean for `fetch_data`?",
              options: [
                "Only the outermost decorator (@timer) actually runs",
                "fetch_data is wrapped by retry first, then the result is wrapped by timer",
                "The decorators cancel each other out",
                "Python raises a SyntaxError for stacked decorators",
              ],
              correctIndex: 1,
              explanation:
                "Decorators apply bottom-up. `@retry(max_attempts=3)` wraps `fetch_data` first, then `@timer` wraps that result. So the call chain is: `timer_wrapper → retry_wrapper → fetch_data`. The timer measures the total time including any retries.",
            },
            {
              id: "q-3-4-4",
              question:
                "When does the `@celsius.setter` decorator allow you to do `t.celsius = 25`?",
              options: [
                "Always — all properties automatically get setters",
                "Only after you define a setter with `@celsius.setter` on top of an existing `@property`",
                "Only if celsius is a class attribute, not an instance attribute",
                "Never — properties are always read-only",
              ],
              correctIndex: 1,
              explanation:
                "A `@property` alone creates a read-only attribute. To allow assignment, you must define a setter using `@<property_name>.setter`. The setter lets you validate the incoming value before storing it.",
            },
          ],
        },
        completed: false,
      },
    ],
  },
  {
    module_: {
      id: "mod-4",
      title: "Advanced Python",
      description: "Generators, async, type hints, testing, and best practices",
      order: 4,
    },
    completedCount: 0,
    totalCount: 4,
    lessons: [
      {
        lesson: {
          id: "lesson-4-1",
          moduleId: "mod-4",
          title: "Generators & Iterators",
          order: 1,
          description:
            "Build memory-efficient data pipelines with generators and iterators.",
          difficulty: "Advanced",
          durationMinutes: 35,
          content: `# Generators & Iterators

Generators let you create sequences lazily — producing values one at a time without storing the entire collection.

## The Iterator Protocol

\`\`\`python
class CountUp:
    """Custom iterator that counts from start to stop."""
    
    def __init__(self, start: int, stop: int):
        self.current = start
        self.stop = stop
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

for n in CountUp(1, 6):
    print(n)  # 1, 2, 3, 4, 5
\`\`\`

## Generator Functions

\`\`\`python
def fibonacci():
    """Infinite Fibonacci sequence generator."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
first_10 = [next(fib) for _ in range(10)]
print(first_10)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Reading a huge file without loading it all
def read_in_chunks(filepath: str, chunk_size: int = 1024):
    with open(filepath, "rb") as f:
        while chunk := f.read(chunk_size):
            yield chunk
\`\`\`

## Generator Pipelines

\`\`\`python
def integers(start=0):
    n = start
    while True:
        yield n
        n += 1

def take(n, iterable):
    for _ in range(n):
        yield next(iter(iterable))

# Pipeline: generate -> filter -> transform -> take
result = list(
    take(5,
        (x**2 for x in integers(1) if x % 2 == 1)
    )
)
print(result)  # [1, 9, 25, 49, 81]
\`\`\``,
          quiz: [
            {
              id: "q-4-1-1",
              question:
                "What keyword turns a regular function into a generator function?",
              options: ["return", "async", "yield", "iter"],
              correctIndex: 2,
              explanation:
                "Any function that contains a `yield` statement becomes a generator function. Calling it returns a generator object instead of executing the body. The body runs only when you call `next()` on the generator, pausing at each `yield`.",
            },
            {
              id: "q-4-1-2",
              question:
                "What exception does an iterator raise to signal that it has no more values?",
              options: [
                "IndexError",
                "StopIteration",
                "GeneratorExit",
                "ValueError",
              ],
              correctIndex: 1,
              explanation:
                "`StopIteration` is raised by `__next__` when there are no more items. A `for` loop automatically catches this exception and exits cleanly. You can also raise it explicitly in a custom `__next__` method, as shown in `CountUp`.",
            },
            {
              id: "q-4-1-3",
              question:
                "Why is `sum(n**2 for n in integers(1) if n % 2 == 1)` more memory-efficient than building a list first?",
              options: [
                "Generator expressions use a C extension for speed",
                "Generators produce one value at a time without storing the full sequence",
                "The filter condition skips elements so fewer items are processed",
                "Python caches generator results to avoid recomputation",
              ],
              correctIndex: 1,
              explanation:
                "A generator computes and yields values on demand (lazily). Only one value exists in memory at a time. A list comprehension materialises every value into a list before processing. For large or infinite sequences, generators are far more memory-efficient.",
            },
            {
              id: "q-4-1-4",
              question:
                "The `fibonacci()` generator in the lesson is an infinite sequence. How do you safely take only the first 10 values?",
              options: [
                "Call `fib.stop(10)`",
                "Use `[next(fib) for _ in range(10)]` or `itertools.islice(fib, 10)`",
                "Set a limit inside the generator with `max_count=10`",
                "Infinite generators will raise OverflowError after 10 items",
              ],
              correctIndex: 1,
              explanation:
                "You control how many items you consume from an infinite generator. `[next(fib) for _ in range(10)]` calls `next()` exactly 10 times. `itertools.islice(fib, 10)` is another idiomatic way. Never iterate an infinite generator with a plain `for` loop without a break condition.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-4-2",
          moduleId: "mod-4",
          title: "Async Programming",
          order: 2,
          description:
            "Write concurrent I/O-bound code with asyncio, async/await.",
          difficulty: "Advanced",
          durationMinutes: 40,
          content: `# Async Programming with asyncio

Asynchronous programming lets you handle many I/O-bound tasks concurrently without threads.

## Core Concepts

\`\`\`python
import asyncio
import time

async def fetch_user(user_id: int) -> dict:
    """Simulate an async API call."""
    await asyncio.sleep(0.5)  # Non-blocking sleep
    return {"id": user_id, "name": f"User {user_id}"}

async def main():
    # Sequential — slow (1.5s total)
    u1 = await fetch_user(1)
    u2 = await fetch_user(2)
    u3 = await fetch_user(3)
    
    # Concurrent — fast (0.5s total!)
    users = await asyncio.gather(
        fetch_user(1),
        fetch_user(2),
        fetch_user(3),
    )
    return users

asyncio.run(main())
\`\`\`

## Async Context Managers

\`\`\`python
import aiofiles
import aiohttp

async def download_file(url: str, dest: str) -> None:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            content = await response.read()
    
    async with aiofiles.open(dest, "wb") as f:
        await f.write(content)
\`\`\`

## Async Generators

\`\`\`python
async def stream_data(count: int):
    for i in range(count):
        await asyncio.sleep(0.1)
        yield {"item": i, "value": i ** 2}

async def process():
    async for chunk in stream_data(5):
        print(chunk)

asyncio.run(process())
\`\`\``,
          quiz: [
            {
              id: "q-4-2-1",
              question:
                "What does `await asyncio.sleep(0.5)` do differently from `time.sleep(0.5)`?",
              options: [
                "They are identical — both block the current thread for 0.5 seconds",
                "`await asyncio.sleep` suspends the coroutine non-blockingly, letting other tasks run",
                "`await asyncio.sleep` is 10× faster than `time.sleep`",
                "`time.sleep` raises an error inside async functions",
              ],
              correctIndex: 1,
              explanation:
                "`time.sleep` blocks the entire thread — nothing else can run. `await asyncio.sleep` suspends only the current coroutine and yields control back to the event loop, which can run other coroutines in the meantime. This is the key to async concurrency.",
            },
            {
              id: "q-4-2-2",
              question:
                "What is the benefit of `asyncio.gather(fetch_user(1), fetch_user(2), fetch_user(3))` over awaiting each call sequentially?",
              options: [
                "gather() runs the calls on multiple CPU cores in parallel",
                "gather() runs all coroutines concurrently — total time equals the slowest, not the sum",
                "gather() caches results so the second call is instant",
                "There is no benefit — gather() is just syntactic sugar",
              ],
              correctIndex: 1,
              explanation:
                "Sequential awaits take 0.5 + 0.5 + 0.5 = 1.5 seconds. `gather()` starts all three concurrently and waits for all to finish — total time ≈ 0.5 seconds. This is the main power of async: I/O-bound tasks run simultaneously.",
            },
            {
              id: "q-4-2-3",
              question:
                "What does the `async for` syntax in `async for chunk in stream_data(5)` require from `stream_data`?",
              options: [
                "stream_data must return a regular list",
                "stream_data must be an async generator (uses `async def` + `yield`)",
                "stream_data must implement `__iter__` and `__next__`",
                "stream_data must use `asyncio.Queue` internally",
              ],
              correctIndex: 1,
              explanation:
                "`async for` works with async iterables — objects that implement `__aiter__` and `__anext__`. An `async def` function containing `yield` is an async generator, which automatically satisfies this protocol. Regular generators and lists use synchronous `for`.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-4-3",
          moduleId: "mod-4",
          title: "Type Hints & mypy",
          order: 3,
          description:
            "Add static types to Python for better tooling and fewer bugs.",
          difficulty: "Advanced",
          durationMinutes: 30,
          content: `# Type Hints & Static Analysis

Type hints make Python code self-documenting and enable static analysis tools like mypy to catch bugs before runtime.

## Basic Type Annotations

\`\`\`python
from typing import Optional, Union, List, Dict, Tuple, Any

# Variable annotations
name: str = "Alice"
count: int = 0
ratio: float = 0.75
active: bool = True

# Function annotations
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str, times: int = 1) -> None:
    for _ in range(times):
        print(f"Hello, {name}!")
\`\`\`

## Generic Types

\`\`\`python
from typing import TypeVar, Generic, Sequence

T = TypeVar("T")

def first(items: Sequence[T]) -> Optional[T]:
    return items[0] if items else None

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()
    
    def peek(self) -> Optional[T]:
        return self._items[-1] if self._items else None

stack: Stack[int] = Stack()
stack.push(1)
stack.push(2)
print(stack.pop())  # 2
\`\`\`

## TypedDict & Dataclasses

\`\`\`python
from typing import TypedDict
from dataclasses import dataclass, field

class UserDict(TypedDict):
    id: int
    name: str
    email: str

@dataclass
class Product:
    name: str
    price: float
    tags: List[str] = field(default_factory=list)
    
    def discount(self, pct: float) -> "Product":
        return Product(self.name, self.price * (1 - pct), self.tags)
\`\`\``,
          quiz: [
            {
              id: "q-4-3-1",
              question: "What is the main purpose of type hints in Python?",
              options: [
                "They enforce types at runtime and raise TypeError automatically",
                "They document expected types and enable static analysis tools to catch bugs before running",
                "They make code run faster because Python can skip type checks",
                "They are required for all functions — Python raises SyntaxError without them",
              ],
              correctIndex: 1,
              explanation:
                "Python type hints are optional annotations. By default, Python doesn't enforce them at runtime. Their value is for static analysis tools (mypy, Pyright) that check your code without running it, and for IDEs that provide autocompletion and error highlighting.",
            },
            {
              id: "q-4-3-2",
              question: "What does `Optional[str]` mean as a type hint?",
              options: [
                "The argument can be skipped when calling the function",
                "The value can be either `str` or `None`",
                "The value is optional and defaults to an empty string",
                "The function will return str if successful, or raise an exception",
              ],
              correctIndex: 1,
              explanation:
                "`Optional[X]` is shorthand for `Union[X, None]` — the value can be of type `X` or `None`. It's used for values that may or may not exist. In Python 3.10+, you can write `str | None` instead.",
            },
            {
              id: "q-4-3-3",
              question:
                "What does `TypeVar('T')` enable in the `first(items: Sequence[T]) -> Optional[T]` signature?",
              options: [
                "T is replaced with `Any`, allowing any type",
                "T links the input type to the return type — if you pass Sequence[int], the return is Optional[int]",
                "T forces the function to only accept integers",
                "TypeVar is only needed for class definitions, not standalone functions",
              ],
              correctIndex: 1,
              explanation:
                "`TypeVar` creates a generic placeholder. When mypy sees `first([1, 2, 3])`, it infers `T = int` and knows the return type is `Optional[int]`. This preserves type information through generic functions — far better than using `Any`.",
            },
            {
              id: "q-4-3-4",
              question:
                "What is the advantage of `@dataclass` over writing `__init__`, `__repr__`, and `__eq__` manually?",
              options: [
                "Dataclasses run faster than regular classes",
                "Dataclasses auto-generate boilerplate like __init__, __repr__, and __eq__ from field annotations",
                "Dataclasses enforce immutability by default",
                "Dataclasses are required for type checking to work correctly",
              ],
              correctIndex: 1,
              explanation:
                "`@dataclass` inspects your class annotations and generates `__init__`, `__repr__`, and `__eq__` automatically. This eliminates repetitive boilerplate while keeping the code readable. Use `frozen=True` for immutable dataclasses.",
            },
          ],
        },
        completed: false,
      },
      {
        lesson: {
          id: "lesson-4-4",
          moduleId: "mod-4",
          title: "Testing with pytest",
          order: 4,
          description:
            "Write reliable tests with pytest, fixtures, and mocking.",
          difficulty: "Advanced",
          durationMinutes: 40,
          content: `# Testing with pytest

Good tests give you confidence to change code without breaking things. pytest is Python's most popular testing framework.

## Basic Tests

\`\`\`python
# calculator.py
def add(a: float, b: float) -> float:
    return a + b

def divide(a: float, b: float) -> float:
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# test_calculator.py
import pytest
from calculator import add, divide

def test_add_positive_numbers():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2

def test_add_floats():
    assert add(0.1, 0.2) == pytest.approx(0.3)

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError, match="Cannot divide by zero"):
        divide(10, 0)
\`\`\`

## Fixtures

\`\`\`python
import pytest
from dataclasses import dataclass, field
from typing import List

@dataclass
class TodoList:
    items: List[str] = field(default_factory=list)
    
    def add(self, item: str) -> None:
        self.items.append(item)
    
    def remove(self, item: str) -> None:
        self.items.remove(item)

@pytest.fixture
def todo():
    t = TodoList()
    t.add("Buy milk")
    t.add("Write tests")
    return t

def test_add_item(todo: TodoList):
    todo.add("Read book")
    assert "Read book" in todo.items

def test_remove_item(todo: TodoList):
    todo.remove("Buy milk")
    assert "Buy milk" not in todo.items
    assert len(todo.items) == 1
\`\`\`

## Parametrize

\`\`\`python
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
    (100, -50, 50),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
\`\`\``,
          quiz: [
            {
              id: "q-4-4-1",
              question:
                "Why does pytest use `pytest.approx(0.3)` when testing `add(0.1, 0.2)`?",
              options: [
                "0.1 + 0.2 might raise a TypeError in Python",
                "Floating-point arithmetic is imprecise — `0.1 + 0.2` is not exactly `0.3` in binary",
                "`pytest.approx` runs the test 100 times to ensure consistency",
                "Python's `==` operator doesn't work with floats",
              ],
              correctIndex: 1,
              explanation:
                "In binary floating-point, `0.1 + 0.2` evaluates to `0.30000000000000004`. `pytest.approx` compares within a small tolerance (1e-6 by default), making float comparisons in tests reliable. Never use `==` to compare floats directly.",
            },
            {
              id: "q-4-4-2",
              question: "What is a pytest fixture and why is it useful?",
              options: [
                "A special assertion that checks multiple values at once",
                "A reusable setup function that pytest injects into tests as arguments",
                "A way to mark tests as expected to fail",
                "A file that configures pytest's output format",
              ],
              correctIndex: 1,
              explanation:
                "Fixtures are functions decorated with `@pytest.fixture` that set up shared test state. pytest automatically calls the fixture and passes its return value to any test function that lists it as a parameter. This avoids duplicating setup code across tests.",
            },
            {
              id: "q-4-4-3",
              question:
                "What does `pytest.raises(ZeroDivisionError)` do in a test?",
              options: [
                "It suppresses the error so the test doesn't fail",
                "It asserts that the code block inside `with` raises that exact exception",
                "It catches all exceptions and logs them",
                "It only works for built-in Python exceptions",
              ],
              correctIndex: 1,
              explanation:
                "`pytest.raises` is a context manager that asserts the enclosed code raises the specified exception. If the exception isn't raised, the test fails. You can also use `match=` to verify the error message with a regex pattern.",
            },
            {
              id: "q-4-4-4",
              question:
                "What does `@pytest.mark.parametrize` do for your tests?",
              options: [
                "It skips the test unless a specific environment variable is set",
                "It runs the same test function multiple times with different input/expected pairs",
                "It marks tests as slow so they run in a separate suite",
                "It generates random test data automatically",
              ],
              correctIndex: 1,
              explanation:
                "`@pytest.mark.parametrize` lets you define a table of (inputs, expected_output) pairs. pytest runs the test once for each row, giving you multiple test cases with minimal code duplication. Each case appears as a separate test in the results.",
            },
          ],
        },
        completed: false,
      },
    ],
  },
];
