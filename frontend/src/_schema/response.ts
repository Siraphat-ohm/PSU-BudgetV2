
export interface IFacResponse {
    id: number,
    name: string
}

export interface IUsersResponse {
    id: string,
    firstName: string,
    lastName: string,
    username?: string,
    faculties: IFacResponse[]
}