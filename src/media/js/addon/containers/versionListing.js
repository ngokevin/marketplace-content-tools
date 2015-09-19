/*
  Version listing as a smart component since it involves binding a lot of
  actions.
*/
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {fetchVersions} from '../actions/addon';
import {publish, reject} from '../actions/review';
import {fetchThreads, submitNote} from '../actions/comm';

import Version from '../components/version';
import {versionListSelector} from '../selectors/version';


export class AddonVersionListingContainer extends React.Component {
  static propTypes = {
    fetchThreads: React.PropTypes.func.isRequired,
    fetchVersions: React.PropTypes.func.isRequired,
    publish: React.PropTypes.func.isRequired,
    reject: React.PropTypes.func.isRequired,
    showReviewActions: React.PropTypes.bool,
    slug: React.PropTypes.func.isRequired,
    versions: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.fetchThreads(this.props.slug);
    this.props.fetchVersions(this.props.slug);
  }

  render() {
    return (
      <section className="version-listing">
        <h2>Versions</h2>

        <ul>
          {this.props.versions.map(version =>
            <li>
              <Version {...this.props} {...version}/>
            </li>
          )}
        </ul>
      </section>
    );
  }
}


export default connect(
  state => ({
    slug: state.router.params.slug,
    versions: versionListSelector(
      (state.addon.addons[state.router.params.slug] || {}).versions
    )
  }),
  dispatch => bindActionCreators({
    fetchThreads,
    fetchVersions,
    publish,
    reject,
    submitNote
  }, dispatch)
)(AddonVersionListingContainer);
