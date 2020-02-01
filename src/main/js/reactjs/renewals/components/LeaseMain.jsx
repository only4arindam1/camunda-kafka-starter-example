'use strict';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client.jsx');
const follow = require('./follow.jsx'); // function to hop multiple links by "rel"

const LeaseList = require('src/main/js/reactjs/renewals/components/LeaseList.jsx');
const LeaseDetail = require('src/main/js/reactjs/renewals/components/LeaseDetail.jsx');

const root = '/api';
// end::vars[]

// tag::app[]
class LeaseMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          lease: null,
          leases: [],
          attributes: [],
          pageSize: 2,
          links: {},
          displayDetail: "none",
          displayList: "block",
          displayInfo: "none",
          displayLine: "block",
          toggleDetailInfo: "off",
          callUpdate: function (pageSize, that) {that.loadAllFromServer(pageSize)}
        };
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.onUpdateNote = this.onUpdateNote.bind(this);
        this.handleSelectedItem = this.handleSelectedItem.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handlefilterState = this.handlefilterState.bind(this);
        this.handleFilterPriority = this.handleFilterPriority.bind(this);
        this.handleFilterAll = this.handleFilterAll.bind(this);
        this.handleFilterStarted = this.handleFilterStarted.bind(this);
        this.handleRefreshMessages = this.handleRefreshMessages.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    // tag::update-page-size[]
    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
          this.state.callUpdate(pageSize, this);
        }
    }
    // end::update-page-size[]

    // tag::follow-1[]
    componentDidMount() {
        this.loadAllFromServer(this.state.pageSize);
        this.loadCannedMessageFromServer(); 
    }
    // end::follow-1[]

    // tag::navigate[]
    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(leaseCollection => {
            this.setState({
                leases: leaseCollection.entity._embedded.leases,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: leaseCollection.entity._links
            });
        });
    }
    // end::navigate[]

    handleFilterPriority(pageSize){
      this.loadPriorityFromServer(pageSize);
      this.setState({
        callUpdate: function (pageSize, that) {that.loadPriorityFromServer(pageSize)}
      });
    }

    handleFilterAll(pageSize){
      this.loadAllFromServer(pageSize);
      this.setState({
        callUpdate: function (pageSize, that) {that.loadAllFromServer(pageSize)}
      });
    }

    handleFilterStarted(pageSize){
      this.loadStartedFromServer(pageSize);
      this.setState({
        callUpdate: function (pageSize, that) {that.loadStartedFromServer(pageSize)}
      });
    }

    handlefilterState(pageSize){
      this.loadStateFromServer(pageSize);
      this.setState({
        callUpdate: function (pageSize, that) {that.loadStateFromServer(pageSize)}
      });
    }

    handleRefreshMessages(lease){
      this.loadMessagesFromServer(lease._links.messages.href);
    }

    // tag::follow-2[]
    loadCannedMessageFromServer() {
        follow(client, root, [
            {rel: 'cannedMessages'}]
        ).then(cannedMessageCollection => {
            return client({
                method: 'GET',
                path: cannedMessageCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return cannedMessageCollection;
            });
        }).done(cannedMessageCollection => {
            this.setState({
                cannedMessages: cannedMessageCollection.entity._embedded.cannedMessages,
                attributes: Object.keys(this.schema.properties),
                links: cannedMessageCollection.entity._links});
        });
    }
    // end::follow-2[]
    
    loadPriorityFromServer(pageSize){
      client({
        method: 'GET',
        path: root+"/leases/search/findLeasesByRenewalStartedAndRenewalCompletedAndWorkflowStateOrderByShowDateAsc",
        params: {size: pageSize, renewalStarted: true, renewalCompleted: false, workflowState: "Confirm Renewal State"},
      }).done(response => {
          this.setState(
            {
              leases: response.entity._embedded.leases,
              pageSize: pageSize,
              links: response.entity._links
            }
          );
      });
    }

    loadStartedFromServer(pageSize){
      client({
        method: 'GET',
        path: root+"/leases/search/findLeasesByRenewalStartedAndRenewalCompletedOrderByRenewalStartedAsc",
        params: {size: pageSize, renewalStarted: true, renewalCompleted: false},
      }).done(response => {
          this.setState(
            {
              leases: response.entity._embedded.leases,
              pageSize: pageSize,
              links: response.entity._links
            }
          );
      });
    }

    loadStateFromServer(pageSize){
      client({
        method: 'GET',
        path: root+"/leases/search/findLeasesByRenewalStartedAndRenewalCompletedOrderByWorkflowStateAsc",
        params: {size: pageSize, renewalStarted: true, renewalCompleted: false},
      }).done(response => {
          this.setState(
            {
              leases: response.entity._embedded.leases,
              pageSize: pageSize,
              links: response.entity._links
            }
          );
      });
    }

    // tag::follow-2[]
    loadAllFromServer(pageSize) {
        follow(client, root, [
            {rel: 'leases', params: {size: pageSize}}]
        ).then(leaseCollection => {
            return client({
                method: 'GET',
                path: leaseCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return leaseCollection;
            });
        }).done(leaseCollection => {
            this.setState({
                leases: leaseCollection.entity._embedded.leases,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: leaseCollection.entity._links});
        });
    }
    // end::follow-2[]

    // tag::follow-3[]
    loadMessagesFromServer(navUri) {
      client({method: 'GET', path: navUri}).done(response => {
          this.setState({messages: response.entity._embedded.messages});
      });
    }
    // end::follow-3[]

    handleSelectedItem(lease){
      if(lease.renewalStarted === true
              && lease.renewalCompleted === false
              && lease.workflowState === "Confirm Renewal State")
      {
          this.setState({
              displayForm: "block"
          });
      }else{
        this.setState({
            displayForm: "none"
        });
      }

      if(lease.renewalStarted === true){
          this.setState({
            displayMessages: "block"
         });
      }else{
        this.setState({
            displayMessages: "none"
        });
      }

      this.setState({
        lease: lease,
        displayDetail: "block",
        displayList: "none"
      });
      this.loadMessagesFromServer(lease._links.messages.href);
    }

    handleBackClick(e){ 
       this.setState({
           displayDetail: "none",
           displayList: "block"
         });
    }

    handleToggleClick(e){
        if (this.state.toggleDetailInfo === "off"){
            this.setState({
              toggleDetailInfo: "on",
              displayInfo: "block",
              displayLine: "none"
            });
        }else {
            this.setState({
                toggleDetailInfo: "off",
                displayInfo: "none",
                displayLine: "block"
              });
    
        }
    }

    onUpdateNote(lease, updatedLease) {
        debugger
        client({
          method: 'POST',
          path: "/updateNote",
          entity: updatedLease,
          headers: {'Content-Type': 'multipart/form-data'}
        }).done(response => {
          if (response.status.code === 200) {
              alert('SUCCESS: Note Updated');
          }
          if (response.status.code === 412) {
              alert('DENIED: Unable to update ' +
                  lease._links.self.href + ' METHOD NOT ALLOWED');
          }
          if (response.status.code === 412) {
              alert('DENIED: Unable to update ' +
                  lease._links.self.href + '. Your copy is stale.');
          }
          if (response.status.code === 500) {
            alert('DENIED: Unable to update ' +
              lease._links.self.href + '. Internal Server Error.');
          }
        });   
    }


    // tag::on-delete[]
    onDelete(lease) {
        client(
           {method: 'DELETE', path: lease._links.self.href}
        ).done(response => {
           /* let the websocket handle updating the UI */  
           alert("You successfully deleted " +lease.property+ "Use the back button and refresh the Lease list to view the changes"); 
        },
        response => {
            if (response.error){
                 alert("Somthing went wrong "+ reponse.error)   
            }else if (response.status.code === 400) {
                alert('SERVER ERROR: You request was not completed ' +
                        lease._links.self.href);
            }else if (response.status.code === 403) {
                alert('ACCESS DENIED: You are not authorized to delete ' +
                        lease._links.self.href);
            }else{
                alert("Somthing went wrong "+ reponse.error)   
            }
        });
    }
    // end::on-delete[]
    
    render() {
      var item = "";
      if (this.state.lease !== null) {
        item = <LeaseDetail lease={this.state.lease}
                    messages={this.state.messages}
                    cannedMessages={this.state.cannedMessages}
                    onRefreshMessages={this.handleRefreshMessages}
                    displayForm={this.state.displayForm}
                    displayMessages={this.state.displayMessages}
                    onUpdateNote={this.onUpdateNote}
                    onSelectItem={this.handleSelectedItem}
                    displayInfo={this.state.displayInfo}
                    displayLine={this.state.displayLine}
                    onDelete={this.onDelete}/>           
      }

      return (
          <div>

            <div style={{display: this.state.displayList}}>
              <LeaseList leases={this.state.leases}
                links={this.state.links}
                pageSize={this.state.pageSize}
                onNavigate={this.onNavigate}
                onUpdateNote={this.onUpdateNote}
                updatePageSize={this.updatePageSize}
                onSelectItem={this.handleSelectedItem}
                onFilterPriority={this.handleFilterPriority}
                onFilterAll={this.handleFilterAll}
                onFilterStarted={this.handleFilterStarted}
                onFilterState={this.handlefilterState}/>
            </div>

            <div style={{display: this.state.displayDetail}}>
              <div className="top-bar show-for-medium small-12 columns">
               <div className="top-bar-left">
                 <ul className="menu">
                   <li className="topbar-title">
                     Lease Detail
                   </li>
                 </ul>
               </div>
               <div className="top-bar-right">
                 <ul className="menu">
                   <li className="topbar-title">
                     <a className="button small" onClick={this.handleToggleClick}>&lt;Details&gt;</a>
                   </li>                   
                   <li className="topbar-title">
                     <a className="button" onClick={this.handleBackClick}>&lt;&lt;&lt;Back</a>
                   </li>
                 </ul>
               </div>
              </div>
              <div className="row">
                <div className="small-12 columns">
                  {item}
                </div>
              </div>
            </div>

          </div>
      )
    }
}
// end::app[]

module.exports = LeaseMain;
