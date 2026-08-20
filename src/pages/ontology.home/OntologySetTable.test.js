import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import api from '../../settings';
import OntologySetTable from './OntologySetTable';

jest.mock('../../settings', () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn()
}));

test('selects generated repository deletion by default', async () => {
    api.get.mockResolvedValue({
        data: [{id: 'set-id', name: 'OBO', status: 'Saved'}]
    });

    render(
        <MemoryRouter>
            <OntologySetTable addAlert={() => {}}/>
        </MemoryRouter>
    );

    fireEvent.click(await screen.findByTitle('Delete'));

    expect(screen.getByLabelText('Also delete the generated GraphDB repository')).toBeChecked();
});
