import useSWR, { KeyedMutator } from "swr";
import ApiAuth from "./ApiAuth";

type FetchTypes<T> = {
  data: T
  isLoading: boolean
  error: any,
  mutate: KeyedMutator<T>;
}

const useFetch = <T,>( endpoint: string ): FetchTypes<T> =>  {
  const fetcher = async (url: string) => {
  try {
    const res = await ApiAuth.get(url);
    return res.data;
  } catch (error : any) {
    if ( error.response ) {
      throw new Error('API Server Error: ' + error.response.status);
    } else if (error.request) {
      throw new Error('API Server Down or Unreachable'); 
    } else {
      throw new Error('Unexpected API Error');
    }
  }
}
  const { data, isLoading, error, mutate } = useSWR<T>( endpoint, fetcher, { } );
  return { data: ( data as any )?.data, isLoading, error, mutate };
};

export default useFetch;