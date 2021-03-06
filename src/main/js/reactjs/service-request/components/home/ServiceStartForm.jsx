var React = require('react');
const client = require('../client.jsx');
const DisplayDate = require('src/main/js/reactjs/service-request/components/date/DisplayDate.jsx');
const follow = require('../follow.jsx'); // function to hop multiple links by "rel"

class ServiceStartForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log("Start Form Component Did Mount");
    }

    componentDidUpdate() {
        console.log("Start Form Component Did Update");
    }

    handleChange(e){
        e.preventDefault();

        var serviceId = this.refs.pid.value;


        console.log("Start Form handleChange: "+ JSON.stringify(serviceId));

        this.props.onUpdateStartState(serviceId);
    }

    render() {

        if (this.props.serviceRequests !== null){
            // console.log("Start FORM SR's: "+ JSON.stringify(this.props.serviceRequests));
            var options = this.props.serviceRequests.map(serviceRequest =>
                // console.log("Start FORM SR's: "+ JSON.stringify(serviceRequest) +" :: "+serviceRequest._links.self.href)
                <option key={serviceRequest._links.self.href} value={serviceRequest.serviceId}>{serviceRequest.serviceId}</option>
            );
        }

        return (
            <div >

                <div className="small-7 large-7 columns">
                  <div className="input-group">

                      <span className="input-group-label">Select Existing Service Request</span>
                      <select className="input-group-field"
                            ref="pid"
                            onChange={this.handleChange}
                            value={this.props.serviceRequest.serviceId} >

                          <option defaultValue>Please Select</option>
                          {options}
                      </select>
                  </div>
                </div>


              <div className="small-5 large-5 columns">
                  <label htmlFor="start" className="button large">Start New Service Request</label>
                  <input type="submit" id="start" className="show-for-sr"
                         onClick={this.props.onStart} />
              </div>

            </div>

        );
  }
}

module.exports = ServiceStartForm;
