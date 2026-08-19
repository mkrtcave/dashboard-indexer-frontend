import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import OntologySetRow from './OntologySetRow';

test('renders ontology-set status and counts', () => {
    const config = {
        id: 'set-id',
        name: 'OBO',
        status: 'Processed',
        ontologyCount: 77,
        failedCount: 1,
        lastUpdate: '2026-08-19T12:30:00',
        duration: '3723004'
    };

    render(
        <MemoryRouter>
            <table><tbody><OntologySetRow config={config} rowNumber={0}
                                             startProcessing={() => {}}
                                             showDeletePopup={() => {}}/></tbody></table>
        </MemoryRouter>
    );

    expect(screen.getByText('OBO')).toBeInTheDocument();
    expect(screen.getByText('Processed')).toBeInTheDocument();
    expect(screen.getByText('77')).toBeInTheDocument();
    expect(screen.getByText('Failed: 1')).toBeInTheDocument();
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
});

test('shows the unprocessed state for a saved set', () => {
    render(
        <MemoryRouter>
            <table><tbody><OntologySetRow config={{id: 'new-id', name: 'New set', status: 'Saved'}}
                                             rowNumber={0} startProcessing={() => {}}
                                             showDeletePopup={() => {}}/></tbody></table>
        </MemoryRouter>
    );

    expect(screen.getByText('Not processed yet')).toBeInTheDocument();
});
