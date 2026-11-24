# Driving Test Quiz (Lebanon)

A free practice site for the Lebanese theory driving test, with quizzes grouped
into categories. Arabic, right-to-left, built with plain HTML, CSS and JavaScript.

## Goal

Help people prepare for the theory exam with quick quizzes that give instant
feedback. One simple site, easy to maintain by one owner.

## Pages (5)

1. Home: a grid of category cards (image, title, question range).
2. Traffic signs (إشارات السير): sign image + "what does this sign mean?"
3. Driving law (قانون السير): text questions on rules and safety.
4. Motorcycles (الدراجات النارية): its own question set.
5. Trucks (الشاحنات): its own question set.

More categories (for example insurance) can be added later.

## How a quiz works

1. Show one question at a time (with an image for signs) and three options.
2. After the user picks, show right or wrong and the correct answer.
3. Next button, progress ("question 12 of 30"), final score, retry button.

## Structure

- One shared quiz engine used by every category.
- Each category has its own question list. Each entry holds: question text,
  three options, the correct answer, and an optional image link.
- Long categories split into parts of 30 automatically
  (1-30, 31-60, 61-90, 91-101). Adding questions extends the parts by itself.
- Question ranges on the home cards update from the lists.
- Home grid builds itself from the list of categories.

## Adding content (owner only)

- No admin page and no login. The owner edits the question lists directly in
  the code, so only the repository owner can change anything.
- To add a question: copy an existing entry, edit it, paste it at the end.
- To add a category: add one more card and one more question list.

## Design

- Light cream/white background, white rounded cards, soft shadows.
- Accent color purple/blue (#482dff) for buttons, progress and highlights.
- Right-to-left Arabic layout, bold category titles, range shown under title.
- Mobile first, one question per screen, large clear sign images.
- No ads, cookie banners or empty menus.

## Images

- Host images yourself (in this repo or Blogger's uploader) for stable links.
- Never hotlink images from other websites.
- Use signs drawn by the owner or from openly licensed or official sources.
- Keep images small and name files clearly (sign-001, sign-002...).

## Questions and content

- Write questions from the official Lebanese traffic law and driving manual.
- Do not copy another site's question bank (copyright, and answers could be wrong).
- Double-check every correct answer before publishing.

## Limits

- No server code or database, so no saved scores or user accounts.
- Correct answers live in the page code and can be seen by viewing the source.
  Fine for a practice quiz.

## Build order

1. Home page layout.
2. Shared quiz engine.
3. The four category pages with sample questions.
4. Owner adds the real questions and images.
5. Test every page on a phone.

## Project structure

```
index.html            page shell, loads the data files and the engine
css/style.css         all styling
js/app.js             shared quiz engine (home, parts, quiz, result, AR/EN)
data/*.js             one question list per category (signs, law, motorcycles, trucks, car)
images/signs/         sign images (sign-001.png, sign-002.png ...)
questions/            raw blocks and the 30-question template to copy from
```

To add a category: create `data/<name>.js` (copy an existing one) and add one
`<script>` line for it in `index.html`.
