import { describe, expect, it } from 'vitest';
import { render } from '../test';
import { BitmapText } from './BitmapText';
import { BitmapFontFace } from '..';

const FONT: BitmapFontFace = {
  image: {
    url: 'test.url',
    size: [32, 32],
  },
  glyphs: 'ABCDEFGH01234567',
  glyphSize: [8, 8],
};

describe('BitmapText', () => {
  const renderSubject = (props: Partial<React.ComponentProps<typeof BitmapText>> = {}) => {
    return render(<BitmapText font={FONT} text="ABCD" {...props} />);
  };

  const getContainer = () => document.body.getElementsByTagName('div')[1];
  const getCharacter = (i: number) => document.body.getElementsByTagName('div')[i + 2];

  it('automatically sizes the container based on the text', () => {
    renderSubject();
    expect(getContainer()).toHaveStyle({
      width: '32px',
      height: '8px',
    });
  });

  it('generates one image per character', () => {
    renderSubject();

    const size = { width: '8px', height: '8px' };
    expect(getCharacter(0)).toHaveStyle({ ...size, 'background-position': '0px 0px' });
    expect(getCharacter(1)).toHaveStyle({ ...size, 'background-position': '-8px 0px' });
    expect(getCharacter(2)).toHaveStyle({ ...size, 'background-position': '-16px 0px' });
    expect(getCharacter(3)).toHaveStyle({ ...size, 'background-position': '-24px 0px' });
    expect(getCharacter(4)).toBeUndefined();
  });

  describe('when the glyph is on the first row of the image', () => {
    it('sets the background position', () => {
      renderSubject({ text: 'C' });
      expect(getCharacter(0)).toHaveStyle({ 'background-position': '-16px 0px' });
    });
  });

  describe('when the glyph is on the second row of the image', () => {
    it('sets the background position', () => {
      renderSubject({ text: 'G' });
      expect(getCharacter(0)).toHaveStyle({ 'background-position': '-16px -8px' });
    });
  });

  describe('when the glyph is on the third row of the image', () => {
    it('sets the background position', () => {
      renderSubject({ text: '2' });
      expect(getCharacter(0)).toHaveStyle({ 'background-position': '-16px -16px' });
    });
  });

  describe('when the glyph is not in the font description', () => {
    it('sets the background position that results in an empty image', () => {
      renderSubject({ text: 'Z' });
      expect(getCharacter(0)).toHaveStyle({ 'background-position': '8px 8px' });
    });
  })

});
