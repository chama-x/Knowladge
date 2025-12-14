# The "Teacher-First" Workflow Strategy

**Yes, you absolutely should design the lesson as text first.**

Trying to generate code immediately is like trying to build a house without a blueprint. The AI will get distracted by CSS classes and forget the pedagogical nuance.

Your real-world teaching experience is the most valuable asset here. You know specifically *where* students get stuck (e.g., "Students confuse Page Number with Frame Number"). You need to capture that in a script before effective code can be written.

## Recommended Workflow

### Phase 1: The Pedagogical Script (Text Iteration)
Use a separate Gemini/LLM chat (or just a doc) to refine the *story* of the lesson. Do not talk about code yet. Talk about **Cognitive Load** and **Moments of Insight**.

**Iterate on this until it feels perfect:**
1.  **The Hook**: How do I grab their attention? (e.g., "Imagine your RAM is a small backpack, but you have 100 books.")
2.  **The Friction**: What is the hard problem? (e.g., "The CPU asks for Page 5, but Page 5 isn't in the backpack.")
3.  **The Solution (The Toy)**: How do we visualize the fix? (e.g., "We need a Lookup Table (Page Table) to see where Page 5 is hiding.")
4.  **The Assessment**: How do we check understanding without a boring quiz?

**Why this works:**
*   **Speed**: modifying text takes seconds. Modifying React code takes minutes.
*   **Quality**: You can inject your specific analogies ("The Librarian", "The Backpack") which generic AI prompts will miss.

---

### Phase 2: The Blueprint -> Code Handoff
Once your script is solid, you convert it into a **Design Brief** for the Engineering AI (Gemini Canvas).

**Example Brief Structure (Input for Gemini Canvas)**:
> "I have a designed lesson flow for Memory Management.
> **Concept**: Paging.
> **Analogy**: A Librarian (OS) finding books (Pages) on shelves (Frames).
> **Interactive Requirement**: I need a drag-and-drop interface where the user drags books onto shelves. If the shelf is full, the user must click a button to 'Swap Out' a book.
> **Visuals**: Use the Teal/Purple palette."

---

## Template: The "Lesson Design Blueprint"
*Fill this out before asking for any code.*

**1. Learning Objective**:
(e.g., "Student must understand that Logical Address != Physical Address")

**2. The "Aha!" Moment**:
(e.g., "The moment they realize the 'Offset' doesn't change, only the Page Number changes.")

**3. The "Toy" Mechanics**:
*   **Inputs**: (e.g., Slider for address bits, Toggle for Hex/Binary)
*   **Feedback**: (e.g., If they map it wrong, the memory block turns red and shakes)
*   **Win State**: (e.g., All pages are successfully mapped to frames)

**4. The Socratic Questions**:
(e.g., "Why didn't the offset change?" - instead of telling them, ask them after they interact.)

---

### Summary
1.  **Write the Story** (Phase 1) -> Optimize for Teaching.
2.  **Build the Toy** (Phase 2) -> Optimize for UI/UX.

This separates the "Teacher" role from the "Engineer" role, resulting in a much higher quality product.
