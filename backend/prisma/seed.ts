import { PrismaClient, Status } from '@prisma/client'
import convertIsoBEtoAD from "../src/utils/convertBEtoAC";
import { hash } from "../src/utils/hash";
import "dotenv/config";

const migrateDB = new PrismaClient( { 
    datasourceUrl: process.env['MIGRATE_DB_URL']
});

const prisma = new PrismaClient();

interface RawItems {
    code : string
    name : string
    total_amount: number
    productid : number
    facid : number
    typeid : number
    balance : number
    status : Status
}

interface RawFaculties {
    id : number
    fac : string
    userid : number 
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
    planid : number
}

interface RawDisbursedItems {
    id : number
    userid : string
    code : string
    withdrawal_amount : number
    psu_code: string
    date : string
    note : string
}

const migrateFaculty = async ( prisma: PrismaClient ) => {
    try {
        const faculties = ( await migrateDB.$queryRaw`SELECT * from facs` ) as RawFaculties[];
        await Promise.all( faculties.map( async ( faculty ) => {
            const { id, fac, userid } = faculty;
            await prisma.faculty.create( { data: { id, name: fac, userId: userid  } } );
        }));
        console.info( "Migration faculties complete. :D");
    } catch (e) {
        console.error( "Error migrating facutlies:", e );
        throw e;
    }
}

const migrateTypes = async ( prisma: PrismaClient ) => {
    try {
        const types = ( await migrateDB.$queryRaw`SELECT * from types` ) as RawTypes[];
        await Promise.all( types.map( async ( type ) => {
            const { id, type: name } = type;
            await prisma.itemType.create( { data: { id, name } } );
        }));
        console.info( "Migration types complete. :D");
    } catch (e) {
        console.error( "Error migrating types:", e );
        throw e;
    }
}

const migratePlans = async ( prisma: PrismaClient ) => {
    try {
        const plans = ( await migrateDB.$queryRaw`SELECT * from plans` ) as RawPlans[];
        await Promise.all( plans.map( async ( plan ) => {
            const { id, plan:name } = plan;
            await prisma.plan.create( { data: { id, name } } );
        }));
        console.info( "Migration plans complete. :D");
    } catch (e) {
        console.error( "Error migrating plans:", e);
        throw e;
    }
}

const migrateProducts = async ( prisma: PrismaClient ) => {
    try {
        const products = ( await migrateDB.$queryRaw`SELECT * from products` ) as RawProducts[];
        await Promise.all( products.map( async ( product ) => {
            const { id, planid, product:name } = product;
            await prisma.product.create( { 
                data: {
                    id,
                    name,
                    planId: planid
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
        const users = ( await migrateDB.$queryRaw`SELECT * FROM users` ) as RawUsers[];
        await Promise.all( users.map( async ( user ) => {
            const { id, username, password, firstname, lastname } = user; 
            await prisma.user.create( { 
                data:{
                    id,
                    username,
                    password,
                    firstName : firstname,
                    lastName : lastname,
                    fiscalYearId: 1
            }})
        }));
        await prisma.user.create( {
            data: {
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
        await prisma.fiscalYear.create( {
            data: { 
                id: 1,
                year: "2566"
            }
        }) 
    } catch (e) {
        console.error( "Error creating fiscal year:", e );
        throw e; 
    }
}

const migrateItems = async ( primsa: PrismaClient ) => {
    try {
        const items = ( await migrateDB.$queryRaw`SELECT * FROM budget68.items` ) as RawItems[];
        await Promise.all( items.map( async( item ) => {
            const { code, name, balance, facid, productid, status, total_amount, typeid } = item;
            await primsa.item.create( {
                data: {
                    code,
                    balance,
                    fiscalYearId: 1,
                    name,
                    status,
                    totalAmount: total_amount,
                    facultyId: facid,
                    productId: productid,
                    typeId: typeid,
                }
            })
        }));
        console.log( "Migration itmes complete. :D" );
    } catch (e) {
        console.error( "Error migrating items:", e );
        throw e;
    }
}

const migrateDisbursedItems = async ( primsa: PrismaClient ) => {
    try {
        const disbursedItems = ( await migrateDB.$queryRaw`SELECT * FROM budget68.disbursed_items` ) as RawDisbursedItems[];
        await Promise.all( disbursedItems.map( async( disbursedItem ) => {
            const { code, date, id, note, psu_code, userid, withdrawal_amount } = disbursedItem;
            const newDate = convertIsoBEtoAD(date);

            const codeId = await primsa.item.findFirstOrThrow( { where: { code: code }, select: { id: true  } })

            console.log( codeId?.id, code  );
            
            
            await prisma.disbursedItem.create( {
                data: {
                    date: newDate,
                    note,
                    psuCode: psu_code,
                    withdrawalAmount: withdrawal_amount,
                    codeId: codeId!.id,
                    userId: +userid
                }
            })
        }));
        console.log( "Migration disbursed itmes complete. :D" );
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