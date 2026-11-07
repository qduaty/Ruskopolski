# Ruskopolski

A Tampermonkey script that transliterates Cyrillic text to Latin script in real-time on any webpage. 
All widely used Slavic languages that use Cyrillic script are supported, namely Russian, Ukrainian, 
Belarusian in both ortographies, Bulgarian, Serbian and Macedonian.
The resulting text looks like something between various Slavic languages that use Latin script.
The transliteration is reversible, unless the original Cyrillic text contains accents.

Existing transliteration norms such as ISO 9 or Belarusian or Yugoslavian standard are supported where possible 
(not often). The idea was to make transliterated Cyrillic languages take advantage of Slavic existing work on 
Latin script usage and look as natural as possible, while retaining the reversibility into Cyrillic.

<!-- A checkbox is added to disable transliteration for a page. -->

### Rules
- Acute accent (´) softens consonants or appends *j* to vowels.
- Grave accent (`) hardens consonants.
- Caron accent (ˇ) is used to create a "háček" sound. There is currently one exception from this rule with Polish *ż*.
- Circumflex accent (ˆ) is only used for the letter *щ*, which often translates to *c* in languages using Latin script.
- Macron accent (¯) indicates obvious Ruthenian endings, which translate to a single letter in Western/Southern languages.
- Two subsequent accents are combined to facilitate rendering:
  - grave+acute turns into x
  - double acute becomes just that
  - caron+acute becomes a circle
  - curcumflex+acute turns into a tilde.
- *л/ль* is transliterated as *ł* or *l*, respectively, and all softening combinations are supported.

### Status
- Working.

### Example (Ukrainian wikipedia)
<img width="1163" height="1179" alt="image" src="https://github.com/user-attachments/assets/3d390369-a9d7-47ad-9e8a-6f584cec3079" />
