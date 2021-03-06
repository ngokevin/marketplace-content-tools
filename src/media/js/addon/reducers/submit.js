/*
    Reducer for Firefox OS add-ons validation and submission process.
*/
import * as submitActions from '../actions/submit';


const initialState = {
  validationErrorMsg: '',
  validationId: '',
};


export default function addonSubmitReducer(state=initialState, action) {
  switch (action.type) {
    case submitActions.VALIDATION_PENDING: {
      return Object.assign({}, state, {
        validationId: action.payload,
      });
    }

    case submitActions.VALIDATION_FAIL: {
      return Object.assign({}, state, {
        validationErrorMsg: action.payload,
      });
    }

    case submitActions.SUBMIT_OK: {
      // Reset once an add-on submission is complete.
      return initialState;
    }

    default: {
      return state;
    }
  }
}
