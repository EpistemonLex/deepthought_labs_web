# Tutorial: Creating a Custom Tool

This tutorial will guide you through the process of creating a new custom tool for your AI agents using the **Tool Foundry** in Deepthought. Tools are the primary way to extend an agent's capabilities, allowing it to interact with external systems, files, and APIs.

For this tutorial, we will create a simple but practical tool: `get_current_weather`.

## Step 1: Navigate to the Tool Foundry

1.  Launch the Deepthought application.
2.  In the left-hand navigation pane ("Control Deck"), click on the **Tool Foundry** button (the toolbox icon).

This will open the Tool Foundry workbench, which is split into two main sections: the Tool Library on the left and the Tool Editor on the right.

## Step 2: Create a New Tool

1.  In the Tool Library pane on the left, click the **"New Tool..."** button.
2.  This will clear all the fields in the Tool Editor on the right, preparing it for your new tool definition.

## Step 3: Define the Tool's Identity

This section tells the AI agent what the tool is for. The agent uses the **Name** and **Description** to decide when it is appropriate to use this tool.

1.  **Tool Name**: In the `Tool Name` input field, enter a clear, descriptive, and verb-based name. For our example, type:
    ```
    get_current_weather
    ```
2.  **Description**: In the `Description` text area, write a detailed explanation of what the tool does, what its parameters mean, and what it returns. This is critical for the AI to use the tool correctly. For our example, enter:
    ```
    Retrieves the current weather for a specified location. It requires a city and an optional country code. It returns a dictionary containing the temperature and a general description of the weather conditions.
    ```

## Step 4: Define the Implementation

This is where you specify how the tool actually works.

1.  **Implementation Type**: For this example, we will write a Python function. Select **"Python Function"** from the `Implementation Type` dropdown menu.

2.  **Parameter Schema (JSON)**: This is a crucial step. You must define the parameters your tool accepts using the **JSON Schema** format. This schema is how the AI knows what arguments to provide when it calls your tool.

    In the `Parameter Schema (JSON)` editor, enter the following JSON:
    ```json
    {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "The city name for which to get the weather, e.g., 'San Francisco'."
        },
        "country_code": {
          "type": "string",
          "description": "The two-letter ISO country code, e.g., 'US'. This is optional but helps clarify the location."
        }
      },
      "required": ["location"]
    }
    ```
    This schema tells the AI that the `get_current_weather` function requires one argument (`location`) and has one optional argument (`country_code`).

3.  **Implementation Code**: In the `Implementation Code` editor, write the Python code for your function. The function signature **must** match the properties you defined in the JSON schema.

    For this tutorial, we will use a mock function that doesn't actually call a weather API. Enter the following code:
    ```python
    import random

    def get_current_weather(location: str, country_code: str = "US") -> dict:
        """
        Retrieves the current weather for a specified location.

        Args:
            location: The city name.
            country_code: The two-letter ISO country code.

        Returns:
            A dictionary with the current temperature and weather description.
        """
        # In a real tool, you would make an API call here.
        # For this example, we'll return random mock data.
        conditions = ["Sunny", "Cloudy", "Rainy", "Windy"]
        temperature = random.randint(5, 25)  # Temperature in Celsius
        condition = random.choice(conditions)

        return {
            "location": f"{location}, {country_code}",
            "temperature_celsius": temperature,
            "condition": condition
        }

    ```

## Step 5: Configure Safety Controls

This section allows you to define safeguards for your tool.

-   **Require user confirmation**: Check this box if you want the UI to prompt you for approval every time an agent tries to use this tool. This is highly recommended for tools that modify files, make API calls with costs, or perform other sensitive operations. For our simple weather tool, we can leave this unchecked.
-   **Allow file system access**: These checkboxes should only be checked if your tool's code needs to read from or write to the file system. Our tool does not, so leave them unchecked.

## Step 6: Save the Tool

Click the **"Save Tool"** button at the bottom of the editor.

Your new tool, `get_current_weather`, will now appear in the Tool Library list on the left. You have successfully created a custom tool!

## Next Steps

Now that your tool is created, you can make it available to an agent by:

1.  Navigating to the **Persona Foundry**.
2.  Creating or selecting a persona.
3.  In the "Associated Tools" section, checking the box next to `get_current_weather`.
4.  Saving the persona.

Any agent using this persona will now have the ability to check the weather!
