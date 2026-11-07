// ==UserScript==
// @name         Ruskopolski
// @namespace    http://tampermonkey.net/
// @version      2026-08-22
// @description  try to take over the world!
// @author       You
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=russiatoday.ru
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function getPageLanguage() {
        const htmlLang = document.documentElement.lang;

        // Normalize and validate
        if (typeof htmlLang === 'string' && htmlLang.trim() !== '') return htmlLang.trim().toLowerCase();
        else if (location.href.includes('booksprime.ru/')) return 'ru';
        //else if(location.href.includes('.ru/') || location.href.startsWith('file:')) return 'ru';
        // else if(location.href.includes('.rs/')) return 'sr';
        else return null; // No language set
    }

    let disableTransliteration = Number(localStorage.disableTransliteration || 0);
    if (Number.isNaN(disableTransliteration)) localStorage.disableTransliteration = disableTransliteration = 0;
    console.log(`${location.href}: disableTransliteration: ${disableTransliteration}`);
    let cbDisableTransliteration = document.getElementById('cbDisableTransliteration');

    if (cbDisableTransliteration == null) {
        let span = Object.assign(document.createElement('span'), {
            style: 'position: absolute; top: 0; left: 0;',
        });
        span.append(Object.assign(document.createElement('input'), {
            id: 'cbDisableTransliteration',
            type: 'checkbox',
            onchange: ev => {
                let oldValue = localStorage.disableTransliteration;
                localStorage.disableTransliteration = ev.target.checked ? 1 : 0;
                if (localStorage.disableTransliteration != oldValue)
                    window.location.reload();
            },
            checked: disableTransliteration,
        }));
        span.append(Object.assign(document.createElement('label'), {
            htmlFor: 'cbDisableTransliteration',
            innerHTML: 'Disable transliteration',
            style: 'display: inline-block; vertical-align: middle;',
        }));
        document.body.append(span);

    }
    else cbDisableTransliteration.checked = disableTransliteration;

    const pageLang = getPageLanguage();
    console.log(`Język strony: ${pageLang}`);
    let isCyrillic = false;
    let needsŁ = false;
    if (['ru', 'sr', 'sr-rs', 'uk', 'bg', 'be-tarask', 'be'].includes(pageLang)
        || location.href.includes('x.com/')
        || [...decodeURIComponent(location.href)].some(c => c >= '\u0400' && c <= '\u04FF'))
        isCyrillic = true;

    if (!isCyrillic) return;
    if (['ru', 'be', 'be-tarask', 'uk'].includes(pageLang) || location.href.includes('x.com/')) {
        needsŁ = true;
    }

    const isFirefox = navigator.userAgent.includes(' Gecko/');
    const isMobile = false; // navigator?.userAgentData.platform == 'Android';
    const softLettersSoftenPrevious = true;

    // const i_diacritic = '̂';
    const AcuteAccent = '́';
    const GraveAccent = "̀";
    const DotAccent = '̇';
    const CaronAccent = '̌'; // háček
    const CircumflexAccent = '̂'; // roof accent

    let dict = {
        "а": "a",
        "А": "A",
        "б": "b",
        "Б": "B",
        "в": "v",
        "В": "V",
        "г": "g",
        "Г": "G",
        "д": "d",
        "Д": "D",
        "е": "e" + AcuteAccent,
        "Е": "E" + AcuteAccent,
        "ё": "o" + CircumflexAccent,
        "Ё": "O" + CircumflexAccent,
        "є": "e" + AcuteAccent,
        "Є": "E" + AcuteAccent,
        "ж": "z" + DotAccent,
        "Ж": "Z" + DotAccent,
        "з": "z",
        "З": "Z",
        "и": "i",
        "И": "I",
        "й": "j",
        "Й": "J",
        "к": "k",
        "К": "K",
        "л": "l",
        "Л": "L",
        "љ": "l",
        "м": "m",
        "М": "M",
        "н": "n",
        "Н": "N",
        "Њ": "Ń",
        "њ": "n" + AcuteAccent,
        "о": "o",
        "О": "O",
        "п": "p",
        "П": "P",
        "р": "r",
        "Р": "R",
        // "сть": "ść",
        "с": "s",
        "С": "S",
        "т": "t",
        "Т": "T",
        // "ть": "ť",
        // "Ть": "Ť",
        // "ТЬ": "Ť",
        "ћ": "c" + AcuteAccent,
        "Ћ": "C" + AcuteAccent,
        "у": "u",
        "У": "U",
        'ў': 'ŭ',
        "ф": "f",
        "Ф": "F",
        "х": "ch",
        "Х": "Ch",
        "ц": "c",
        "Ц": "C",
        "ч": "c" + CaronAccent,
        "Ч": "C" + CaronAccent,
        "дь": "đ",
        "Дь": "Đ",
        "ДЬ": "Đ",
        "ђ": "đ",
        "Ђ": "Đ",
        "џ": "dz" + CaronAccent,
        "Џ": "Dz" + CaronAccent,
        "ш": "s" + CaronAccent,
        "Ш": "S" + CaronAccent,
        "щ": "c" + CircumflexAccent,
        "Щ": "C" + CircumflexAccent,
        "ъ": GraveAccent,
        '\'': "̀", // it's not empty! post-grave accent
        "ы": "y",
        "Ы": "Y",
        "ь": AcuteAccent,
        "Ь": AcuteAccent,
        "э": "e",
        "Э": "E",
        "ю": "u" + AcuteAccent,
        "Ю": "U" + AcuteAccent,
        "я": "a" + AcuteAccent,
        "Я": "A" + AcuteAccent
    }
    const prefixes = {
    };
    const suffixes = {
        'ый': 'ȳ',
        'ая': 'ā',
        'ые': 'ē',
        "лий": "lī",
        'ий': 'ī',
        "лії": "lii",
    };

    if (needsŁ) {
        Object.assign(dict, {
            "л": "ł",
            "Л": "Ł",
            "ле": "le",
            "Ле": "Le",
            "лё": "lo",
            "ли": "li",
            "Ли": "Li",
            "лі": "li",
            "Лі": "Li",
            "лл": "ll",
            "ль": "l",
            "Ль": "L",
            "Лю": "Lu",
            "лю": "lu",
            "ля": "la",
            "Ля": "La",
        });
    }

    if (softLettersSoftenPrevious) {
        Object.assign(dict, {
            "е": AcuteAccent + "e",
            "Е": AcuteAccent + "E",
            "ё": AcuteAccent + "o",
            "Ё": AcuteAccent + "O",
            "ю": AcuteAccent + "u",
            "Ю": AcuteAccent + "U",
            "я": AcuteAccent + "a",
            "Я": AcuteAccent + "A",
        });
        Object.assign(prefixes, {
            "е": "e" + AcuteAccent,
            "Е": "E" + AcuteAccent,
            "ё": "o" + AcuteAccent,
            "Ё": "O" + AcuteAccent,
            "ю": "u" + AcuteAccent,
            "Ю": "U" + AcuteAccent,
            "я": "ja",
            "Я": "Ja"
        });
    } else {
        Object.assign(dict, {
            "ре": "ře" + AcuteAccent,
            "ри": "ři",
            "ря": "řa" + AcuteAccent,
            "Ре": "Ře" + AcuteAccent,
            "Ри": "Ři",
            "Ря": "Řa" + AcuteAccent
        });
    }

    if (isFirefox) {
        Object.assign(dict, {
            "шь": "ṧ",
            "Шь": "Ṥ",
        });
    }
    switch (pageLang) {
        case 'be':
            Object.assign(dict, {
                "ж": "ž", // belarusian standard
                "Ж": "Ž",
            });
            break;
        case 'uk':
            Object.assign(dict, {
                'Е': 'E',
                'е': 'e',
                'И': 'Y',
                'и': 'y',
                'Г': 'H',
                'г': 'h',
                'Ґ': 'G',
                'ґ': 'g',
            });
            if (needsŁ) {
                Object.assign(suffixes, {
                    "лий": "łȳ",
                // "лії": "lii",
                });
            }
            Object.assign(suffixes, {
                'ий': 'ȳ',
            });
            break;
    }

    if (true) // sort for display
    {
        const sortedKeys = Object.keys(dict).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        const newDict = Object.fromEntries(sortedKeys.map(key => [key, dict[key]]));
        console.log(JSON.stringify(newDict, null, 2));
    }

    const sortedKeys = Object.keys(dict).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).reverse();
    dict = Object.fromEntries(sortedKeys.map(key => [key, dict[key]]));
    // console.log(JSON.stringify(dict, null, 2));

    function processWord(word) {
        // false true
        const addMarkings = false;
        const appendOriginals = false;
        const appendTranslations = true;

        let result = '';
        //console.log(`word: ${origText}`);
        for (let key in prefixes) {
            if (word.startsWith(key)) {
                word = prefixes[key] + word.slice(key.length);
                break;
            }
        }
        for (let key in suffixes) {
            if (word.endsWith(key)) {
                word = word.slice(0, -key.length) + suffixes[key];
                break;
            }
        }
        for (let i = 0; i < word.length; i++) {
            let c = word[i];
            let found = false;
            for (let key in dict) {
                if (word.startsWith(key, i)) {
                    if (addMarkings) result += '·';
                    if (appendTranslations) {
                        let replacement = dict[key];
                        if (replacement.startsWith(AcuteAccent)) {
                            let suffix = null;
                            if (result.endsWith(AcuteAccent)) {
                                result = result.slice(0, -1);
                                suffix = '̋';
                            }
                            // else if (result.endsWith(DotAccent)) {
                            //     result = result.slice(0, -1);
                            //     suffix = '̈';
                            // }
                            else if (result.endsWith(GraveAccent)) {
                                result = result.slice(0, -1);
                                suffix = '̽';
                            }
                            else if (result.endsWith(CaronAccent) || result.endsWith(DotAccent)) {
                                result = result.slice(0, -1);
                                // suffix = '̐';
                                suffix = '̊';
                            }
                            else if(result.endsWith(CircumflexAccent)) {
                                result = result.slice(0, -1);
                                suffix = '̃';
                            }
                            if (suffix !== null) {
                                replacement = replacement.slice(1);
                                result += suffix;
                            }
                        }
                        result += replacement;
                    }
                    if(appendOriginals) result += '·' + key;
                    i += key.length - 1;
                    found = true;
                    break;
                }
            }
            if (!found) result += c;
        }
        return result;
    }

    function transliterate(textNode) {
        let polishText = '';
        const origText = textNode.nodeValue;
        let word = '';
        for (let c of origText) {
            if ((c < '\u0400' || c > '\u04FF') && c != '\'') {
                if (word.length) {
                    polishText += processWord(word);
                    word = '';
                }
                polishText += c;
            } else {
                word += c;
            }
        }
        if (word.length) polishText += processWord(word);
        textNode.nodeValue = polishText;
        //console.log(textNode.nodeValue);
    }

    function r_traverse(node, disableTransliteration) {
        if (disableTransliteration === undefined) {
            const cbDisableTransliteration = document.getElementById('cbDisableTransliteration');
            disableTransliteration = cbDisableTransliteration?.checked;
        }
        if (node.nodeType === Node.ELEMENT_NODE && (node.isContentEditable || node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) {
            return false;
        }
        if (!disableTransliteration && node.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length > 0) {
            transliterate(node);
        }

        node = node.firstChild;
        while (node) {
            r_traverse(node, disableTransliteration);
            node = node.nextSibling;
        }
    }
    r_traverse(document.body);
    if (isMobile) {
        ;
    } else {
        setInterval(() => {
            // const startTime = Date.now();
            r_traverse(document.body);
            // const seconds = Date.now() - startTime;
            // console.log(`Transliterating took ${seconds}ms`)
        }, 1000);
    }
})();