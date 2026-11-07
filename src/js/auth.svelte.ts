interface UserStore {
    isLoggedIn: boolean,
    user?: {
        name: string
        email: string
        _id: string
    },
    token: string
}
export const userStore = $state({ isLoggedIn: false, user: {}, token: "" }) as UserStore;

const baseURL = import.meta.env.PUBLIC_SERVER_URL;

export const login = async (email: string, password: string) => {

    const payload = {
        email,
        password
    }
    const response = await fetch(baseURL + 'users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    const data = await response.json();

    if (!response.ok) {
        console.log("there was an error logging in")
        throw new Error(data.error.message)
    }

    userStore.token = data.token;
    userStore.user = data.user;
    userStore.isLoggedIn = true;
    localStorage.setItem('userStore', JSON.stringify(userStore))
    return data;
}

export const logout = () => {
    localStorage.removeItem('userStore');
    userStore.token = '';
    userStore.user = undefined;
    userStore.isLoggedIn = false;
    // window.location.href = '/login'
}

export const checkAuth = () => {
    const user = localStorage.getItem('userStore');
    if (user) {
        const parsedUser = JSON.parse(user);
        userStore.isLoggedIn = parsedUser.isLoggedIn
        userStore.user = parsedUser.user
        userStore.token = parsedUser.token
    } else {
        userStore.isLoggedIn = false;
        userStore.user = undefined;
        userStore.token = "";
    }
    return !!user
}