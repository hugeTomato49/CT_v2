from datetime import datetime, timedelta

def filterDataByTimeRange(data, timeRange):
    # Parse the start and end times from the timeRange list and adjust them
    # Replace "Z" with "+00:00" to properly handle the timezone
    start_time_original = datetime.fromisoformat(timeRange[0].replace("Z", "+00:00"))
    end_time_original = datetime.fromisoformat(timeRange[1].replace("Z", "+00:00"))
    
    # Adjust the start time to the day after the original start time
    start_time_adjusted = start_time_original + timedelta(days=1)
    # The end time is set to the exact date of the end time specified in timeRange
    end_time_adjusted = end_time_original

    # Convert both adjusted times to "YYYY-MM-DD" format for comparison
    start_date_str = start_time_adjusted.strftime("%Y-%m-%d")
    end_date_str = end_time_adjusted.strftime("%Y-%m-%d")

    # Filter the data to include only the entries within the adjusted time range
    filtered_data = [
        entry for entry in data
        if start_date_str <= entry["Time"] <= end_date_str
    ]

    return filtered_data
