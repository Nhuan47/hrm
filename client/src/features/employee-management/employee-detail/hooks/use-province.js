import { useEffect, useRef, useState } from 'react';

import axios from '@/shared/services/axios-instance';

export const useProvince = ({ cacheRef, props }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [city, setCity] = useState(null);
    const [cities, setCities] = useState();

    const [district, setDistrict] = useState(null);
    const [districts, setDistricts] = useState();

    const [wards, setWards] = useState();

    // fetch city
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
                if (!cacheRef.current) {
                    cacheRef.current = true;
                    setIsLoading(true);

                    let { data: response } = await axios.get(
                        '/province/cities',
                        {
                            signal
                        }
                    );

                    let { status, message, data } = response;
                    if (status === 200) {
                        // convert to options type
                        let options = data.map(item => ({
                            label: item.name,
                            value: item.code
                        }));
                        setCities(options);

                        if (props?.cityName) {
                            let cityItem = data?.find(
                                c => c.name === props?.cityName
                            );
                            if (cityItem) {
                                onCityChange(cityItem?.code);
                            }
                        }
                    } else {
                        console.error(
                            `HTTP error! Status: ${status} - ${message}`
                        );
                    }
                }
            } catch (err) {
                if (!err?.code === 'ERR_CANCELED') {
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, []);

    // fetch district
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
                setIsLoading(true);

                if (city) {
                    let { data: response } = await axios.get(
                        `/province/${city}/districts`,
                        {
                            signal
                        }
                    );

                    let { status, message, data } = response;
                    if (status === 200) {
                        // convert to options type
                        let options = data.map(item => ({
                            label: item.name,
                            value: item.code
                        }));

                        setDistricts(options);

                        if (props?.districtName) {
                            let districtItem = data?.find(
                                d => d.name === props?.districtName
                            );
                            if (districtItem) {
                                onDistrictChange(districtItem?.code);
                            }
                        }
                    } else {
                        console.error(
                            `HTTP error! Status: ${status} - ${message}`
                        );
                    }
                }
            } catch (err) {
                if (!err?.code === 'ERR_CANCELED') {
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, [city]);

    // fetch ward
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            try {
                setIsLoading(true);

                if (city && district) {
                    let { data: response } = await axios.get(
                        `/province/${city}/${district}/wards`,
                        {
                            signal
                        }
                    );

                    let { status, message, data } = response;
                    if (status === 200) {
                        // convert to options type
                        let options = data.map(item => ({
                            label: item.name,
                            value: item.code
                        }));

                        setWards(options);
                    } else {
                        console.error(
                            `HTTP error! Status: ${status} - ${message}`
                        );
                    }
                }
            } catch (err) {
                if (!err?.code === 'ERR_CANCELED') {
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            // Cancel the request when the component unmounts
            controller.abort();
        };
    }, [city, district]);

    const onCityChange = value => {
        setCity(value);
    };

    const onDistrictChange = value => {
        setDistrict(value);
    };

    return {
        isLoading,
        onCityChange,
        onDistrictChange,
        cities,
        districts,
        setDistrict,
        wards
    };
};
