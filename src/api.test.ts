import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';

import { requestLogin, requestUserData } from '@/api';
import rootReducer from '@/reducers';

const createTestStore = () => createStore(rootReducer, undefined, applyMiddleware(thunk));

describe('dev fake users (__DEV__ only)', () => {
  it.each([
    ['nonmember', false],
    ['member', true],
  ])('logs in "%s" with a fake user without hitting the network', async (username, isMember) => {
    const store = createTestStore();

    await store.dispatch(requestLogin(username as string, 'any-password'));
    expect(store.getState().isAuthenticated).toBe(true);

    await store.dispatch(requestUserData(store.getState().userToken ?? ''));
    expect(store.getState().user?.is_member).toBe(isMember);

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
