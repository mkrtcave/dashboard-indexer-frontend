import React from 'react';
import * as Bootstrap from 'react-bootstrap';
import OntologySetTable from './OntologySetTable';
import '../home/Home.css';

class OntologyHome extends React.Component {
    render() {
        return (
            <Bootstrap.Container className={'pt-5'}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1 className={'mb-0'}>Ontology sets</h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <OntologySetTable {...this.props}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }
}

export default OntologyHome;
