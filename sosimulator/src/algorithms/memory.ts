export function memoryPush({processNumber, memoryPages}: any, memoria: any[]){
    let memoriaLivre: number = 0
    console.log(memoryPages)
    while(memoryPages > 0){
        memoria.map( e =>{
            if(e.processNumber == 'Vazio'){
                if(e.memoryPages > memoryPages){
                    e.memoryPages -= memoryPages
                    memoria.unshift({processNumber, memoryPages})
                    memoryPages = 0
                }else{
                    if(e.memoryPages < memoryPages){
                        memoryPages -= e.memoryPages
                        memoria.unshift({processNumber, memoryPages})
                        memoria.splice(memoria.indexOf(e), 1)
                    }
                }
            }
        })
        memoria.map( e =>{
            if(memoryPages > 0){
                if(e.memoryPages > memoryPages){
                    let liberada = e.memoryPages
                    memoria.pop()
                    memoria.unshift({processNumber: "Vazio", memoryPages: (liberada-memoryPages)})
                    memoria.unshift({processNumber, memoryPages})
                    memoryPages = 0
                }else if(e.memoryPages = memoryPages){
                    memoria.pop()
                    memoria.unshift({processNumber, memoryPages})
                    memoryPages = 0
                }else{
                    let liberada = e.memoryPages
                    memoria.pop()
                    memoria.unshift({processNumber, memoryPages:(memoryPages - liberada)})
                    memoryPages -= liberada
                }
            }
        })
        // if(memoryPages > 0){
        //     break
        // }
    }
    console.log(memoria)
    return memoria
}