import { PrismaClient, Status } from '@prisma/client'
import convertIsoBEtoAD from "./convertBEtoAC";
import { hash } from "./hash";
import "dotenv/config";

import mysql from "mysql2/promise"

const mgDB = async() => {
    const conn = await mysql.createConnection( {
        host: process.env['MYSQL_HOST'] || "localhost",
        user: process.env['MYSQL_USER'] || "root",
        password: process.env['MYSQL_PASSWORD'] || "root_password",
        database: process.env["MYSQL_DATABASE"] ,
        port: parseInt( process.env["MYSQL_PORT"] ?? "3306" )
    }) 
    return conn
}

const prisma = new PrismaClient();

interface RawItems {
    code : string
    name : string
    total_amount: number
    productID : number
    facID : number
    typeID : number
    balance : number
    status : Status
}

interface RawFaculties {
    id : number
    fac : string
    userID : number 
}

interface RawTypes {
    id : number
    type : string
}

interface RawPlans {
    id : number
    plan: string
}

interface RawUsers {
    id : number
    username : string
    password : string
    firstname : string
    lastname : string
}

interface RawProducts {
    id : number
    product : string
    planID : number
}

interface RawDisbursedItems {
    id : number
    userID : string
    code : string
    withdrawal_amount : number
    psu_code: string
    date : string
    note : string
}

const migrateFaculty = async ( prisma: PrismaClient ) => {
    try {
        // const faculties = ( await migrateDB.$queryRaw`SELECT * from facs` ) as RawFaculties[];
        const [ row, fields ] = await ( await mgDB() ).execute( "SELECT * FROM facs");
        const faculties = row as RawFaculties[]
        await Promise.all( faculties.map( async ( faculty ) => {
            const { id: fid, fac, userID } = faculty;
            const userId = Number( userID )
            const id = Number( fid )
            await prisma.faculty.upsert( { 
                where: { id },
                create: { id, name: fac, userId  } ,
                update: { id, name: fac, userId  } ,
            } );
        }));
        console.info( "Migration faculties complete. :D");
    } catch (e) {
        console.error( "Error migrating facutlies:", e );
        throw e;
    }
}

const migrateTypes = async ( prisma: PrismaClient ) => {
    try {
        const [ row, fields ] = await ( await mgDB() ).execute( "SELECT * FROM types;" )
        const types = row as RawTypes[];
        await Promise.all( types.map( async ( type ) => {
            const { id: tid, type: name } = type;
            const id = Number( tid );
            await prisma.itemType.upsert( { 
                where: { id },
                create: { id, name },
                update: { id, name }
             } );
        }));
        console.info( "Migration types complete. :D");
    } catch (e) {
        console.error( "Error migrating types:", e );
        throw e;
    }
}

const migratePlans = async ( prisma: PrismaClient ) => {
    try {
        // const plans = ( await migrateDB.$queryRaw`SELECT * from plans` ) as RawPlans[];
        const [ row, fields ] = await ( await mgDB() ).execute( "SELECT * FROM plans;" )
        const plans = row as RawPlans[]
        await Promise.all( plans.map( async ( plan ) => {
            const { id: pid, plan:name } = plan;
            const id = Number( pid )
            await prisma.plan.upsert( { 
                where : { id },
                create : { id, name },
                update : { id, name },
            } );
        }));
        console.info( "Migration plans complete. :D");
    } catch (e) {
        console.error( "Error migrating plans:", e);
        throw e;
    }
}

const migrateProducts = async ( prisma: PrismaClient ) => {
    try {
        // const products = ( await migrateDB.$queryRaw`SELECT * from products` ) as RawProducts[];
        const [ row, fields ] = await ( await mgDB() ).execute( "SELECT * FROM products;")
        const  products = row as RawProducts[];
        await Promise.all( products.map( async ( product ) => {
            const { id: pid, planID, product:name } = product;
            const id = Number( pid );
            const planId = Number( planID );
            await prisma.product.upsert( { 
                where: { id },
                create: {
                    id,
                    name,
                    planId 
                },
                update: {
                    id,
                    name,
                    planId 
                }
            })
        }));
        console.info( "Migration products complete. :D" );
    } catch (e) {
        console.error( "Error migrating products:", e);
        throw e;
    }
}

