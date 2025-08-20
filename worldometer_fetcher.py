#!/usr/bin/env python3
"""
Real-time population data fetcher from Worldometers.info
Uses the worldometer Python package to scrape authentic live data
"""

import sys
import json
from datetime import datetime, timezone
from worldometer.world import WorldCounters

def get_real_time_population_data():
    """
    Fetch real-time population data from Worldometers.info
    Returns JSON with births, deaths, and current population
    """
    try:
        # Initialize worldometer counters
        wc = WorldCounters()
        
        # Get current world population data
        current_population = wc.world_population.current_population
        births_today = wc.world_population.births_today
        deaths_today = wc.world_population.deaths_today
        population_growth_today = wc.world_population.population_growth_today
        
        # Format the data
        data = {
            "success": True,
            "currentPopulation": f"{current_population:,}",
            "birthsToday": f"{births_today:,}",
            "deathsToday": f"{deaths_today:,}",
            "growthToday": f"{population_growth_today:,}",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "worldometers.info",
            "region": "World"
        }
        
        return json.dumps(data)
        
    except Exception as e:
        # Return error response if scraping fails
        error_data = {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source": "worldometers.info"
        }
        return json.dumps(error_data)

if __name__ == "__main__":
    # Output the JSON data
    print(get_real_time_population_data())