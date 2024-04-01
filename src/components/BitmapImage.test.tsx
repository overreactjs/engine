import { describe, expect, it } from 'vitest';
import { render } from '../test';
import { BitmapImage } from './BitmapImage';
import { BitmapAsset, Position, Size, VariableProperty } from '..';

const IMAGE: BitmapAsset = {
  url: 'test.url',
  size: [32, 64],
};

describe('BitmapImage', () => {
  const renderSubject = (props: Partial<React.ComponentProps<typeof BitmapImage>>) => {
    return render(<BitmapImage image={IMAGE} offset={[0, 0]} size={[48, 96]} {...props} />);
  };

  const getSubject = () => {
    return document.body.getElementsByTagName('div')[1];
  };

  describe('position and size', () => {
    it('sets the position and size of the image', () => {
      renderSubject({ pos: [100, 50] });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(100px, 50px) rotate(0deg) scale(1, 1)',
        width: '48px',
        height: '96px',
      });
    });
  });

  describe('rotation', () => {
    it('rotates the image', () => {
      renderSubject({ angle: 42 });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(0px, 0px) rotate(42deg) scale(1, 1)',
      });
    });
  });

  describe('flip', () => {
    it('flips the image', () => {
      renderSubject({ flip: true });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(0px, 0px) rotate(0deg) scale(-1, 1)',
      });
    });
  });

  describe('scale', () => {
    it('scales the image', () => {
      renderSubject({ scale: 0.5 });
      expect(getSubject()).toHaveStyle({
        transform: 'translate(0px, 0px) rotate(0deg) scale(0.5, 0.5)',
      });
    });
  });

  describe('background image', () => {
    it('sets the background image', () => {
      renderSubject({});
      expect(getSubject()).toHaveStyle({
        'background-image': "url(test.url)",
      });
    });

    it('validates the image prop', () => {
      const image = new VariableProperty(IMAGE);
      renderSubject({ image });

      expect(image.invalidated).toBe(false);
    });
  });

  describe('background position', () => {
    it('sets the background position', () => {
      renderSubject({ offset: [10, 5] });
      expect(getSubject()).toHaveStyle({
        'background-position': '-10px -5px',
      });
    });

    describe('when the image scale factor is given', () => {
      it('stretches the image', () => {
        renderSubject({ offset: [10, 5], factor: [2, 3] });
        expect(getSubject()).toHaveStyle({
          'background-position': '-20px -15px',
        });
      });
    });

    it('validates the offset and factor props', () => {
      const offset = new VariableProperty<Position>([100, 50]);
      const factor = new VariableProperty<Size>([2, 3]);
      renderSubject({ offset, factor });

      expect(offset.invalidated).toBe(false);
      expect(factor.invalidated).toBe(false);
    });
  });

  describe('background size', () => {
    it('sets the background size', () => {
      renderSubject({});
      expect(getSubject()).toHaveStyle({
        'background-size': '32px 64px',
      });
    });

    describe('when the image scale factor is given', () => {
      it('stretches the image', () => {
        renderSubject({ factor: [2, 3] });
        expect(getSubject()).toHaveStyle({
          'background-size': '64px 192px',
        });
      });
    });

    it('validates the image and factor props', () => {
      const image = new VariableProperty(IMAGE);
      const factor = new VariableProperty<Size>([2, 3]);
      renderSubject({ image, factor });

      expect(image.invalidated).toBe(false);
      expect(factor.invalidated).toBe(false);
    });
  });
});
