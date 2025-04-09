# Objectives App

## Pages

### Login Page

Entry point for the application, where the user can log in, reset password or register a new user.

Components:

- Username/email field
- Password field
- "Forgot password" button
- "Register" button

### Register user page

Components:

- Username/email field
- Password field
- Confirm password field
- Conclude button
- Cancel/return button

### Home/Objectives pages

Shows the the current objectives for the current time period of each "frequency" group. Allow creation and removal of a objective.

Components:

- List of objectives for each frequency type
- "Add objective" button
- "Remove objective" button

## Model

### Objective

#### Type

    Daily
    Weekly
    Monthly
    Yearly

#### Description

    Title of the objective

#### ObjectiveCells

    List of objects with the size of the amount of times this objective is expected to occur in the respective interval.

#### Reversible

    If checks can be reversible.

#### Timestamp of when was concluded(?)

### ObjectiveCell

#### Done

    Boolean for when this cell is checked/done.

#### Timestamp

    Timestamp for when the cell was checked/done last time.

## General development information

- Mobile first
- Week definition: Monday -> Sunday
- Recurrences flag to keep track of the amount of times the objective was concluded beyond expected amount.
