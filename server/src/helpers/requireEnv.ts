import 'dotenv/config';
export function requireEnv(varName : string){
    let value = process.env[varName]
    if(!value)
        throw new Error(`Missing required env var ${varName}`)
    
    return value
}