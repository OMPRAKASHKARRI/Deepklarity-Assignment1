# app/utils.py
import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import re

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; DeepKlarityBot/1.0)"}

def scrape_wikipedia(url: str) -> Dict[str, Any]:
    if "en.wikipedia.org/wiki/" not in url:
        raise ValueError("Only en.wikipedia.org article URLs are supported in this demo.")
    resp = requests.get(url, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    html = resp.text
    soup = BeautifulSoup(html, "html.parser")

    # Title
    title_tag = soup.find("h1", id="firstHeading")
    title = title_tag.get_text(strip=True) if title_tag else ""

    # Content paragraphs
    content_div = soup.find("div", id="mw-content-text")
    paragraphs = []
    sections = []
    if content_div:
        for element in content_div.find_all(["h2", "h3", "p"], recursive=True):
            if element.name in ("h2", "h3"):
                # get header text
                header = element.get_text().strip()
                header = re.sub(r'\[edit\]$', '', header).strip()
                if header:
                    sections.append(header)
            elif element.name == "p":
                text = element.get_text().strip()
                if text:
                    paragraphs.append(text)

    # Build summary as first 2 paragraphs
    summary = " ".join(paragraphs[:2]) if paragraphs else ""

    # Clean text for LLM feed
    text = "\n\n".join(paragraphs)

    return {"title": title, "summary": summary, "raw_html": html, "text": text, "sections": sections}

def generate_quiz_fallback(text: str, title: str, num_questions: int = 5) -> List[Dict[str, Any]]:
    """
    Simple fallback quiz generator:
     - picks sentences from text and forms one correct option with 3 generic distractors.
     - This is deterministic and safe for demo when LLM key is not present.
    """
    # Break into candidate sentences (long enough)
    candidates = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if len(s.split()) >= 8]
    out = []
    for i in range(min(num_questions, len(candidates))):
        correct = candidates[i]
        q = f"According to the article, which of the following statements about \"{title}\" is correct?"
        options = [correct]
        # create simple distractors (truncated/modified versions) - clearly wrong but acceptable for demo
        for j in range(3):
            distractor = f"{' '.join(correct.split()[:max(4, 6-j)])}..."
            options.append(distractor)
        # Shuffle options to avoid answer always first
        # but to keep deterministic order we won't randomize; if you want randomness import random.shuffle
        answer = correct
        out.append({
            "question": q,
            "options": options,
            "answer": answer,
            "explanation": "Taken from the scraped article paragraphs.",
            "difficulty": "medium"
        })
    return out
