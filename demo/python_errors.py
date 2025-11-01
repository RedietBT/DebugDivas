"""
VibeAssist Demo - Python Errors
This file contains intentional errors for testing VibeAssist
"""

# Error 1: NameError - undefined variable
def greet_user():
    print(f"Hello, {username}")  # username is not defined

# Error 2: TypeError - string concatenation with integer
def calculate_age(birth_year):
    current_year = "2024"
    age = current_year - birth_year  # Can't subtract int from string
    return age

# Error 3: IndexError - list index out of range
def get_first_item():
    items = []
    return items[0]  # List is empty

# Error 4: AttributeError - calling non-existent method
def process_text(text):
    return text.uppercas()  # Should be uppercase()

# Error 5: ImportError - importing non-existent module
import non_existent_module

# Error 6: ZeroDivisionError
def divide_numbers(a, b):
    return a / 0  # Division by zero

# Error 7: KeyError - accessing non-existent dictionary key
def get_user_info():
    user = {"name": "John", "age": 30}
    return user["email"]  # 'email' key doesn't exist

# Error 8: IndentationError (uncomment to test)
# def bad_indentation():
# print("This will cause an error")

if __name__ == "__main__":
    # Run one error at a time for testing
    greet_user()  # Uncomment to test different errors
    # print(calculate_age(1990))
    # print(get_first_item())
    # print(process_text("hello"))
    # print(divide_numbers(10, 5))
    # print(get_user_info())

