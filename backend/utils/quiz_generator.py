import requests
from bs4 import BeautifulSoup

def generate_quiz(url: str):
    """Scrape Wikipedia and generate dummy quiz data"""
    try:
        response = requests.get(url)
        response.raise_for_status()
    except Exception:
        raise Exception("Failed to fetch Wikipedia page. Check the URL.")

    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.find("h1").text if soup.find("h1") else "Unknown Title"
    paragraphs = " ".join([p.text for p in soup.find_all("p")[:3]])

    # Dummy quiz data for testing (replace with LLM integration later)
    quiz = [
        {
            "question": f"What is {title} known for?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Option A",
            "difficulty": "easy",
            "explanation": f"This question is about {title}.",
        }
    ]

    return {
        "url": url,
        "title": title,
        "summary": paragraphs[:500],
        "quiz": quiz,
        "related_topics": ["Sample Topic 1", "Sample Topic 2"]
    }
