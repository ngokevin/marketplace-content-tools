/*
  Single review page for an add-on.

  Lists the add-on's versions, each with their own approve and reject buttons.
*/
import React from 'react';
import {connect} from 'react-redux';
import {ReverseLink} from 'react-router-reverse';
import {bindActionCreators} from 'redux';

import {fetch as fetchAddon, fetchVersions} from '../actions/addon';
import {publish, reject} from '../actions/review';
import {Addon} from '../components/addon';
import AddonSubnav from '../components/addonSubnav';
import PageHeader from '../../site/components/pageHeader';


export class AddonReviewDetail extends React.Component {
  static propTypes = {
    addon: React.PropTypes.object,
    fetchAddon: React.PropTypes.func.isRequired,
    fetchVersions: React.PropTypes.func.isRequired,
    publish: React.PropTypes.func,
    reject: React.PropTypes.func,
    slug: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.props.fetchAddon(this.props.slug);
    this.props.fetchVersions(this.props.slug);
  }

  render() {
    if (!this.props.addon || !this.props.addon.slug) {
      return (
        <section>
          <PageHeader title="Loading Firefox OS Add-on..."
                      subnav={<AddonSubnav/>}/>
        </section>
      );
    }
    return (
      <section>
        <PageHeader
          title={`Reviewing Firefox OS Add-on: ${this.props.addon.name}`}
          subnav={<AddonSubnav/>}/>
        <Addon {...this.props.addon}
               publish={this.props.publish}
               reject={this.props.reject}
               showReviewActions={true}/>
      </section>
    );
  }
};


export default connect(
  state => ({
    addon: state.addonReviewDetail.addons[state.router.params.slug],
    slug: state.router.params.slug
  }),
  dispatch => bindActionCreators({
    fetchAddon,
    fetchVersions,
    publish,
    reject,
  }, dispatch)
)(AddonReviewDetail);
