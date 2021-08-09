import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import fetchMock from 'fetch-mock';

import Sentence from './Sentence';

beforeEach(() => {
  fetchMock.restore();
})

const expectedSentence = 'There is a snake in my boots.';
const data = {
  inflected: expectedSentence,
  base: [
    { fields: { base: 'there' } },
    { fields: { base: 'is' } },
    { fields: { base: 'a' } },
    { fields: { base: 'snake', category: 'whatever' } },
    { fields: { base: 'in' } },
    { fields: { base: 'my' } },
    { fields: { base: 'boots' } }
  ],
  poops: 'lots'
};

describe('Sentence', () => {
  it('should render a sentence', async () => {
    render(<Sentence sentence={data}/>);
    expectedSentence.split(' ').forEach(word =>
      expect(screen.getByRole('button', { name: word })).toBeInTheDocument()
    )
  });

  it('should show sentence data', async () => {
    render(<Sentence sentence={data}/>);
    expect(screen.queryByText('category')).not.toBeInTheDocument();
    expect(screen.queryByText('noun')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'snake' }));
    expect(screen.queryByText('category')).toBeInTheDocument();
  });

  it('should show sentence data', () => {
    render(<Sentence sentence={data}/>);
    expect(screen.queryByText('poops')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'See sentence data' }));
    expect(screen.queryByText('poops')).toBeInTheDocument();
  });
});
