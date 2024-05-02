import { clsx } from 'clsx';
import jwt_decode from 'jwt-decode';
import { twMerge } from 'tailwind-merge';

import { ACCESS_TOKEN_KEY } from './constants';

export function cn (...inputs) {
    return twMerge(clsx(inputs));
}

export function isImage (file) {
    if (file && file.type.split('/')[0] == 'image') {
        return true;
    } else {
        return false;
    }
}

// function used to check size file upload
// if size of file < 1MB is ok ortherwise
export function checkSize (files) {
    let valid = true;
    if (files) {
        files.map(file => {
            const size = file.size / 1024 / 1024;
            if (size > 5) {
                valid = false;
            }
        });
    }
    return valid;
}

export function decodeToken () {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    let data;
    if (token) {
        data = jwt_decode(token);
    } else {
        window.location.href = '/login';
    }

    return data;
}


