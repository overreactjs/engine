import { describe, expect, it } from 'vitest';
import { advanceFrames, nextFrame, render } from '../test';
import { BitmapSprite } from './BitmapSprite';
import { BitmapSpriteAsset, SpriteSet, VariableProperty } from '..';

const SPRITE: BitmapSpriteAsset = {
  url: 'test.url',
  size: [96, 64],
  count: 3,
  rate: 20,
};

describe('BitmapSprite', () => {
  const renderSubject = (props: Partial<React.ComponentProps<typeof BitmapSprite>> = {}) => {
    return render(<BitmapSprite sprite={SPRITE} size={[32, 64]} {...props} />);
  };

  const getSubject = () => {
    return document.body.getElementsByTagName('div')[1];
  };

  describe('position and size', () => {
    it('sets the position and size of the sprite', () => {
      renderSubject({ pos: [100, 50] });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(100px, 50px) rotate(0deg) scale(1, 1)',
        width: '32px',
        height: '64px',
      });
    });
  });

  describe('rotation', () => {
    it('rotates the sprite', () => {
      renderSubject({ angle: 42 });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(0px, 0px) rotate(42deg) scale(1, 1)',
      });
    });
  });

  describe('flip', () => {
    it('flips the sprite', () => {
      renderSubject({ flip: true });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(0px, 0px) rotate(0deg) scale(-1, 1)',
      });
    });
  });

  describe('scale', () => {
    it('scales the sprite', () => {
      renderSubject({ scale: 2 });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(0px, 0px) rotate(0deg) scale(2, 2)',
      });
    });
  });

  describe('animation', () => {
    it('initially shows the first frame', () => {
      renderSubject();
      expect(getSubject()).toHaveStyle({
        'background-position': '0px 0px',
      });
    });

    describe('when the duration of the first frame has passed', () => {
      it('shows the second frame', () => {
        renderSubject();
        advanceFrames(4); // 15 x 4 = 60
        expect(getSubject()).toHaveStyle({
          'background-position': '-32px 0px',
        });
      });
    });

    describe('when the duration of the first 2 frames has passed', () => {
      it('shows the third frame', () => {
        renderSubject();
        advanceFrames(7); // 15 x 7 = 105
        expect(getSubject()).toHaveStyle({
          'background-position': '-64px 0px',
        });
      });
    });

    describe('when the duration of all 3 frames has passed', () => {
      it('loops back to the first frame', () => {
        renderSubject();
        advanceFrames(10); // 15 x 10 = 150
        expect(getSubject()).toHaveStyle({
          'background-position': '0px 0px',
        });
      });

      describe('and the repeat flag is false', () => {
        it('shows the third (and final) frame', () => {
          renderSubject({ repeat: false });
          advanceFrames(10); // 15 x 10 = 150
          expect(getSubject()).toHaveStyle({
            'background-position': '-64px 0px',
          });
        });
      });
    });
  });

  describe('when the sprite is part of a sprite set', () => {
    describe('and the animation changes', () => {
      it('resets the animation to the first frame', () => {
        const animation = new VariableProperty('run');
        render(
          <SpriteSet animation={animation}>
            <BitmapSprite name="idle" sprite={SPRITE} size={[32, 64]} />
          </SpriteSet>
        );

        advanceFrames(4); // 15 x 4 = 60
        expect(getSubject()).toHaveStyle({
          'background-position': '-32px 0px',
        });

        animation.current = 'idle';
        nextFrame();
        nextFrame(); // This might be a bug. The sprite set calls the reset function in a render function!
        expect(getSubject()).toHaveStyle({
          'background-position': '0px 0px',
        });
      });
    });
  });
});
