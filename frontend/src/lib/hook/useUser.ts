import useSWR from "swr"
import ApiAuth from "./ApiAuth";

interface IResponse {
    data: any,
    message: string
}

const useFetch = ( endpoint: string ) => {
    const fetcher = async( url: string ) => await ApiAuth.get( url ).then( res => res.data );

    const { data, isLoading, error } = useSWR( endpoint , fetcher );

    return { 
        res: data as IResponse, 
        isLoading, 
        error 
    }
}

export default useFetch;