# Step: Label chunks with a simple heuristic
def label_chunk(text: str) -> str:
    lowered = text.lower()
    if any(h in lowered for h in ["email", "phone", "linkedin", "steven liu"]):
        return "header"
    elif "experience" in lowered:
        return "experience"
    elif "education" in lowered:
        return "education"
    elif "skills" in lowered or "languages" in lowered:
        return "skills"
    elif "project" in lowered:
        return "projects"
    elif "certification" in lowered:
        return "certifications"
    else:
        return "other"


import re
from langchain.schema import Document
from langchain.document_loaders import PyPDFLoader


def chunk_by_ordered_sections(documents, section_names):
    """
    Split documents into labeled chunks based on ordered section headers.

    Args:
        documents: list of Documents (each with .page_content)
        section_names: list of section header strings in desired order, e.g. ['work experience', 'education']

    Returns:
        list of Documents with metadata 'section' indicating the chunk label
    """
    section_pattern = re.compile(
        "(" + "|".join([re.escape(s) for s in section_names]) + ")",
        re.IGNORECASE,
    )

    all_chunks = []
    for doc in documents:
        text = doc.page_content

        # Find all headers with their start positions
        matches = list(section_pattern.finditer(text))

        # If no matches, everything is a header or 'other'
        if not matches:
            text = clean_header_text(text)
            all_chunks.append(
                Document(page_content=text, metadata={"section": "header"})
            )
            continue

        # Add initial chunk from start to first header (header section)
        first_header_start = matches[0].start()
        if first_header_start > 0:
            header_chunk = text[:first_header_start].strip()
            if header_chunk:

                header_chunk = clean_header_text(header_chunk)
                all_chunks.append(
                    Document(page_content=header_chunk, metadata={"section": "header"})
                )

        # Now create chunks between headers
        for i in range(len(matches)):
            start_pos = matches[i].start()
            section_label = matches[i].group(0).lower().replace(" ", "_")

            end_pos = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            section_text = text[start_pos:end_pos].strip()

            section_text = clean_header_text(section_text)
            all_chunks.append(
                Document(page_content=section_text, metadata={"section": section_label})
            )

    return all_chunks


def clean_header_text(text):
    # print("input text:", text)
    # Collapse newlines and non-informative dashes/bars
    text = text.replace("—", " ").replace("|", " ")
    text = re.sub(r"\s+", " ", text)  # collapse whitespace
    return text.strip()


# # Example usage
section_names = [
    "work  experience",
    "education",
    "skills",
    "personal  projects",
    "certifications",
]

loader = PyPDFLoader("Resume.pdf")
documents = loader.load()

chunks = chunk_by_ordered_sections(documents, section_names)

for i, c in enumerate(chunks):
    print(f"\n--- Chunk {i+1} --- Section: {c.metadata['section']}")
    print(c.page_content[:500])  # preview first 500 chars
