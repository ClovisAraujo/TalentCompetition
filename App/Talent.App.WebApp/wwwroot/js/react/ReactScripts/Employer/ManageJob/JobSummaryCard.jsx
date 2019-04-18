import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button, Label, Icon, Segment } from 'semantic-ui-react';
import moment, { now } from 'moment';
import { NavLink } from 'react-router-dom';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);

    }

    closeJob(id) {
        var link = 'http://localhost:51689/listing/listing/closeJob';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success == true) {
                    this.props.reloadData();
                }
                else {
                    alert("Unable to close this job!\n\nPlease contact administrator")
                }
            }.bind(this)
        })
    }

    render() {
        var data = this.props.data

        return (
            <Card>
                <Card.Content>
                    <Card.Header>{data.title}</Card.Header>
                    <Label as='a' color='black'
                        ribbon='right'>
                        <Icon name='user' />{data.noOfSuggestions}
                    </Label><br /><br />
                    <Card.Meta>{data.location.city}, {data.location.country}</Card.Meta>
                    <Card.Description>{data.summary}</Card.Description>
                    <br /><br /><br /><br /><br /><br /><br /><br />
                </Card.Content>
                <Card.Content extra>
                    <Button.Group floated='right' size='mini'>
                        <Button basic color='blue'
                            onClick={() => this.closeJob(data.id)}>
                            <Icon name='ban' />Close</Button>
                        <NavLink to={'/EditJob/' + data.id}>
                            <Button basic color='blue'>
                                <Icon name='edit' />Edit</Button>
                        </NavLink>
                        <Button basic color='blue'>
                            <Icon name='copy' />Copy</Button>
                    </Button.Group>
                    {console.log(moment(data.expiryDate).toDate() + ' < ' + moment().toDate() + '?')}
                    {moment(data.expiryDate) < moment() ?
                        <Label color='red'>Expired
                    </Label> : null}
                </Card.Content>
            </Card>
        )
    }
}