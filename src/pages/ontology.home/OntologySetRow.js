import React from 'react';
import * as Bootstrap from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencilAlt, faPlay, faTrash} from '@fortawesome/free-solid-svg-icons';
import durationToText from '../../DurationToText';

class OntologySetRow extends React.Component {
    render() {
        const config = this.props.config;
        const processing = config.status === 'Processing';
        const rowColor = this.props.rowNumber % 2 ? 'table-secondary' : 'table-default';
        return (
            <tr className={rowColor}>
                <th scope={'row'}><h4 className={'m-0'}>{config.name}</h4></th>
                <td>
                    {processing && <Bootstrap.Spinner size="sm" animation="border" className={'mr-2'}/>}
                    {config.status || 'Saved'}
                </td>
                <td className={'pt-1 pb-1 text-center'}>{this.renderLastUpdate(config)}</td>
                <td className={'text-center'}>
                    <div className={'font-weight-bold'}>{config.ontologyCount || 0}</div>
                    {config.failedCount > 0
                        ? <div>Failed: {config.failedCount}</div>
                        : ''}
                </td>
                <td>
                    <div className={'d-flex justify-content-center'}>
                        <div className={'m-auto'}>
                            <Link to={'/ontology-set/' + config.id}>
                                <FontAwesomeIcon className="text-dark pointer" icon={faPencilAlt} title={'Edit'}/>
                            </Link>
                        </div>
                        <div className={'m-auto'} onClick={() => {
                            if (!processing) this.props.startProcessing(config);
                        }}>
                            <FontAwesomeIcon className={(processing ? 'text-muted' : 'text-dark') + ' pointer'}
                                             icon={faPlay} title={processing ? 'Processing' : 'Process'}/>
                        </div>
                        <div className={'m-auto'} onClick={() => this.props.showDeletePopup(config)}>
                            <FontAwesomeIcon className="text-danger pointer" icon={faTrash} title={'Delete'}/>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    renderLastUpdate(config) {
        if (!config.lastUpdate) {
            return <h4 className={'m-0'}><Bootstrap.Badge variant={'warning'}>Not processed yet</Bootstrap.Badge></h4>;
        }
        const success = config.status === 'Processed';
        const duration = Number(config.duration || 0);
        return (
            <Bootstrap.Row>
                <Bootstrap.Col lg={6}>
                    <Bootstrap.Col className={'p-0 text-lg-left'}>
                        <Bootstrap.Badge variant={success ? 'success' : 'danger'}>
                            {success ? 'SUCCESS' : config.status.toUpperCase()}
                        </Bootstrap.Badge>
                    </Bootstrap.Col>
                    <Bootstrap.Col className={'p-0 text-lg-left'}>
                        {new Date(config.lastUpdate).toLocaleString()}
                    </Bootstrap.Col>
                </Bootstrap.Col>
                <Bootstrap.Col lg={6}>
                    <Bootstrap.Col className={'text-lg-right font-weight-bold p-0'}>Duration:</Bootstrap.Col>
                    <Bootstrap.Col className={'text-lg-right p-0'}>{durationToText(duration)}</Bootstrap.Col>
                </Bootstrap.Col>
            </Bootstrap.Row>
        );
    }
}

export default OntologySetRow;
