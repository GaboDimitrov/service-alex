export const getJWT = () => {
    return localStorage.getItem('userToken')
}
 
export const removeJWT = () => {
    return localStorage.removeItem('userToken')
}