import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test';
import { Circle } from './Circle';

describe('Circle', () => {
  it('uses the given dimensions', () => {
    render(<Circle size={[20, 20]}>test</Circle>);

    const box = screen.getByText('test');
    expect(box).toHaveStyle({
      transform: 'translate(0px, 0px)',
      width: '20px',
      height: '20px',
    });
  });

  it('uses the given background color', () => {
    render(<Circle size={[20, 20]} color="orangered">test</Circle>);

    const box = screen.getByText('test');
    expect(box).toHaveStyle({
      'background-color': 'rgb(255, 69, 0)',
      transform: 'translate(0px, 0px)',
    });
  });

  describe('when no background color is given', () => {
    it('defaults to transparent', () => {
      render(<Circle size={[20, 10]}>test</Circle>);

      const box = screen.getByText('test');
      expect(box).toHaveStyle({
        'background-color': 'rgba(0, 0, 0, 0)',
      });
    });
  });
});
