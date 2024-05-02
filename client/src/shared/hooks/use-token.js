import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import { ACCESS_TOKEN_KEY } from '../constants';

export const useToken = () => {
    let navigate = useNavigate();
    let tokenData;

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const decodeToken = async () => {
        try {
            if (token) {
                const userInfo = await jwt_decode(token);
                if (!userInfo === 1) {
                    navigate('/login');
                }
                tokenData = userInfo;
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };
    decodeToken();

    return { tokenData };
};