const migrateUsers = async ( prisma: PrismaClient ) => {
    try {
        const [ row, fields ]: any = await (await mgDB()).execute( "SELECT * FROM users" );
        const users =  row  as RawUsers[]

        await Promise.all( users.map( async ( user ) => {
            const { id : uid ,  username, password, firstname, lastname } = user; 
            const id = Number( uid )
            await prisma.user.upsert( { 
                where: { id },
                create:{
                    id,
                    username,
                    password,
                    firstName : firstname,
                    lastName : lastname,
                    fiscalYearId: 1
            },
            update: {
                    id,
                    username,
                    password,
                    firstName : firstname,
                    lastName : lastname,
                    fiscalYearId: 1
            }
        })
        }));
        await prisma.user.upsert( {
            where: { id: 999 },
            create: {
                id: 999,
                username : process.env['ADMIN_USERNAME'] ?? "admin",
                password : hash( String(process.env["ADMIN_PASSWORD"]) ) ?? "admin",
                firstName : "admin",
                lastName : "admin",
                role : "ADMIN",
            },
            update: {
                id: 999,
                username : process.env['ADMIN_USERNAME'] ?? "admin",
                password : hash( String(process.env["ADMIN_PASSWORD"]) ) ?? "admin",
                firstName : "admin",
                lastName : "admin",
                role : "ADMIN",
            }
        })
        console.info( "Migration users complete. :D" );
    } catch (e) { 
        console.error( "Error migrating users:", e );
        throw e;
    }
}

const createFiscalYear = async ( prisma: PrismaClient ) => {
    try {
        await prisma.fiscalYear.upsert( {
            where: {
                id: 1
            },
            create: { 
                id: 1,
                name: "2566",
                isActive: true
            },
            update: {
                id: 1,
                name: "2566",
                isActive: true
            }
        }) 
    } catch (e) {
        console.error( "Error creating fiscal year:", e );
        throw e; 
    }
}

const migrateItems = async ( primsa: PrismaClient ) => {
    try {
        // const items = ( await migrateDB.$queryRaw`SELECT * FROM budget68.items` ) as RawItems[];
        const [ row, fields ] = await ( await mgDB() ).execute( "SELECT * FROM items;")
        const items = row as RawItems[]
        await Promise.all( items.map( async( item ) => {
            const { code, name, balance, facID, productID, status, total_amount, typeID } = item;
            const facultyId = Number( facID )
            const typeId = Number( typeID )
            const productId = Number( productID )
            await primsa.itemCode.upsert( {
                where: { code },
                create: {
                    code,
                    balance,
                    fiscalYearId: 1,
                    name,
                    status,
                    totalAmount: total_amount,
                    facultyId,
                    productId,
                    typeId,
                },
                update : {
                    code,
                    balance,
                    fiscalYearId: 1,
                    name,
                    status,
                    totalAmount: total_amount,
                    facultyId,
                    productId,
                    typeId,
                }
            })
        }));
        console.log( "Migration items complete. :D" );
    } catch (e) {
        console.error( "Error migrating items:", e );
        throw e;
    }
}

const migrateDisbursedItems = async ( primsa: PrismaClient ) => {
    try {
        // const disbursedItems = ( await migrateDB.$queryRaw`SELECT * FROM budget68.disbursed_items` ) as RawDisbursedItems[];
        const [ row, fields ] = await ( await mgDB() ).execute( "SELECT * FROM disbursed_items;")
        const disbursedItems = row as RawDisbursedItems[]
        await Promise.all( disbursedItems.map( async( disbursedItem ) => {
            const { code, date, id: did, note, psu_code, userID, withdrawal_amount } = disbursedItem;
            const newDate = convertIsoBEtoAD(date);
            const id = Number( did )
            const userId = Number( userID )
            const codeId = await primsa.itemCode.findFirstOrThrow( { where: { code: code }, select: { id: true  } })

            // console.log( codeId?.id, code  );
            
            await prisma.disbursedItem.upsert( {
                where: { 
                    id,
                },
                create: {
                    id,
                    date: newDate,
                    note,
                    psuCode: psu_code,
                    withdrawalAmount: withdrawal_amount,
                    codeId: codeId!.id,
                    userId
                },
                update: {
                    id,
                    date: newDate,
                    note,
                    psuCode: psu_code,
                    withdrawalAmount: withdrawal_amount,
                    codeId: codeId!.id,
                    userId
                }
            })
        }));
        console.log( "Migration disbursed items complete. :D" );
    } catch (e) {
        console.error( "Error migrating disbursed items:", e );
        throw e;
    }
}

const main = async () => {
    try {
        await createFiscalYear( prisma );
        await migrateUsers( prisma );
        await migrateFaculty( prisma );
        await migrateTypes( prisma );
        await migratePlans( prisma );
        await migrateProducts( prisma );
        await migrateItems( prisma );
        await migrateDisbursedItems( prisma );

    } catch (error) {
       console.log( error ) 
    }
}

main()