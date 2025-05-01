# Personal Finance Visualizer

## Description

This web application is a personal finance visualizer designed to help users track their income, expenses, and budgets. Built with Next.js, it provides a user-friendly interface for managing financial transactions, viewing visualizations, and gaining insights into spending habits.  The application allows users to add/edit/delete transactions, categorize them, set budgets, and view various charts and summaries.

## Features

* Add/Edit/Delete transactions (amount, date, description).
* Transaction list view.
* Monthly expenses bar chart.
* Basic form validation.
* Predefined categories for transactions.
* Category-wise pie chart.
* Dashboard with summary cards: total expenses, category breakdown, most recent transactions.
* Set monthly category budgets.
* Budget vs. actual comparison chart.
* Simple spending insights.

## Screenshot

Here is a screenshot of the application:

* **Complete Application:**
![Complete IMage](https://imagizer.imageshack.com/img923/5821/IZGw8j.png)
    

## Technologies Used

* Next.js
* MongoDB (for data storage)
* React (for the user interface)
* Other libraries - recharts, framer-motion

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/princetiwari26/Personal-Finance-Visualizer
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the environment variables:**

    * Create a `.env.local` file in the root directory of the project.
    * Add your MongoDB connection string to the `.env.local` file:

        ```
        MONGO_URI=your_mongodb_connection_string
        ```

    * **Important:** Replace `your_mongodb_connection_string` with your actual MongoDB connection string. This is crucial for the application to connect to your database.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:3000`.