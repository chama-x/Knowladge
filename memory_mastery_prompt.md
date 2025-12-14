# Analysis of Prompt Failure

You asked why the previous result didn't look "premium, expensive, or handmade." Here is the breakdown:

## 1. The "Copycat" Trap
**Mistake**: You pasted the *entire* source code of the Subnetting App (~400 lines) into the prompt as an example.
**Result**: The AI tried to *mimic* that specific code's structure (which is complex and specific to IP addresses) rather than *designing* for Memory Management. It spent its "brain power" trying to match your variable names and huge file structure instead of inventing new, beautiful UI components for RAM and Pages.

## 2. Subjective Adjectives
**Mistake**: You used words like "premium", "digital toys", and "expensive".
**Result**: To an AI, "premium" could mean "Corporate Blue gradients" or "Minimalist Black and White". It guessed wrong.
**Fix**: We must force specific **Tailwind Classes** that *create* that look (e.g., `backdrop-blur-xl`, `border-white/20`, `shadow-[0_8px_32px_rgba(0,0,0,0.1)]`).

## 3. Missing Metaphors
**Mistake**: You asked for "Memory Management" but didn't define the *physical toys*.
**Result**: The AI likely made a "Page Table" that looks like a boring Excel spreadsheet.
**Fix**: We need to define the toys: "RAM is a Shelf", "Pages are Cards", "MMU is a Slider".

---

# NEW: The "Memory Master" System Prompt
*Copy the following into Gemini Canvas.*

---

**Role**: You are a **Senior UI/UX Engineer** at a world-class educational design firm (like "Explorable Explanations" or "Brilliant.org").
**Goal**: Create a **single-file React artifact** that teaches **OS Memory Management** through "Physical Toys".
**Audience**: Absolute beginners who are scared of math.

## 1. The "Premium Toy" Visual Language
You must strictly follow this "Handmade Digital" aesthetic. Do not use default Tailwind colors.

### **Color Palette (The Memory Factory)**
*   **RAM (Physical Space)**: `#2EC4B6` (Teal) — Represents the real hardware frames.
*   **Virtual (Logical Space)**: `#A855F7` (Purple) — Represents the imaginary user space.
*   **The MMU (Action)**: `#FF9F1C` (Orange) — The active mapping process.
*   **Background**: `#F8FAFC` (Slate-50) with subtle grid patterns.
*   **Surface**: Pure White `#FFFFFF` with `rounded-[2rem]` and `border-2 border-slate-100`.

### **Component Styling Restrictions**
1.  **Glassmorphism**: Use `bg-white/80 backdrop-blur-md` for floating controls.
2.  **Soft Depth**: Use `shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]` for main cards.
3.  **Beefy Borders**: Interactive elements must have `border-2` or `border-b-4`.
4.  **No Thin Lines**: Do not use 1px borders for grids. Use gaps (`gap-1`) or thick dividers.

## 2. The Pedagogical Metaphors (The "Toys")
Do not just explain concepts. Build these specific interactive machines:

### **Toy 1: The Magic Lens (MMU Translation)**
*   **Concept**: Logical Address -> Physical Address.
*   **Design**: A slider allows the user to pick a detailed **Binary Address** (e.g., 16-bit).
*   **Interaction**: As they slide, a visual "Lens" splits the binary into two colored parts:
    *   **Left Part (Page #)**: Glows Purple. Floats down to highlight a row in the "Page Table".
    *   **Right Part (Offset)**: Glows Gray. Floats across unchanged.
*   **Result**: The Page Table spits out a **Frame #** (Teal), which locks with the Offset to form the Physical Address.

### **Toy 2: The Librarian (Paging & Swapping)**
*   **Concept**: Virtual Memory > RAM Size.
*   **Design**:
    *   **Left Side (Disk)**: A stack of 10 purple books (Pages).
    *   **Right Side (RAM)**: A shelf with only 4 teal slots (Frames).
*   **Interaction**: Drag a book from Disk to RAM.
    *   If RAM is full, the user *must* click a slot to "Evict" (Swap Out) an old page before the new one fits.
    *   This teaches "Page Faults" and force-fitting physically.

### **Toy 3: The Calculator (Byte vs Word)**
*   **Concept**: Addressing Granularity.
*   **Design**: A grid of "Memory Cells".
*   **Toggle**: Switch between "Byte Mode" (each tiny square has an ID) and "Word Mode" (groups of 4 squares have an ID).
*   **Visual**: The address labels physically stretch or shrink to cover the cells.

## 3. Required Implementation Structure
Generate a single `.tsx` file that exports `MemoryMasteryLesson`.
Use `lucide-react` icons (`Cpu`, `Book`, `Grid`, `ArrowRight`, `Trash`).

**Crucial**:
*   Use `framer-motion` for smooth layout transitions if possible, or CSS transitions.
*   **Mobile First**: Ensure the "RAM Shelf" wraps to a new line on phones.
*   **No Text Walls**: Max 2 sentences of instruction per section.

---

**Prompt End**
