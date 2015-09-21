import React from 'react';
import {ReverseLink} from 'react-router-reverse';


export class AddonListing extends React.Component {
  static propTypes = {
    addons: React.PropTypes.array.isRequired
  };

  render() {
    return (
      <ul className="addon-listing">
        {this.props.addons.map(addon =>
          <li>
            <Addon {...this.props} {...addon}/>
          </li>
        )}
        {this.props.addons.length === 0 && <p>No add-ons.</p>}
      </ul>
    );
  }
}


export class Addon extends React.Component {
  static propTypes = {
    description: React.PropTypes.string,
    latest_public_version: React.PropTypes.object,
    latest_version: React.PropTypes.object.isRequired,
    linkTo: React.PropTypes.string,
    mini_manifest_url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
  };

  renderName() {
    // If `linkTo`, have the header link to a more detailed page.
    if (this.props.linkTo) {
      return (
        <ReverseLink to={this.props.linkTo} params={{slug: this.props.slug}}>
          <h2>{this.props.name}</h2>
        </ReverseLink>
      );
    }
    return <h2>{this.props.name}</h2>
  }

  render() {
    return (
      <div className="addon">
        <div>
          {this.renderName()}
        </div>
        <dl>
          <di>
            <dt>Slug</dt>
            <dd>{this.props.slug}</dd>
          </di>

          <di>
            <dt>Manifest</dt>
            <dd>
              <a href={this.props.mini_manifest_url}>
                Download manifest
              </a>
            </dd>
          </di>

          {this.props.description &&
            <di>
              <dt>Description</dt>
              <dd>{this.props.description}</dd>
            </di>
          }

          {this.props.latest_public_version &&
            <di>
              <dt>Latest Public Version</dt>
              <dd>{this.props.latest_public_version.version}</dd>

              <dt>Size</dt>
              <dd>{this.props.latest_public_version.size}</dd>
            </di>
          }

          <di>
            <dt>Latest Submitted Version</dt>
            <dd>{this.props.latest_version.version}</dd>
          </di>

        </dl>

        {this.props.description &&
          <di>
            <dt>Description</dt>
            <dd>{this.props.description}</dd>
          </di>
        }
      </div>
    );
  }
}
