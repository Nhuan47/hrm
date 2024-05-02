import { useState, useEffect, useReducer, useRef } from 'react'

import axios from '@/api/axios/AxiosInstance'

// Custom hook for fetching data using Axios
export function useFetch (url, options) {
    const cache = useRef({})

    // Used to prevent state update if the component is unmounted
    const cancelReQuest = useRef(false)

    const initialState = {
        error: undefined,
        data: undefined
    }

    console.log('render')
    // Keep state logic separated
    const fetchReducer = (state, action) => {
        switch (action.type) {
            case 'loading':
                return {
                    ...initialState
                }
            case 'fetched':
                return {
                    ...initialState,
                    data: action.payload
                }
            case 'error':
                return {
                    ...initialState,
                    error: action.payload
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(fetchReducer, initialState)

    useEffect(() => {
        // Do nothing if the url is not given
        if (!url) return

        cancelReQuest.current = false

        const fetchData = async () => {
            dispatch({ type: 'loading' })

            // if a cache exists for this url, reuturn it
            if (cache.current[url]) {
                dispatch({
                    type: 'fetched',
                    payload: cache.current[url]
                })
            }

            try {
                const {
                    data: { data, status, message }
                } = await axios.get(url, options)

                if (!status === 200) {
                    throw new Error(message)
                }

                cache.current[url] = data

                if (cancelReQuest.current) return

                dispatch({ type: 'fetched', payload: data })
            } catch (err) {
                if (cancelReQuest.current) return

                dispatch({ type: 'error', payload: err })
            }
        }

        fetchData()

        // use the cleanup function  for avoiding a possibly state update after the component was unmounted
        return () => {
            cancelReQuest.current = true
        }
    }, [url])

    return state
}
