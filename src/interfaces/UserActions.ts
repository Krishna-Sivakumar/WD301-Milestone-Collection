export type User = any;

export interface UserData {
    user: User | null
    token: string
}

interface SetUserAction {
    actionType: "set_user",
    user: User
}

interface DeleteUserAction {
    actionType: "delete_user",
}

interface SetTokenAction {
    actionType: "set_token",
    token: string
}

interface DeleteTokenAction {
    actionType: "delete_token",
}

export type UserAction = SetUserAction | DeleteUserAction | SetTokenAction | DeleteTokenAction;

export const UserReducer : (state: UserData, Action: UserAction) => UserData = (state: UserData, action: UserAction) => {
    switch (action.actionType) {
        case "set_user":
            return {
                ...state,
                user: action.user
            }
        case "delete_user":
            return {
                ...state,
                user: null
            }
        case "set_token":
            return {
                ...state,
                token: action.token
            }
        case "delete_token":
            return {
                ...state,
                token: ""
            }
    }
}
