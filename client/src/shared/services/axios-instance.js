import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/shared/constants';

const baseUrl = import.meta.env.VITE_API_ENDPOINT;

// Variables to track token refreshing and queued requests.
let isRefreshing = false;
let refreshQueue = [];

// Create an Axios instance with custom configuration.
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add an interceptor to handle the request.
instance.interceptors.request.use(async req => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    req.headers.Authorization = `Bearer ${accessToken}`;

    if (accessToken) {
        const tokenData = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        const isAccessTokenExpired = tokenData.exp <= currentTime;

        if (!isAccessTokenExpired) return req;

        if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            // Return a promise to resolve or reject the request.
            return new Promise((resolve, reject) => {
                refreshQueue.push(newToken => {
                    if (newToken) {
                        req.headers.Authorization = `Bearer ${newToken}`;
                        resolve(req);
                    } else {
                        localStorage.removeItem(ACCESS_TOKEN_KEY);
                        localStorage.removeItem(REFRESH_TOKEN_KEY);
                        reject(new Error('Token refresh failed.'));
                    }
                });

                // Send a request to refresh the token.
                axios
                    .post(
                        `${baseUrl}/auth/refresh`,
                        { refreshToken },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                    .then(response => {
                        // Update the access token and resolve queued requests.
                        localStorage.setItem(
                            ACCESS_TOKEN_KEY,
                            JSON.stringify(response.data.accessToken)
                        );
                        isRefreshing = false;
                        const newAccessToken = response.data.accessToken;

                        refreshQueue.forEach(callback =>
                            callback(newAccessToken)
                        );
                        refreshQueue = [];
                    })
                    .catch(error => {
                        // Handle token refresh failure and reject queued requests.
                        isRefreshing = false;
                        refreshQueue.forEach(callback => callback(null));
                        refreshQueue = [];
                        localStorage.removeItem(ACCESS_TOKEN_KEY);
                        localStorage.removeItem(REFRESH_TOKEN_KEY);
                        window.location.href = '/login';
                    });
            });
        } else {
            // Add the request to the queue and wait for token refresh.
            return new Promise(resolve => {
                refreshQueue.push(newToken => {
                    if (newToken) {
                        req.headers.Authorization = `Bearer ${newToken}`;
                    }
                    resolve(req);
                });
            });
        }
    }

    return req;
});

// Add an interceptor to handle errors globally.
instance.interceptors.response.use(
    response => {
        // If the request was successful, return the response.
        return response;
    },
    error => {
        // Handle errors here.
        if (error.response) {
            // The request was made, and the server responded with a status code outside the range of 2xx.

            // Log the error for debugging.
            // console.error('Error response:', error.response);

            // Handle specific status codes.
            if (error.response.status === 401) {
                // Unauthorized: Handle the case where the user is not authenticated.

                localStorage.removeItem(ACCESS_TOKEN_KEY);
                localStorage.removeItem(REFRESH_TOKEN_KEY);
                window.location.href = '/login';
                return Promise.reject(error.response);
            } else if (error.response.status === 403) {
                window.location.href = '/error/403';
            } else if (error.response.status === 404) {
                // Not Found: Handle the case where the requested resource is not found.
                // Display an error message or take appropriate action.
            } else if (error.response.status === 500) {
                // Not Found: Handle the case where the requested resource is not found.
                // Display an error message or take appropriate action.
            }

            // You can handle other status codes here as needed.
        } else if (error.request) {
            // The request was made, but no response was received.
            // console.error('No response received:', error.request);
            // Handle this scenario, which might be a network issue or a server that is not responding.
        } else {
            // Something else happened while setting up the request.
            console.error('Request setup error:', error.message);
            // Handle this type of error, which could be a request configuration issue.
        }

        // Return a rejected promise to propagate the error to the caller.
        return Promise.reject(error);
    }
);

export default instance;
