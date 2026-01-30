import { addSpellingMistakes, switchCasing } from '../js/lib';

test('switchCasing behaves as expected.', () => {
    expect(switchCasing('a')).toBe('A');
    expect(switchCasing('Z')).toBe('z');
});

test('Casing is switch according to probability given.', () => {
    expect(addSpellingMistakes('a', 1)).toBe('A');
    expect(addSpellingMistakes('a', 0)).toBe('a');
    expect(addSpellingMistakes('aAAeeiuezeé, JE suis très zarbi.', 1)).toBe('AaaEEIUEZEÉ, je SUIS TRÈS ZARBI.');
    expect(addSpellingMistakes('aAAeeiuezeé, JE suis très zarbi.', 0)).toBe('aAAeeiuezeé, JE suis très zarbi.');
});

test('A letter is duplicated according to probability given.', () => {
    expect(addSpellingMistakes('a', 0, 1)).toBe('aa');
    expect(addSpellingMistakes('s a e b f', 0, 1)).toBe('ss aa ee bb ff');
    expect(addSpellingMistakes('a', 0, 0)).toBe('a');
});