export function memoryPush(pags: number, memoria: number[]){
    console.log(memoria.length)
    if(memoria.length < 10){
        memoria.push(pags)
    }
    console.log(memoria.length)
    console.log(memoria)
    return memoria
}