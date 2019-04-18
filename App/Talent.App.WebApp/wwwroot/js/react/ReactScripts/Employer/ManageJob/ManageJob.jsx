import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");

        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var link = 'http://clovistalentservicestalent.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            data: {
                activePage: this.state.activePage,
                sortByDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            success: function (res) {
                console.log(res)
                this.setState({
                    loadJobs: res.myJobs,
                    totalPages: Math.ceil(res.totalCount / 6) 
                }, callback);
            }.bind(this),
            error: function (res) {
                console.log(res)
            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {

        let serviceList = this.state.loadJobs;

        let jobData = null;

        if (serviceList != "") {
            jobData = serviceList.map(service =>
                <JobSummaryCard
                    key={service.id}
                    data={service}
                    reloadData={this.loadData}
                />
            )
        }
        else {
            jobData =
                <div className="ui container">
                    <p>No Jobs Found</p>
                </div>
        }

        const filterOptions = [
            {
                key: 'Not part of this task',
                text: 'Not part of this task',
                value: 'Not part of this task',
            }]

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div className="spanMargin">
                        <span>
                            <Icon name='filter' />{' Filter: '}
                            <Dropdown
                                text='Choose filter'
                                inline
                                options={filterOptions}
                            />&emsp;
                            <Icon name='calendar' />{' Sort by date: '}
                            <Dropdown
                                text='Newest first'
                                inline
                                options={filterOptions}
                            />
                        </span>
                    </div>

                    <Card.Group itemsPerRow={3}>
                        {jobData}
                    </Card.Group>
                    <div className="centerPagination">
                        <Pagination
                            totalPages={this.state.totalPages}
                            activePage={this.state.activePage}
                        />
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}