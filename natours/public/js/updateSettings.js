import axios from 'axios';
import { showAlert } from './alert';

// update data or password
export const updateSettings = async (data, type) => {
  try {
    const url = `http://localhost:3000/api/v1/users/${
      type === 'password' ? 'updatePassword' : 'updateCurrentUser'
    }`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'SUCCESS') {
      showAlert('success', `Successfully updated the user ${type}`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
