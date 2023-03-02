import {ActionType} from '../actions';
const InitialCartState = {
  cart1: [],
  user:[]
};

export default (state = InitialCartState, {type, payload}) => {
  switch (type) {
    case ActionType.CAL_CART: {
      return {...state,
        cart1: [...state.cart1, {...payload}],
      };
    }
    case ActionType.CARTITEMUPDATE: {
      const newcart1 = [...state.cart1];
      newcart1[payload.index]['qty'] = newcart1[payload.index]['qty'] + 1;
      return {...state,
        cart1: newcart1,
      };
    }
    case ActionType.PRODUCTINC: {
      const newcart1 = [...state.cart1];
      newcart1[payload.index]['qty'] = newcart1[payload.index]['qty'] + 1;
      return {...state,
        cart1: newcart1,
      };
    }
    case ActionType.PRODUCTDEC: {
      const newcart1 = [...state.cart1];
      if (newcart1[payload.index]['qty'] === 1) {
        newcart1.splice(payload.index, 1);
      } else
        newcart1[payload.index]['qty'] = newcart1[payload.index]['qty'] - 1;
      return {...state,
        cart1: newcart1,
      };
    }
    case ActionType.SELECTEDUSER:{
      return{...state,
        user:[...state.user,{payload}]
      };
    }
    default:
      return state;
  }
};
