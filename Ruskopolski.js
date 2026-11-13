// ==UserScript==
// @name         Ruskopolski
// @namespace    http://tampermonkey.net/
// @version      2026-08-22
// @description  try to take over the world!
// @author       You
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=russiatoday.ru
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
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

    // false true
    const SoftLettersSoftenPrevious = true;
    const CompoundAccents = true;
    let compoundTallSmallLetters = GM_getValue('CompoundTallSmallLetters', false);
    const AddMarkings = false;
    const AppendOriginals = false;
    const AppendTranslations = true;

    let disableTransliteration = localStorage.disableTransliteration == 'true';
    console.log(`${location.href}: disableTransliteration: ${disableTransliteration}`);
    GM_registerMenuCommand("Toggle transliteration", () => {
        disableTransliteration = !disableTransliteration;
        localStorage['disableTransliteration'] = disableTransliteration;
        // alert(`${location.href}: localStorage.disableTransliteration: ${localStorage.disableTransliteration}`);
        window.location.reload();
    });
    if (!disableTransliteration) {
        GM_registerMenuCommand("Toggle compound tall small letters", () => {
            compoundTallSmallLetters = !compoundTallSmallLetters;
            GM_setValue('CompoundTallSmallLetters', compoundTallSmallLetters);
            window.location.reload();
        });
    }

    const pageLang = getPageLanguage();
    console.log(`pageLang: ${pageLang}`);
    let isCyrillic = false;
    let needsŁ = false;
    if (['ru', 'sr', 'sr-rs', 'uk', 'bg', 'be-tarask', 'be', 'mk'].includes(pageLang)
        || location.href.includes('x.com/')
        || [...decodeURIComponent(location.href)].some(c => c >= '\u0400' && c <= '\u04FF'))
        isCyrillic = true;

    if (!isCyrillic) return;
    if (['ru', 'be', 'be-tarask', 'uk', 'bg', 'mk'].includes(pageLang) || location.href.includes('x.com/')) {
        needsŁ = true;
    }

    const isFirefox = navigator.userAgent.includes(' Gecko/');
    const isMobile = false; // navigator?.userAgentData.platform == 'Android';

    const AcuteAccent = '́';
    const GraveAccent = "̀";
    const DotAccent = '̇';
    const CaronAccent = '̌'; // háček
    const CircumflexAccent = '̂'; // roof accent
    const MacronAccent = '̄';

    let dict = {
        "а": "a",
        "А": "A",
        "б": "b",
        "Б": "B",
        "в": "v",
        "В": "V",
        "Вт": "W",
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
        // "дь": "đ",
        // "Дь": "Đ",
        // "ДЬ": "Đ",
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
    const prefixes = { };
    const suffixes = {
        'ый': 'y' + MacronAccent,
        'ая': 'a' + MacronAccent,
        'ые': 'e' + MacronAccent,
        "лий": "li" + MacronAccent,
        'ий': 'i' + MacronAccent,
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
            "лле": "lle",
            "лли": "lli",
            "ль": "l",
            "Ль": "L",
            "Лю": "Lu",
            "лю": "lu",
            "ля": "la",
            "Ля": "La",
        });
    }

    if (SoftLettersSoftenPrevious) {
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
            "Е": "E" + GraveAccent,
            "Ё": "O" + GraveAccent,
            "Ю": "U" + GraveAccent,
            "Я": "A" + GraveAccent,
            "е": "e" + GraveAccent,
            "ё": "o" + GraveAccent,
            "ю": "u" + GraveAccent,
            "я": "a" + GraveAccent,
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

    // obsolete?
    // if (isFirefox) {
    //     Object.assign(dict, {
    //         "шь": "ṧ",
    //         "Шь": "Ṥ",
    //     });
    // }
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
            Object.assign(prefixes, {
                'Е': 'E',
                'е': 'e',
                "є": "e" + GraveAccent,
                "Є": "E" + GraveAccent,
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
        case 'sr':
            Object.assign(dict, {
                'Е': 'E',
                'е': 'e',
            });
            Object.assign(prefixes, {
                'Е': 'E',
                'е': 'e',
            });
            break;
    }

    if (false) // sort for display
    {
        const sortedKeys = Object.keys(dict).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        const newDict = Object.fromEntries(sortedKeys.map(key => [key, dict[key]]));
        console.log(JSON.stringify(newDict, null, 2));
    }

    const sortedKeys = Object.keys(dict).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).reverse();
    dict = Object.fromEntries(sortedKeys.map(key => [key, dict[key]]));
    // console.log(JSON.stringify(dict, null, 2));

    function processWord(word) {
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
                    if (AppendTranslations) {
                        let replacement = dict[key];
                        if (CompoundAccents && replacement.startsWith(AcuteAccent)) {
                            let suffix = null;
                            if (result.endsWith(AcuteAccent)) {
                                result = result.slice(0, -1);
                                suffix = '̋'; // double acute
                            }
                            else if (result.endsWith(GraveAccent)) {
                                result = result.slice(0, -1);
                                suffix = '̽'; // x
                            }
                            else if (result.endsWith(CaronAccent) || result.endsWith(DotAccent)) {
                                result = result.slice(0, -1);
                                // suffix = '̐'; // candrabindu
                                suffix = '̊'; // ring
                            }
                            else if(result.endsWith(CircumflexAccent)) {
                                result = result.slice(0, -1);
                                // suffix = '᷉'; // zig-zag
                                suffix = '̃'; // tilde
                            }
                            else if (compoundTallSmallLetters) {
                                if (result.endsWith('b')) {
                                    result = result.slice(0, -1);
                                    suffix = 'ƀ';
                                }
                                // else if (result.endsWith('B')) {
                                //     result = result.slice(0, -1);
                                //     suffix = 'Ɓ';
                                // }
                                else if (result.endsWith('d')) {
                                    result = result.slice(0, -1);
                                    suffix = 'đ';
                                }
                                // else if (result.endsWith('D')) {
                                //     result = result.slice(0, -1);
                                //     suffix = 'Đ';
                                // }
                                else if(result.endsWith('h')) {
                                    result = result.slice(0, -1);
                                    suffix = 'ħ';
                                }
                                // else if(result.endsWith('H')) {
                                //     result = result.slice(0, -1);
                                //     suffix = 'Ħ';
                                // }
                                else if (result.endsWith('k')) {
                                    result = result.slice(0, -1);
                                    suffix = 'ĸ' + AcuteAccent;
                                }
                                else if (result.endsWith('t')) {
                                    result = result.slice(0, -1);
                                    suffix = 'ŧ';
                                    // suffix = 'ť';
                                }
                                // else if (result.endsWith('T')) {
                                //     result = result.slice(0, -1);
                                //     suffix = 'Ŧ';
                                //     suffix = 'Ť';
                                // }
                            }
                            if (suffix !== null) {
                                result += suffix;
                                replacement = replacement.slice(1);
                            }
                        }
                        result += replacement;
                    }
                    if (AppendOriginals) result += '|' + key;
                    if (AddMarkings) result += '·';
                    i += key.length - 1;
                    found = true;
                    break;
                }
            }
            if (!found) result += c;
        }
        return result;
    }

    // "е Е ё Ё ю Ю я Я "
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
    r_traverse(document.body, disableTransliteration);
    if (isMobile || AppendOriginals) {
        ;
    } else {
        setInterval(() => {
            // const startTime = Date.now();
            r_traverse(document.body, disableTransliteration);
            // const seconds = Date.now() - startTime;
            // console.log(`Transliterating took ${seconds}ms`)
        }, 1000);
    }
})();