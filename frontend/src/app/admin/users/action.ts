'use sever'

import ApiAuth from "@/lib/hook/ApiAuth"

export const handleDeleteUser = async( id: string | number ) => {
    try {
        const res = await ApiAuth.delete( `/users?id=${id}` );
        console.log( res.data.data );
    } catch (e) {
        console.log( e );
    }

}