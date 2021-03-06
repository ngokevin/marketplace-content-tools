import React from 'react';
import {Provider} from 'react-redux';
import {Redirect, Route, Router} from 'react-router';
import {history} from 'react-router/lib/BrowserHistory';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import loggerMiddleware from 'redux-logger';
import {reduxRouteComponent,
        routerStateReducer as router} from 'redux-react-router';
import persistState from 'redux-localstorage'
import persistSlicer from 'redux-localstorage-slicer';
import thunkMiddleware from 'redux-thunk';

import {loginRequired} from './site/login';

import AddonDashboard from './addon/containers/dashboard';
import AddonLanding from './addon/containers/landing';
import AddonReview from './addon/containers/review';
import AddonSubmit from './addon/containers/submit';
import App from './site/containers/app';
import Landing from './site/containers/landing';
import Login from './site/containers/login'
import LoginOAuthRedirect from './site/containers/loginOAuthRedirect';
import WebsiteLanding from './website/containers/landing';
import WebsiteReview from './website/containers/review';
import WebsiteReviewForm from './website/containers/reviewForm';
import WebsiteSubmit from './website/containers/submit';

import addonDashboard from './addon/reducers/dashboard';
import addonSubmit from './addon/reducers/submit';
import apiArgs from './site/reducers/apiArgs';
import login from './site/reducers/login';
import siteConfig from './site/reducers/siteConfig';
import user from './site/reducers/user';
import websiteReview from './website/reducers/review';
import websiteSubmit from './website/reducers/submit';
import websiteSubmitUrl from './website/reducers/submitUrl';


const reducer = combineReducers({
  // The name of the reducers, as imported, will be the keys of state tree.
  addonDashboard,
  addonSubmit,
  apiArgs,
  login,
  router,
  siteConfig,
  user,
  websiteReview,
  websiteSubmit,
  websiteSubmitUrl,
});

const createPersistentStore = compose(
  persistState(null, {
    slicer: persistSlicer()
  }),
  createStore
);

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
)(createPersistentStore);

const store = createStoreWithMiddleware(reducer);


function renderRoutes() {
  return (
    <Router history={history}>
      <Route component={reduxRouteComponent(store)}>
        <Route component={App} name="app">

          {/* nginx will be serving this at /content, but we need this in
              place for when it's run as a standalone app. */}
          <Redirect from="/" to="/content"/>
          <Route name="login-oauth-redirect" path="/fxa-authorize"
                 component={LoginOAuthRedirect}/>

          <Route path="/content">
            <Route name="login" path="/login" component={Login}/>

            <Route name="root" component={Landing}/>

            <Route name="addon" path="/addon/"
                   component={loginRequired(AddonLanding, Login,
                                            ['reviewer',
                                             'website_submitter'])}/>
            <Route name="addon-dashboard" path="/addon/dashboard/"
                   component={loginRequired(AddonDashboard, Login)}/>
            <Route name="addon-review" path="/addon/review/"
                   component={loginRequired(AddonReview, Login,
                                            ['reviewer',
                                             'website_submitter'])}/>
            <Route name="addon-submit" path="/addon/submit"
                   component={loginRequired(AddonSubmit, Login,
                                            ['reviewer',
                                             'website_submitter'])}/>

            <Route name="website" path="/website/"
                   component={loginRequired(WebsiteLanding, Login,
                                            'reviewer')}/>
            <Route name="website-review" path="/website/review/"
                   component={loginRequired(WebsiteReview, Login,
                                            'reviewer')}/>
            <Route name="website-review-form" path="/website/review/:id"
                   component={loginRequired(WebsiteReviewForm, Login,
                                            'reviewer')}/>
            <Route name="website-submit" path="/website/submit"
                   component={loginRequired(WebsiteSubmit, Login,
                                            'reviewer')}/>
          </Route>
        </Route>
      </Route>
    </Router>
  );
}


class ReduxApp extends React.Component {
  render() {
    return <Provider store={store}>
      {renderRoutes.bind(null)}
    </Provider>
  }
}


React.render(<ReduxApp/>, document.querySelector('.app-container'));
