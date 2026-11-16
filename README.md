# Ruskopolski

A Tampermonkey script that transliterates Cyrillic text to Latin script in real-time on any webpage. 
All widely used Slavic languages that use Cyrillic script are supported, namely Russian, Ukrainian, 
Belarusian in both ortographies, Bulgarian, Serbian and Macedonian (incomplete).
The resulting text looks like something between various Slavic languages that use Latin script.
The transliteration is reversible, unless the original Cyrillic text contains accents.

Existing transliteration norms such as ISO 9 or Belarusian or Yugoslavian standard are supported where possible 
(not often). The idea was to make transliterated Cyrillic languages take advantage of Slavic existing work on 
Latin script usage and look as natural as possible, while retaining the reversibility into Cyrillic.

The script's Tampermonkey menu allows to toggle transliteration per page and compound tall small letters globally.

### Rules
- Acute accent (´) softens consonants or appends *j* to vowels.
- Grave accent (`) hardens consonants.
- Caron accent (ˇ) creates a "háček" sound.
- Circumflex accent (ˆ) prepends *j* for initial *Е, Ё, Ю, Я* and their small counterparts or creates *щ* 
representation as *ĉ*, because it often translates to *c* in Latin script.
- Macron accent (¯) indicates obvious Ruthenian endings, which translate to a single letter in Latin script.
- Two subsequent accents are combined to facilitate rendering:
  - grave+acute turns into x
  - double acute becomes just that
  - caron+acute becomes a circle
  - curcumflex+acute turns into a tilde.
- *л/ль* is transliterated as *ł* or *l*, respectively, and all softening combinations are supported.

### Status
- Working.

### Example 1 (Ukrainian wikipedia)
<img height="1000" alt="image" src="https://github.com/user-attachments/assets/fe0d58bf-3f62-4055-9829-8eb8845a1b69" />

### Example 2 (Russian news site pravda.ru, with compound tall letters enabled)
<img width="2177" height="1118" alt="image" src="https://github.com/user-attachments/assets/f45abfad-2fd0-4214-8161-2a29f77b191d" />


