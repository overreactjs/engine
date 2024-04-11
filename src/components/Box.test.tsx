import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test';
import { Box } from './Box';

describe('Box', () => {
  it('uses the given dimensions', () => {
    render(<Box size={[20, 10]}>test</Box>);

    const box = screen.getByText('test');
    expect(box).toHaveStyle({
      transform: 'translate(0px, 0px) rotate(0deg)',
      width: '20px',
      height: '10px',
    });
  });

  it('uses the given angle', () => {
    render(<Box size={[20, 10]} angle={42}>test</Box>);

    const box = screen.getByText('test');
    expect(box).toHaveStyle({
      transform: 'translate(0px, 0px) rotate(42deg)',
      width: '20px',
      height: '10px',
    });
  });

  it('uses the given background color', () => {
    render(<Box size={[20, 10]} color="orangered">test</Box>);

    const box = screen.getByText('test');
    expect(box).toHaveStyle({
      'background-color': 'rgb(255, 69, 0)',
      transform: 'translate(0px, 0px) rotate(0deg)',
      width: '20px',
      height: '10px',
    });
  });

  describe('when no background color is given', () => {
    it('defaults to transparent', () => {
      render(<Box size={[20, 10]}>test</Box>);

      const box = screen.getByText('test');
      expect(box).toHaveStyle({
        'background-color': 'rgba(0, 0, 0, 0)',
      });
    });
  });
});
