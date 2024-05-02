const axios = require('axios')

// Function to fetch data from the API
async function fetchData () {
  try {
    const response = await axios.get('https://api.example.com/data')
    console.log('Data fetched successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

// Call the fetchData function
fetchData()
