def calculate_agile_score_percentage(saydo_value, churn_value, six03010_value):
    # SayDo Score
    if 50 <= saydo_value <= 100:
        saydo_score = 1
    else:
        saydo_score = 0

    # Churn Score
    if 0 <= churn_value <= 50:
        churn_score = 1
    else:
        churn_score = 0

    # 603010 Score
    if 0 <= six03010_value <= 50:
        six03010_score = 1
    else:
        six03010_score = 0

    # Total score out of 3
    total_score = saydo_score + churn_score + six03010_score

    # Calculate Agile Score Percentage
    agile_score_percentage = (total_score / 3) * 100

    return agile_score_percentage

# Example usage:
saydo_value = 70      # Example SayDo percentage
churn_value = 30      # Example Churn percentage
six03010_value = 40   # Example 603010 percentage

agile_score_percentage = calculate_agile_score_percentage(saydo_value, churn_value, six03010_value)
print(f"Agile Score Percentage: {agile_score_percentage:.2f}%")
