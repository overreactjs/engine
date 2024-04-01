import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { nextFrame, render } from '../test';
import { FrameRate } from './FrameRate';

describe('FrameRate', () => {
  it('updates each frame', () => {
    render(<FrameRate />);
    expect(screen.getByText('0 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('2 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('4 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('7 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('9 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('11 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('13 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('16 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('18 fps')).not.toBeNull();
    nextFrame();
    expect(screen.getByText('20 fps')).not.toBeNull();
  });
});
