import ConnectyCube from 'react-native-connectycube';
import config from '../config';

export default class AuthService {
  init = () => {
    ConnectyCube.init(...config);
  }

  login = user => {
    ConnectyCube.createSession({
      id: user.webrtcId,
      password: user.webrtcPassword
    })
      .then((r) => console.log('session r : ', r))
      .catch((e) => console.log('error e : ', e))

    return ConnectyCube.chat.connect({
      userId: user.webrtcId,
      password: user.webrtcPassword,
    });
  }


  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();
  };
}
