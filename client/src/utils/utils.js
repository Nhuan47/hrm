import { toast } from 'react-toastify'

export function generateEmployeeTopMenu (id) {
    // Define menu top
    const topMenus = [
        { name: 'profile', link: `/employee/${id}/profile` },
        { name: 'personal details', link: `/employee/${id}/personal-details` },
        { name: 'report to', link: `/employee/${id}/report-to` },
        { name: 'salary', link: `/employee/${id}/salary` }
    ]
    return topMenus
}

export function formatTimeOffDate (dateString, adjustHours = 0) {
    // Extract the timestamp in milliseconds
    const timestamp = parseInt(dateString.match(/\d+/)[0], 10)

    const dateObject = new Date(timestamp)

    // Manually adjust the timezone offset to +07:00
    const offset = adjustHours * 60 // 7 hours in minutes
    const adjustedDate = new Date(dateObject.getTime() + offset * 60000)

    // Format the adjusted date as "2024-02-07T07:00:00Z"
    const formattedDate = adjustedDate.toISOString().slice(0, -5) + 'Z'

    return formattedDate
}

export function formatDate (date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

export function showNotification (message, type = 'success') {
    switch (type) {
        case 'success':
            toast.success(message)
            break
        case 'error':
            toast.error(message)
            break
        case 'warning':
            toast.warn(message)
            break

        // Add more cases for different notification types as needed
        default:
            toast(message)
    }
}

export function checkSize (files) {
    let valid = true
    if (files) {
        files.map(file => {
            const size = file.size / 1024 / 1024
            if (size > 5) {
                valid = false
            }
        })
    }
    return valid
}

export function isImage (file) {
    if (file && file.type.split('/')[0] == 'image') {
        return true
    } else {
        return false
    }
}

export const generateBgChartColor = () => {
    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(201, 203, 207, 0.8)'
    ]

    const colorIndex = Math.floor(Math.random() * colors.length)

    return colors[colorIndex].toString()
}

// Utility function to generate random background and border colors for charts
export const generateRandomColors = numColors => {
    const randomColor = () => Math.floor(Math.random() * 256)

    const backgroundColors = Array.from({ length: numColors }, () => {
        return `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.8)`
    })

    const borderColors = backgroundColors.map(color => {
        const rgbValues = color.match(/\d+/g)
        const alpha = 0.4
        return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`
    })

    return { background: backgroundColors, borderColor: borderColors }
}

export function numberWithCommas (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function isFloat (n) {
    if (n.match(/^-?\d*(\.\d+)?$/) && !isNaN(parseFloat(n)) && n % 1 != 0)
        return true
    return false
}
