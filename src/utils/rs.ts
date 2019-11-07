
type RequestServiceFunction = (
  that: {
    [key: string]: any;
  },
  name: string,
  payload?: object | [],
) => void;

interface RequestService {
  reader: RequestServiceFunction,
  update: RequestServiceFunction,
}

const rs: RequestService = {
  reader: (that, name, payload = {}) => {
    const { dispatch } = that.props;
    that.setState({ dataLoading: true });
    if (dispatch) {
      dispatch({ type: name, payload }).then(() => {
        if (that.state.dataLoading) {
          that.setState({ dataLoading: false });
        }
      });
    }
  },
  update: (that, dispatchTypeName, payload = {}) => {
    const { dispatch } = that.props;
    if (dispatch) {
      dispatch({ type: dispatchTypeName, payload }).then(() => {
        console.log('success~');
      });
    }
  },
};

export default rs;
