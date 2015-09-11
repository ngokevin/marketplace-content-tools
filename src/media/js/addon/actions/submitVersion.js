/*
  Add-on version validation and submission actions.

  Adapted from actions/submit.js. It was difficult to completely reuse the
  add-on submission action code since we want to dispatch different action
  constants. Also, the route for versions is slightly different, we would
  have to pass down arguments down the chain all the way to the end to
  appropriately multiplex it.

  TODO: refactor out the pieces we can from actions/submit.js for reuse.
*/
'use strict';
import {createAction} from 'redux-actions';
import req from 'request';
import Url from 'urlgray';
import urlJoin from 'url-join';


export const VALIDATION_BEGIN = 'ADDON_SUBMIT_VERSION__VALIDATION_BEGIN';
const validationBegin = createAction(VALIDATION_BEGIN);

// For when the add-on upload has started processing.
export const VALIDATION_PENDING = 'ADDON_SUBMIT_VERSION__VALIDATION_PENDING';
const validationPending = createAction(VALIDATION_PENDING);

// For when the add-on upload has finished validation.
export const VALIDATION_PASS = 'ADDON_SUBMIT_VERSION__VALIDATION_PASS';
const validationPassed = createAction(VALIDATION_PASS);

export const VALIDATION_FAIL = 'ADDON_SUBMIT_VERSION__VALIDATION_FAIL';
const validationFail = createAction(VALIDATION_FAIL);

export const SUBMIT_OK = 'ADDON_SUBMIT_VERSION__SUBMIT_OK';
const submitOk = createAction(SUBMIT_OK);

export const SUBMIT_ERROR = 'ADDON_SUBMIT_VERSION__SUBMIT_ERROR';
const submitError = createAction(SUBMIT_ERROR);


export function submitVersion(fileData, addonSlug) {
  /*
    Upload add-on .zip file for validation.

    addonSlug -- will be passed down all the way from validation, polling, to
                 actual version creation.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const validationUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/validation/')
    ).q(apiArgs);

    dispatch(validationBegin());

    req
      .post(validationUrl)
      .set('Content-Type', 'application/zip')
      .set('Content-Disposition',
           'form-data; name="binary_data"; filename="extension.zip"')
      .send(fileData)
      .then(res => {
        // Notify the reducers.
        dispatch(validationPending(res.body.id));

        // Take further action by polling.
        dispatch(pollValidator(res.body.id, addonSlug));
      }, err => {
        dispatch(validationFail(JSON.parse(err.response.text).detail));
      });
  };
}


export function pollValidator(validationId, addonSlug) {
  /*
    Poll add-on's validation detail endpoint to wait until validation has
    processed.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const pollUrl = Url(
      urlJoin(process.env.MKT_API_ROOT,
              `extensions/validation/${validationId}/`)
    ).q(apiArgs);

    let pollValidatorInterval;

    function poll(interval) {
      req
        .get(pollUrl)
        .then(res => {
          if (res.body.processed) {
            // If processed, then validation is complete. Resolve process.
            clearInterval(pollValidatorInterval);

            if (res.body.valid) {
              dispatch(createVersion(addonSlug));
            } else {
              dispatch(validationFail(res.body.validation));
            }
          }
        });
    }

    // Poll the validator, poll() will clear interval when complete + dispatch.
    pollValidatorInterval = setInterval(() => {
      poll(pollValidatorInterval);
    }, 500);
  };
}


export function createVersion(addonSlug) {
  /*
    Finish add-on version submission process.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const createVersionUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/extension/',
              addonSlug, 'versions/')
    ).q(apiArgs);

    req
      .post(createVersionUrl)
      .send({validation_id: getState().addonSubmitVersion.validationId})
      .then(res => {
        dispatch(submitOk(res.body));
      }, err => {
        dispatch(submitError(err.response.body));
      });
  };
}
