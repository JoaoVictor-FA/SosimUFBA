export function memoryPush({processNumber, memoryPages}: any, memoria: any[]){
    while(memoryPages > 0){
        memoria.map( e =>{
            if(memoryPages > 0){
                if(e.processNumber == 'Vazio'){
                    if(e.memoryPages > memoryPages){
                        e.memoryPages -= memoryPages
                        if((memoria.indexOf(e) -1) >= 0){
                            memoria.splice((memoria.indexOf(e)), 0, {processNumber, memoryPages})
                        }else{
                            memoria.unshift({processNumber, memoryPages})
                        }
                        memoryPages = 0
                    }else if(e.memoryPages == memoryPages){
                        if((memoria.indexOf(e) -1)>= 0){
                            memoria.splice((memoria.indexOf(e)), 0, {processNumber, memoryPages})
                        }else{
                            memoria.unshift({processNumber, memoryPages})
                        }
                        memoria.splice(memoria.indexOf(e), 1)
                        memoryPages = 0
                    }else if(e.memoryPages < memoryPages){
                        memoryPages -= e.memoryPages
                        if((memoria.indexOf(e) -1)>= 0){
                            memoria.splice((memoria.indexOf(e)), 0, {processNumber, memoryPages: e.memoryPages})
                        }else{
                            memoria.unshift({processNumber, memoryPages: e.memoryPages})
                        }
                        memoria.splice(memoria.indexOf(e), 1)
                    }
                }
            }
        })
        let min = Number.POSITIVE_INFINITY
        for (const value of memoria) {
            if(value.processNumber  != 'Vazio'){
                min = Math.min(min, value.processNumber )
            }
        }
        let e = memoria.find(x => x.processNumber == min)
        if(memoryPages > 0){
            if(e.memoryPages > memoryPages){
                let liberada = e.memoryPages
                memoria.splice((memoria.indexOf(e)), 0,{processNumber, memoryPages})
                memoria.splice((memoria.indexOf(e)), 0,{processNumber: "Vazio", memoryPages: (liberada-memoryPages)})
                memoria.splice(memoria.indexOf(e), 1)
                memoryPages = 0
            }else if(e.memoryPages == memoryPages){
                memoria.splice((memoria.indexOf(e)), 0,{processNumber, memoryPages})
                memoria.splice(memoria.indexOf(e), 1)
                memoryPages = 0
            }else{
                let liberada = e.memoryPages
                if((memoria.indexOf(e) -1)>= 0){
                    memoria.splice((memoria.indexOf(e)), 0, {processNumber, memoryPages:(memoryPages - liberada)})
                }else{
                    memoria.unshift({processNumber, memoryPages:(memoryPages - liberada)})
                }
                memoria.splice(memoria.indexOf(e), 1)
                memoryPages -= liberada
            }
        }
        if(memoryPages = 0){
            break
        }
    }
    
    return memoria
}