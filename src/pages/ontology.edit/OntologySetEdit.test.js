import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import OntologySetEdit from './OntologySetEdit';

test('renders the create form with base version enabled by default', () => {
    render(
        <MemoryRouter initialEntries={['/ontology-set']}>
            <Route path={'/ontology-set'}>
                <OntologySetEdit addAlert={() => {}}/>
            </Route>
        </MemoryRouter>
    );

    expect(screen.getByRole('heading', {name: 'New ontology set'})).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Ontology set')).toHaveAttribute('type', 'url');
    expect(screen.getByLabelText('Graph DB')).toHaveAttribute('type', 'url');
    expect(screen.getByLabelText('Use base version')).toBeChecked();
    expect(screen.getByRole('button', {name: /Save$/})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Save and start/})).toBeInTheDocument();
});
