import { AUCTION_LOADED } from "../actions/types";

const initialState = {
  loading: true,
  auctions: [],
};

function auctionReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUCTION_LOADED:
      return {
        ...state,
        loading: false,
        auctions: payload,
      };
    default:
      return state;
  }
}

export default auctionReducer;
