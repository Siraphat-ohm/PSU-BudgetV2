
export interface IFacResponse {
    id: number,
    fac: string
}

export interface IUsersResponse {
    id: number,
    firstname: string,
    lastname: string
    facs: IFacResponse[]
}