import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  // this will automatically determine what parts of the object you are changing
  // and will return a new state object on the next round...so we are not actually
  // violating the immutability of the state object
  // Redux Toolkit allows us to write "mutating" logic in reducers. It
  // doesn't actually mutate the state because it uses the Immer library,
  // which detects changes to a "draft state" and produces a brand new
  // immutable state based off those changes
  reducers: {
    setProfile: (currentState, nextProfileAction) => {
      currentState.profile = nextProfileAction.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = sessionSlice;

export const { setProfile } = actions;

const getScope = (state) => state.session;

export const getProfile = (state) => getScope(state).profile;

export const getProfileUuid = (state) => (getScope(state).profile || {}).uuid;
export const getEmailVerified = (state) => (getScope(state).profile || {}).emailVerified;
