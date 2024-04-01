import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { render, renderHook } from '../test';
import { useElement } from "./useElement";
import { VariableProperty } from '..';

describe('useElement', () => {
  const renderSubject = () => {
    const { result } = renderHook(() => useElement());
    const { ref } = result.current;
    render(<div data-testid="div" ref={ref} />);
    return result.current;
  };

  describe('setText', () => {
    it('sets the text content of the node', () => {
      const { setText } = renderSubject();
      expect(screen.getByTestId('div').textContent).toBe('');
      setText('something');
      expect(screen.getByTestId('div').textContent).toBe('something');
    });
  });

  describe('setAttribute', () => {
    describe('when the value is defined', () => {
      it('sets the attribute', () => {
        const { setAttribute } = renderSubject();
        expect(screen.getByTestId('div').getAttribute('test')).toBe(null);
        setAttribute('test', 'something');
        expect(screen.getByTestId('div').getAttribute('test')).toBe('something');
      });
    });

    describe('when the value is false', () => {
      it('sets the attribute to be the string false', () => {
        const { setAttribute } = renderSubject();
        setAttribute('test', false);
        expect(screen.getByTestId('div').getAttribute('test')).toBe('false');
      });
    });

    describe('when the value is true', () => {
      it('sets the attribute to be the string true', () => {
        const { setAttribute } = renderSubject();
        setAttribute('test', true);
        expect(screen.getByTestId('div').getAttribute('test')).toBe('true');
      });
    });

    describe('when the value is 0', () => {
      it('sets the attribute', () => {
        const { setAttribute } = renderSubject();
        setAttribute('test', 0);
        expect(screen.getByTestId('div').getAttribute('test')).toBe('0');
      });
    });

    describe('when the value is undefined', () => {
      it('removes the attribute', () => {
        const { setAttribute } = renderSubject();
        setAttribute('test', 'something');
        expect(screen.getByTestId('div').getAttribute('test')).toBe('something');
        setAttribute('test', undefined);
        expect(screen.getByTestId('div').getAttribute('test')).toBe(null);
      });
    });

    describe('when the value is null', () => {
      it('removes the attribute', () => {
        const { setAttribute } = renderSubject();
        setAttribute('test', 'something');
        expect(screen.getByTestId('div').getAttribute('test')).toBe('something');
        setAttribute('test', null);
        expect(screen.getByTestId('div').getAttribute('test')).toBe(null);
      });
    });
  });

  describe('setData', () => {
    describe('when the value is defined', () => {
      it('sets the data attribute', () => {
        const { setData } = renderSubject();
        setData('test', 'something');
        expect(screen.getByTestId('div').getAttribute('data-test')).toBe('something');
      });
    });

    describe('when the value is undefined', () => {
      it('removes the data attribute', () => {
        const { setData } = renderSubject();
        setData('test', 'something');
        setData('test', null);
        expect(screen.getByTestId('div').getAttribute('data-test')).toBe(null);
      });
    });
  });

  describe('setStyle', () => {
    it('sets the style property', () => {
      const { setStyle } = renderSubject();
      expect(screen.getByTestId('div').style.backgroundColor).toBe('');
      setStyle('background-color', 'orangered');
      expect(screen.getByTestId('div').style.backgroundColor).toBe('orangered');
    });
  });

  describe('setLegacyStyle', () => {
    it('sets the style property', () => {
      const { setLegacyStyle } = renderSubject();
      expect(screen.getByTestId('div').style.backgroundColor).toBe('');
      setLegacyStyle('background-color', 'orangered');
      expect(screen.getByTestId('div').style.backgroundColor).toBe('orangered');
    });
  });

  describe('setBaseStyles', () => {
    it('sets the position', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({ pos: new VariableProperty([100, 50]) });
      expect(screen.getByTestId('div')).toHaveStyle({
        transform: 'translate(100px, 50px)',
      });
    });

    it('sets the angle', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({ angle: new VariableProperty(42) });
      expect(screen.getByTestId('div')).toHaveStyle({
        transform: 'rotate(42deg)',
      });
    });

    it('sets the scale', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({ scale: new VariableProperty(2) });
      expect(screen.getByTestId('div')).toHaveStyle({
        transform: 'scale(2, 2)',
      });
    });

    it('flips the element', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({ flip: new VariableProperty(true) });
      expect(screen.getByTestId('div')).toHaveStyle({
        transform: 'scale(-1, 1)',
      });
    });

    it('sets all transforms at once', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({
        pos: new VariableProperty([100, 50]),
        angle: new VariableProperty(42),
        scale: new VariableProperty(2),
        flip: new VariableProperty(true),
       });

      expect(screen.getByTestId('div')).toHaveStyle({
        transform: 'translate(100px, 50px) rotate(42deg) scale(-2, 2)',
      });
    });

    it('sets the size', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({ size: new VariableProperty([100, 50]) });
      expect(screen.getByTestId('div')).toHaveStyle({
        width: '100px',
        height: '50px',
      });
    });

    it('sets the opacity', () => {
      const { setBaseStyles } = renderSubject();
      setBaseStyles({ opacity: new VariableProperty(0.5) });
      expect(screen.getByTestId('div')).toHaveStyle({
        opacity: '0.5',
      });
    });
  });

  describe('when an element is passed in', () => {
    it('is passed straight back out', () => {
      const { result: result1 } = renderHook(() => useElement());
      const { result: result2 } = renderHook(() => useElement(result1.current));
      expect(result1.current).toBe(result2.current);
    });
  });
});
