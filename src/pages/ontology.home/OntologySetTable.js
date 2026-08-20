import React from 'react';
import * as Bootstrap from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle} from '@fortawesome/free-solid-svg-icons';
import api from '../../settings';
import OntologySetRow from './OntologySetRow';

class OntologySetTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            configs: [],
            connected: true,
            deletePopupShow: false,
            deleteData: true
        };
    }

    componentDidMount() {
        this.loadConfigs();
        this.configsInterval = setInterval(this.loadConfigs, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.configsInterval);
    }

    loadConfigs = () => {
        api.get('dashboard/configs').then((response) => {
            if (!this.state.connected) {
                this.props.addAlert({
                    variant: 'success',
                    title: 'Reconnected',
                    message: 'Reconnected to API server',
                    durationSec: 5
                });
            }
            this.setState({configs: response.data, connected: true});
        }).catch((error) => {
            if (this.state.connected) {
                this.props.addAlert({
                    variant: 'danger',
                    title: 'Connection lost',
                    message: error,
                    durationSec: 9
                });
            }
            this.setState({connected: false});
        });
    }

    startProcessing = (config) => {
        api.post('dashboard/configs/' + config.id + '/start', null, {
            params: {useBaseVersion: true}
        }).then(() => {
            this.loadConfigs();
            this.props.addAlert({
                variant: 'success',
                title: 'Processing started',
                message: "Ontology set '" + config.name + "' was queued for processing.",
                durationSec: 6
            });
        }).catch((error) => this.props.addAlert({
            variant: 'danger',
            title: 'Start request error',
            message: error,
            durationSec: 30
        }));
    }

    showDeletePopup = (config) => {
        this.setState({
            deletePopupShow: true,
            deletePopupConfig: config,
            deleteData: true
        });
    }

    deleteConfig = () => {
        const config = this.state.deletePopupConfig;
        if (!config) return;
        api.delete('dashboard/configs/' + config.id, {
            params: {deleteData: this.state.deleteData}
        }).then(() => {
            this.loadConfigs();
        }).catch((error) => this.props.addAlert({
            variant: 'danger',
            title: 'Delete request error',
            message: error,
            durationSec: 30
        }));
        this.setState({deletePopupShow: false, deletePopupConfig: null});
    }

    render() {
        return (
            <>
                {this.renderDeletePopup()}
                {this.renderStatus()}
                <Bootstrap.Table responsive="lg" bordered>
                    <thead className={'thead-dark'}>
                    <tr>
                        <th scope="col">Set name</th>
                        <th scope="col">Status</th>
                        <th scope="col">Last update</th>
                        <th scope="col">Ontology count</th>
                        <th scope="col">Controls</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.configs.length > 0
                        ? this.state.configs.map((config, rowNumber) => (
                            <OntologySetRow key={config.id}
                                            config={config}
                                            rowNumber={rowNumber}
                                            startProcessing={this.startProcessing}
                                            showDeletePopup={this.showDeletePopup}/>
                        ))
                        : this.renderNoConfigsRow()}
                    </tbody>
                </Bootstrap.Table>
            </>
        );
    }

    renderNoConfigsRow() {
        return (
            <tr>
                <td colSpan={5} className={'text-center'}>
                    <h3 className={'m-0'}>
                        <Bootstrap.Badge variant={'secondary'}>No ontology sets</Bootstrap.Badge>
                    </h3>
                </td>
            </tr>
        );
    }

    renderStatus() {
        return (
            <div className={'float-right'}>
                Status: {this.state.connected
                ? <FontAwesomeIcon className={'text-success'} icon={faCircle} title={'Online'}/>
                : <Bootstrap.Spinner size="sm" variant={'danger'} animation={'grow'} title={'Offline'}/>
            }
            </div>
        );
    }

    renderDeletePopup() {
        const config = this.state.deletePopupConfig;
        return (
            <Bootstrap.Modal centered show={this.state.deletePopupShow}
                             onHide={() => this.setState({deletePopupShow: false})}>
                <Bootstrap.Modal.Header className={'text-light bg-danger'}>
                    <Bootstrap.Modal.Title>
                        {'Deleting ontology set: ' + (config ? config.name : '')}
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    <p>Are you sure you want to delete this ontology-set configuration?</p>
                    <Bootstrap.Form.Switch label={'Also delete the generated GraphDB repository'}
                                           checked={this.state.deleteData}
                                           id="deleteOntologyDataCheck"
                                           onChange={(event) => this.setState({deleteData: event.target.checked})}/>
                </Bootstrap.Modal.Body>
                <Bootstrap.Modal.Footer>
                    <Bootstrap.Button className={'mr-2'} variant="secondary"
                                      onClick={() => this.setState({deletePopupShow: false})}>
                        No
                    </Bootstrap.Button>
                    <Bootstrap.Button variant="danger" onClick={this.deleteConfig}>
                        Yes, delete
                    </Bootstrap.Button>
                </Bootstrap.Modal.Footer>
            </Bootstrap.Modal>
        );
    }
}

export default OntologySetTable;
