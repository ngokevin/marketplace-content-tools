import {createSelector} from 'reselect';


export default createSelector(
  [state => state.websiteReview],
  websiteSubmissions => {
    // Return submissions in list form.
    websiteSubmissions = Object.assign({}, websiteSubmissions);
    delete websiteSubmissions.__persist;

    return {
      websiteSubmissions: Object.keys(websiteSubmissions)
                                .sort()
                                .map(id => websiteSubmissions[id])
    };
  }
);
