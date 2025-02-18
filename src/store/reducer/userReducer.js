const initialState = {
  user: {},
};
export default function (state = initialState, action) {
  switch (action.type) {
    case 'SETUSER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATEUSER':
      return {
        ...state,
        user: action.payload.user,
        permission: action.payload.user.permissions,
      };
    default:
      return state;
  }
}
