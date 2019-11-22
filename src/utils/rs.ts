type RequestServiceFunction = (
  that: {
    [key: string]: any;
  },
  name: string,
  payload?: object | [],
) => void | any;

interface RequestService {
  search: RequestServiceFunction;
  update: RequestServiceFunction;
  detail: RequestServiceFunction;
}

const rs: RequestService = {
  search: (that, name, payload = {}) =>
    new Promise(() => {
      const { dispatch } = that.props;
      that.setState({ dataLoading: true });
      if (dispatch) {
        dispatch({ type: `${name}/search`, payload })
          .then(() => {
            if (that.state.dataLoading) {
              that.setState({ dataLoading: false });
            }
          })
          .catch(() => {
            that.setState({ dataLoading: false });
          });
      }
    }),
  update: (that, name, payload = {}) => {
    const { dispatch } = that.props;
    if (dispatch) {
      dispatch({ type: `${name}/update`, payload });
    }
  },
  detail: (that, name, payload = {}) => {
    const { dispatch } = that.props;
    if (dispatch) {
      dispatch({ type: `${name}/detail`, payload });
    }
  },
};

export default rs;
