'use strict';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom')
const {Route, Router, IndexRoute, hashHistory} = require('react-router');
const Main = require('Main');
const RenewalMain = require('RenewalMain');
const TenantMain = require('TenantMain');
const Import = require('Import');
const RenewalDetail = require('RenewalDetail');
const TenantDetail = require('TenantDetail');
const CannedMessageMain = require('CannedMessageMain');

// tag::styles[]
require('style!css!foundation-sites/dist/foundation.css');
$(document).foundation();

//require('style!css!../../main/resources/static/app.css');
// end::styles[]

// tag::render[]
ReactDOM.render(
      <Router history={hashHistory}>
        <Route path="/" component={Main}>
          <IndexRoute component={RenewalMain}/>
          <Route path="renewal" component={RenewalDetail}/>
          <Route path="tenants" component={TenantMain}/>
          <Route path="tenant" component={TenantDetail}/>
          <Route path="cannedMessages" component={CannedMessageMain}/>
          <Route path="import" component={Import}/>
        </Route>
      </Router>,
      document.getElementById('react')
)
// end::render[]
