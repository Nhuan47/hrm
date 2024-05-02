import { useState } from 'react'

const useFormProgress = () => {
    const [currentStep, setCurrentStep] = useState(0)

    const goForward = () => {
        setCurrentStep(currentStep + 1)
    }

    const goBack = () => {
        setCurrentStep(currentStep - 1)
    }

    const goTo = step => {
        setCurrentStep(step)
    }

    return { currentStep, goForward, goBack, goTo }
}

export default useFormProgress
