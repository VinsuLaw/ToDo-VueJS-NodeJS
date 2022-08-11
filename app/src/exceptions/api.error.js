export default class ApiError {
    static BadResponse(error) {
        return error.response.data.message
    }
}
