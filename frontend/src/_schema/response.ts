
export interface IFacResponse {
    id: number,
    fac: string
}

export interface IUsersResponse {
    id: string,
    firstname: string,
    lastname: string,
    username?: string,
    facs: IFacResponse[]
}