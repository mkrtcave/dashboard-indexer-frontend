import React from 'react';
import * as Bootstrap from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlay, faSave} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import api from '../../settings';
import './OntologySetEdit.css';

class OntologySetEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            name: '',
            source: '',
            graphURI: '',
            useBaseVersion: true,
            loading: Boolean(props.match.params.id),
            saving: false,
            validated: false
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.loadConfig(this.props.match.params.id);
        }
    }

    loadConfig(id) {
        api.get('dashboard/configs/' + id).then((response) => {
            this.setState({
                config: response.data,
                name: response.data.name || '',
                source: response.data.source || '',
                graphURI: response.data.graphURI || '',
                loading: false
            });
        }).catch((error) => {
            if (error.response && error.response.status === 404) {
                this.props.history.replace('/notfound');
                return;
            }
            this.props.addAlert({
                variant: 'danger',
                title: 'Get configuration error',
                message: error,
                durationSec: 30
            });
            this.setState({loading: false});
        });
    }

    save = (startAfterSave) => {
        this.setState({validated: true});
        if (!this.form.checkValidity()) return;

        const payload = Object.assign({}, this.state.config, {
            name: this.state.name.trim(),
            source: this.state.source.trim(),
            graphURI: this.state.graphURI.trim()
        });
        delete payload.repositoryUrl;

        const address = startAfterSave ? 'dashboard/configAndIndex' : 'dashboard/configs';
        const options = startAfterSave
            ? {params: {useBaseVersion: this.state.useBaseVersion}}
            : undefined;

        this.setState({saving: true});
        api.put(address, payload, options).then(() => {
            this.props.history.push('/ontology-sets');
        }).catch((error) => {
            this.props.addAlert({
                variant: 'danger',
                title: startAfterSave ? 'Save and start error' : 'Save configuration error',
                message: error,
                durationSec: 30
            });
            this.setState({saving: false});
        });
    }

    render() {
        const editing = Boolean(this.props.match.params.id);
        return (
            <Bootstrap.Container className={'pt-5'}>
                {this.renderSaveButtons()}
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <h1>{editing ? 'Editing ontology set' : 'New ontology set'}</h1>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        {this.state.loading
                            ? <div className={'text-center p-5'}><Bootstrap.Spinner animation={'border'}/></div>
                            : this.renderForm()}
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        );
    }

    renderForm() {
        return (
            <Bootstrap.Form noValidate validated={this.state.validated}
                            ref={(form) => this.form = form}
                            onSubmit={(event) => event.preventDefault()}>
                <Bootstrap.Form.Group as={Bootstrap.Row} controlId={'ontologySetName'}>
                    <Bootstrap.Form.Label column md={2}>Name</Bootstrap.Form.Label>
                    <Bootstrap.Col md={10}>
                        <Bootstrap.Form.Control required value={this.state.name}
                                                onChange={(event) => this.setState({name: event.target.value})}/>
                        <Bootstrap.Form.Control.Feedback type={'invalid'}>Name is required.</Bootstrap.Form.Control.Feedback>
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
                <Bootstrap.Form.Group as={Bootstrap.Row} controlId={'ontologySetSource'}>
                    <Bootstrap.Form.Label column md={2}>Ontology set</Bootstrap.Form.Label>
                    <Bootstrap.Col md={10}>
                        <Bootstrap.Form.Control required type={'url'}
                                                placeholder={'http://obofoundry.org/registry/ontologies.ttl'}
                                                value={this.state.source}
                                                onChange={(event) => this.setState({source: event.target.value})}/>
                        <Bootstrap.Form.Text className={'text-muted'}>
                            URL of the RDF registry that describes the ontology set.
                        </Bootstrap.Form.Text>
                        <Bootstrap.Form.Control.Feedback type={'invalid'}>
                            Enter a valid ontology-set URL.
                        </Bootstrap.Form.Control.Feedback>
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
                <Bootstrap.Form.Group as={Bootstrap.Row} controlId={'graphDbUrl'}>
                    <Bootstrap.Form.Label column md={2}>Graph DB</Bootstrap.Form.Label>
                    <Bootstrap.Col md={10}>
                        <Bootstrap.Form.Control required type={'url'} placeholder={'http://localhost:7200'}
                                                value={this.state.graphURI}
                                                onChange={(event) => this.setState({graphURI: event.target.value})}/>
                        <Bootstrap.Form.Text className={'text-muted'}>
                            GraphDB server URL. The result repository is created automatically.
                        </Bootstrap.Form.Text>
                        <Bootstrap.Form.Control.Feedback type={'invalid'}>
                            Enter a valid GraphDB server URL.
                        </Bootstrap.Form.Control.Feedback>
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
                <Bootstrap.Form.Group as={Bootstrap.Row}>
                    <Bootstrap.Form.Label column md={2}>Use base version</Bootstrap.Form.Label>
                    <Bootstrap.Col md={10} className={'align-items-center d-flex'}>
                        <Bootstrap.Form.Check type={'switch'} id={'useBaseVersion'}
                                              aria-label={'Use base version'}
                                              checked={this.state.useBaseVersion}
                                              onChange={(event) => this.setState({useBaseVersion: event.target.checked})}/>
                    </Bootstrap.Col>
                </Bootstrap.Form.Group>
            </Bootstrap.Form>
        );
    }

    renderSaveButtons() {
        return (
            <div className={'ontology-save-buttons'}>
                <Bootstrap.Button variant={'success'} className={'mr-3'} disabled={this.state.loading || this.state.saving}
                                  onClick={() => this.save(false)}>
                    <FontAwesomeIcon icon={faSave}/> Save
                </Bootstrap.Button>
                <Bootstrap.Button variant={'success'} className={'mr-3'} disabled={this.state.loading || this.state.saving}
                                  onClick={() => this.save(true)}>
                    <FontAwesomeIcon icon={faPlay}/> Save and start
                </Bootstrap.Button>
            </div>
        );
    }
}

export default withRouter(OntologySetEdit);
