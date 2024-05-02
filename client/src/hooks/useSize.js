import { useEffect, useState } from 'react'

const useSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    useEffect(() => {
        const windowSizeHandler = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', windowSizeHandler)

        return () => {
            window.removeEventListener('resize', windowSizeHandler)
        }
    }, [])
    return windowSize
}

export default useSize
